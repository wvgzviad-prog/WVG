'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe, Phone, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const langs = [
    { code: 'ka', label: 'ქართული', flag: '🇬🇪' },
    { code: 'en', label: 'English',  flag: '🇬🇧' },
    { code: 'ru', label: 'Русский',  flag: '🇷🇺' },
  ];

  const getLocalizedPath = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const navLinks = [
    { href: `/${locale}`,             label: t('home') },
    { href: `/${locale}/about`,       label: t('about') },
    { href: `/${locale}/vacancies`,   label: t('vacancies') },
    { href: `/${locale}/documents`,   label: t('documents') },
    { href: `/${locale}/procedure`,   label: t('procedure') },
    { href: `/${locale}/faq`,         label: t('faq') },
    { href: `/${locale}/partners`,    label: t('partners') },
    { href: `/${locale}/contact`,     label: t('contact') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ── Top utility bar ── */}
      <div style={{ background: '#0a1e4a', borderBottom: '1px solid rgba(255,255,255,.07)' }}
        className="hidden md:block text-sm text-white">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <span className="text-blue-300 text-xs tracking-wide">Work Visa Georgia — wvg.ge</span>
          <div className="flex items-center gap-5">
            <a href="tel:+995591888774"
              className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors text-xs">
              <Phone size={12} strokeWidth={2.5} />
              +995 591 888 774
            </a>
            <a href="https://wa.me/995591888774" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
              <MessageCircle size={11} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50"
        style={{ boxShadow: '0 1px 12px rgba(15,37,87,.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[60px]">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 flex-shrink-0">
            <Image src="/logo.png" alt="Work Visa Georgia" width={36} height={36} className="rounded-full" priority />
            <div className="hidden sm:block leading-none">
              <div className="font-bold text-[#0f2557] text-[13px] tracking-tight">Work Visa</div>
              <div className="text-[11px] font-semibold" style={{ color: '#c9a84c' }}>Georgia</div>
            </div>
          </Link>

          {/* Desktop nav — show at lg instead of xl */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? 'text-[#0f2557] bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-[#0f2557] hover:bg-slate-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: lang + CTA + burger */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button onClick={() => { setLangOpen(o => !o); setMenuOpen(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-[#0f2557] rounded-md hover:bg-slate-50 transition-colors text-[13px] font-medium">
                <Globe size={14} />
                <span className="uppercase">{locale}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px]"
                  style={{ boxShadow: '0 8px 32px rgba(15,37,87,.12)' }}>
                  {langs.map((lang) => (
                    <Link key={lang.code} href={getLocalizedPath(lang.code)}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] hover:bg-slate-50 transition-colors ${
                        locale === lang.code ? 'bg-blue-50 text-[#0f2557] font-semibold' : 'text-slate-700'
                      }`}>
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* CTA button */}
            <Link href={`/${locale}/register`}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#0f2557] font-bold text-[13px] px-4 py-2 rounded-lg transition-all"
              style={{ background: '#c9a84c' }}>
              {t('registerBtn')}
            </Link>

            {/* Burger — show below lg */}
            <button onClick={() => { setMenuOpen(o => !o); setLangOpen(false); }}
              className="lg:hidden p-2 text-slate-500 hover:text-[#0f2557] rounded-md hover:bg-slate-50 transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white"
            style={{ boxShadow: '0 8px 24px rgba(15,37,87,.08)' }}>
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 text-[13px] font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'text-[#0f2557] bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-[#0f2557] hover:bg-slate-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <Link href={`/${locale}/register`} onClick={() => setMenuOpen(false)}
                className="mt-2 text-[#0f2557] font-bold px-4 py-3 rounded-xl text-[13px] text-center transition-colors"
                style={{ background: '#c9a84c' }}>
                {t('registerBtn')}
              </Link>
              {/* Mobile lang row */}
              <div className="flex gap-2 mt-2 pt-2.5 border-t border-slate-100">
                {langs.map((lang) => (
                  <Link key={lang.code} href={getLocalizedPath(lang.code)}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[12px] rounded-lg transition-colors ${
                      locale === lang.code ? 'bg-blue-50 text-[#0f2557] font-semibold' : 'text-slate-500 hover:bg-slate-50'
                    }`}>
                    {lang.flag} {lang.code.toUpperCase()}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
