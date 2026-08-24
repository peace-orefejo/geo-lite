export type BrandDefinition = {
  id: string;
  name: string;
  isTarget: boolean;
  pattern: RegExp;
  domains: string[];
};

export const BRANDS: BrandDefinition[] = [
  {
    id: 'ray-ban',
    name: 'Ray-Ban',
    isTarget: true,
    pattern: /\bray[-\s]?ban(?:s)?\b/gi,
    domains: ['ray-ban.com'],
  },
  {
    id: 'oakley',
    name: 'Oakley',
    isTarget: false,
    pattern: /\boakley(?:s)?\b/gi,
    domains: ['oakley.com'],
  },
  {
    id: 'warby-parker',
    name: 'Warby Parker',
    isTarget: false,
    pattern: /\bwarby[-\s]?parker\b/gi,
    domains: ['warbyparker.com'],
  },
  {
    id: 'persol',
    name: 'Persol',
    isTarget: false,
    pattern: /\bpersol(?:s)?\b/gi,
    domains: ['persol.com'],
  },
];

export const TARGET_BRAND_ID = 'ray-ban';

export function getBrand(id: string): BrandDefinition {
  const brand = BRANDS.find((b) => b.id === id);
  if (!brand) throw new Error(`Unknown brand: ${id}`);
  return brand;
}
