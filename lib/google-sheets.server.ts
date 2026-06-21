/**
 * lib/google-sheets.server.ts
 *
 * Server-only Google Sheets adapter.
 * Keeps the same record shape that the old Airtable adapter returned:
 * { id, createdTime, fields }
 *
 * Required environment variables:
 * GOOGLE_SHEETS_SPREADSHEET_ID
 * GOOGLE_SERVICE_ACCOUNT_EMAIL
 * GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 */

import crypto from 'crypto';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const RAW_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if ((!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !RAW_PRIVATE_KEY) && typeof window === 'undefined') {
  console.warn('[google-sheets] Missing GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
}

export const SHEET_NAMES = {
  candidates: process.env.GOOGLE_SHEET_CANDIDATES ?? 'Candidates',
  employers: process.env.GOOGLE_SHEET_EMPLOYERS ?? 'Employers',
  projects: process.env.GOOGLE_SHEET_PROJECTS ?? 'Projects',
  payments: process.env.GOOGLE_SHEET_PAYMENTS ?? 'Payments',
  monitoring: process.env.GOOGLE_SHEET_MONITORING ?? 'Monitoring',
  documents: process.env.GOOGLE_SHEET_DOCUMENTS ?? 'Documents',
  tallyRegistrations: process.env.GOOGLE_SHEET_TALLY_REGISTRATIONS ?? 'WVG-კანდიდატების რეგისტრაცია',
} as const;

export type TableName = keyof typeof SHEET_NAMES;

export interface SheetRecord {
  id: string; // Google Sheet row number as string
  createdTime: string;
  fields: Record<string, unknown>;
}

interface ListOptions {
  filterFormula?: string;
  maxRecords?: number;
  sort?: { field: string; direction?: 'asc' | 'desc' }[];
  fields?: string[];
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function privateKey() {
  let key = RAW_PRIVATE_KEY ?? '';
  // Strip surrounding double-quotes added by some env editors or Vercel paste
  key = key.replace(/^"([\s\S]*)"$/, '$1');
  // Normalize escaped \n sequences (Vercel single-line format) to real newlines
  key = key.replace(/\\n/g, '\n');
  return key;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.accessToken;
  if (!SERVICE_ACCOUNT_EMAIL || !RAW_PRIVATE_KEY) throw new Error('Google service account is not configured');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(privateKey()));
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description ?? data.error ?? 'Google auth failed');
  cachedToken = { accessToken: data.access_token, expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000 };
  return cachedToken.accessToken;
}

async function sheetsFetch(path: string, init: RequestInit = {}) {
  if (!SPREADSHEET_ID) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured');
  const token = await getAccessToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error?.message ?? `Google Sheets ${res.status}`);
  return data;
}

function sheetName(table: TableName) {
  return SHEET_NAMES[table];
}

function q(s: string) {
  return encodeURIComponent(`'${s.replace(/'/g, "''")}'`);
}

function rowsToRecords(values: string[][]): SheetRecord[] {
  const headers = values[0] ?? [];
  return values.slice(1).map((row, idx) => {
    const fields: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      if (!h) return;
      const raw = row[i] ?? '';
      if (raw === '') return;
      if (raw.startsWith('{') || raw.startsWith('[')) {
        try { fields[h] = JSON.parse(raw); return; } catch {}
      }
      fields[h] = raw;
    });
    return { id: String(idx + 2), createdTime: String(fields['Created Time'] ?? ''), fields };
  });
}

async function getHeaders(table: TableName): Promise<string[]> {
  const data = await sheetsFetch(`/values/${q(sheetName(table))}!1:1`);
  return data.values?.[0] ?? [];
}

function valuesForHeaders(headers: string[], fields: Record<string, unknown>) {
  return headers.map(h => {
    const value = fields[h];
    if (value === undefined || value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  });
}

function applySimpleFilter(records: SheetRecord[], formula?: string) {
  if (!formula) return records;
  const equal = formula.match(/^\{(.+?)\}\s*=\s*"(.*)"$/);
  if (equal) return records.filter(r => String(r.fields[equal[1]] ?? '') === equal[2]);
  const find = formula.match(/^FIND\("(.+?)",\s*ARRAYJOIN\(\{(.+?)\},\s*","\)\)$/);
  if (find) return records.filter(r => String(r.fields[find[2]] ?? '').includes(find[1]));
  return records;
}

/** List records from a sheet */
export async function listRecords(table: TableName, opts: ListOptions = {}): Promise<SheetRecord[]> {
  const data = await sheetsFetch(`/values/${q(sheetName(table))}`);
  let records = rowsToRecords(data.values ?? []);
  records = applySimpleFilter(records, opts.filterFormula);

  if (opts.fields?.length) {
    records = records.map(r => ({
      ...r,
      fields: Object.fromEntries(Object.entries(r.fields).filter(([k]) => opts.fields!.includes(k))),
    }));
  }

  opts.sort?.slice().reverse().forEach(s => {
    records.sort((a, b) => String(a.fields[s.field] ?? '').localeCompare(String(b.fields[s.field] ?? ''), 'ka'));
    if (s.direction === 'desc') records.reverse();
  });

  if (opts.maxRecords) records = records.slice(0, opts.maxRecords);
  return records;
}

/** Get a single record by row number */
export async function getRecord(table: TableName, id: string): Promise<SheetRecord> {
  const row = Number(id);
  if (!Number.isInteger(row) || row < 2) throw new Error('Invalid row id');
  const headers = await getHeaders(table);
  const data = await sheetsFetch(`/values/${q(sheetName(table))}!${row}:${row}`);
  const values = [headers, ...(data.values ?? [[]])];
  const record = rowsToRecords(values)[0];
  if (!record) throw new Error('Record not found');
  record.id = id;
  return record;
}

/** Create a record */
export async function createRecord(table: TableName, fields: Record<string, unknown>): Promise<SheetRecord> {
  const headers = await getHeaders(table);
  if (!headers.length) throw new Error(`Sheet ${sheetName(table)} has no header row`);
  if (headers.includes('Created Time') && fields['Created Time'] === undefined) fields['Created Time'] = new Date().toISOString();
  const values = [valuesForHeaders(headers, fields)];
  const data = await sheetsFetch(`/values/${q(sheetName(table))}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ values }),
  });
  const updatedRange = data.updates?.updatedRange as string | undefined;
  const rowMatch = updatedRange?.match(/!(?:[A-Z]+)(\d+):/);
  const id = rowMatch?.[1] ?? '';
  return { id, createdTime: String(fields['Created Time'] ?? ''), fields };
}

/** Update a record by row number */
export async function updateRecord(table: TableName, id: string, fields: Record<string, unknown>): Promise<SheetRecord> {
  const existing = await getRecord(table, id);
  const headers = await getHeaders(table);
  const merged = { ...existing.fields, ...fields };
  const values = [valuesForHeaders(headers, merged)];
  await sheetsFetch(`/values/${q(sheetName(table))}!${id}:${id}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values }),
  });
  return { id, createdTime: existing.createdTime, fields: merged };
}

/** Delete a record by clearing the row. Safer than shifting row numbers in an operational registry. */
export async function deleteRecord(table: TableName, id: string): Promise<{ deleted: boolean; id: string }> {
  await sheetsFetch(`/values/${q(sheetName(table))}!${id}:${id}:clear`, { method: 'POST', body: '{}' });
  return { deleted: true, id };
}
