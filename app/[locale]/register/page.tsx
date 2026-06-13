'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, Send, User, Phone, Calendar, Briefcase, Globe } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', whatsapp: '', dob: '',
    profession: '', experience: '', country: '',
    hasPassport: '', workedIsrael: '', triedIsrael: '',
    readyDate: '', consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-lg border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f2557] mb-3">
            {locale === 'ka' ? 'წარმატება!' : locale === 'ru' ? 'Успешно!' : 'Success!'}
          </h2>
          <p className="text-slate-600 leading-relaxed">{t('registration.success')}</p>
          <a
            href={`/${locale}`}
            className="mt-8 inline-flex items-center gap-2 bg-[#0f2557] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1a3a7c] transition-colors"
          >
            {locale === 'ka' ? 'მთავარ გვერდზე' : locale === 'ru' ? 'На главную' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('registration.title')}</h1>
          <p className="text-blue-200 text-xl">{t('registration.subtitle')}</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">

            {/* Personal info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#0f2557] rounded-lg flex items-center justify-center">
                  <User size={16} className="text-yellow-400" />
                </div>
                <h2 className="font-bold text-[#0f2557]">
                  {locale === 'ka' ? 'პირადი ინფორმაცია' : locale === 'ru' ? 'Личная информация' : 'Personal Information'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.firstName')} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.lastName')} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+995 5XX XXX XXX"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.whatsapp')}
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="+995 5XX XXX XXX"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.dob')}
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Work info */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#0f2557] rounded-lg flex items-center justify-center">
                  <Briefcase size={16} className="text-yellow-400" />
                </div>
                <h2 className="font-bold text-[#0f2557]">
                  {locale === 'ka' ? 'სამუშაო ინფორმაცია' : locale === 'ru' ? 'Рабочая информация' : 'Work Information'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.profession')} *
                  </label>
                  <select
                    name="profession"
                    value={form.profession}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
                    required
                  >
                    <option value="">—</option>
                    {(t.raw('registration.professions') as string[]).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.experience')}
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder={locale === 'ka' ? 'მაგ: 3 წელი' : locale === 'ru' ? 'Напр: 3 года' : 'e.g. 3 years'}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.country')} *
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
                    required
                  >
                    <option value="">—</option>
                    {(t.raw('registration.countries') as string[]).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('registration.fields.readyDate')}
                  </label>
                  <input
                    type="date"
                    name="readyDate"
                    value={form.readyDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Yes/No questions */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#0f2557] rounded-lg flex items-center justify-center">
                  <Globe size={16} className="text-yellow-400" />
                </div>
                <h2 className="font-bold text-[#0f2557]">
                  {locale === 'ka' ? 'დამატებითი კითხვები' : locale === 'ru' ? 'Дополнительные вопросы' : 'Additional Questions'}
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'hasPassport', label: t('registration.fields.hasPassport') },
                  { name: 'workedIsrael', label: t('registration.fields.workedIsrael') },
                  { name: 'triedIsrael', label: t('registration.fields.triedIsrael') },
                ].map((q) => (
                  <div key={q.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <label className="text-slate-700 font-medium">{q.label}</label>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q.name}
                          value="yes"
                          checked={form[q.name as keyof typeof form] === 'yes'}
                          onChange={handleChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700">{t('registration.fields.yes')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer ml-4">
                        <input
                          type="radio"
                          name={q.name}
                          value="no"
                          checked={form[q.name as keyof typeof form] === 'no'}
                          onChange={handleChange}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700">{t('registration.fields.no')}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consent */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-blue-600"
                />
                <span className="text-slate-600 text-sm leading-relaxed">
                  {t('registration.fields.consent')}
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!form.consent || loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0f2557] font-bold px-8 py-4 rounded-xl text-lg hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0f2557] border-t-transparent rounded-full animate-spin" />
                  {locale === 'ka' ? 'იგზავნება...' : locale === 'ru' ? 'Отправка...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t('registration.submit')}
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
