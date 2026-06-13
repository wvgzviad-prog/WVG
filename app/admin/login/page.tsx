'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: 'admin', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Login failed');
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f4f8',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '40px 36px',
        width: 380,
        boxShadow: '0 2px 16px rgba(0,0,0,.08)',
        border: '0.5px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40,
            background: '#0f2557',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#c9a84c', letterSpacing: -.5,
          }}>WVG</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#0f2557' }}>WVG Admin</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Workforce Deployment OS</div>
          </div>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b', marginBottom: 24 }}>
          Sign in
        </h1>

        {error && (
          <div style={{
            background: '#fef2f2', border: '0.5px solid #fca5a5',
            borderRadius: 8, padding: '10px 14px',
            color: '#dc2626', fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              required
              autoComplete="username"
              style={{
                width: '100%', padding: '9px 12px',
                border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, color: '#1e293b',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              autoComplete="current-password"
              style={{
                width: '100%', padding: '9px 12px',
                border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, color: '#1e293b',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#94a3b8' : '#c9a84c',
              color: '#0f2557', fontWeight: 700, fontSize: 14,
              border: 'none', borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background .15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
          Protected area — WVG staff only
        </p>
      </div>
    </div>
  );
}
