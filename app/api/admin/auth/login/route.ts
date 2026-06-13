import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session.server';
import { ok, err } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME ?? 'admin';
    const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? '';

    if (!passwordHash) {
      return err('Admin password not configured. Set ADMIN_PASSWORD_HASH in .env.local.', 500);
    }

    if (username !== expectedUsername) {
      return err('Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return err('Invalid credentials', 401);
    }

    const session = await getSession();
    session.isAdmin = true;
    session.username = username;
    session.loginAt = Date.now();
    await session.save();

    return ok({ ok: true, username });
  } catch {
    return err('Login failed', 500);
  }
}
