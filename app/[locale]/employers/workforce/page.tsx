import { getWorkforceData } from '@/lib/workforce.server';
import Link from 'next/link';
import { Users, ArrowRight, MessageCircle, Briefcase, ShieldCheck, RefreshCw } from 'lucide-react';

export const revalidate = 300;

// ── Trilingual copy ────────────────────────────────────────────────────────────

const COPY = {
  ka: {
    badge:         'WVG სამუშაო რეესტრი — ისრაელი',
    title:         'დადასტურებული ქართველი სპეციალისტები ისრაელისთვის',
    subtitle:      'მხოლოდ ის კანდიდატები, რომლებიც Work Visa Georgia-მ გადაამოწმა და დამსაქმებლებისთვის დაამტკიცა.',
    verified:      'დადასტურებულია Work Visa Georgia-ს მიერ',
    totalLabel:    'დამტკიცებული კანდიდატი',
    catsLabel:     'პროფესიული კატეგორია',
    profsLabel:    'სტრუქტურირებული პროფესია',
    updated:       'მონაცემები განახლდება ყოველ 5 წუთში.',
    catTitle:      'პროფესიული კატეგორიები',
    profTitle:     'პოპულარული პროფესიები',
    profHeader:    ['პროფესია', 'კატეგორია', 'კანდიდატი'],
    expTitle:      'გამოცდილების დონე',
    ctaTitle:      'გჭირდებათ ქართველი სპეციალისტები თქვენი პროექტისთვის ისრაელში?',
    ctaBody:       'მოგვწერეთ მოთხოვნილი პროფესია, რაოდენობა და დაწყების სავარაუდო თარიღი.',
    ctaBtn:        'დაგვიკავშირდით',
    whatsapp:      'WhatsApp',
    candidates:    'კანდიდატი',
  },
  en: {
    badge:         'WVG Workforce Registry — Israel',
    title:         'Verified Georgian Workforce for Israel',
    subtitle:      'Only candidates manually reviewed and approved by Work Visa Georgia for employer presentation.',
    verified:      'Verified by Work Visa Georgia',
    totalLabel:    'Approved candidates',
    catsLabel:     'Profession categories',
    profsLabel:    'Structured professions',
    updated:       'Data refreshes every 5 minutes.',
    catTitle:      'Profession Categories',
    profTitle:     'Top Available Professions',
    profHeader:    ['Profession', 'Category', 'Candidates'],
    expTitle:      'Experience Breakdown',
    ctaTitle:      'Looking for Georgian specialists for your Israeli project?',
    ctaBody:       'Send us the required profession, quantity, and expected start date.',
    ctaBtn:        'Contact WVG',
    whatsapp:      'WhatsApp',
    candidates:    'candidates',
  },
  ru: {
    badge:         'Реестр специалистов WVG — Израиль',
    title:         'Проверенные грузинские специалисты для Израиля',
    subtitle:      'Только кандидаты, вручную проверенные и одобренные Work Visa Georgia для работодателей.',
    verified:      'Проверено Work Visa Georgia',
    totalLabel:    'Утверждённых кандидатов',
    catsLabel:     'Категорий профессий',
    profsLabel:    'Структурированных профессий',
    updated:       'Данные обновляются каждые 5 минут.',
    catTitle:      'Профессиональные категории',
    profTitle:     'Топ доступных профессий',
    profHeader:    ['Профессия', 'Категория', 'Кандидатов'],
    expTitle:      'Распределение по опыту',
    ctaTitle:      'Нужны грузинские специалисты для вашего проекта в Израиле?',
    ctaBody:       'Сообщите профессию, количество и предполагаемую дату начала.',
    ctaBtn:        'Связаться с WVG',
    whatsapp:      'WhatsApp',
    candidates:    'кандидатов',
  },
} as const;

type Locale = keyof typeof COPY;

