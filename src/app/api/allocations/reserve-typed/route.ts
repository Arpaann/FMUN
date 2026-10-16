import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const reserveTypedSchema = z.object({
  committeeId: z.string().min(1, 'Committee is required'),
  countryInput: z.string().min(2, 'Please type a valid country name'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reserveTypedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { committeeId, countryInput } = parsed.data;
    const result = await db.reserveCountryByTypedName(committeeId, countryInput);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 409 } // Conflict: already taken
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error reserving country';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
