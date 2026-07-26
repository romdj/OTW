# Handball Mock Data Contract

## Boundary

All fixtures are fictional UI inputs, not forecasts or provider data. The document and every event carry `source: "MOCK"` and `isSynthetic: true`. Do not ingest them into production, provider contracts, or model evaluation.

Each event separates:

- `safe`: schedule, teams, pre-match context/importance, blind recommendation.
- `liveSafe`: only “In progress” in strict mode.
- `protected`: score, clock, aggregate/live state inaccessible before authorization.
- `revealed`: outcome, structure, statistics and post-match explanation.

Variants are `PRE_MATCH`, `LIVE_SAFE`, `COMPLETED_HIDDEN`, `REVEALED`, and `AGGREGATE_TIE`.

## Acceptance criteria

- Protected cards contain no score, clock/half, current possession, exclusions, extra time/shootout, result, duration, comeback/upset, aggregate qualifier, or result-derived priority.
- Reveal is explicit and event-scoped; protected payloads are not preloaded or serialized into safe DOM.
- Accessible labels, images, notifications, URLs, sorting and analytics obey the same boundary.
- Match and aggregate outcomes use separate fields.
- `availability` and recommended format are never conflated.
- Low-completeness fixtures render an uncertainty note and never invent possession, run, leverage or goalkeeper explanations.
