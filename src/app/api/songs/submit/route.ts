import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { songSubmissionSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = songSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid song submission',
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const settings = await db.getSettings();

    // Check if song submissions require registered delegate reference
    if (!settings.song_submissions_public && !input.registrationReference) {
      return NextResponse.json(
        {
          success: false,
          message: 'Song recommendations are currently limited to registered delegates. Please enter your registration reference.',
        },
        { status: 403 }
      );
    }

    const result = await db.submitSong({
      title: input.title,
      artist: input.artist,
      sourcePlatform: input.sourcePlatform,
      sourceUrl: input.sourceUrl,
      notes: input.notes,
      submitterName: input.submitterName,
      registrationReference: input.registrationReference,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit song recommendation';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
