import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { FileText, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const docIcons = ['🛂', '🪪', '📄', '🏥', '⚖️', '📜', '✉️', '📷', '🤝', '📋', '📝', '📃'];

export default function DocumentsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const docs = t.raw('documents.docs') as Array<{ name: string; desc: string }>;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('documents.title')}</h1>
          <p className="text-blue-200 text-xl">{t('documents.subtitle')}</p>
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-yellow-50 border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-800 text-sm leading-relaxed">{t('documents.note')}</p>
        </div>
      </section>

      {/* Documents grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-sm transition-shadow">
                <div className="text-3xl flex-shrink-0">{docIcons[i] || '📄'}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#0f2557]">{doc.name}</h3>
                    <div className="w-5 h-5 bg-[#0f2557] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist banner */}
      <section className="py-16 bg-[#0f2557]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {locale === 'ka' ? 'გჭირდება დოკუმენტების მომზადებაში დახმარება?' :
             locale === 'ru' ? 'Нужна помощь в подготовке документов?' :
             'Need help preparing documents?'}
          </h2>
          <p className="text-blue-200 mb-8">
            {locale === 'ka' ? 'ჩვენი გუნდი სრულად გეხმარება ყველა საჭირო დოკუმენტის მოგროვებასა და შემოწმებაში.' :
             locale === 'ru' ? 'Наша команда полностью поможет собрать и проверить все необходимые документы.' :
             'Our team fully assists in collecting and verifying all required documents.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/register`}
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f2557] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-400 transition-colors">
              {t('hero.ctaRegister')} <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/995551234567" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white hover:text-[#0f2557] transition-colors">
              WhatsApp <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
