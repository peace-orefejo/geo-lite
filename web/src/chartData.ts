import type { ReportGroup, ReportResponse } from './types';

export const TARGET_BRAND_ID = 'ray-ban';

export type ChartPoint = {
  date: string;
  shareOfVoice: number | null;
  mentionRate: number | null;
  sentiment: ReportResponse['sentiment'] | null;
  responseCount: number;
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDay(date: string): string {
  const [, month, day] = date.split('-');
  const index = Number(month) - 1;
  if (!MONTHS[index] || !day) return date;
  return `${MONTHS[index]} ${Number(day)}`;
}

export function formatPercent(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

export function toChartData(
  report: ReportGroup[] | null,
  brandId: string = TARGET_BRAND_ID,
): ChartPoint[] {
  if (!report) return [];

  return [...report]
    .sort((a, b) => a.collectedAt.localeCompare(b.collectedAt))
    .map((group) => {
      const brand = group.brands.find((entry) => entry.brandId === brandId);

      return {
        date: group.collectedAt,
        shareOfVoice: brand ? brand.shareOfVoice : null,
        mentionRate: brand ? brand.mentionRate : null,
        sentiment: brand ? brand.sentiment : null,
        responseCount: group.responseCount,
      };
    });
}
