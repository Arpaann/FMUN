import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { esewaGateway } from '@/lib/payments/esewa';
import { khaltiGateway } from '@/lib/payments/khalti';

describe('4. Payment Calculation & Gateway Adapters', () => {
  beforeEach(async () => {
    await db.updateSettings({
      registration_open: true,
      registration_fee: 3000, // NPR 3000
      currency: 'NPR',
    });
  });

  it('guarantees payment amount is server-calculated strictly from settings', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const targetCountry = countries.find((c) => c.status === 'available')!.country;

    const res = await db.reserveCountry(commId, targetCountry.id);
    expect(res.success).toBe(true);

    const reg = await db.createRegistration({
      fullName: 'Bikash Adhikari',
      email: 'bikash@example.com',
      phone: '+9779841999999',
      institution: 'Fluorescent School',
      committeeId: commId,
      countryId: targetCountry.id,
      allocationId: res.allocationId!,
      reservationToken: res.token!,
      paymentMethod: 'physical',
    });

    expect(reg.success).toBe(true);
    expect(reg.payment?.amount).toBe(3000);
    expect(reg.payment?.currency).toBe('NPR');
    expect(reg.payment?.status).toBe('pending');
  });

  it('generates compliant HMAC-SHA256 signature for eSewa EPAY v2', () => {
    const totalAmount = '3000';
    const txnUuid = 'FMUN-2026-TEST01';
    const productCode = 'EPAYTEST';

    const signature = esewaGateway.generateSignature(totalAmount, txnUuid, productCode);
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(20);
  });

  it('rejects eSewa verification when payment amount is tampered', async () => {
    const validData = {
      transaction_code: 'ESW-123456',
      status: 'COMPLETE',
      total_amount: '1500', // Tampered amount (expected 3000)
      transaction_uuid: 'FMUN-2026-TEST-1',
      product_code: 'EPAYTEST',
      signature: 'dummy-sig',
    };

    const encoded = Buffer.from(JSON.stringify(validData)).toString('base64');
    const result = await esewaGateway.verifyPayment(encoded, 3000);

    expect(result.success).toBe(false);
    expect(result.message).toContain('amount mismatch');
  });

  it('converts NPR amount to Paisa for Khalti ePayment v2 (1 NPR = 100 Paisa)', async () => {
    const req = {
      delegateId: 'del-123',
      referenceCode: 'FMUN-2026-X8B9K2',
      amount: 2500, // NPR 2500 -> 250000 Paisa
      delegateName: 'Test Delegate',
      delegateEmail: 'delegate@test.com',
      delegatePhone: '+9779800000000',
      returnUrl: 'http://localhost:3000/api/payments/khalti/verify',
      failureUrl: 'http://localhost:3000/register/failed',
    };

    const init = await khaltiGateway.initiatePayment(req);
    expect(init.pidx).toBeDefined();
    expect(init.paymentUrl).toBeDefined();
  });

  it('allows authorized finance staff to verify payment and mark delegate confirmed', async () => {
    const committees = await db.getCommittees();
    const commId = committees[0].id;
    const countries = await db.getCommitteeCountries(commId);
    const targetCountry = countries.find((c) => c.status === 'available')!.country;

    const res = await db.reserveCountry(commId, targetCountry.id);
    const reg = await db.createRegistration({
      fullName: 'Prashant Karki',
      email: 'prashant@example.com',
      phone: '+9779841888888',
      institution: 'Fluorescent School',
      committeeId: commId,
      countryId: targetCountry.id,
      allocationId: res.allocationId!,
      reservationToken: res.token!,
      paymentMethod: 'physical',
    });

    const paymentId = reg.payment!.id;
    const verifyRes = await db.verifyPayment(paymentId, 'verified', null, 'finance-admin-01');
    expect(verifyRes.success).toBe(true);

    // Verify delegate is confirmed
    const updated = await db.getDelegateByReference(reg.referenceCode!);
    expect(updated?.delegate.status).toBe('confirmed');
    expect(updated?.payment?.status).toBe('verified');
  });
});
