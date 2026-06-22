export type TaxonomyLocale = 'ka' | 'en' | 'ru';

// ── Category translations ─────────────────────────────────────────────────────
// Keys are Georgian canonical values from Google Sheet column Q.

export const CATEGORY_TRANSLATIONS: Record<string, Record<TaxonomyLocale, string>> = {
  'მშენებლობა': {
    ka: 'მშენებლობა',
    en: 'Construction',
    ru: 'Строительство',
  },
  'მეტალი და ინდუსტრია': {
    ka: 'მეტალი და ინდუსტრია',
    en: 'Metal & Industry',
    ru: 'Металл и промышленность',
  },
  'ტექნიკა და მძღოლები': {
    ka: 'ტექნიკა და მძღოლები',
    en: 'Equipment & Drivers',
    ru: 'Техника и водители',
  },
  'ელექტრო და ტექნიკური სპეციალობები': {
    ka: 'ელექტრო და ტექნიკური სპეციალობები',
    en: 'Electrical & Technical',
    ru: 'Электро и технические специальности',
  },
  'მომსახურება და მოვლა': {
    ka: 'მომსახურება და მოვლა',
    en: 'Service & Care',
    ru: 'Обслуживание и уход',
  },
  'დამხმარე სამუშაოები': {
    ka: 'დამხმარე სამუშაოები',
    en: 'General Labor',
    ru: 'Вспомогательные работы',
  },
  'სხვა': {
    ka: 'სხვა',
    en: 'Other',
    ru: 'Другое',
  },
};

// ── Profession translations ───────────────────────────────────────────────────
// Keys are Georgian canonical values from Google Sheet column V (Profession Unified).

