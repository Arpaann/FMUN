import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const randomSchema = z.object({
  committeeId: z.string().min(1, 'Committee ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = randomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid committee' },
        { status: 400 }
      );
    }

    const { committeeId } = parsed.data;
    const result = await db.generateRandomCountry(committeeId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal allocation error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
