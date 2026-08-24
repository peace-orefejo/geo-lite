import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LlmResponse } from './types.js';

const dataPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../data/responses.json',
);

export function loadResponses(): LlmResponse[] {
  const raw = readFileSync(dataPath, 'utf8');
  return JSON.parse(raw) as LlmResponse[];
}
