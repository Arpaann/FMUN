import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { khaltiGateway } from '@/lib/payments/khalti';

export async function GET(req: NextRequest) {
  try {
    const pidx = req.nextUrl.searchParams.get('pidx');
    const ref = req.nextUrl.searchParams.get('ref') || '';

    if (!pidx) {
      return NextResponse.redirect(new URL('/register?error=missing_pidx', req.url));
    }

    const settings = await db.getSettings();
    const expectedAmount = settings.registration_fee || 0;

    const verification = await khaltiGateway.verifyPayment(pidx, expectedAmount, ref);

    if (!verification.success) {
      return NextResponse.redirect(
        new URL(`/register?error=khalti_failed&msg=${encodeURIComponent(verification.message)}`, req.url)
      );
    }

    if (ref) {
      const record = await db.getDelegateByReference(ref);
      if (record?.payment) {
        await db.verifyPayment(record.payment.id, 'verified', null, 'khalti-gateway');
      }
      return NextResponse.redirect(new URL(`/register/status/${ref}?payment=verified`, req.url));
    }

    return NextResponse.redirect(new URL('/register?verified=true', req.url));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Khalti verification error';
    return NextResponse.redirect(new URL(`/register?error=${encodeURIComponent(msg)}`, req.url));
  }
}
