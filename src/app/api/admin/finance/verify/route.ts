import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentVerificationSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = paymentVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { paymentId, status, rejectionReason } = parsed.data;
    const result = await db.verifyPayment(paymentId, status, rejectionReason, 'secretariat-finance-admin');

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Finance verification failed';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
