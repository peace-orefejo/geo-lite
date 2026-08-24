import { BRANDS, getBrand } from './brands.js';
import type { BrandDefinition } from './brands.js';
import { scoreAroundMentions, scoreText, toSentiment } from './sentiment.js';
import type { Sentiment } from './sentiment.js';
import type { LlmResponse, ReportGroup, ReportResponse } from './types.js';

type BrandSignal = {
  occurrences: number;
  mentioned: boolean;
  sentiment: Sentiment;
};

function countMatches(text: string, pattern: RegExp): number {
  const matcher = new RegExp(pattern.source, pattern.flags);
  let count = 0;
  while (matcher.exec(text) !== null) count += 1;
  return count;
}

function hasCitation(response: LlmResponse, brand: BrandDefinition): boolean {
  return response.citations.some((citation) => {
    let host: string;
    try {
      host = new URL(citation.url).hostname.toLowerCase();
    } catch {
      return false;
    }
    return brand.domains.some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
  });
}

function signalFor(response: LlmResponse, brand: BrandDefinition): BrandSignal {
  const textMentions = countMatches(response.text, brand.pattern);
  const cited = hasCitation(response, brand);
  const occurrences = textMentions > 0 ? textMentions : cited ? 1 : 0;

  let sentiment: Sentiment = 'neutral';
  if (textMentions > 0) {
    const promptIsAboutBrand = countMatches(response.prompt, brand.pattern) > 0;
    const score = promptIsAboutBrand
      ? scoreText(response.text)
      : scoreAroundMentions(response.text, brand.pattern);
    sentiment = toSentiment(score);
  }

  return { occurrences, mentioned: occurrences > 0, sentiment };
}

function isoDay(collectedAt: string): string {
  const date = new Date(collectedAt);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid collectedAt timestamp: ${collectedAt}`);
  }
  return date.toISOString().slice(0, 10);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function summarise(
  responses: LlmResponse[],
  brand: BrandDefinition,
): ReportResponse {
  const signals = responses.map((response) => signalFor(response, brand));

  const brandOccurrences = signals.reduce((sum, s) => sum + s.occurrences, 0);
  const totalOccurrences = BRANDS.reduce(
    (sum, other) =>
      sum +
      responses.reduce((inner, response) => inner + signalFor(response, other).occurrences, 0),
    0,
  );

  const mentionCount = signals.filter((s) => s.mentioned).length;

  const sentimentScore = signals.reduce((sum, s) => {
    if (s.sentiment === 'positive') return sum + 1;
    if (s.sentiment === 'negative') return sum - 1;
    return sum;
  }, 0);

  return {
    brandId: brand.id,
    name: brand.name,
    shareOfVoice: totalOccurrences === 0 ? 0 : round(brandOccurrences / totalOccurrences),
    mentionRate: responses.length === 0 ? 0 : round(mentionCount / responses.length),
    sentiment: toSentiment(sentimentScore),
  };
}

export function buildReport(
  responses: LlmResponse[],
  target: string,
  brandIds: string[] = [],
): ReportGroup[] {
  brandIds = [target]
  const brands = brandIds.map(getBrand);

  const byDay = new Map<string, LlmResponse[]>();
  for (const response of responses) {
    const day = isoDay(response.collectedAt);
    const bucket = byDay.get(day);
    if (bucket) bucket.push(response);
    else byDay.set(day, [response]);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([collectedAt, group]) => ({
      collectedAt,
      responseCount: group.length,
      brands: brands.map((brand) => summarise(group, brand)),
    }));
}
