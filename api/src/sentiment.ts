export type Sentiment = 'positive' | 'negative' | 'neutral';
const POSITIVE_PHRASES = [
  'still in style',
  'the default answer',
  'holds up',
  'worth doing',
  'worth keeping',
  'the correct call',
  'lean toward',
  'step up',
  'gold standard',
  'the benchmark',
  'in-house',
  'more generous',
  'buy it again',
  'without hesitating',
  'outlived',
  'stay accurate',
  'easier on the eyes',
  'easy to source',
  'reads as classic',
  'timeless',
  'classic',
  'recommend',
  'the practical pick',
  'the nicer',
  'unbreakable',
  'comfortable',
  'excellent',
  'favourite',
  'favorite',
  'reliable',
  'durable',
  'accurate',
  'worth it',
  'clarity',
  'best',
  'better',
  'solid',
  'great',
  'sharp',
];

const NEGATIVE_PHRASES = [
  'not worth',
  "isn't worth",
  'what to avoid',
  'not designed for it',
  'one thing to avoid',
  'failure point',
  'wears off',
  'played out',
  'looks suspiciously',
  'a fraction of that',
  'marketing asset',
  'nothing optically',
  'quality control',
  'feels thinner',
  'the downside',
  'noticeably worse',
  'they are invisible',
  "they're invisible",
  'the problem',
  'aged',
  'dated',
  'erratic',
  'complaints',
  'shatter',
  'avoid',
  'overpriced',
  'disappointing',
  'flimsy',
  'no venting',
  'no grip',
  'too wide',
  'worse',
  'worst',
  'poor',
  'lose',
  'honestly, no',
];

const SENTENCE_WINDOW = 320;

function escape(phrase: string): string {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countPhrases(haystack: string, phrases: string[]): number {
  let score = 0;
  let remaining = haystack.toLowerCase();
  for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
    const matcher = new RegExp(`(?<![a-z])${escape(phrase)}(?![a-z])`, 'g');
    remaining = remaining.replace(matcher, (match) => {
      score += 1;
      return ' '.repeat(match.length);
    });
  }
  return score;
}

function label(score: number): Sentiment {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

export function scoreText(text: string): number {
  return countPhrases(text, POSITIVE_PHRASES) - countPhrases(text, NEGATIVE_PHRASES);
}

export function scoreAroundMentions(text: string, pattern: RegExp): number {
  const windows: string[] = [];
  const matcher = new RegExp(pattern.source, pattern.flags);
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(text)) !== null) {
    const start = Math.max(0, match.index - SENTENCE_WINDOW);
    const end = Math.min(text.length, match.index + match[0].length + SENTENCE_WINDOW);
    windows.push(text.slice(start, end));
  }
  return windows.reduce((total, window) => total + scoreText(window), 0);
}

export function toSentiment(score: number): Sentiment {
  return label(score);
}
