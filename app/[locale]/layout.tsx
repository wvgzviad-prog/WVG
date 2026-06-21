import type { Metadata } from "next";
import { Inter, Noto_Sans_Georgian } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { headers } from 'next/headers';
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-geo',
  display: 'swap',
});

const SITE_URL = 'https://www.wvg.ge';

const META = {
  ka: {
    title: 'Work Visa Georgia — ლეგალური დასაქმება ისრაელში | WVG',
    description: 'Work Visa Georgia — საქართველოს შრომის სამინისტროს ლიცენზირებული სააგენტო. ლეგალური დასაქმება ისრაელში. 120+ დასაქმებული. სამშენებლო, ინდუსტრიული, მომსახურების სფერო.',
  },
  en: {
    title: 'Work Visa Georgia — Legal Employment in Israel | WVG',
    description: "Work Visa Georgia — licensed by Georgia's Ministry of Labour. Legal employment in Israel for Georgian citizens. 120+ candidates placed. Construction, industrial and service sectors.",
  },
  ru: {
    title: 'Work Visa Georgia — Легальное трудоустройство в Израиле | WVG',
    description: 'Work Visa Georgia — лицензированное агентство Министерства труда Грузии. Легальное трудоустройство в Израиле для граждан Грузии. 120+ трудоустроенных кандидатов.',
  },
} as const;

type Locale = keyof typeof META;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale: Locale = (locale in META) ? (locale as Locale) : 'ka';
  const meta = META[safeLocale];

  // Build per-page hreflang from x-pathname injected by middleware
  const headersList = await headers();
  const xPathname = headersList.get('x-pathname') ?? `/${safeLocale}`;
  const pathSuffix = xPathname.replace(/^\/(ka|en|ru)/, '') || '';

  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: [
      'Work Visa Georgia', 'WVG', 'wvg.ge',
      'legal employment Israel', 'Georgian workers Israel',
      'სამუშაო ვიზა', 'ისრაელი დასაქმება', 'ლეგალური დასაქმება',
      'трудоустройство Израиль', 'легальная работа Израиль',
    ],
    alternates: {
      languages: {
        'ka':        `${SITE_URL}/ka${pathSuffix}`,
        'en':        `${SITE_URL}/en${pathSuffix}`,
        'ru':        `${SITE_URL}/ru${pathSuffix}`,
        'x-default': `${SITE_URL}/ka${pathSuffix}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Work Visa Georgia',
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${safeLocale}`,
      locale: safeLocale === 'ka' ? 'ka_GE' : safeLocale === 'ru' ? 'ru_RU' : 'en_US',
      images: [{
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Work Visa Georgia',
      }],
    },
    twitter: {
      card: 'summary',
      title: meta.title,
      description: meta.description,
      images: ['/logo.png'],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
  };
}

function getLdJson(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Work Visa Georgia',
    alternateName: 'WVG',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: META[locale].description,
    telephone: '+995591888774',
    email: 'wvg.zviad@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ნავთლუღის ქ. 10, კ. C, ოფისი 29A',
      addressLocality: 'Tbilisi',
      addressCountry: 'GE',
    },
    areaServed: ['GE', 'IL'],
    sameAs: ['https://wa.me/995591888774'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = (locale in META) ? (locale as Locale) : 'ka';
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${notoGeorgian.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLdJson(safeLocale)) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
