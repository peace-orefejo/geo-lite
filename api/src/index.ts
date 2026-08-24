import cors from 'cors';
import express from 'express';
import { loadResponses } from './loadResponses.js';
import { TARGET_BRAND_ID } from './brands.js';
import { buildReport } from './report.js';

const port = 4000;
const app = express();
const responses = loadResponses();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/report', (_req, res) => {
  res.json(buildReport(responses, TARGET_BRAND_ID));
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Loaded ${responses.length} responses`);
});