export const PROFESSION_TRANSLATIONS: Record<string, Record<TaxonomyLocale, string>> = {
  'მშენებელი': {
    ka: 'მშენებელი',
    en: 'Construction Worker / Mason',
    ru: 'Каменщик / Строитель',
  },
  'არმატურის ხელოსანი': {
    ka: 'არმატურის ხელოსანი',
    en: 'Rebar / Ironworker',
    ru: 'Арматурщик',
  },
  'ხის ყალიბის ხელოსანი': {
    ka: 'ხის ყალიბის ხელოსანი',
    en: 'Wooden Formwork Carpenter',
    ru: 'Плотник по деревянной опалубке',
  },
  'მეტალის ყალიბის ხელოსანი': {
    ka: 'მეტალის ყალიბის ხელოსანი',
    en: 'Metal Formwork Installer',
    ru: 'Монтажник металлической опалубки',
  },
  'მებათქაშე': {
    ka: 'მებათქაშე',
    en: 'Plasterer',
    ru: 'Штукатур',
  },
  'კაფელ-მეტლახის ხელოსანი': {
    ka: 'კაფელ-მეტლახის ხელოსანი',
    en: 'Tile & Ceramic Worker',
    ru: 'Плиточник',
  },
  'ბეტონის მუშა': {
    ka: 'ბეტონის მუშა',
    en: 'Concrete Worker',
    ru: 'Бетонщик',
  },
  'დურგალი': {
    ka: 'დურგალი',
    en: 'Carpenter',
    ru: 'Плотник',
  },
  'სანტექნიკოსი': {
    ka: 'სანტექნიკოსი',
    en: 'Plumber',
    ru: 'Сантехник',
  },
  'გიფსოკარდონის ხელოსანი': {
    ka: 'გიფსოკარდონის ხელოსანი',
    en: 'Drywall / Gypsum Worker',
    ru: 'Мастер гипсокартона',
  },
  'სახურავის ხელოსანი': {
    ka: 'სახურავის ხელოსანი',
    en: 'Roofer',
    ru: 'Кровельщик',
  },
  'ფასადის ხელოსანი': {
    ka: 'ფასადის ხელოსანი',
    en: 'Facade Worker',
    ru: 'Фасадчик',
  },
  'მღებავი': {
    ka: 'მღებავი',
    en: 'Painter',
    ru: 'Маляр',
  },
  'მეტალკონსტრუქციების მონტაჟის სპეციალისტი': {
    ka: 'მეტალკონსტრუქციების მონტაჟის სპეციალისტი',
    en: 'Steel Structure Installer',
    ru: 'Монтажник металлоконструкций',
  },
  'შეკიდული ჭერის ხელოსანი': {
    ka: 'შეკიდული ჭერის ხელოსანი',
    en: 'Suspended Ceiling Installer',
    ru: 'Монтажник подвесных потолков',
  },
  'შემდუღებელი': {
    ka: 'შემდუღებელი',
    en: 'Welder',
    ru: 'Сварщик',
  },
  'CO2 შემდუღებელი': {
    ka: 'CO2 შემდუღებელი',
    en: 'CO2 Welder',
    ru: 'Сварщик CO2',
  },
  'არგონის შემდუღებელი': {
    ka: 'არგონის შემდუღებელი',
    en: 'Argon / TIG Welder',
    ru: 'Аргонный сварщик',
  },
  'ელექტრო შემდუღებელი': {
    ka: 'ელექტრო შემდუღებელი',
    en: 'Arc / MMA Welder',
    ru: 'Электросварщик',
  },
  'მეტალის მლესავი': {
    ka: 'მეტალის მლესავი',
    en: 'Metal Grinder',
    ru: 'Шлифовщик металла',
  },
  'მეტალის პოლირების სპეციალისტი': {
    ka: 'მეტალის პოლირების სპეციალისტი',
    en: 'Metal Polisher',
    ru: 'Полировщик металла',
  },
  'მექანიკოსი': {
    ka: 'მექანიკოსი',
    en: 'Industrial Mechanic',
    ru: 'Механик промышленный',
  },
  'სამრეწველო მონტაჟის მუშა': {
    ka: 'სამრეწველო მონტაჟის მუშა',
    en: 'Industrial Assembly Worker',
    ru: 'Промышленный монтажник',
  },
  'ქარხნის მუშა': {
    ka: 'ქარხნის მუშა',
    en: 'Factory Worker',
    ru: 'Заводской рабочий',
  },
  'საწარმოო ხაზის ოპერატორი': {
    ka: 'საწარმოო ხაზის ოპერატორი',
    en: 'Production Line Operator',
    ru: 'Оператор производственной линии',
  },
  'CNC ოპერატორი': {
    ka: 'CNC ოპერატორი',
    en: 'CNC Operator',
    ru: 'Оператор ЧПУ',
  },
  'საწყობის მუშა': {
    ka: 'საწყობის მუშა',
    en: 'Warehouse Worker',
    ru: 'Складской рабочий',
  },
  'ექსკავატორის ოპერატორი': {
    ka: 'ექსკავატორის ოპერატორი',
    en: 'Excavator Operator',
    ru: 'Оператор экскаватора',
  },
  'ბულდოზერის ოპერატორი': {
    ka: 'ბულდოზერის ოპერატორი',
    en: 'Bulldozer Operator',
    ru: 'Оператор бульдозера',
  },
  'ამწის ოპერატორი': {
    ka: 'ამწის ოპერატორი',
    en: 'Crane Operator',
    ru: 'Оператор крана',
  },
  'სატვირთოს მძღოლი': {
    ka: 'სატვირთოს მძღოლი',
    en: 'Truck Driver',
    ru: 'Водитель грузовика',
  },
  'ავტო-მექანიკოსი': {
    ka: 'ავტო-მექანიკოსი',
    en: 'Auto Mechanic',
    ru: 'Автомеханик',
  },
  'ელექტრიკოსი': {
    ka: 'ელექტრიკოსი',
    en: 'Electrician',
    ru: 'Электрик',
  },
  'ელექტრო ტექნიკოსი': {
    ka: 'ელექტრო ტექნიკოსი',
    en: 'Electrotechnician',
    ru: 'Электротехник',
  },
  'ელექტრომონტაჟის სპეციალისტი': {
    ka: 'ელექტრომონტაჟის სპეციალისტი',
    en: 'Electrical Installer',
    ru: 'Монтажник электрооборудования',
  },
  'ლიფტის ტექნიკოსი': {
    ka: 'ლიფტის ტექნიკოსი',
    en: 'Elevator Technician',
    ru: 'Лифтовой техник',
  },
  'მომვლელი': {
    ka: 'მომვლელი',
    en: 'Caregiver',
    ru: 'Сиделка / Помощник по уходу',
  },
  'დამლაგებელი': {
    ka: 'დამლაგებელი',
    en: 'Cleaner',
    ru: 'Уборщик',
  },
  'მზარეული': {
    ka: 'მზარეული',
    en: 'Cook',
    ru: 'Повар',
  },
  'სამზარეულოს დამხმარე': {
    ka: 'სამზარეულოს დამხმარე',
    en: 'Kitchen Assistant',
    ru: 'Помощник повара',
  },
  'დამხმარე მუშა': {
    ka: 'დამხმარე მუშა',
    en: 'General Helper',
    ru: 'Подсобный рабочий',
  },
  'ტვირთამწე': {
    ka: 'ტვირთამწე',
    en: 'Load Handler / Porter',
    ru: 'Грузчик',
  },
  'საწყობის დამხმარე': {
    ka: 'საწყობის დამხმარე',
    en: 'Warehouse Assistant',
    ru: 'Помощник на складе',
  },
  'უნივერსალური მუშა': {
    ka: 'უნივერსალური მუშა',
    en: 'Multi-trade Worker',
    ru: 'Разнорабочий',
  },
};

