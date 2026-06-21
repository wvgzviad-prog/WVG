import { NextResponse } from 'next/server';

export async function GET() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '';

  // Strip quotes exactly as privateKey() does, then normalize \n
  let normalized = raw.replace(/^"([\s\S]*)"$/, '$1').replace(/\\n/g, '\n');

  return NextResponse.json({
    exists: raw.length > 0,
    rawLength: raw.length,
    normalizedLength: normalized.length,
    startsCorrectly: normalized.startsWith('-----BEGIN PRIVATE KEY-----'),
    endsCorrectly: normalized.trimEnd().endsWith('-----END PRIVATE KEY-----'),
    rawHasRealNewlines: raw.includes('\n'),
    rawHasEscapedNewlines: raw.includes('\\n'),
    rawStartsWith10: raw.slice(0, 10),   // first 10 chars only — reveals quote presence
    rawEndsWith10: raw.slice(-10),        // last 10 chars only — reveals quote/newline tail
    normalizedStartsWith27: normalized.slice(0, 27),  // "-----BEGIN PRIVATE KEY-----"
  });
}
