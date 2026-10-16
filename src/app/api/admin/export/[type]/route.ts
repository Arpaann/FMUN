import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;

    if (type === 'delegates') {
      const delegates = await db.getAllDelegatesWithDetails();
      const headers = [
        'Reference Code',
        'Full Name',
        'Email',
        'Phone',
        'Institution',
        'Committee',
        'Country',
        'Status',
        'Payment Status',
        'Registered At',
      ];
      const rows = delegates.map((d) => [
        `"${d.reference_code}"`,
        `"${d.full_name.replace(/"/g, '""')}"`,
        `"${d.email}"`,
        `"${d.phone}"`,
        `"${d.institution.replace(/"/g, '""')}"`,
        `"${d.committeeName}"`,
        `"${d.countryName}"`,
        `"${d.status}"`,
        `"${d.paymentStatus}"`,
        `"${d.created_at}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="fmun_2026_delegates_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'finance') {
      const delegates = await db.getAllDelegatesWithDetails();
      const headers = [
        'Payment ID',
        'Delegate Reference',
        'Delegate Name',
        'Amount (NPR)',
        'Payment Method',
        'Status',
        'Transaction Reference',
        'Registered At',
      ];
      const rows = delegates.map((d) => [
        `"${d.paymentId || 'N/A'}"`,
        `"${d.reference_code}"`,
        `"${d.full_name.replace(/"/g, '""')}"`,
        d.paymentAmount,
        `"${d.paymentMethod}"`,
        `"${d.paymentStatus}"`,
        `"${d.transactionReference || 'N/A'}"`,
        `"${d.created_at}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="fmun_2026_finance_${Date.now()}.csv"`,
        },
      });
    }

    if (type === 'dj') {
      const songs = await db.getAllSongs();
      const headers = [
        'Title',
        'Artist',
        'Platform',
        'Source URL',
        'Status',
        'Submitter',
        'Submitted At',
      ];
      const rows = songs.map((s) => [
        `"${s.title.replace(/"/g, '""')}"`,
        `"${s.artist.replace(/"/g, '""')}"`,
        `"${s.source_platform}"`,
        `"${s.source_url.replace(/"/g, '""')}"`,
        `"${s.status}"`,
        `"${(s.submitter_name || 'Anonymous').replace(/"/g, '""')}"`,
        `"${s.created_at}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="fmun_2026_playlist_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Export failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
