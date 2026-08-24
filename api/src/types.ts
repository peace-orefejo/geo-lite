export type Citation = {
  url: string;
};

export type LlmResponse = {
  id: string;
  collectedAt: string;
  prompt: string;
  text: string;
  citations: Citation[];
};
