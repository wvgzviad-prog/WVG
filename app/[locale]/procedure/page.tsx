import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Clock } from 'lucide-react';

const stepIcons = ['📋', '📄', '👔', '✅', '🪪', '✈️', '🏗️', '🛰️'];

interface ProcedureStep {
  title: string;
  desc: string;
  bullets?: string[];
  note?: string;
}

export default function ProcedurePage() {
  const t = useTranslations();
  const locale = useLocale();
  const steps = t.raw('procedure.steps') as ProcedureStep[];
  const duration = t.raw('procedure.duration') as { title: string; text: string };

  const stepLabel = (i: number) =>
    locale === 'ka' ? `ეტაპი ${i + 1}` :
    locale === 'ru' ? `Этап ${i + 1}` :
    `Step ${i + 1}`;

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0a1e4a 0%, #0f2557 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {t('procedure.title')}
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl">{t('procedure.subtitle')}</p>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-slate-700 leading-relaxed">{t('procedure.intro')}</p>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5"
              style={{ background: 'linear-gradient(180deg, #0f2557 0%, #e2e8f0 100%)' }} />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="relative flex items-start gap-7">
                  {/* Step icon */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ background: '#0f2557' }}>
                    <span className="text-2xl">{stepIcons[i] ?? '📌'}</span>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 mb-1">
                    {/* Step label + title */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: '#fef9ec', color: '#b45309' }}>
                        {stepLabel(i)}
                      </span>
                    </div>
                    <h3 className="font-black text-[#0f2557] text-lg mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm mb-3">{step.desc}</p>

                    {/* Bullet list */}
                    {step.bullets && step.bullets.length > 0 && (
                      <ul className="space-y-1.5">
                        {step.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: '#c9a84c' }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Warning note */}
                    {step.note && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl p-3.5"
                        style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                        <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-sm leading-relaxed">{step.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Duration section ── */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-start gap-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#eff6ff' }}>
              <Clock size={22} className="text-blue-500" />
            </div>
            <div>
              <h2 className="font-black text-[#0f2557] text-xl mb-3">{duration.title}</h2>
              <p className="text-slate-600 leading-relaxed">{duration.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background: '#c9a84c' }} />
          <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] mb-4 tracking-tight">
            {locale === 'ka' ? 'მზად ხართ დასაქმების პროცესის დასაწყებად?' :
             locale === 'ru' ? 'Готовы начать процесс трудоустройства?' :
             'Ready to start the employment process?'}
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            {locale === 'ka' ? 'შეავსეთ რეგისტრაციის ფორმა და ჩვენი გუნდი დაგიკავშირდებათ პირველადი კონსულტაციისთვის.' :
             locale === 'ru' ? 'Заполните регистрационную форму и наша команда свяжется с вами для первичной консультации.' :
             'Fill in the registration form and our team will contact you for an initial consultation.'}
          </p>
          <Link href={`/${locale}/register`}
            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-md"
            style={{ background: '#c9a84c', color: '#0a1e4a', boxShadow: '0 4px 20px rgba(201,168,76,.3)' }}>
            {t('nav.registerBtn')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
