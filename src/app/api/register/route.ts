import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { delegateRegistrationSchema } from '@/lib/validations';
import { esewaGateway } from '@/lib/payments/esewa';
import { khaltiGateway } from '@/lib/payments/khalti';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = delegateRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation error',
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Check conference settings: registration must be open
    const settings = await db.getSettings();
    if (!settings.registration_open) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Registration is currently closed until the official conference schedule and fee are published by the secretariat.',
        },
        { status: 403 }
      );
    }

    // Submit registration to atomic database repository
    const result = await db.createRegistration({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      institution: input.institution,
      academicLevel: input.academicLevel,
      committeeId: input.committeeId,
      countryId: input.countryId,
      allocationId: input.allocationId,
      reservationToken: input.reservationToken,
      paymentMethod: input.paymentMethod,
      transactionReference: input.transactionReference,
      receiptFilePath: input.receiptFilePath,
    });

    if (!result.success || !result.delegate || !result.payment) {
      return NextResponse.json(
        { success: false, message: result.message || 'Registration failed' },
        { status: 400 }
      );
    }

    const { delegate, payment, referenceCode } = result;

    // If eSewa or Khalti was chosen, generate provider payment initiation details
    let gatewayPayload: Record<string, unknown> | null = null;
    const origin = req.nextUrl.origin;

    if (input.paymentMethod === 'esewa' && settings.esewa_enabled && payment.amount > 0) {
      const esewaPayload = esewaGateway.createInitiationPayload({
        delegateId: delegate.id,
        referenceCode: referenceCode!,
        amount: payment.amount,
        delegateName: delegate.full_name,
        delegateEmail: delegate.email,
        delegatePhone: delegate.phone,
        returnUrl: `${origin}/api/payments/esewa/verify`,
        failureUrl: `${origin}/register/status/${referenceCode}?payment=failed`,
      });
      gatewayPayload = { type: 'esewa', form: esewaPayload };
    } else if (input.paymentMethod === 'khalti' && settings.khalti_enabled && payment.amount > 0) {
      const khaltiResponse = await khaltiGateway.initiatePayment({
        delegateId: delegate.id,
        referenceCode: referenceCode!,
        amount: payment.amount,
        delegateName: delegate.full_name,
        delegateEmail: delegate.email,
        delegatePhone: delegate.phone,
        returnUrl: `${origin}/api/payments/khalti/verify?ref=${referenceCode}`,
        failureUrl: `${origin}/register/status/${referenceCode}?payment=failed`,
      });
      gatewayPayload = { type: 'khalti', ...khaltiResponse };
    }

    return NextResponse.json({
      success: true,
      referenceCode,
      delegateId: delegate.id,
      paymentId: payment.id,
      gatewayPayload,
      message: 'Registration successfully created!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server registration error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
