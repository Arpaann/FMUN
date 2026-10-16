import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const suggestionSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  faculty: z.string().optional(),
  category: z.enum(['agenda', 'crisis', 'event', 'general']),
  title: z.string().min(3, 'Please enter a title or idea topic'),
  details: z.string().min(10, 'Please describe your idea or suggestion in at least 10 characters'),
});

export async function GET() {
  try {
    const list = await db.getSuggestions();
    return NextResponse.json({ success: true, suggestions: list });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching suggestions';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = suggestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message || 'Invalid suggestion details' },
        { status: 400 }
      );
    }

    const item = await db.submitSuggestion(parsed.data);
    return NextResponse.json({ success: true, suggestion: item }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error submitting suggestion';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
