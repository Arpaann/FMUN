import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { esewaGateway } from '@/lib/payments/esewa';

export async function GET(req: NextRequest) {
  try {
    const dataParam = req.nextUrl.searchParams.get('data');

    if (!dataParam) {
      return NextResponse.redirect(new URL('/register?error=missing_payment_data', req.url));
    }

    const settings = await db.getSettings();
    const expectedAmount = settings.registration_fee || 0;

    const verification = await esewaGateway.verifyPayment(dataParam, expectedAmount);

    if (!verification.success || !verification.rawResponse) {
      return NextResponse.redirect(
        new URL(`/register?error=payment_failed&msg=${encodeURIComponent(verification.message)}`, req.url)
      );
    }

    // Extract reference code from transaction_uuid pattern: "FMUN-2026-XXXXXX-timestamp"
    const rawUuid = String(verification.rawResponse.transaction_uuid || '');
    const refMatch = rawUuid.match(/FMUN-2026-[A-Z0-9]+/);
    const referenceCode = refMatch ? refMatch[0] : null;

    if (referenceCode) {
      const record = await db.getDelegateByReference(referenceCode);
      if (record?.payment) {
        await db.verifyPayment(record.payment.id, 'verified', null, 'esewa-gateway');
      }
      return NextResponse.redirect(new URL(`/register/status/${referenceCode}?payment=verified`, req.url));
    }

    return NextResponse.redirect(new URL('/register?verified=true', req.url));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment verification error';
    return NextResponse.redirect(new URL(`/register?error=${encodeURIComponent(msg)}`, req.url));
  }
}
