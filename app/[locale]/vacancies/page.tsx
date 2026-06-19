'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, Home, ChevronDown, ArrowRight, Search } from 'lucide-react';

const vacanciesData = [
  { id: 1, titleKa: 'სამშენებლო მუშა', titleEn: 'Construction Worker', titleRu: 'Строительный рабочий', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$1,800–2,400', schedule: '6/1', accommodation: true, experience: false, category: 'construction' },
  { id: 2, titleKa: 'შემდუღებელი', titleEn: 'Welder', titleRu: 'Сварщик', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$2,200–2,800', schedule: '6/1', accommodation: true, experience: true, category: 'skilled' },
  { id: 3, titleKa: 'ელექტრიკოსი', titleEn: 'Electrician', titleRu: 'Электрик', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$2,000–2,600', schedule: '5/2', accommodation: true, experience: true, category: 'skilled' },
  { id: 4, titleKa: 'ფასადის მუშა', titleEn: 'Facade Worker', titleRu: 'Фасадный рабочий', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$1,900–2,300', schedule: '6/1', accommodation: true, experience: false, category: 'construction' },
  { id: 5, titleKa: 'მძღოლი', titleEn: 'Driver', titleRu: 'Водитель', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$1,700–2,100', schedule: '5/2', accommodation: false, experience: true, category: 'driver' },
  { id: 6, titleKa: 'მეჩარხე', titleEn: 'Lathe Operator', titleRu: 'Токарь', country: 'ისრაელი', countryEn: 'Israel', countryRu: 'Израиль', salary: '$2,100–2,600', schedule: '6/1', accommodation: true, experience: true, category: 'skilled' },
];

export default function VacanciesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [countryFilter, setCountryFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const getTitle = (v: typeof vacanciesData[0]) =>
    locale === 'en' ? v.titleEn : locale === 'ru' ? v.titleRu : v.titleKa;
  const getCountry = (v: typeof vacanciesData[0]) =>
    locale === 'en' ? v.countryEn : locale === 'ru' ? v.countryRu : v.country;

  const filtered = vacanciesData.filter((v) => {
    const matchCountry = countryFilter === 'all' || v.country === countryFilter;
    const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchSearch = search === '' || getTitle(v).toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchCat && matchSearch;
  });

  const countries = ['all', ...Array.from(new Set(vacanciesData.map((v) => v.country)))];
  const categories = [
    { key: 'all', ka: 'ყველა', en: 'All', ru: 'Все' },
    { key: 'construction', ka: 'სამშენებლო', en: 'Construction', ru: 'Строительство' },
    { key: 'skilled', ka: 'კვალიფიციური', en: 'Skilled', ru: 'Квалифицированные' },
    { key: 'driver', ka: 'მძღოლი', en: 'Driver', ru: 'Водитель' },
  ];

  const getCatLabel = (c: typeof categories[0]) =>
    locale === 'en' ? c.en : locale === 'ru' ? c.ru : c.ka;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0f2557] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-14 h-1 bg-yellow-500 rounded-full mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('vacancies.title')}</h1>
          <p className="text-blue-200 text-xl">{t('vacancies.subtitle')}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-slate-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === 'ka' ? 'ვაკანსიის ძებნა...' : locale === 'ru' ? 'Поиск вакансий...' : 'Search vacancies...'}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Country filter */}
          <div className="flex gap-2 flex-wrap">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  countryFilter === c ? 'bg-[#0f2557] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? (locale === 'ka' ? 'ყველა' : locale === 'ru' ? 'Все' : 'All') : c}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.key ? 'bg-yellow-500 text-[#0f2557]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCatLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vacancies grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-500 text-sm mb-6">
            {locale === 'ka' ? `${filtered.length} ვაკანსია ნაპოვნია` :
             locale === 'ru' ? `Найдено ${filtered.length} вакансий` :
             `${filtered.length} vacancies found`}
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              {locale === 'ka' ? 'ვაკანსია ვერ მოიძებნა' : locale === 'ru' ? 'Вакансии не найдены' : 'No vacancies found'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                      {getCountry(v)}
                    </span>
                    {v.experience ? (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {locale === 'ka' ? 'გამოცდილება' : locale === 'ru' ? 'Опыт' : 'Experience'}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        {locale === 'ka' ? 'დამწყები' : locale === 'ru' ? 'Начинающий' : 'Entry level'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#0f2557] text-xl mb-4">{getTitle(v)}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin size={15} className="text-yellow-500 flex-shrink-0" />
                      {getCountry(v)}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Briefcase size={15} className="text-green-500 flex-shrink-0" />
                      <span className="font-semibold text-green-600">{v.salary}</span>
                      <span className="text-slate-400">/mo</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Clock size={15} className="text-blue-400 flex-shrink-0" />
                      {v.schedule} {locale === 'ka' ? 'გრაფიკი' : locale === 'ru' ? 'график' : 'schedule'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Home size={15} className="text-purple-400 flex-shrink-0" />
                      {v.accommodation
                        ? (locale === 'ka' ? 'საცხოვრებელი უზრუნველყოფილია' : locale === 'ru' ? 'Жильё предоставляется' : 'Accommodation provided')
                        : (locale === 'ka' ? 'საცხოვრებელი არ არის' : locale === 'ru' ? 'Жильё не предоставляется' : 'No accommodation')}
                    </div>
                  </div>
                  <Link href={`/${locale}/register`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0f2557] text-white font-semibold px-4 py-3 rounded-xl text-sm hover:bg-[#1a3a7c] transition-colors">
                    {t('vacancies.apply')} <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
