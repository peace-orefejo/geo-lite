# geo-lite

A small take-home exercise. Read this, then build.

The API and frontend apps are already scaffolded. Do not spend time on project
setup — implement the metrics and wire them into the dashboard.

## Scenario

We track how visible a set of brands are in AI-generated answers. Every day we run a fixed
set of prompts through a web-browsing LLM and record what comes back.

`data/responses.json` holds the raw responses from the last few daily runs. Each object
looks like:

```json
{
  "id": "r1",
  "collectedAt": "2026-08-18T06:12:04Z",
  "prompt": "the user's question",
  "text": "the LLM's answer",
  "citations": [{ "url": "https://…" }]
}
```

Collection is already handled — you don't need to call any model or scrape anything.

## Your task

Read that file and report, per brand:

- **share of voice**
- **mention rate**
- **sentiment**

…and show the results in the dashboard.

Brands to track:

- Target: **Ray-Ban**
- Competitors: **Oakley**, **Warby Parker**, **Persol**

There is more than one reasonable definition of share of voice. Pick one and be
able to say why.

## What's already here

```
data/responses.json   raw LLM answers
api/                  Express + TypeScript
web/                  Vite + React + TypeScript
```

`api` loads the JSON on startup (`loadResponses`) and exposes `GET /health`.
`web` proxies `/api/*` to the API. Add your own routes and UI from there.

## Run

Node 18+ and npm.

```sh
npm install
```

In one terminal:

```sh
npm run dev:api
```

In another:

```sh
npm run dev:web
```

- API: http://localhost:4000/health
- App: http://localhost:5173

## Notes

- Use any AI tooling you want. That's how we work.
- Cut scope aggressively. A working slice beats a broad half-finished one.
- You will not finish everything in the time available. Choosing what to leave
  out is part of the exercise.
- We care about your reasoning as much as the code — expect to talk through the
  decisions you made and the ones you deliberately deferred.
