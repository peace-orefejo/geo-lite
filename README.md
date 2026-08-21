# geo-lite

A small take-home exercise. Read this, then build.

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

Build a small fullstack app that reads that file and reports, per brand:

- **share of voice**
- **mention rate**
- **sentiment**

…and shows the results in a simple dashboard.

Brands to track:

- Target: **Ray-Ban**
- Competitors: **Oakley**, **Warby Parker**, **Persol**

## Your call

- **The stack.** Anything you're fast in. We have no house preference.
- **The scaffolding.** Set it up however you like.
- **What share of voice means.** There's more than one reasonable definition. Pick one and
  be able to say why.

## Notes

- Use any AI tooling you want. That's how we work.
- Cut scope aggressively and skip boilerplate. A working slice beats a broad half-finished
  one.
- You will not finish everything in the time available. Choosing what to leave out is part
  of the exercise.
- We care about your reasoning as much as the code — expect to talk through the decisions
  you made and the ones you deliberately deferred.
