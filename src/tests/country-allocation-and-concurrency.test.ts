import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';

describe('3. Country Allocation & Concurrency Protection', () => {
  beforeEach(async () => {
    await db.updateSettings({ registration_open: true, registration_fee: 2500 });
  });

  it('atomically creates a 15-minute temporary reservation hold with secure token', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const targetCountry = countries.find((c) => c.status === 'available')!.country;

    const res = await db.reserveCountry(commId, targetCountry.id, 15);
    expect(res.success).toBe(true);
    expect(res.allocationId).toBeDefined();
    expect(res.token).toBeDefined();
    expect(res.expiry).toBeDefined();

    // Verify hold duration is approximately 15 minutes
    const expiryTime = new Date(res.expiry!).getTime();
    const nowTime = Date.now();
    const diffMinutes = (expiryTime - nowTime) / (60 * 1000);
    expect(diffMinutes).toBeGreaterThan(14);
    expect(diffMinutes).toBeLessThanOrEqual(15);
  });

  it('rejects simultaneous reservation collisions for the same country in the same committee', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const targetCountry = countries.find((c) => c.status === 'available')!.country;

    // First reservation attempt: should succeed
    const firstRes = await db.reserveCountry(commId, targetCountry.id, 15);
    expect(firstRes.success).toBe(true);

    // Second simultaneous reservation attempt by another delegate: must fail!
    const secondRes = await db.reserveCountry(commId, targetCountry.id, 15);
    expect(secondRes.success).toBe(false);
    expect(secondRes.message).toContain('already held or assigned');
  });

  it('enforces committee-specific country mapping rules', async () => {
    const committees = await db.getCommittees();
    const unsc = committees.find((c) => c.acronym === 'UNSC')!;

    // Non-member in UNSC (e.g. random country not in UNSC roster)
    const invalidCountryId = 'c-non-existent-or-ineligible';

    const res = await db.reserveCountry(unsc.id, invalidCountryId);
    expect(res.success).toBe(false);
    expect(res.message).toContain('not eligible');
  });

  it('generates a random available country and locks it atomically', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;

    const randomResult = await db.generateRandomCountry(commId);
    expect(randomResult.success).toBe(true);
    expect(randomResult.country).toBeDefined();
    expect(randomResult.allocationId).toBeDefined();
    expect(randomResult.token).toBeDefined();

    // The chosen country should now be in 'held' status
    const countryList = await db.getCommitteeCountries(commId);
    const chosenStatus = countryList.find((c) => c.country.id === randomResult.country!.id)?.status;
    expect(chosenStatus).toBe('held');
  });

  it('allows releasing a reservation hold cleanly', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const targetCountry = countries.find((c) => c.status === 'available')!.country;

    const res = await db.reserveCountry(commId, targetCountry.id, 15);
    expect(res.success).toBe(true);

    const released = await db.releaseHold(res.allocationId!, res.token!);
    expect(released).toBe(true);

    // Now country is available again
    const reReserve = await db.reserveCountry(commId, targetCountry.id, 15);
    expect(reReserve.success).toBe(true);
  });

  it('reserves a country by typed name and strictly rejects duplicate repeated selection in the same committee', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;

    // First delegate types "Japan"
    const firstTyped = await db.reserveCountryByTypedName(commId, 'japan');
    expect(firstTyped.success).toBe(true);
    expect(firstTyped.country?.name).toBe('Japan');

    // Second delegate attempts to type the same country ("Japan" or "JAPAN") in this committee
    const duplicateTyped = await db.reserveCountryByTypedName(commId, 'JAPAN');
    expect(duplicateTyped.success).toBe(false);
    expect(duplicateTyped.message).toContain('already chosen or held');

    // Checking availability also reports unavailable
    const check = await db.checkCountryAvailability(commId, 'Japan');
    expect(check.available).toBe(false);
    expect(check.message).toContain('already chosen or held');
  });

  it('stores and retrieves delegate suggestions & ideas', async () => {
    const suggestion = await db.submitSuggestion({
      name: 'Prashant KC',
      faculty: '+2 Science',
      category: 'crisis',
      title: 'Global Cyber Grid Blackout',
      details: 'A midnight cyber attack scenario requiring delegates to negotiate emergency protocols.',
    });

    expect(suggestion.id).toBeDefined();
    expect(suggestion.title).toBe('Global Cyber Grid Blackout');
    expect(suggestion.status).toBe('new');

    const all = await db.getSuggestions();
    expect(all.some((s) => s.id === suggestion.id)).toBe(true);
  });
});

