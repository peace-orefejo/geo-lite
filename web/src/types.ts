export type ReportResponse = {
  brandId: string;
  name: string;
  shareOfVoice: number;
  mentionRate: number;
  sentiment: 'positive' | 'negative' | 'neutral';
};

export type ReportGroup = {
  collectedAt: string;
  responseCount: number;
  brands: ReportResponse[];
};
