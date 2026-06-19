'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { MapPin, Briefcase, Clock, Home, ArrowRight, Search, ChevronDown, ChevronUp } from 'lucide-react';

const vacanciesData = [
  {
    id: 1,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2500,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'შემდუღებელი',
    titleEn: 'Welder',
    titleRu: 'Сварщик',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია გამოცდილების მქონე შემდუღებელი.',
    shortEn: 'An experienced welder is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытный сварщик.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე შემდუღებელი. კანდიდატმა უნდა შეძლოს სამუშაო გამოცდილების დადასტურება ვიდეოთი ან პრაქტიკული ტესტირებით. საცხოვრებელი უზრუნველყოფილია დამსაქმებლის მიერ. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced welder is required for official employment in Israel. The candidate must be able to demonstrate work experience by video or practical testing. Accommodation is provided by the employer. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытный сварщик. Кандидат должен быть в состоянии подтвердить опыт работы видео или практическим тестированием. Жильё предоставляется работодателем. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 2,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2500,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'მომვლელი',
    titleEn: 'Caregiver',
    titleRu: 'Сиделка',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია გამოცდილების მქონე მომვლელი ქალბატონი.',
    shortEn: 'An experienced female caregiver is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытная сиделка (женщина).',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე მომვლელი ქალბატონი. უპირატესობა მიენიჭება კანდიდატს, რომელსაც აქვს პრაქტიკული სამუშაო გამოცდილება მომვლელის პოზიციაზე და ფლობს რუსულ და/ან ინგლისურ ენას. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced female caregiver is required for official employment in Israel. Preference will be given to candidates who have practical work experience as a caregiver and speak Russian and/or English. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытная сиделка (женщина). Предпочтение будет отдано кандидату, имеющему практический опыт работы на должности сиделки и владеющему русским и/или английским языком. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 3,
    status: 'active',
    category: 'construction',
    country: 'Israel',
    salaryMin: 2200,
    salaryMax: 2700,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'მშენებელი',
    titleEn: 'Construction Worker',
    titleRu: 'Строительный рабочий',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია სამშენებლო გამოცდილების მქონე მუშაკი.',
    shortEn: 'A construction worker with experience is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется строительный рабочий с опытом.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა სამშენებლო გამოცდილების მქონე კანდიდატი. სამუშაო შეიძლება მოიცავდეს სხვადასხვა სამშენებლო პროცესში მონაწილეობას. კანდიდატმა უნდა წარმოადგინოს სამუშაო გამოცდილების დამადასტურებელი ვიდეო ან სხვა მტკიცებულება.',
    fullEn: 'A construction worker with experience is required for official employment in Israel. Work may involve participation in various construction processes. The candidate must provide a video or other evidence confirming work experience. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется строительный рабочий с опытом. Работа может включать участие в различных строительных процессах. Кандидат должен предоставить видео или иные доказательства подтверждения опыта работы. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 4,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2500,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'ზეინკალი',
    titleEn: 'Plumber / Fitter',
    titleRu: 'Слесарь / Сантехник',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია სამშენებლო გამოცდილების მქონე ზეინკალი.',
    shortEn: 'An experienced plumber / fitter with construction experience is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытный слесарь / сантехник со строительным опытом.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე ზეინკალი. უპირატესობა მიენიჭება კანდიდატს, რომელსაც აქვს პრაქტიკული სამუშაო გამოცდილება სამშენებლო ან ინდუსტრიულ ობიექტებზე. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced plumber / fitter is required for official employment in Israel. Preference will be given to candidates who have practical work experience at construction or industrial sites. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытный слесарь / сантехник. Предпочтение будет отдано кандидату, имеющему практический опыт работы на строительных или промышленных объектах. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 5,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2500,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'დურგალი',
    titleEn: 'Carpenter',
    titleRu: 'Столяр / Плотник',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია გამოცდილების მქონე დურგალი.',
    shortEn: 'An experienced carpenter is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытный столяр / плотник.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე დურგალი. უპირატესობა მიენიჭება კანდიდატს, რომელსაც აქვს პრაქტიკული სამუშაო გამოცდილება სამშენებლო ან ინდუსტრიულ ობიექტებზე. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced carpenter is required for official employment in Israel. Preference will be given to candidates who have practical work experience at construction or industrial sites. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытный столяр / плотник. Предпочтение будет отдано кандидату, имеющему практический опыт работы на строительных или промышленных объектах. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 6,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2200,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'მზარეული',
    titleEn: 'Cook',
    titleRu: 'Повар',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია გამოცდილების მქონე მზარეული.',
    shortEn: 'An experienced cook is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытный повар.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე მზარეული. უპირატესობა მიენიჭება კანდიდატს, რომელსაც აქვს პრაქტიკული სამუშაო გამოცდილება კვების ობიექტებზე. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced cook is required for official employment in Israel. Preference will be given to candidates who have practical work experience at catering establishments. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытный повар. Предпочтение будет отдано кандидату, имеющему практический опыт работы в заведениях общественного питания. Окончательные условия уточняются с работодателем.',
  },
  {
    id: 7,
    status: 'active',
    category: 'skilled',
    country: 'Israel',
    salaryMin: 2500,
    salaryMax: 3000,
    experience: true,
    accommodation: true,
    registrationUrl: 'https://tally.so/r/dWzRXd',
    titleKa: 'დამლაგებელი',
    titleEn: 'Cleaner',
    titleRu: 'Уборщица',
    shortKa: 'ისრაელში სამუშაოდ მოთხოვნილია გამოცდილების მქონე დამლაგებელი.',
    shortEn: 'An experienced cleaner is required for official employment in Israel.',
    shortRu: 'Для официального трудоустройства в Израиле требуется опытная уборщица.',
    fullKa: 'ისრაელში ოფიციალური დასაქმებისთვის საჭიროა გამოცდილების მქონე დამლაგებელი. უპირატესობა მიენიჭება კანდიდატს, რომელსაც აქვს პრაქტიკული სამუშაო გამოცდილება დამლაგებლის პოზიციაზე და ფლობს რუსულ და/ან ინგლისურ ენას. საბოლოო პირობები ზუსტდება დამსაქმებელთან.',
    fullEn: 'An experienced cleaner is required for official employment in Israel. Preference will be given to candidates who have practical work experience as a cleaner and speak Russian and/or English. Final terms are confirmed with the employer.',
    fullRu: 'Для официального трудоустройства в Израиле требуется опытная уборщица. Предпочтение будет отдано кандидату, имеющему практический опыт работы на должности уборщицы и владеющему русским и/или английским языком. Окончательные условия уточняются с работодателем.',
  },
];

