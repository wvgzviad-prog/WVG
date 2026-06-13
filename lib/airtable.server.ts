/**
 * lib/airtable.server.ts
 *
 * Server-only Airtable client.
 * Import only from API routes or Server Actions — never from client components.
 * Next.js will throw a build error if this file is imported client-side
 * because it references process.env values that are not prefixed with NEXT_PUBLIC_.
 */

const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!TOKEN || !BASE_ID) {
  // Only warn at runtime, not during build-time static analysis
  if (typeof window === 'undefined') {
    console.warn('[airtable] AIRTABLE_TOKEN or AIRTABLE_BASE_ID is not set in .env.local');
  }
}

export const TABLE_IDS = {
  candidates:  'tblNGIBUgMHayZUMS',
  employers:   'tblFpBhMrupX2U8B7',
  projects:    'tblufesMFEo9KonUJ',
  payments:    'tblZ2WGMfltYUFiBo',
  monitoring:  'tbllSVgxfSgr7uNAh',
  documents:   'tblKEfWbRV2TOC1ji',
} as const;

export type TableName = keyof typeof TABLE_IDS;

export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

interface ListOptions {
  filterFormula?: string;
  maxRecords?: number;
  sort?: { field: string; direction?: 'asc' | 'desc' }[];
  fields?: string[];
  offset?: string;
}

interface AirtableError {
  error: { type: string; message: string };
}

function baseUrl(table: TableName, recordId?: string) {
  const tbl = TABLE_IDS[table];
  const base = `https://api.airtable.com/v0/${BASE_ID}/${tbl}`;
  return recordId ? `${base}/${recordId}` : base;
}

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const err = data as AirtableError;
    throw new Error(err.error?.message ?? `Airtable ${res.status}`);
  }
  return data as T;
}

/** List records from a table */
export async function listRecords(
  table: TableName,
  opts: ListOptions = {}
): Promise<AirtableRecord[]> {
  const url = new URL(baseUrl(table));
  if (opts.filterFormula) url.searchParams.set('filterByFormula', opts.filterFormula);
  if (opts.maxRecords)    url.searchParams.set('maxRecords', String(opts.maxRecords));
  if (opts.offset)        url.searchParams.set('offset', opts.offset);
  opts.sort?.forEach((s, i) => {
    url.searchParams.set(`sort[${i}][field]`, s.field);
    url.searchParams.set(`sort[${i}][direction]`, s.direction ?? 'asc');
  });
  opts.fields?.forEach((f, i) => url.searchParams.set(`fields[${i}]`, f));

  // Collect all pages
  let allRecords: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url.toString(), { headers: headers(), cache: 'no-store' });
    const data = await handleResponse<{ records: AirtableRecord[]; offset?: string }>(res);
    allRecords = allRecords.concat(data.records);
    offset = data.offset;
  } while (offset && (!opts.maxRecords || allRecords.length < opts.maxRecords));

  return allRecords;
}

/** Get a single record */
export async function getRecord(
  table: TableName,
  id: string
): Promise<AirtableRecord> {
  const res = await fetch(baseUrl(table, id), { headers: headers(), cache: 'no-store' });
  return handleResponse<AirtableRecord>(res);
}

/** Create a record */
export async function createRecord(
  table: TableName,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const res = await fetch(baseUrl(table), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  return handleResponse<AirtableRecord>(res);
}

/** Update a record (PATCH — partial update) */
export async function updateRecord(
  table: TableName,
  id: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const res = await fetch(baseUrl(table, id), {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  return handleResponse<AirtableRecord>(res);
}

/** Delete a record */
export async function deleteRecord(
  table: TableName,
  id: string
): Promise<{ deleted: boolean; id: string }> {
  const res = await fetch(baseUrl(table, id), {
    method: 'DELETE',
    headers: headers(),
  });
  return handleResponse<{ deleted: boolean; id: string }>(res);
}
