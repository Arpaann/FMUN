# FMUN 2026 — Fluorescent Model United Nations

> **"Where Nations Meet. Ideas Move."**  
> The official, production-ready website and conference management system for the first-ever Model United Nations organized by **Fluorescent Secondary School, Kathmandu, Nepal**.

---

## 🌟 Executive Overview

FMUN 2026 is an international-grade diplomatic conference portal and management platform. Commissioned for the program manager, web designer, and resident DJ, the platform combines:
- **Cinematic Public Experience:** Editorial serif typography, midnight navy & champagne gold palette, animated longitude/latitude coordinate lines, interactive 3D vector diplomatic globe with Kathmandu host beacon.
- **Dynamic Sovereign Allocation Matrix:** Live database-backed country availability roster per committee, supporting either manual sovereign choice or animated diplomatic random generation.
- **Atomic Concurrency Protection:** Cryptographic temporary reservation holds (15-minute expiration) with partial unique indexes preventing duplicate active allocations for the same country in any committee.
- **Nepalese Payment Gateways:** Server-calculated registration fees in Nepalese Rupees (NPR), official eSewa EPAY v2 HMAC-SHA256 signature verification, Khalti ePayment v2 API initiation and lookup verification, and manual cash vouchers.
- **After-Party & DJ Music System:** Distinctive social portal with audio waveforms, approved playlist, safe delegate song recommendation submission with anti-script URL validation, and an administrative DJ console.
- **Administrative Control Engine (`/admin`):** Live telemetry metrics, delegate roster management with RFC-compliant CSV export, country quota manager, finance voucher approval/rejection with reason, and website content manager.

---

## 🎨 Visual Identity

- **Midnight Navy:** `#07111F` (Base background)
- **Deep Blue:** `#101E33` (Diplomatic panels)
- **Warm Ivory:** `#F6F2E9` (Diplomatic prose and headlines)
- **Champagne Gold:** `#C9A96E` (Summit accents, borders, and brand crest)
- **Muted Grey:** `#8B95A5` (Secondary metadata)
- **Accent Red:** `#D94B4B` (Pings and badges)

---

## 🏛 Database Architecture & Migrations

The database is built on **Supabase PostgreSQL** with full **Row Level Security (RLS)** and stored procedures for race-condition-free reservations:

1. `conference_settings`: Global conference parameters, provisional tagline, unconfirmed dates/theme/fee (held as `NULL` until published by the Secretariat), payment instructions.
2. `profiles`: Authenticated staff with role-based access control (`super_admin`, `administrator`, `registration_manager`, `finance_manager`, `committee_manager`, `dj_music_manager`).
3. `committees`: Deliberative councils (acronym, description, agenda, capacity, open/closed status).
4. `countries`: Normalized roster of UN member states and permanent observer states with ISO codes and flag emojis.
5. `committee_countries`: Committee-specific country mappings with unique constraints.
6. `delegates`: Delegate credentials, normalized email, normalized Nepalese phone (`+977`), unguessable reference codes (e.g. `FMUN-2026-X8B9K2`).
7. `country_allocations`: Atomic reservation holds, cryptographic token hashes, 15-minute expiry handling, and partial unique index `idx_unique_active_committee_country`.
8. `payments`: Server-calculated amounts, provider records, transaction references, private receipts, and verification audits.
9. `song_submissions`: Delegate music requests with platform URL security, moderation status (`pending`, `approved`, `rejected`, `played`).
10. `faqs`: Categorized knowledge base entries.
11. `announcements`: Official Secretariat communications.
12. `audit_logs`: Immutable trail of administrative and financial operations.

### Applying Database Migrations

In your Supabase project SQL Editor or via Supabase CLI, run:
```bash
# Apply schema, functions, indexes, and RLS policies
psql -h db.your-supabase.co -U postgres -d postgres -f supabase/migrations/00001_initial_schema.sql

# Seed normalized countries, initial baseline settings, and FAQs
psql -h db.your-supabase.co -U postgres -d postgres -f supabase/migrations/00002_seed_data.sql
```

---

## 🔒 Security & Concurrency Controls

- **Database-Level Allocation Lock:** Partial unique index:
  ```sql
  CREATE UNIQUE INDEX idx_unique_active_committee_country 
  ON country_allocations (committee_id, country_id) 
  WHERE status IN ('held', 'assigned');
  ```
  Guarantees that no two delegates can hold or be assigned the same sovereign country in a committee simultaneously.
- **Server-Calculated Amounts:** Payment totals are strictly resolved on the server from `conference_settings.registration_fee`. No client-side price parameter is ever accepted as authoritative.
- **URL & Script Protection:** Song recommendation URLs must use HTTP/HTTPS and belong to approved streaming hosts (Spotify, YouTube, SoundCloud, Apple Music). Malicious schemes (`javascript:`, `data:`) are rejected.
- **Cryptographic References:** Delegate reference codes follow `FMUN-2026-[A-Z2-9]{6}` and cannot be sequentially enumerated.

---

## 💳 Payment Gateway Adapters

### 1. eSewa EPAY v2
- Developer specs: `https://developer.esewa.com.np/`
- Generates HMAC-SHA256 signature using `total_amount`, `transaction_uuid`, and `product_code`.
- Test merchant code: `EPAYTEST`
- Server-side callback verification decodes the base64 `?data=` query parameter, validates the returned signature, matches expected fees, and checks status.

### 2. Khalti ePayment v2
- Developer specs: `https://docs.khalti.com/`
- Converts NPR integer into paisa (`amount * 100`).
- Initiates transaction with `/api/v2/epayment/initiate/`.
- Verifies server-to-server with `/api/v2/epayment/lookup/` matching order ID and total amount.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### 2. Install Dependencies
```bash
cd fmun-2026
npm install --legacy-peer-deps
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the conference website.

### 5. Running the Test Suite
The project includes automated integration tests covering all critical flows:
```bash
npm run test
```
**Results:** 4 test suites, 20 tests covering registration validation, country allocation concurrency, payment calculation, eSewa and Khalti gateways, and song moderation.

### 6. Production Build
```bash
npm run build
```

---

## 🛠 Secretariat Administrator Setup

1. In Supabase Auth, invite or register the primary organizer email (e.g., `admin@fluorescent.edu.np`).
2. In the SQL Editor, grant the super administrator role:
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   VALUES ('<supabase-auth-user-id>', 'admin@fluorescent.edu.np', 'Secretariat Admin', 'super_admin')
   ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
   ```
3. Log in at `/admin/login` or access `/admin` directly during development.
4. From `/admin/settings`, configure conference dates, official theme, delegate fee, and toggle **Registration Open** when ready to begin delegate admissions.

---

## 🌐 Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Set the Framework Preset to **Next.js**.
4. Configure the environment variables from your `.env.local`.
5. Deploy. The platform will automatically deploy as an optimized Next.js App Router application.
