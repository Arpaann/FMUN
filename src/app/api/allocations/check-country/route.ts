import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const checkSchema = z.object({
  committeeId: z.string().min(1, 'Committee is required'),
  countryInput: z.string().min(2, 'Please type at least 2 characters for country name'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { committeeId, countryInput } = parsed.data;
    const result = await db.checkCountryAvailability(committeeId, countryInput);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error validating country';
    return NextResponse.json({ recognized: false, message: msg }, { status: 500 });
  }
}