// ── Helper functions ──────────────────────────────────────────────────────────

/** Translate a Georgian canonical category name. Falls back to the raw value. */
export function translateCategory(category: string, locale: TaxonomyLocale): string {
  return CATEGORY_TRANSLATIONS[category]?.[locale] ?? category;
}

/** Translate a Georgian canonical profession name. Falls back to the raw value. */
export function translateProfession(profession: string, locale: TaxonomyLocale): string {
  return PROFESSION_TRANSLATIONS[profession]?.[locale] ?? profession;
}

/** Translate and normalise an experience level string for display. */
export function translateExperience(value: string, locale: TaxonomyLocale): string {
  const normalized = value.trim();

  if (normalized === 'გამოცდილების გარეშე') {
    return locale === 'ka' ? 'გამოცდილების გარეშე'
         : locale === 'ru' ? 'Без опыта'
         : 'No experience';
  }

  if (['0–2 წელი', '0-2 წელი', '0–2', '0-2'].includes(normalized)) {
    return locale === 'ka' ? '0–2 წელი'
         : locale === 'ru' ? '0–2 года'
         : '0–2 years';
  }

  if (['2–5 წელი', '2-5 წელი', '2–5', '2-5'].includes(normalized)) {
    return locale === 'ka' ? '2–5 წელი'
         : locale === 'ru' ? '2–5 лет'
         : '2–5 years';
  }

  if (['5–10 წელი', '5-10 წელი', '5–10', '5-10'].includes(normalized)) {
    return locale === 'ka' ? '5–10 წელი'
         : locale === 'ru' ? '5–10 лет'
         : '5–10 years';
  }

  if (['10+ წელი', '10+'].includes(normalized)) {
    return locale === 'ka' ? '10+ წელი'
         : locale === 'ru' ? '10+ лет'
         : '10+ years';
  }

  // Bare numeric legacy value (e.g. "5")
  if (/^\d+$/.test(normalized)) {
    return locale === 'ka' ? `${normalized} წელი`
         : locale === 'ru' ? `${normalized} лет`
         : `${normalized} years`;
  }

  return normalized;
}
