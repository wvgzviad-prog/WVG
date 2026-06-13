'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Building2, Users, Globe, CheckCircle, Send } from 'lucide-react';

export default function PartnersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const categories = t.raw('partners.categories') as string[];

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('partners.title')}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{t('partners.subtitle')}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-14 h-1 bg-yellow-500 rounded-full mb-6" />
            <p className="text-slate-600 text-lg leading-relaxed mb-8">{t('partners.description')}</p>
            <div className="space-y-3">
              {[
                { icon: <Users size={20} className="text-blue-500" />, text: locale === 'ka' ? 'გამოცდილი, შრომისმოყვარე მუშახელი' : locale === 'ru' ? 'Опытная, трудолюбивая рабочая сила' : 'Experienced, hardworking workforce' },
                { icon: <CheckCircle size={20} className="text-green-500" />, text: locale === 'ka' ? 'წინასწარ გასაუბრება და სკრინინგი' : locale === 'ru' ? 'Предварительное собеседование и скрининг' : 'Pre-screening and interviews' },
                { icon: <Globe size={20} className="text-yellow-500" />, text: locale === 'ka' ? 'ლეგალური, სრულად დოკუმენტირებული' : locale === 'ru' ? 'Легальные, полностью документированные' : 'Legal, fully documented workers' },
                { icon: <Building2 size={20} className="text-purple-500" />, text: locale === 'ka' ? 'გრძელვადიანი თანამშრომლობა' : locale === 'ru' ? 'Долгосрочное сотрудничество' : 'Long-term cooperation' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  {item.icon}
                  <span className="text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available categories */}
          <div className="bg-gradient-to-br from-[#0f2557] to-[#1a3a7c] rounded-3xl p-8 text-white">
            <h3 className="font-bold text-xl mb-6 text-yellow-400">
              {locale === 'ka' ? 'ხელმისაწვდომი კატეგორიები' : locale === 'ru' ? 'Доступные категории' : 'Available Categories'}
            </h3>
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-blue-700 pb-3">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-blue-100">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-14 h-1 bg-yellow-500 rounded-full mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#0f2557]">{t('partners.form.title')}</h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2557] mb-2">
                {locale === 'ka' ? 'წარმატებით გაიგზავნა!' : locale === 'ru' ? 'Успешно отправлено!' : 'Successfully sent!'}
              </h3>
              <p className="text-slate-500">
                {locale === 'ka' ? 'ჩვენი გუნდი მალე დაგიკავშირდება.' : locale === 'ru' ? 'Наша команда свяжется с вами.' : 'Our team will contact you shortly.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.company')} *</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.country')} *</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.profession')} *</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.quantity')}</label>
                  <input type="number" min="1" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.email')} *</label>
                  <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.contact')}</label>
                  <input type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('partners.form.message')}</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f2557] font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0f2557] border-t-transparent rounded-full animate-spin" />
                ) : <Send size={20} />}
                {t('partners.form.submit')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
