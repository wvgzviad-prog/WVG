'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const contactItems = [
    {
      icon: <Phone size={22} className="text-yellow-400" />,
      label: t('contact.phone'),
      value: '+995 591 888 774',
      href: 'tel:+995591888774',
    },
    {
      icon: <MessageCircle size={22} className="text-green-400" />,
      label: 'WhatsApp',
      value: '+995 591 888 774',
      href: 'https://wa.me/995591888774',
    },
    {
      icon: <Mail size={22} className="text-blue-300" />,
      label: t('contact.email'),
      value: 'wvg.zviad@gmail.com',
      href: 'mailto:wvg.zviad@gmail.com',
    },
    {
      icon: <MapPin size={22} className="text-red-300" />,
      label: t('contact.address'),
      value: 'თბილისი, საქართველო',
      href: null,
    },
    {
      icon: <Clock size={22} className="text-purple-300" />,
      label: locale === 'ka' ? 'სამუშაო საათები' : locale === 'ru' ? 'Рабочие часы' : 'Working Hours',
      value: t('contact.workingHours'),
      href: null,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
          <p className="text-blue-200 text-xl">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <div className="w-14 h-1 bg-yellow-500 rounded-full mb-8" />
            <div className="space-y-5">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl">
                  <div className="w-11 h-11 bg-[#0f2557] rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-medium mb-1">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-[#0f2557] font-semibold hover:text-yellow-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-slate-700 font-medium">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-2xl">
              <h3 className="font-bold text-green-800 mb-2">
                {locale === 'ka' ? 'სწრაფი კავშირი WhatsApp-ზე' : locale === 'ru' ? 'Быстрая связь в WhatsApp' : 'Quick contact via WhatsApp'}
              </h3>
              <p className="text-green-600 text-sm mb-4">
                {locale === 'ka' ? 'ყველაზე სწრაფი გზა ჩვენთან დასაკავშირებლად' :
                 locale === 'ru' ? 'Самый быстрый способ связаться с нами' :
                 'The fastest way to reach us'}
              </p>
              <a href="https://wa.me/995591888774" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-400 transition-colors">
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div>
            {submitted ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#0f2557] mb-2">
                  {locale === 'ka' ? 'შეტყობინება გაიგზავნა!' : locale === 'ru' ? 'Сообщение отправлено!' : 'Message sent!'}
                </h3>
                <p className="text-slate-500">
                  {locale === 'ka' ? 'ჩვენი გუნდი მალე გიპასუხებს.' : locale === 'ru' ? 'Наша команда ответит вам.' : 'Our team will reply to you.'}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h2 className="text-xl font-bold text-[#0f2557] mb-6">
                  {locale === 'ka' ? 'შეტყობინების გაგზავნა' : locale === 'ru' ? 'Отправить сообщение' : 'Send a Message'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('contact.form.name')}</label>
                    <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('contact.form.email')}</label>
                    <input type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('contact.form.phone')}</label>
                    <input type="tel" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('contact.form.message')}</label>
                    <textarea rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f2557] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#1a3a7c] transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <Send size={18} />}
                    {t('contact.form.submit')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Office photos */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
          <h2 className="text-xl font-black text-[#0f2557] mb-6">
            {locale === 'ka' ? 'ჩვენი ოფისი' : locale === 'ru' ? 'Наш офис' : 'Our Office'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <Image src="/office-main.jpg" alt="WVG Office – consultation room" width={600} height={450} className="w-full h-56 object-cover" draggable={false} />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <Image src="/office-docs.jpg" alt="WVG Office – document processing room" width={600} height={450} className="w-full h-56 object-cover" draggable={false} />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <Image src="/building-aerial.jpg" alt="Navtlughi Street 10, Tbilisi – office building" width={600} height={450} className="w-full h-56 object-cover" draggable={false} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f2557]/70 to-transparent px-4 py-3">
                <p className="text-white text-xs font-medium">ნავთლუღის ქ. 10C, თბილისი</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="h-80 relative overflow-hidden">
        <iframe
          title="Work Visa Georgia office location"
          src="https://maps.google.com/maps?q=Navtlughi+Street+10,+Tbilisi,+Georgia&output=embed&z=16"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
