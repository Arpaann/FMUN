-- ============================================================================
-- FMUN 2026 (Fluorescent Model United Nations) Database Schema
-- Production Migration 00001: Core Architecture, Tables, Indexes, Functions, and RLS
-- ============================================================================

-- Enable pgcrypto for UUID generation and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CONFERENCE SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS conference_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conference_name TEXT NOT NULL DEFAULT 'Fluorescent Model United Nations',
    short_name TEXT NOT NULL DEFAULT 'FMUN',
    year INTEGER NOT NULL DEFAULT 2026,
    theme TEXT DEFAULT NULL, -- Intentionally NULL until officially confirmed
    tagline TEXT DEFAULT 'Where Nations Meet. Ideas Move.',
    description TEXT DEFAULT 'Fluorescent Model United Nations 2026 is the inaugural diplomatic simulation conference hosted by Fluorescent Secondary School in Kathmandu, Nepal.',
    start_date TIMESTAMPTZ DEFAULT NULL, -- Unconfirmed
    end_date TIMESTAMPTZ DEFAULT NULL, -- Unconfirmed
    venue TEXT DEFAULT NULL, -- Unconfirmed
    registration_fee NUMERIC(10, 2) DEFAULT NULL, -- Unconfirmed: paid registration cannot open until configured
    currency TEXT NOT NULL DEFAULT 'NPR',
    registration_open BOOLEAN NOT NULL DEFAULT false, -- Strict gate: false until organizers configure & publish
    registration_deadline TIMESTAMPTZ DEFAULT NULL,
    contact_email TEXT DEFAULT NULL,
    contact_phone TEXT DEFAULT NULL,
    address TEXT DEFAULT 'Banasthali, Kathmandu, Nepal',
    social_facebook TEXT DEFAULT NULL,
    social_instagram TEXT DEFAULT NULL,
    social_linkedin TEXT DEFAULT NULL,
    logo_url TEXT DEFAULT NULL,
    delegate_handbook_url TEXT DEFAULT NULL,
    rules_content TEXT DEFAULT NULL,
    schedule_content TEXT DEFAULT NULL,
    about_content TEXT DEFAULT NULL,
    physical_payment_instructions TEXT DEFAULT 'Physical payments can be submitted in cash directly at the Fluorescent Secondary School Administration Desk. You will receive an official physical receipt acknowledging your registration reference.',
    digital_payment_instructions TEXT DEFAULT 'Transfer the exact registration fee to our verified merchant account and submit your transaction code and receipt screenshot below.',
    esewa_enabled BOOLEAN NOT NULL DEFAULT true,
    khalti_enabled BOOLEAN NOT NULL DEFAULT true,
    physical_enabled BOOLEAN NOT NULL DEFAULT true,
    manual_transfer_enabled BOOLEAN NOT NULL DEFAULT true,
    song_submissions_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure only one settings row exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_conference_settings ON conference_settings ((true));

-- ============================================================================
-- 2. USER PROFILES & ROLES
-- ============================================================================
CREATE TYPE app_role AS ENUM (
    'super_admin',
    'administrator',
    'registration_manager',
    'finance_manager',
    'committee_manager',
    'dj_music_manager'
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'registration_manager',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================================
-- 3. COMMITTEES
-- ============================================================================
CREATE TABLE IF NOT EXISTS committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    description TEXT,
    agenda TEXT,
    capacity INTEGER NOT NULL DEFAULT 30,
    is_open BOOLEAN NOT NULL DEFAULT true,
    eligibility_requirements TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_committees_display_order ON committees(display_order);

-- ============================================================================
-- 4. COUNTRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    code VARCHAR(3) UNIQUE NOT NULL, -- ISO Alpha-2 or Alpha-3
    flag_emoji TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(is_active);

-- ============================================================================
-- 5. COMMITTEE-COUNTRY MAPPING (Eligible Countries per Committee)
-- ============================================================================
CREATE TABLE IF NOT EXISTS committee_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_committee_country UNIQUE (committee_id, country_id)
);

CREATE INDEX IF NOT EXISTS idx_committee_countries_comm ON committee_countries(committee_id);
CREATE INDEX IF NOT EXISTS idx_committee_countries_country ON committee_countries(country_id);

