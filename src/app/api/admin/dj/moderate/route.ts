import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const moderateSchema = z.object({
  songId: z.string().min(1),
  status: z.enum(['pending', 'approved', 'rejected', 'played']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = moderateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid moderation payload' }, { status: 400 });
    }

    const { songId, status } = parsed.data;
    const result = await db.updateSongStatus(songId, status, 'dj-secretariat-admin');

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Song moderation failed';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