// ── Category config ────────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  'მშენებლობა':                          '#f59e0b',
  'მეტალი და ინდუსტრია':                '#3b82f6',
  'ტექნიკა და მძღოლები':                '#8b5cf6',
  'ელექტრო და ტექნიკური სპეციალობები': '#06b6d4',
  'მომსახურება და მოვლა':               '#10b981',
  'დამხმარე სამუშაოები':                '#64748b',
  'სხვა':                                '#94a3b8',
};

const CATEGORY_ICON: Record<string, string> = {
  'მშენებლობა':                          '🏗️',
  'მეტალი და ინდუსტრია':                '⚙️',
  'ტექნიკა და მძღოლები':                '🚛',
  'ელექტრო და ტექნიკური სპეციალობები': '⚡',
  'მომსახურება და მოვლა':               '🤝',
  'დამხმარე სამუშაოები':                '🔧',
};

// ── Experience label normalizer (display only) ─────────────────────────────────

const STANDARD_EXP = new Set([
  'გამოცდილების გარეშე',
  '0–2 წელი',
  '2–5 წელი',
  '5–10 წელი',
  '10+ წელი',
]);

function normalizeExpLabel(raw: string): string {
  if (STANDARD_EXP.has(raw)) return raw;
  // Normalise hyphen ranges to em-dash versions first
  const mapped: Record<string, string> = {
    '0-2':  '0–2 წელი',
    '2-5':  '2–5 წელი',
    '5-10': '5–10 წელი',
  };
  if (mapped[raw]) return mapped[raw];
  // Bare numbers / "10+" style: append " წელი" if not already there
  if (/^\d/.test(raw) && !raw.includes('წელი')) return `${raw} წელი`;
  return raw;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function WorkforcePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'ka'];

  let data;
  let errorMsg: string | null = null;
  try {
    data = await getWorkforceData();
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : String(e);
  }

  if (errorMsg || !data) {
    return (
      <div style={{ padding: 40, fontFamily: 'monospace' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Workforce data unavailable</h2>
        <pre style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 16, whiteSpace: 'pre-wrap', fontSize: 13, color: '#7f1d1d' }}>{errorMsg ?? 'Unknown error'}</pre>
      </div>
    );
  }

  // Filter "სხვა" from category cards and count KPIs
  const mainCategories = data.byCategory.filter(({ category }) => category !== 'სხვა');
  const categoryCount  = mainCategories.length;
  const professionCount = data.byProfession.length;

  const maxProfCount = data.byProfession[0]?.count ?? 1;
  const maxExpCount  = data.byExperience.reduce((m, e) => Math.max(m, e.count), 1);

  return (
    <div style={{ fontFamily: "'Inter','Noto Sans Georgian',system-ui,sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg,#0a1e4a 0%,#0f2557 60%,#1a3a7c 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }} aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="wgrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth=".8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wgrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative">

          {/* top badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
            <Briefcase size={13} style={{ color: '#c9a84c' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#93c5fd', letterSpacing: '.03em' }}>{c.badge}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem,4.5vw,3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14, letterSpacing: '-0.02em', maxWidth: 680 }}>
            {c.title}
          </h1>
          <p style={{ fontSize: 16, color: '#bfdbfe', marginBottom: 20, maxWidth: 560, lineHeight: 1.6 }}>{c.subtitle}</p>

          {/* verification badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.35)', borderRadius: 8, padding: '8px 16px', marginBottom: 40 }}>
            <ShieldCheck size={15} style={{ color: '#34d399' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>{c.verified}</span>
          </div>

          {/* KPI cards row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {/* total */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 16, padding: '20px 36px', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={20} style={{ color: '#c9a84c' }} />
                <span style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.total}</span>
              </div>
              <span style={{ fontSize: 12, color: '#c9a84c', fontWeight: 600 }}>{c.totalLabel}</span>
            </div>
            {/* categories */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '20px 36px', gap: 4 }}>
              <span style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{categoryCount}</span>
              <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>{c.catsLabel}</span>
            </div>
            {/* professions */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: '20px 36px', gap: 4 }}>
              <span style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{professionCount}</span>
              <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>{c.profsLabel}</span>
            </div>
          </div>

          {/* refresh note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
            <RefreshCw size={11} style={{ color: '#475569' }} />
            <span style={{ fontSize: 11, color: '#475569' }}>{c.updated}</span>
          </div>
        </div>
      </section>

      {/* ── BY CATEGORY ── */}
      {mainCategories.length > 0 && (
        <section style={{ background: '#f8fafc', padding: '60px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ width: 48, height: 4, background: '#c9a84c', borderRadius: 2, marginBottom: 16 }} />
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#0f2557', marginBottom: 32, letterSpacing: '-0.01em' }}>
              {c.catTitle}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {mainCategories.map(({ category, count }) => {
                const color = CATEGORY_COLOR[category] ?? '#64748b';
                const icon  = CATEGORY_ICON[category]  ?? '📋';
                return (
                  <div key={category} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 18px', borderTop: `3px solid ${color}` }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f2557', marginBottom: 10, lineHeight: 1.3 }}>{category}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1 }}>{count}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{c.candidates}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BY PROFESSION ── */}
      {data.byProfession.length > 0 && (
        <section style={{ background: '#fff', padding: '60px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ width: 48, height: 4, background: '#c9a84c', borderRadius: 2, marginBottom: 16 }} />
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#0f2557', marginBottom: 32, letterSpacing: '-0.01em' }}>
              {c.profTitle}
            </h2>

            <div style={{ background: '#f8fafc', borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', padding: '10px 20px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                {c.profHeader.map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>
                ))}
              </div>

              {data.byProfession.map(({ profession, category, count }, i) => {
                const color = CATEGORY_COLOR[category] ?? '#64748b';
                const barPct = Math.round((count / maxProfCount) * 100);
                return (
                  <div key={profession} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', padding: '12px 20px', alignItems: 'center', borderBottom: i < data.byProfession.length - 1 ? '1px solid #f1f5f9' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0f2557', marginBottom: 4 }}>{profession}</div>
                      <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2, width: 120 }}>
                        <div style={{ height: 3, width: `${barPct}%`, background: color, borderRadius: 2 }} />
                      </div>
                    </div>
                    <div>
                      <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px' }}>
                        {category}
                      </span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f2557' }}>{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BY EXPERIENCE ── */}
      {data.byExperience.length > 0 && (
        <section style={{ background: '#f8fafc', padding: '60px 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ width: 48, height: 4, background: '#c9a84c', borderRadius: 2, marginBottom: 16 }} />
            <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800, color: '#0f2557', marginBottom: 32, letterSpacing: '-0.01em' }}>
              {c.expTitle}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
              {data.byExperience.map(({ level, count }) => {
                const label = normalizeExpLabel(level);
                const barPct = Math.round((count / maxExpCount) * 100);
                return (
                  <div key={level}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f2557' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0f2557' }}>{count}</span>
                    </div>
                    <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: 8, width: `${barPct}%`, background: 'linear-gradient(90deg,#0f2557,#c9a84c)', borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg,#0a1e4a 0%,#0f2557 100%)', padding: '72px 0' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div style={{ width: 48, height: 4, background: '#c9a84c', borderRadius: 2, margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {c.ctaTitle}
          </h2>
          <p style={{ color: '#bfdbfe', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>{c.ctaBody}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              href={`/${locale}/contact`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#c9a84c', color: '#0a1e4a', fontWeight: 700, padding: '14px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none', boxShadow: '0 4px 20px rgba(201,168,76,.32)' }}
            >
              {c.ctaBtn} <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/995591888774"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid #22c55e', color: '#4ade80', fontWeight: 600, padding: '14px 28px', borderRadius: 12, fontSize: 14, textDecoration: 'none' }}
            >
              <MessageCircle size={16} /> {c.whatsapp}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