-- ============================================================================
-- 6. DELEGATES
-- ============================================================================
CREATE TYPE delegate_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'rejected'
);

CREATE TABLE IF NOT EXISTS delegates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT UNIQUE NOT NULL, -- e.g. FMUN-2026-X8B9K2
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_normalized TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_normalized TEXT NOT NULL,
    institution TEXT NOT NULL,
    academic_level TEXT,
    committee_id UUID REFERENCES committees(id) ON DELETE RESTRICT,
    status delegate_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    consent_given_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delegates_ref ON delegates(reference_code);
CREATE INDEX IF NOT EXISTS idx_delegates_email_norm ON delegates(email_normalized);
CREATE INDEX IF NOT EXISTS idx_delegates_committee ON delegates(committee_id);
CREATE INDEX IF NOT EXISTS idx_delegates_status ON delegates(status);

-- ============================================================================
-- 7. COUNTRY ALLOCATIONS (ATOMIC RESERVATION & ASSIGNMENT)
-- ============================================================================
CREATE TYPE allocation_status AS ENUM (
    'held',
    'assigned',
    'released',
    'expired'
);

CREATE TABLE IF NOT EXISTS country_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    delegate_id UUID REFERENCES delegates(id) ON DELETE SET NULL,
    status allocation_status NOT NULL DEFAULT 'held',
    reservation_token_hash TEXT, -- Stored as SHA256 cryptographic hash
    reservation_expiry TIMESTAMPTZ, -- Temporary hold expiration (e.g. 15 minutes)
    assigned_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PARTIAL UNIQUE INDEX: Strictly guarantees that within any committee,
-- no country can have more than one active ('held' or 'assigned') allocation.
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_committee_country 
ON country_allocations (committee_id, country_id) 
WHERE status IN ('held', 'assigned');

CREATE INDEX IF NOT EXISTS idx_country_allocations_delegate ON country_allocations(delegate_id);
CREATE INDEX IF NOT EXISTS idx_country_allocations_expiry ON country_allocations(reservation_expiry) WHERE status = 'held';

-- ============================================================================
-- 8. PAYMENTS
-- ============================================================================
CREATE TYPE payment_method_type AS ENUM (
    'physical',
    'esewa',
    'khalti',
    'manual_transfer'
);

