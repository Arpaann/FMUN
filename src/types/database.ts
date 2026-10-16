export type AppRole =
  | 'super_admin'
  | 'administrator'
  | 'registration_manager'
  | 'finance_manager'
  | 'committee_manager'
  | 'dj_music_manager';

export interface ConferenceSettings {
  id: string;
  conference_name: string;
  short_name: string;
  year: number;
  theme: string | null;
  tagline: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  venue: string | null;
  registration_fee: number | null; // in NPR
  currency: string;
  registration_open: boolean;
  registration_deadline: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  logo_url: string | null;
  delegate_handbook_url: string | null;
  rules_content: string | null;
  schedule_content: string | null;
  about_content: string | null;
  physical_payment_instructions: string | null;
  digital_payment_instructions: string | null;
  esewa_enabled: boolean;
  khalti_enabled: boolean;
  physical_enabled: boolean;
  manual_transfer_enabled: boolean;
  song_submissions_public: boolean;
  schedule_items?: ScheduleItemConfig[];
  created_at: string;
  updated_at: string;
}

export interface ScheduleItemConfig {
  id: string;
  day: number;
  time: string;
  title: string;
  desc: string;
  tag: string;
  highlight?: boolean;
}

export interface SuggestionSubmission {
  id: string;
  name: string;
  faculty?: string | null;
  stream?: string | null;
  category?: 'agenda' | 'crisis' | 'event' | 'general';
  title?: string;
  details?: string;
  topic?: string;
  idea?: string;
  status: 'new' | 'reviewed' | 'accepted';
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Committee {
  id: string;
  name: string;
  acronym: string;
  description: string | null;
  agenda: string | null;
  capacity: number;
  is_open: boolean;
  eligibility_requirements: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name: string;
  display_name: string;
  code: string;
  flag_emoji: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CommitteeCountry {
  id: string;
  committee_id: string;
  country_id: string;
  status?: 'available' | 'held' | 'assigned';
  is_priority?: boolean;
  is_active: boolean;
  created_at: string;
}

export type DelegateStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected';

export interface Delegate {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  email_normalized: string;
  phone: string;
  phone_normalized: string;
  institution: string;
  academic_level: string | null;
  committee_id: string | null;
  status: DelegateStatus;
  notes: string | null;
  consent_given_at: string;
  created_at: string;
  updated_at: string;
}

export type AllocationStatus = 'held' | 'assigned' | 'released' | 'expired';

export interface CountryAllocation {
  id: string;
  committee_id: string;
  country_id: string;
  delegate_id: string | null;
  status: AllocationStatus;
  reservation_token_hash?: string | null;
  reservation_expiry: string | null;
  assigned_at: string | null;
  released_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'physical' | 'esewa' | 'khalti' | 'manual_transfer';
export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  delegate_id: string;
  amount: number; // in NPR
  currency: string;
  payment_method: PaymentMethod;
  provider: string | null;
  status: PaymentStatus;
  transaction_reference: string | null;
  receipt_file_path: string | null;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  provider_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type SongStatus = 'pending' | 'approved' | 'rejected' | 'played';
export type SongPlatform = 'spotify' | 'youtube' | 'apple_music' | 'soundcloud' | 'other';

export interface SongSubmission {
  id: string;
  title: string;
  artist: string;
  source_platform: SongPlatform;
  source_url: string;
  notes: string | null;
  submitter_name: string | null;
  registration_reference: string | null;
  status: SongStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

