import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// No withError wrapper — Next.js route handler types don't allow generic wrappers cleanly.
// Each route handles its own try/catch for proper TypeScript inference.
