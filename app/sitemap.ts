import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.wvg.ge';
const locales = ['ka', 'en', 'ru'] as const;

const pages: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }> = [
  { path: '',            priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/vacancies',  priority: 0.9, changeFrequency: 'weekly'  },
  { path: '/register',   priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about',      priority: 0.8, changeFrequency: 'monthly' },
  { path: '/procedure',  priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact',    priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq',        priority: 0.7, changeFrequency: 'monthly' },
  { path: '/documents',  priority: 0.7, changeFrequency: 'monthly' },
  { path: '/partners',   priority: 0.6, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: locale === 'ka' ? page.priority : Math.round(page.priority * 0.9 * 10) / 10,
      });
    }
  }

  return entries;
}