export default function VacanciesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getTitle = (v: typeof vacanciesData[0]) =>
    locale === 'en' ? v.titleEn : locale === 'ru' ? v.titleRu : v.titleKa;
  const getShort = (v: typeof vacanciesData[0]) =>
    locale === 'en' ? v.shortEn : locale === 'ru' ? v.shortRu : v.shortKa;
  const getFull = (v: typeof vacanciesData[0]) =>
    locale === 'en' ? v.fullEn : locale === 'ru' ? v.fullRu : v.fullKa;

  const filtered = vacanciesData.filter((v) => {
    const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchSearch = search === '' || getTitle(v).toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = [
    { key: 'all',          ka: 'ყველა',          en: 'All',          ru: 'Все' },
    { key: 'construction', ka: 'სამშენებლო',     en: 'Construction', ru: 'Строительство' },
    { key: 'skilled',      ka: 'კვალიფიციური',   en: 'Skilled',      ru: 'Квалифицированные' },
  ];
  const getCatLabel = (c: typeof categories[0]) =>
    locale === 'en' ? c.en : locale === 'ru' ? c.ru : c.ka;

  const countryLabel = locale === 'en' ? 'Israel' : locale === 'ru' ? 'Израиль' : 'ისრაელი';
  const scheduleLabel = locale === 'en' ? 'Employer schedule' : locale === 'ru' ? 'По графику работодателя' : 'დამსაქმებლის გრაფიკი';
  const accommodationLabel = locale === 'en' ? 'Accommodation provided' : locale === 'ru' ? 'Жильё предоставляется' : 'საცხოვრებელი უზრუნველყოფილია';
  const experienceLabel = locale === 'en' ? 'Experience required' : locale === 'ru' ? 'Опыт обязателен' : 'გამოცდილება სავალდებულოა';

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
             `${filtered.length} ${filtered.length === 1 ? 'vacancy' : 'vacancies'} found`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              {locale === 'ka' ? 'ვაკანსია ვერ მოიძებნა' : locale === 'ru' ? 'Вакансии не найдены' : 'No vacancies found'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
                  <div className="p-6 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                        {countryLabel}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {experienceLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[#0f2557] text-xl mb-2">{getTitle(v)}</h3>

                    {/* Short description */}
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">{getShort(v)}</p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Briefcase size={15} className="text-green-500 flex-shrink-0" />
                        <span className="font-semibold text-green-600">${v.salaryMin}–{v.salaryMax}</span>
                        <span className="text-slate-400">/mo</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock size={15} className="text-blue-400 flex-shrink-0" />
                        {scheduleLabel}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <MapPin size={15} className="text-yellow-500 flex-shrink-0" />
                        {countryLabel}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Home size={15} className="text-purple-400 flex-shrink-0" />
                        {accommodationLabel}
                      </div>
                    </div>

                    {/* Full description toggle */}
                    <button
                      onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                      className="flex items-center gap-1 text-[#0f2557] text-xs font-medium hover:underline mb-4"
                    >
                      {expandedId === v.id
                        ? (locale === 'ka' ? 'ნაკლები' : locale === 'ru' ? 'Скрыть' : 'Show less')
                        : (locale === 'ka' ? 'სრული აღწერა' : locale === 'ru' ? 'Подробнее' : 'Full details')}
                      {expandedId === v.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {expandedId === v.id && (
                      <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 leading-relaxed border border-slate-100">
                        {getFull(v)}
                      </div>
                    )}
                  </div>

                  {/* Apply button — always at bottom */}
                  <div className="px-6 pb-6">
                    <Link
                      href={`/${locale}/register`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0f2557] text-white font-semibold px-4 py-3 rounded-xl text-sm hover:bg-[#1a3a7c] transition-colors"
                    >
                      {t('vacancies.apply')} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Not-listed CTA */}
      <section className="py-14 bg-[#0f2557]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-base mb-2">
            {locale === 'ka' ? 'შენი პროფესია სიაში არ არის?' :
             locale === 'ru' ? 'Вашей профессии нет в списке?' :
             "Don't see your profession listed?"}
          </p>
          <h2 className="text-2xl font-bold text-white mb-4">
            {locale === 'ka' ? 'მაინც გამოაგზავნე განაცხადი — ჩვენ ვიპოვით შენთვის სამუშაოს' :
             locale === 'ru' ? 'Всё равно подайте заявку — мы подберём вам работу' :
             'Apply anyway — we will find the right role for you'}
          </h2>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0f2557] font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
          >
            {t('vacancies.apply')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
