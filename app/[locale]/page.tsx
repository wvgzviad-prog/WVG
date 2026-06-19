import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, Users, Globe, Award, ChevronRight,
  MapPin, Clock, Briefcase, Shield, MessageCircle, Building2, TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();

  const trustSignals      = t.raw('trustSignals') as string[];
  const processSteps      = Object.entries(t.raw('process.steps') as Record<string, { title: string; desc: string }>);
  const vacancyProfessions = t.raw('vacancies.professions') as string[];
  const whyUsItems        = t.raw('about.whyUs.items') as string[];

  const vacancyPreviews = [
    { title: locale === 'ka' ? 'შემდუღებელი' : locale === 'ru' ? 'Сварщик'             : 'Welder',              country: locale === 'ka' ? 'ისრაელი' : locale === 'ru' ? 'Израиль' : 'Israel', salary: '$2,500–3,000', schedule: locale === 'ka' ? 'დამსაქმებლის გრაფიკი' : locale === 'ru' ? 'По графику работодателя' : 'Employer schedule' },
    { title: locale === 'ka' ? 'მშენებელი'   : locale === 'ru' ? 'Строительный рабочий' : 'Construction Worker', country: locale === 'ka' ? 'ისრაელი' : locale === 'ru' ? 'Израиль' : 'Israel', salary: '$2,200–2,700', schedule: locale === 'ka' ? 'დამსაქმებლის გრაფიკი' : locale === 'ru' ? 'По графику работодателя' : 'Employer schedule' },
    { title: locale === 'ka' ? 'ზეინკალი'    : locale === 'ru' ? 'Слесарь / Сантехник'  : 'Plumber / Fitter',    country: locale === 'ka' ? 'ისრაელი' : locale === 'ru' ? 'Израиль' : 'Israel', salary: '$2,500–3,000', schedule: locale === 'ka' ? 'დამსაქმებლის გრაფიკი' : locale === 'ru' ? 'По графику работодателя' : 'Employer schedule' },
    { title: locale === 'ka' ? 'მომვლელი'    : locale === 'ru' ? 'Сиделка'              : 'Caregiver',           country: locale === 'ka' ? 'ისრაელი' : locale === 'ru' ? 'Израиль' : 'Israel', salary: '$2,500–3,000', schedule: locale === 'ka' ? 'დამსაქმებლის გრაფიკი' : locale === 'ru' ? 'По графику работодателя' : 'Employer schedule' },
  ];

  /* ─── Social proof stats ─────────────────────────────────── */
  const socialStats = [
    {
      value: '120+',
      label: locale === 'ka' ? 'დასაქმებული კანდიდატი ისრაელში' : locale === 'ru' ? 'кандидатов трудоустроено' : 'Candidates employed in Israel',
      icon: <Users size={26} />,
      accent: '#c9a84c',
    },
    {
      value: '10+',
      label: locale === 'ka' ? 'აქტიური პარტნიორი ისრაელში' : locale === 'ru' ? 'активных партнёров в Израиле' : 'Active partners in Israel',
      icon: <Building2 size={26} />,
      accent: '#60a5fa',
    },
    {
      value: '2024',
      label: locale === 'ka' ? 'წლიდან საერთაშორისო დასაქმებაში' : locale === 'ru' ? 'год — начало работы' : 'Year founded',
      icon: <TrendingUp size={26} />,
      accent: '#34d399',
    },
    {
      value: locale === 'ka' ? 'ლიც.' : 'LIC.',
      label: locale === 'ka' ? 'შრომის სამინისტროს ლიცენზია' : locale === 'ru' ? 'Лицензия Минтруда Грузии' : 'Ministry of Labour Licensed',
      icon: <Shield size={26} />,
      accent: '#a78bfa',
    },
  ];

  /* ─── Gallery placeholders ───────────────────────────────── */
  const gallery = [
    { initials: 'გ.მ.', role: locale === 'ka' ? 'შემდუღებელი'             : locale === 'ru' ? 'Сварщик'             : 'Welder',       city: locale === 'ka' ? 'თბილისი' : locale === 'ru' ? 'Тбилиси'  : 'Tbilisi',  year: '2024' },
    { initials: 'ლ.ბ.', role: locale === 'ka' ? 'სამშენებლო სპეც.'        : locale === 'ru' ? 'Строительство'      : 'Construction', city: locale === 'ka' ? 'ქუთაისი' : locale === 'ru' ? 'Кутаиси'  : 'Kutaisi',  year: '2024' },
    { initials: 'ნ.კ.', role: locale === 'ka' ? 'სანტექნიკოსი'            : locale === 'ru' ? 'Сантехник'          : 'Plumber',      city: locale === 'ka' ? 'ბათუმი'  : locale === 'ru' ? 'Батуми'   : 'Batumi',   year: '2025' },
    { initials: 'თ.ა.', role: locale === 'ka' ? 'ინდუსტრიული მუშა'        : locale === 'ru' ? 'Производство'       : 'Industrial',   city: locale === 'ka' ? 'რუსთავი' : locale === 'ru' ? 'Рустави'  : 'Rustavi',  year: '2025' },
    { initials: 'მ.ჯ.', role: locale === 'ka' ? 'შემდუღებელი'             : locale === 'ru' ? 'Сварщик'            : 'Welder',       city: locale === 'ka' ? 'გორი'    : locale === 'ru' ? 'Гори'     : 'Gori',     year: '2025' },
    { initials: 'დ.წ.', role: locale === 'ka' ? 'სამშენებლო სპეც.'        : locale === 'ru' ? 'Строительство'      : 'Construction', city: locale === 'ka' ? 'თბილისი' : locale === 'ru' ? 'Тбилиси'  : 'Tbilisi',  year: '2025' },
  ];

  const galleryLabel   = locale === 'ka' ? 'ისრაელი' : locale === 'ru' ? 'Израиль' : 'Israel';
  const partnerLabel   = locale === 'ka' ? 'ჩვენი პარტნიორი კომპანიები ისრაელში' : locale === 'ru' ? 'Наши партнёры в Израиле' : 'Our Partners in Israel';
  const partnerNote    = locale === 'ka' ? '* ლოგოები განახლდება პარტნიორთა დადასტურებისამებრ' : locale === 'ru' ? '* Логотипы будут обновлены после подтверждения партнёров' : '* Logos will be updated upon partner confirmation';
  const fullProcedure  = locale === 'ka' ? 'სრული პროცედურა' : locale === 'ru' ? 'Полная процедура' : 'View Full Process';
  const ctaHeading     = locale === 'ka' ? 'გსურთ ისრაელში ლეგალურად დასაქმება?' : locale === 'ru' ? 'Хотите легально трудоустроиться в Израиле?' : 'Ready for legal employment in Israel?';
  const ctaBody        = locale === 'ka' ? 'შეავსეთ რეგისტრაციის ფორმა და ჩვენი გუნდი დაგიკავშირდებათ პირველადი კონსულტაციისთვის.' : locale === 'ru' ? 'Заполните форму регистрации и наша команда свяжется с вами для первичной консультации.' : 'Fill in the registration form and our team will contact you for an initial consultation.';

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div>

      {/* ══════════════════════════════════════════════
          HERO  — badge · title · subtitle · CTAs · trust pills
      ══════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#0a1e4a 0%,#0f2557 55%,#1a3a7c 100%)', position:'relative', overflow:'hidden' }}>

        {/* subtle grid */}
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.07 }} aria-hidden="true">
          <defs>
            <pattern id="hgrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth=".8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
        {/* gold glow */}
        <div style={{ position:'absolute',top:'-100px',right:'-80px',width:'480px',height:'480px',borderRadius:'50%',background:'radial-gradient(circle,rgba(201,168,76,.18) 0%,transparent 70%)',pointerEvents:'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 relative">
          <div className="max-w-2xl">

            {/* badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm text-blue-200 border border-blue-700/50"
              style={{ background:'rgba(255,255,255,.05)' }}>
              <Award size={14} className="text-yellow-400" />
              {t('hero.badge')}
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1 animate-pulse" />
            </div>

            {/* h1 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4"
              style={{ fontFamily:"'Noto Sans Georgian','Inter',sans-serif" }}>
              {t('hero.title')}
            </h1>

            {/* subtitle */}
            <p className="text-xl font-bold mb-8" style={{ color:'#c9a84c' }}>
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href={`/${locale}/register`}
                className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg"
                style={{ background:'#c9a84c',color:'#0a1e4a',boxShadow:'0 4px 24px rgba(201,168,76,.42)' }}>
                {t('hero.ctaRegister')} <ArrowRight size={18} />
              </Link>
              <Link href={`/${locale}/vacancies`}
                className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 border border-white/30 text-white hover:bg-white/10">
                {t('hero.ctaVacancies')} <ChevronRight size={18} />
              </Link>
            </div>

            {/* trust signal pills */}
            <div className="flex flex-wrap gap-2">
              {trustSignals.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-blue-200 text-xs border border-blue-800/50"
                  style={{ background:'rgba(255,255,255,.04)' }}>
                  <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SOCIAL PROOF  — 4 big-number cards
      ══════════════════════════════════════════════ */}
      <section style={{ background:'#091840' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {socialStats.map((s, i) => (
              <div key={i}
                className="flex flex-col items-center text-center gap-3 py-8 px-4 rounded-2xl"
                style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background:`${s.accent}18`,color:s.accent }}>
                  {s.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">{s.value}</div>
                <div className="text-blue-300 text-xs leading-snug max-w-[120px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW EMPLOYMENT WORKS  — visual timeline
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{ background:'#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-14">
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background:'#c9a84c' }} />
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2557] tracking-tight">
              {t('process.title')}
            </h2>
            <p className="text-slate-500 text-lg mt-2">{t('process.subtitle')}</p>
          </div>

          {/* ── Desktop: horizontal timeline ── */}
          <div className="hidden md:block">
            <div className="relative">
              {/* connector */}
              <div className="absolute top-[27px] left-[calc(100%/12)] right-[calc(100%/12)] h-0.5"
                style={{ background:'linear-gradient(90deg,transparent,#c9a84c 20%,#0f2557 80%,transparent)' }} />

              <div className="grid grid-cols-6 gap-3">
                {processSteps.map(([key, step], i) => (
                  <div key={key} className="flex flex-col items-center text-center relative">
                    {/* node */}
                    <div className="w-[54px] h-[54px] rounded-full flex items-center justify-center font-black text-lg text-white mb-5 relative z-10"
                      style={{
                        background: i === 0 ? '#c9a84c' : '#0f2557',
                        border: '3px solid white',
                        boxShadow: i === 0 ? '0 0 0 4px rgba(201,168,76,.25)' : '0 0 0 4px rgba(15,37,87,.12)',
                      }}>
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-[#0f2557] text-xs leading-snug mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile: vertical timeline ── */}
          <div className="md:hidden relative">
            <div className="absolute left-[26px] top-0 bottom-0 w-0.5"
              style={{ background:'linear-gradient(180deg,#c9a84c44,#0f2557,#c9a84c44)' }} />
            <div className="space-y-5">
              {processSteps.map(([key, step], i) => (
                <div key={key} className="flex gap-5 relative">
                  <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 relative z-10"
                    style={{
                      background: i === 0 ? '#c9a84c' : '#0f2557',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(15,37,87,.2)',
                    }}>
                    {i + 1}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex-1">
                    <h3 className="font-bold text-[#0f2557] text-sm mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/procedure`}
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl border-2 border-[#0f2557] text-[#0f2557] hover:bg-[#0f2557] hover:text-white transition-all duration-200 text-sm">
              {fullProcedure} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VACANCIES PREVIEW
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="w-12 h-1 rounded-full mb-4" style={{ background:'#c9a84c' }} />
              <h2 className="text-3xl md:text-4xl font-black text-[#0f2557] tracking-tight">
                {t('vacancies.title')}
              </h2>
              <p className="text-slate-500 text-base mt-2 max-w-xl">{t('vacancies.subtitle')}</p>
            </div>
            <Link href={`/${locale}/vacancies`}
              className="inline-flex items-center gap-1.5 text-[#0f2557] font-semibold hover:text-yellow-600 transition-colors text-sm flex-shrink-0">
              {t('vacancies.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>

          {/* profession pills */}
          <div className="mb-8 bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <p className="text-[#0f2557] font-semibold mb-3 text-sm">{t('vacancies.topDemand')}</p>
            <div className="flex flex-wrap gap-2">
              {vacancyProfessions.map((prof, i) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-blue-200 text-[#0f2557] text-sm font-medium rounded-full">
                  {prof}
                </span>
              ))}
            </div>
          </div>

          {/* cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {vacancyPreviews.map((v, i) => (
              <div key={i}
                className="rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                style={{ background:'#f8fafc' }}>
                <div className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 self-start"
                  style={{ background:'#eff6ff',color:'#1d4ed8' }}>
                  {v.country}
                </div>
                <h3 className="font-bold text-[#0f2557] text-base mb-4 leading-snug">{v.title}</h3>
                <div className="space-y-1.5 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Briefcase size={13} className="text-green-500 flex-shrink-0" />
                    <span className="font-semibold text-green-600">{v.salary}</span>
                    <span className="text-slate-400 text-xs">/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={13} className="text-blue-400 flex-shrink-0" />
                    {v.schedule}
                  </div>
                </div>
                <Link href={`/${locale}/register`}
                  className="w-full inline-flex items-center justify-center gap-1.5 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors text-white"
                  style={{ background:'#0f2557' }}>
                  {t('vacancies.apply')} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-500 text-sm leading-relaxed">{t('vacancies.notListed')}</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CANDIDATE SUCCESS GALLERY  — placeholder cards
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{ background:'#f0f4ff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background:'#c9a84c' }} />
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2557] tracking-tight mb-3">
              {t('testimonials.title')}
            </h2>
            <p className="text-slate-500 text-lg">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {gallery.map((c, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

                {/* photo placeholder — monogram ring */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-base text-white"
                  style={{ background:'linear-gradient(135deg,#0f2557,#1a3a7c)',border:'3px solid #c9a84c' }}>
                  {c.initials}
                </div>

                <div>
                  <div className="font-bold text-[#0f2557] text-xs leading-snug">{c.role}</div>
                  <div className="text-slate-400 text-[11px] flex items-center justify-center gap-0.5 mt-0.5">
                    <MapPin size={9} /> {c.city}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={10} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 font-medium">
                  {galleryLabel} · {c.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PARTNER LOGOS  — placeholder strip
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">{partnerLabel}</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map((n) => (
              <div key={n}
                className="h-16 rounded-xl flex flex-col items-center justify-center gap-1 border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                style={{ background:'#f8fafc' }}>
                <Globe size={16} className="text-slate-300" />
                <span className="text-slate-300 font-bold text-[10px] tracking-wide">
                  {locale === 'ka' ? `პარტნიორი ${n < 10 ? '0'+n : n}` : `Partner ${n < 10 ? '0'+n : n}`}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs mt-5">{partnerNote}</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY WVG
      ══════════════════════════════════════════════ */}
      <section className="py-20" style={{ background:'#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background:'#c9a84c' }} />
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2557] tracking-tight">
              {t('about.whyUs.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {whyUsItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'#0f2557' }}>
                  <CheckCircle size={15} className="text-yellow-400" />
                </div>
                <span className="text-slate-700 font-medium text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={`/${locale}/about`}
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl text-sm text-white transition-colors hover:opacity-90"
              style={{ background:'#0f2557' }}>
              {t('nav.about')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="py-24" style={{ background:'linear-gradient(135deg,#0a1e4a 0%,#0f2557 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background:'#c9a84c' }} />
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            {ctaHeading}
          </h2>
          <p className="text-blue-200 text-lg mb-8">{ctaBody}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/register`}
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200"
              style={{ background:'#c9a84c',color:'#0a1e4a',boxShadow:'0 4px 20px rgba(201,168,76,.32)' }}>
              {t('hero.ctaRegister')} <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/995591888774" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 font-semibold px-8 py-4 rounded-xl text-base transition-colors border-green-500 text-green-400 hover:bg-green-900/20">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
