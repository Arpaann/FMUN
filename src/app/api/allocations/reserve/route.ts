import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const reserveSchema = z.object({
  committeeId: z.string().min(1, 'Committee ID is required'),
  countryId: z.string().min(1, 'Country ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reserveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { committeeId, countryId } = parsed.data;
    const result = await db.reserveCountry(committeeId, countryId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 409 } // Conflict: already held or assigned
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal reservation error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
