import { describe, it, expect, beforeEach } from 'vitest';
import {
  delegateRegistrationSchema,
  normalizeEmail,
  normalizeNepalPhone,
} from '@/lib/validations';
import { db } from '@/lib/db';

describe('1. Registration Validation & Normalization', () => {
  it('normalizes email addresses to lowercase and trims whitespace', () => {
    expect(normalizeEmail('  Delegate.Nepal@GMAIL.Com  ')).toBe('delegate.nepal@gmail.com');
  });

  it('normalizes standard Nepal 10-digit phone numbers with +977 prefix', () => {
    expect(normalizeNepalPhone('9841234567')).toBe('+9779841234567');
    expect(normalizeNepalPhone('+977 9841234567')).toBe('+9779841234567');
    expect(normalizeNepalPhone('+977-9841234567')).toBe('+9779841234567');
  });

  it('validates a complete valid delegate registration payload', () => {
    const validPayload = {
      fullName: 'Aarav Sharma',
      email: 'aarav@fluorescent.edu.np',
      phone: '+977 9841234567',
      institution: 'Fluorescent Secondary School',
      academicLevel: 'Grade 11 / 12',
      committeeId: '123e4567-e89b-12d3-a456-426614174000',
      countryId: '123e4567-e89b-12d3-a456-426614174001',
      allocationId: '123e4567-e89b-12d3-a456-426614174002',
      reservationToken: '0123456789abcdef0123456789abcdef',
      paymentMethod: 'physical' as const,
      transactionReference: null,
      termsAccepted: true as const,
    };

    const result = delegateRegistrationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('aarav@fluorescent.edu.np');
      expect(result.data.phone).toBe('+9779841234567');
    }
  });

  it('rejects registration when terms & code of conduct are not accepted', () => {
    const invalidPayload = {
      fullName: 'Aarav Sharma',
      email: 'aarav@fluorescent.edu.np',
      phone: '+977 9841234567',
      institution: 'Fluorescent Secondary School',
      committeeId: '123e4567-e89b-12d3-a456-426614174000',
      countryId: '123e4567-e89b-12d3-a456-426614174001',
      allocationId: '123e4567-e89b-12d3-a456-426614174002',
      reservationToken: '0123456789abcdef0123456789abcdef',
      paymentMethod: 'physical' as const,
      termsAccepted: false,
    };

    const result = delegateRegistrationSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});

describe('2. Duplicate Registration Prevention', () => {
  beforeEach(async () => {
    // Open registration and set fee for tests
    await db.updateSettings({ registration_open: true, registration_fee: 2500 });
  });

  it('prevents duplicate active registrations with the same email or phone', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const country1 = countries[0].country;
    const country2 = countries[1].country;

    // Reserve country 1
    const res1 = await db.reserveCountry(commId, country1.id);
    expect(res1.success).toBe(true);

    // Register delegate 1
    const reg1 = await db.createRegistration({
      fullName: 'Sujan Shrestha',
      email: 'sujan@example.com',
      phone: '+9779811111111',
      institution: 'Fluorescent School',
      committeeId: commId,
      countryId: country1.id,
      allocationId: res1.allocationId!,
      reservationToken: res1.token!,
      paymentMethod: 'physical',
    });
    expect(reg1.success).toBe(true);

    // Try registering delegate 2 with the SAME email but different country
    const res2 = await db.reserveCountry(commId, country2.id);
    expect(res2.success).toBe(true);

    const duplicateAttempt = await db.createRegistration({
      fullName: 'Sujan Shrestha Clone',
      email: 'sujan@example.com', // Duplicate email
      phone: '+9779822222222',
      institution: 'Fluorescent School',
      committeeId: commId,
      countryId: country2.id,
      allocationId: res2.allocationId!,
      reservationToken: res2.token!,
      paymentMethod: 'physical',
    });

    expect(duplicateAttempt.success).toBe(false);
    expect(duplicateAttempt.message).toContain('active registration already exists');
  });
});
