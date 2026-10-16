import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conferenceSettingsSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = conferenceSettingsSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid settings' },
        { status: 400 }
      );
    }

    const updated = await db.updateSettings(parsed.data, 'secretariat-admin');
    return NextResponse.json({ success: true, settings: updated, message: 'Settings successfully updated!' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Settings update failed';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