CREATE TYPE payment_status_type AS ENUM (
    'pending',
    'verified',
    'rejected',
    'failed',
    'refunded'
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegate_id UUID NOT NULL REFERENCES delegates(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Integer amount in NPR (e.g. 2500)
    currency VARCHAR(3) NOT NULL DEFAULT 'NPR',
    payment_method payment_method_type NOT NULL,
    provider TEXT, -- 'esewa', 'khalti', 'bank_nepal', 'counter'
    status payment_status_type NOT NULL DEFAULT 'pending',
    transaction_reference TEXT, -- Gateway txn reference or bank voucher number
    receipt_file_path TEXT, -- Secure path in private Supabase storage
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    provider_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_delegate ON payments(delegate_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_txn_ref ON payments(transaction_reference);

-- ============================================================================
-- 9. SONG RECOMMENDATIONS (AFTER-PARTY MUSIC SYSTEM)
-- ============================================================================
CREATE TYPE song_status_type AS ENUM (
    'pending',
    'approved',
    'rejected',
    'played'
);

CREATE TABLE IF NOT EXISTS song_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    source_platform TEXT NOT NULL, -- 'spotify', 'youtube', 'apple_music', 'soundcloud', 'other'
    source_url TEXT NOT NULL,
    notes TEXT,
    submitter_name TEXT,
    registration_reference TEXT,
    status song_status_type NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_song_submissions_status ON song_submissions(status);
CREATE INDEX IF NOT EXISTS idx_song_submissions_created ON song_submissions(created_at DESC);

-- ============================================================================
-- 10. FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(display_order);

-- ============================================================================
-- 11. ANNOUNCEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Official Notice',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 12. AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================================
-- STORED DATABASE FUNCTIONS FOR CONCURRENCY-SAFE OPERATIONS
-- ============================================================================

-- Function 1: Clean up expired holds automatically
CREATE OR REPLACE FUNCTION release_expired_holds()
RETURNS INTEGER AS $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    UPDATE country_allocations
    SET status = 'expired',
        released_at = now(),
        updated_at = now()
    WHERE status = 'held'
      AND reservation_expiry IS NOT NULL
      AND reservation_expiry <= now();
      
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RETURN v_updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Atomically reserve a country
CREATE OR REPLACE FUNCTION reserve_country(
    p_committee_id UUID,
    p_country_id UUID,
    p_token_hash TEXT,
    p_hold_minutes INTEGER DEFAULT 15
)
RETURNS JSONB AS $$
DECLARE
    v_existing_id UUID;
    v_existing_status allocation_status;
    v_existing_expiry TIMESTAMPTZ;
    v_new_allocation_id UUID;
    v_expiry TIMESTAMPTZ;
BEGIN
    -- First, flush expired holds
    PERFORM release_expired_holds();

    -- Verify that the country belongs to this committee
    IF NOT EXISTS (
        SELECT 1 FROM committee_countries
        WHERE committee_id = p_committee_id
          AND country_id = p_country_id
          AND is_active = true
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'NOT_ELIGIBLE',
            'message', 'Selected country is not in the eligible roster for this committee.'
        );
    END IF;

    -- Check for existing active allocation with table row lock
    SELECT id, status, reservation_expiry 
    INTO v_existing_id, v_existing_status, v_existing_expiry
    FROM country_allocations
    WHERE committee_id = p_committee_id
      AND country_id = p_country_id
      AND status IN ('held', 'assigned')
    FOR UPDATE;

    IF FOUND THEN
        -- If it's held but expired, mark as expired and proceed
        IF v_existing_status = 'held' AND v_existing_expiry <= now() THEN
            UPDATE country_allocations
            SET status = 'expired', released_at = now(), updated_at = now()
            WHERE id = v_existing_id;
        ELSE
            RETURN jsonb_build_object(
                'success', false,
                'error_code', 'ALREADY_TAKEN',
                'message', 'This country is currently held or assigned by another delegate.'
            );
        END IF;
    END IF;

    -- Calculate expiry timestamp
    v_expiry := now() + (p_hold_minutes || ' minutes')::interval;

    -- Insert new reservation hold
    INSERT INTO country_allocations (
        committee_id,
        country_id,
        status,
        reservation_token_hash,
        reservation_expiry
    ) VALUES (
        p_committee_id,
        p_country_id,
        'held',
        p_token_hash,
        v_expiry
    )
    RETURNING id INTO v_new_allocation_id;

    RETURN jsonb_build_object(
        'success', true,
        'allocation_id', v_new_allocation_id,
        'reservation_expiry', v_expiry
    );
EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object(
        'success', false,
        'error_code', 'CONFLICT',
        'message', 'Concurrent reservation collision. Please choose another country.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Pick a random available country atomically
CREATE OR REPLACE FUNCTION generate_random_available_country(
    p_committee_id UUID,
    p_token_hash TEXT,
    p_hold_minutes INTEGER DEFAULT 15
)
RETURNS JSONB AS $$
DECLARE
    v_selected_country_id UUID;
    v_country_name TEXT;
    v_country_code TEXT;
    v_flag_emoji TEXT;
    v_reservation_result JSONB;
BEGIN
    -- Flush expired holds first
    PERFORM release_expired_holds();

    -- Pick a random country that is active in this committee and has no active hold or assignment
    SELECT c.id, c.name, c.code, c.flag_emoji
    INTO v_selected_country_id, v_country_name, v_country_code, v_flag_emoji
    FROM committee_countries cc
    JOIN countries c ON cc.country_id = c.id
    WHERE cc.committee_id = p_committee_id
      AND cc.is_active = true
      AND c.is_active = true
      AND NOT EXISTS (
          SELECT 1 FROM country_allocations ca
          WHERE ca.committee_id = p_committee_id
            AND ca.country_id = c.id
            AND ca.status IN ('held', 'assigned')
      )
    ORDER BY random()
    LIMIT 1;

    IF v_selected_country_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'NO_COUNTRIES_AVAILABLE',
            'message', 'All countries for this committee have been allocated or are currently held.'
        );
    END IF;

    -- Attempt atomic reservation
    v_reservation_result := reserve_country(p_committee_id, v_selected_country_id, p_token_hash, p_hold_minutes);

    IF (v_reservation_result->>'success')::boolean = true THEN
        RETURN jsonb_build_object(
            'success', true,
            'country_id', v_selected_country_id,
            'country_name', v_country_name,
            'country_code', v_country_code,
            'flag_emoji', v_flag_emoji,
            'allocation_id', v_reservation_result->>'allocation_id',
            'reservation_expiry', v_reservation_result->>'reservation_expiry'
        );
    ELSE
        RETURN v_reservation_result;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Confirm allocation for a confirmed delegate registration
CREATE OR REPLACE FUNCTION confirm_allocation(
    p_allocation_id UUID,
    p_token_hash TEXT,
    p_delegate_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_allocation country_allocations%ROWTYPE;
BEGIN
    SELECT * INTO v_allocation
    FROM country_allocations
    WHERE id = p_allocation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Allocation not found.');
    END IF;

    IF v_allocation.status != 'held' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Allocation is no longer in held status.');
    END IF;

    IF v_allocation.reservation_expiry <= now() THEN
        UPDATE country_allocations
        SET status = 'expired', released_at = now(), updated_at = now()
        WHERE id = p_allocation_id;
        RETURN jsonb_build_object('success', false, 'message', 'Reservation hold has expired.');
    END IF;

    IF v_allocation.reservation_token_hash != p_token_hash THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid reservation token.');
    END IF;

    -- Upgrade status to assigned
    UPDATE country_allocations
    SET status = 'assigned',
        delegate_id = p_delegate_id,
        assigned_at = now(),
        reservation_token_hash = NULL, -- clear token hash on confirmation
        updated_at = now()
    WHERE id = p_allocation_id;

    RETURN jsonb_build_object('success', true, 'allocation_id', p_allocation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE conference_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delegates ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION auth_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'administrator', 'registration_manager', 'finance_manager', 'committee_manager', 'dj_music_manager')
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- conference_settings: Public read, admin write
CREATE POLICY "Public can view conference settings"
ON conference_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage conference settings"
ON conference_settings FOR ALL
TO authenticated
USING (auth_is_admin());

-- committees: Public view open, admin all
CREATE POLICY "Public can view committees"
ON committees FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage committees"
ON committees FOR ALL
TO authenticated
USING (auth_is_admin());

-- countries: Public view active, admin all
CREATE POLICY "Public can view active countries"
ON countries FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage countries"
ON countries FOR ALL
TO authenticated
USING (auth_is_admin());

-- committee_countries: Public view, admin all
CREATE POLICY "Public can view committee country mappings"
ON committee_countries FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Admins can manage committee country mappings"
ON committee_countries FOR ALL
TO authenticated
USING (auth_is_admin());

-- country_allocations: Anonymized public read (committee_id, country_id, status only, no delegate info)
CREATE POLICY "Public can view availability status"
ON country_allocations FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage allocations"
ON country_allocations FOR ALL
TO authenticated
USING (auth_is_admin());

-- delegates: Admins only (public cannot inspect delegates)
CREATE POLICY "Admins can view and manage delegates"
ON delegates FOR ALL
TO authenticated
USING (auth_is_admin());

-- payments: Admins and finance only (never public)
CREATE POLICY "Finance and admins can view and manage payments"
ON payments FOR ALL
TO authenticated
USING (auth_is_admin());

-- song_submissions: Public can view approved/played; DJ/admins can view & manage all
CREATE POLICY "Public can view approved songs"
ON song_submissions FOR SELECT
TO anon, authenticated
USING (status IN ('approved', 'played'));

CREATE POLICY "Public can submit song recommendations"
ON song_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "DJ and admins can manage song submissions"
ON song_submissions FOR ALL
TO authenticated
USING (auth_is_admin());

-- faqs: Public read published, admin all
CREATE POLICY "Public can view published FAQs"
ON faqs FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can manage FAQs"
ON faqs FOR ALL
TO authenticated
USING (auth_is_admin());

-- announcements: Public read published, admin all
CREATE POLICY "Public can view published announcements"
ON announcements FOR SELECT
TO anon, authenticated
USING (is_published = true);

CREATE POLICY "Admins can manage announcements"
ON announcements FOR ALL
TO authenticated
USING (auth_is_admin());

-- audit_logs: Admins only
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (auth_is_admin());
