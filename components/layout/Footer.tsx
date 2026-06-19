'use client';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const links = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/vacancies`, label: t('nav.vacancies') },
    { href: `/${locale}/register`, label: t('nav.register') },
    { href: `/${locale}/documents`, label: t('nav.documents') },
    { href: `/${locale}/procedure`, label: t('nav.procedure') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/partners`, label: t('nav.partners') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  return (
    <footer className="bg-[#091840] text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#c9a84c] rounded-lg flex items-center justify-center">
                <span className="text-[#091840] font-bold text-sm">WVG</span>
              </div>
              <div>
                <div className="font-bold text-white">Work Visa Georgia</div>
                <div className="text-blue-300 text-xs">wvg.ge</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/995591888774" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="tel:+995591888774"
                className="w-9 h-9 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Phone size={16} />
              </a>
              <a href="mailto:wvg.zviad@gmail.com"
                className="w-9 h-9 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-200 hover:text-yellow-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('contact.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-blue-300 text-xs mb-1">{t('contact.phone')}</div>
                  <a href="tel:+995591888774" className="text-white text-sm hover:text-yellow-300 transition-colors">
                    +995 591 888 774
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-blue-300 text-xs mb-1">{t('contact.email')}</div>
                  <a href="mailto:wvg.zviad@gmail.com" className="text-white text-sm hover:text-yellow-300 transition-colors">
                    wvg.zviad@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-blue-300 text-xs mb-1">WhatsApp</div>
                  <a href="https://wa.me/995591888774" className="text-white text-sm hover:text-yellow-300 transition-colors">
                    +995 591 888 774
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-blue-300 text-xs mb-1">{t('contact.address')}</div>
                  <span className="text-white text-sm">თბილისი, ნავთლუღის ქ. 10, კ. C, ოფისი 29A</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-semibold text-white mb-4">
              {locale === 'ka' ? 'მზად ხარ?' : locale === 'ru' ? 'Готовы начать?' : 'Ready to start?'}
            </h3>
            <p className="text-blue-200 text-sm mb-4">
              {locale === 'ka' ? 'გამოაგზავნე განაცხადი და ჩვენი გუნდი 24 საათში დაგიკავშირდება.' :
               locale === 'ru' ? 'Подайте заявку, и наша команда свяжется с вами в течение 24 часов.' :
               'Submit your application and our team will contact you within 24 hours.'}
            </p>
            <Link
              href={`/${locale}/register`}
              className="inline-block bg-[#c9a84c] text-[#091840] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-yellow-400 transition-colors"
            >
              {t('nav.registerBtn')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-blue-300 text-sm">
            © {new Date().getFullYear()} Work Visa Georgia. {t('footer.rights')}.
          </span>
          <span className="text-blue-400 text-xs">wvg.ge</span>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/995591888774"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle size={26} className="text-white" />
      </a>
    </footer>
  );
}
