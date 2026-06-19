import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();

  const a = t.raw('about') as Record<string, unknown>;
  const construction = a.construction as { title: string; items: string[] };
  const industrial    = a.industrial   as { title: string; items: string[] };
  const other         = a.other        as { title: string; items: string[] };
  const whyUs         = a.whyUs        as { title: string; items: string[] };
  const approachValues = a.approachValues as string[];
  const partnerSectors = a.partnerSectors as string[];
  const contactInfo   = a.contactInfo  as Record<string, string>;

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #0a1e4a 0%, #0f2557 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {String(a.title)}
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl">{String(a.subtitle)}</p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {String(a.intro).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 text-lg leading-relaxed mb-4 last:mb-0">{para}</p>
              ))}
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="/office-main.jpg"
                alt="Work Visa Georgia Office – Tbilisi"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                draggable={false}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0f2557]/80 to-transparent px-5 py-4">
                <p className="text-white text-sm font-medium">Work Visa Georgia Office – Tbilisi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Specialization ── */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
          <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] tracking-tight mb-4">
            {String(a.specializationTitle)}
          </h2>
          {String(a.specializationText).split('\n\n').map((para, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-3 max-w-3xl last:mb-0">{para}</p>
          ))}

          {/* Three sector columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[construction, industrial, other].map((sector, si) => (
              <div key={si} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#0f2557' }}>
                    <span className="text-yellow-400 font-black text-xs">{si + 1}</span>
                  </div>
                  <h3 className="font-black text-[#0f2557] text-base">{sector.title}</h3>
                </div>
                <ul className="space-y-2">
                  {sector.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Selection system ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
            <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] tracking-tight mb-6">
              {String(a.selectionTitle)}
            </h2>
            {String(a.selectionText).split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-4 last:mb-0">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
              <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] tracking-tight mb-4">
                {String(a.partnersTitle)}
              </h2>
              {String(a.partnersText).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
              <ul className="mt-4 space-y-2">
                {partnerSectors.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Approach */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-[#0f2557] mb-4">{String(a.approachTitle)}</h2>
              <p className="text-slate-600 mb-4">{String(a.approachIntro)}</p>
              <ul className="space-y-2 mb-6">
                {approachValues.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 font-semibold text-[#0f2557]">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
              {String(a.approachText).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-600 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why WVG summary ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background: '#c9a84c' }} />
            <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] tracking-tight">{whyUs.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {whyUs.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-2xl border border-slate-100"
                style={{ background: '#f8fafc' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0f2557' }}>
                  <CheckCircle size={16} className="text-yellow-400" />
                </div>
                <span className="text-slate-700 font-medium text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Licenses & Trust Documents ── */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
          <h2 className="text-2xl md:text-3xl font-black text-[#0f2557] tracking-tight mb-3">
            {locale === 'ka' ? 'ლიცენზიები, რეგისტრაცია და ფინანსური გარანტია' :
             locale === 'ru' ? 'Лицензии, регистрация и финансовые гарантии' :
             'Licenses, Registration & Financial Guarantees'}
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            {locale === 'ka' ? 'WVG ოფიციალურად ლიცენზირებულია საქართველოს შრომის, ჯანმრთელობისა და სოციალური დაცვის სამინისტროს მიერ და ფლობს 50,000 ლარის საბანკო გარანტიას.' :
             locale === 'ru' ? 'WVG официально лицензирована Министерством труда, здравоохранения и социальной защиты Грузии и располагает банковской гарантией на 50 000 лари.' :
             'WVG is officially licensed by the Ministry of Labour, Health and Social Protection of Georgia and holds a 50,000 GEL bank guarantee.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Ministry of Labour Certificate */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {locale === 'ka' ? 'შრომის სამინისტრო — სერტიფიკატი' :
                     locale === 'ru' ? 'Министерство труда — сертификат' :
                     'Ministry of Labour — Certificate'}
                  </span>
                </div>
              </div>
              <div className="select-none" style={{ pointerEvents: 'none' }}>
                <Image
                  src="/trust-certificate-ka.jpg"
                  alt="Ministry of Labour Certificate – Work Visa Georgia"
                  width={600}
                  height={430}
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>
            </div>
            {/* Bank Guarantee */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {locale === 'ka' ? 'ALDAGI — საბანკო გარანტია 50,000 ₾' :
                     locale === 'ru' ? 'ALDAGI — банковская гарантия 50 000 ₾' :
                     'ALDAGI — Bank Guarantee 50,000 GEL'}
                  </span>
                </div>
              </div>
              <div className="select-none" style={{ pointerEvents: 'none' }}>
                <Image
                  src="/trust-bank-guarantee.jpg"
                  alt="ALDAGI Bank Guarantee 50,000 GEL – Work Visa Georgia"
                  width={600}
                  height={430}
                  className="w-full h-auto"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact info ── */}
      <section className="py-16" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="w-12 h-1 rounded-full mb-5" style={{ background: '#c9a84c' }} />
            <h2 className="text-2xl font-black text-[#0f2557] tracking-tight mb-8">
              {String(a.contactTitle)}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
              <div>
                <div className="font-black text-[#0f2557] text-lg">{contactInfo.company}</div>
                <div className="text-slate-500 text-sm mt-0.5">{contactInfo.legal}</div>
                <div className="text-slate-500 text-sm">{contactInfo.id}</div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <MapPin size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-yellow-600 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g,'')}`}
                  className="text-[#0f2557] font-semibold text-sm hover:text-yellow-600 transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-yellow-600 flex-shrink-0" />
                <a href={`mailto:${contactInfo.email}`}
                  className="text-[#0f2557] font-semibold text-sm hover:text-yellow-600 transition-colors">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-yellow-600 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{contactInfo.website}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg,#0a1e4a 0%,#0f2557 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
            {locale === 'ka' ? 'გსურთ ისრაელში ლეგალურად დასაქმება?' :
             locale === 'ru' ? 'Хотите легально трудоустроиться в Израиле?' :
             'Ready to apply for legal employment in Israel?'}
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            {locale === 'ka' ? 'შეავსეთ რეგისტრაციის ფორმა და ჩვენი გუნდი დაგიკავშირდებათ.' :
             locale === 'ru' ? 'Заполните форму регистрации и наша команда свяжется с вами.' :
             'Fill in the registration form and our team will contact you.'}
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
