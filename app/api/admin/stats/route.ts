import { requireAdmin } from '@/lib/session.server';
import { listRecords } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();

    const [candidates, employers, projects] = await Promise.all([
      listRecords('candidates', { maxRecords: 500 }),
      listRecords('employers', { maxRecords: 200 }),
      listRecords('projects', { maxRecords: 200 }),
    ]);

    const statusBreakdown: Record<string, number> = {};
    let docsIncomplete = 0;

    for (const c of candidates) {
      const status = (c.fields['Candidate Status'] as string) ?? 'New';
      statusBreakdown[status] = (statusBreakdown[status] ?? 0) + 1;
      const ds = c.fields['Document Status'] as Record<string, string> | undefined;
      const approved = ds ? Object.values(ds).filter(v => v === 'Approved').length : 0;
      if (approved < 14) docsIncomplete++;
    }

    const inPipeline = candidates.filter(
      c => !['Placed', 'Rejected'].includes((c.fields['Candidate Status'] as string) ?? '')
    ).length;

    return ok({
      totalCandidates: candidates.length,
      inPipeline,
      docsIncomplete,
      activeVacancies: projects.filter(p => p.fields['Status'] === 'Active').length,
      pendingEmployers: employers.filter(e => e.fields['Request Status'] === 'Pending').length,
      statusBreakdown,
      recentCandidates: candidates.slice(0, 8).map(c => ({
        id: c.id,
        name: c.fields['Name'],
        profession: c.fields['Profession'],
        status: c.fields['Candidate Status'],
        country: c.fields['Destination Country'],
        docProgress: (() => {
          const ds = c.fields['Document Status'] as Record<string, string> | undefined;
          const approved = ds ? Object.values(ds).filter(v => v === 'Approved').length : 0;
          return Math.round((approved / 14) * 100);
        })(),
      })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
