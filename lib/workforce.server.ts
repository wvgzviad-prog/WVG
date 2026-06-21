import { listRecords } from '@/lib/google-sheets.server';

const COL_CATEGORY   = 'პროფესიის კატეგორია';
const COL_PROFESSION = 'Profession Unified';
const COL_EXPERIENCE = 'Experience Unified';
const COL_APPROVED   = 'დამსაქმებლისთვის გამოჩნდეს';
const APPROVED_VALUE = 'დიახ';

const EXPERIENCE_ORDER = [
  'გამოცდილების გარეშე',
  '0–2 წელი',
  '2–5 წელი',
  '5–10 წელი',
  '10+ წელი',
];

export interface WorkforceData {
  total: number;
  byCategory: { category: string; count: number }[];
  byProfession: { profession: string; category: string; count: number }[];
  byExperience: { level: string; count: number }[];
}

export async function getWorkforceData(): Promise<WorkforceData> {
  const records = await listRecords('tallyRegistrations', { maxRecords: 2000 });

  const approved = records.filter(r =>
    String(r.fields[COL_APPROVED]   ?? '').trim() === APPROVED_VALUE &&
    String(r.fields[COL_CATEGORY]   ?? '').trim() !== '' &&
    String(r.fields[COL_PROFESSION] ?? '').trim() !== '',
  );

  const byCategoryMap: Record<string, number> = {};
  const byProfessionMap: Record<string, { category: string; count: number }> = {};
  const byExperienceMap: Record<string, number> = {};

  for (const r of approved) {
    const category   = String(r.fields[COL_CATEGORY]   ?? '').trim();
    const profession = String(r.fields[COL_PROFESSION]  ?? '').trim();
    const experience = String(r.fields[COL_EXPERIENCE]  ?? '').trim();

    byCategoryMap[category] = (byCategoryMap[category] ?? 0) + 1;

    if (category !== 'სხვა') {
      if (!byProfessionMap[profession]) {
        byProfessionMap[profession] = { category, count: 0 };
      }
      byProfessionMap[profession].count += 1;
    }

    if (experience) {
      byExperienceMap[experience] = (byExperienceMap[experience] ?? 0) + 1;
    }
  }

  return {
    total: approved.length,

    byCategory: Object.entries(byCategoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),

    byProfession: Object.entries(byProfessionMap)
      .map(([profession, { category, count }]) => ({ profession, category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),

    byExperience: [
      // Known standard labels in display order
      ...EXPERIENCE_ORDER.filter(level => byExperienceMap[level] !== undefined)
        .map(level => ({ level, count: byExperienceMap[level] })),
      // Legacy / free-text values not in the standard list, sorted alphabetically
      ...Object.entries(byExperienceMap)
        .filter(([level]) => !EXPERIENCE_ORDER.includes(level))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([level, count]) => ({ level, count })),
    ],
  };
}
