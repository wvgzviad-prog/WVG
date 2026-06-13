'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = t.raw('faq.items') as Array<{ q: string; a: string }>;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('faq.title')}</h1>
          <p className="text-blue-200 text-xl">{t('faq.subtitle')}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  openIndex === i ? 'border-blue-200 shadow-sm' : 'border-slate-100'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`font-semibold pr-4 ${openIndex === i ? 'text-[#0f2557]' : 'text-slate-800'}`}>
                    {item.q}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${openIndex === i ? 'bg-[#0f2557] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-slate-100 mb-4" />
                    <p className="text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More questions */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0f2557] mb-4">
            {locale === 'ka' ? 'კიდევ გაქვს კითხვები?' : locale === 'ru' ? 'Есть ещё вопросы?' : 'Still have questions?'}
          </h2>
          <p className="text-slate-500 mb-8">
            {locale === 'ka' ? 'დაგვიკავშირდი WhatsApp-ზე ან შეავსე კონტაქტის ფორმა.' :
             locale === 'ru' ? 'Свяжитесь с нами в WhatsApp или заполните форму обратной связи.' :
             'Contact us via WhatsApp or fill in the contact form.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/995591888774" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-green-400 transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <Link href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#0f2557] text-[#0f2557] font-semibold px-7 py-3.5 rounded-xl hover:bg-[#0f2557] hover:text-white transition-colors">
              {t('nav.contact')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
