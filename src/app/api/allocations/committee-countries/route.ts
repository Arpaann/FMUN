import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const committeeId = req.nextUrl.searchParams.get('committeeId');
    if (!committeeId) {
      return NextResponse.json({ success: false, message: 'Missing committeeId' }, { status: 400 });
    }

    const countries = await db.getCommitteeCountries(committeeId);
    return NextResponse.json({ success: true, countries });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch committee countries';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
