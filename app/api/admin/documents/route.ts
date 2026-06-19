import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords } from '@/lib/google-sheets.server';
import { ok, err } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const filter = new URL(req.url).searchParams.get('filter') ?? 'missing';

    const records = await listRecords('candidates', {
      maxRecords: 500,
      fields: ['Name', 'Profession', 'Destination Country', 'Candidate Status', 'Document Status'],
      sort: [{ field: 'Name', direction: 'asc' }],
    });

    const withProgress = records.map(r => {
      const ds = (r.fields['Document Status'] as Record<string, string>) ?? {};
      const approved = Object.values(ds).filter(v => v === 'Approved').length;
      return { ...r, _docPct: Math.round((approved / 14) * 100), _docApproved: approved };
    });

    let result = withProgress;
    if (filter === 'missing') result = withProgress.filter(r => r._docPct < 100).sort((a, b) => a._docPct - b._docPct);
    if (filter === 'complete') result = withProgress.filter(r => r._docPct === 100);

    return ok(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
