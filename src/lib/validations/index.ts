import { z } from 'zod';

// Nepal phone number regex: allows +977 9XXXXXXXXX, 9779XXXXXXXXX, or 98XXXXXXXX / 97XXXXXXXX
const NEPAL_PHONE_REGEX = /^(?:\+?977[- ]?)?(?:98|97|01|96)\d{8}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeNepalPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('977')) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+977${digits}`;
  }
  return `+${digits}`;
}

export const delegateRegistrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform(normalizeEmail),
  phone: z
    .string()
    .trim()
    .regex(NEPAL_PHONE_REGEX, 'Please enter a valid Nepalese phone number (e.g. +977 98XXXXXXXX or 98XXXXXXXX)')
    .transform(normalizeNepalPhone),
  institution: z
    .string()
    .trim()
    .min(2, 'Please enter your school or institution name')
    .max(120, 'Institution name must not exceed 120 characters'),
  academicLevel: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),
  committeeId: z
    .string()
    .uuid('Please select a valid committee'),
  countryId: z
    .string()
    .uuid('Please select a valid country'),
  allocationId: z
    .string()
    .uuid('Invalid allocation ID'),
  reservationToken: z
    .string()
    .min(16, 'Invalid reservation token'),
  paymentMethod: z.enum(['physical', 'esewa', 'khalti', 'manual_transfer']),
  transactionReference: z.string().trim().max(100).optional().nullable(),
  receiptFilePath: z.string().trim().optional().nullable(),
  termsAccepted: z.literal(true, {
    message: 'You must accept the FMUN rules and code of conduct',
  }),
});

export type DelegateRegistrationInput = z.infer<typeof delegateRegistrationSchema>;

// Allowed domains for song recommendation streaming platforms
const ALLOWED_STREAMING_DOMAINS = [
  'spotify.com',
  'open.spotify.com',
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'music.youtube.com',
  'apple.com',
  'music.apple.com',
  'soundcloud.com',
  'm.soundcloud.com',
];

export const songSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Song title is required')
    .max(120, 'Song title too long'),
  artist: z
    .string()
    .trim()
    .min(1, 'Artist name is required')
    .max(120, 'Artist name too long'),
  sourcePlatform: z.enum(['spotify', 'youtube', 'apple_music', 'soundcloud', 'other']),
  sourceUrl: z
    .string()
    .trim()
    .url('Please provide a valid URL')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return false;
        }
        // If not 'other', check known domains
        return true;
      } catch {
        return false;
      }
    }, 'URL must use HTTP or HTTPS protocol')
    .refine((url) => {
      try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        return ALLOWED_STREAMING_DOMAINS.some(
          (domain) => host === domain || host.endsWith('.' + domain)
        );
      } catch {
        return false;
      }
    }, 'URL must be from an approved music platform (Spotify, YouTube, Apple Music, SoundCloud)'),
  notes: z
    .string()
    .trim()
    .max(300, 'Notes must be under 300 characters')
    .optional()
    .nullable(),
  submitterName: z
    .string()
    .trim()
    .max(80)
    .optional()
    .nullable(),
  registrationReference: z
    .string()
    .trim()
    .max(30)
    .optional()
    .nullable(),
});

export type SongSubmissionInput = z.infer<typeof songSubmissionSchema>;

export const conferenceSettingsSchema = z.object({
  conference_name: z.string().trim().min(2),
  short_name: z.string().trim().min(2),
  year: z.number().int().min(2025).max(2035),
  theme: z.string().trim().nullable().optional(),
  tagline: z.string().trim().min(2),
  description: z.string().trim().nullable().optional(),
  start_date: z.string().datetime().nullable().optional(),
  end_date: z.string().datetime().nullable().optional(),
  venue: z.string().trim().nullable().optional(),
  registration_fee: z.number().nonnegative().nullable().optional(),
  currency: z.string().length(3).default('NPR'),
  registration_open: z.boolean().default(false),
  registration_deadline: z.string().datetime().nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  social_facebook: z.string().url().nullable().optional(),
  social_instagram: z.string().url().nullable().optional(),
  social_linkedin: z.string().url().nullable().optional(),
  physical_payment_instructions: z.string().nullable().optional(),
  digital_payment_instructions: z.string().nullable().optional(),
  esewa_enabled: z.boolean().default(true),
  khalti_enabled: z.boolean().default(true),
  physical_enabled: z.boolean().default(true),
  manual_transfer_enabled: z.boolean().default(true),
  song_submissions_public: z.boolean().default(true),
});

export const paymentVerificationSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['verified', 'rejected']),
  rejectionReason: z.string().trim().max(300).optional().nullable(),
});
