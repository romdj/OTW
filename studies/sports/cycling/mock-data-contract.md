# Cycling Mock Data Contract

## Purpose and hierarchy

`mock-events.json` supports UI/UX work, not provider integration. Each record represents a lifecycle snapshot of a recommendable `STAGE` or single-race `EVENT`, and references its parent race. Every value is fictional.

Required envelope:

- `schemaVersion`, stable `id`, `parentEventId`, `source: "MOCK"`, `fictional: true`.
- `variant`: `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_HIDDEN`, or `REVEALED`.
- `knowledgeAsOf`, `spoilerLevel`, `event`, `recommendation`, `safeContext`.
- `protectedOutcome`, null unless revealed.

## Disclosure rules

- Pre-event: published route version, entrants, schedule, pre-start classifications, forecast, personal relevance.
- Live-safe: identity and neutral “in progress”; no km remaining, groups, gaps, attacks, actual weather, incidents, or live classification.
- Completed-hidden: no winner, finish type, gaps, survival/catch, GC change, withdrawal, actual route/duration/weather, structural trait, or chapter.
- Revealed: result, state timeline, classifications, derived features, and viewing chapters.

Production should fetch protected data separately after authorization. CSS hiding is not protection.

## MVP fields

- Race/stage IDs, discipline/category, format, edition/ruleset, schedule/status.
- Published route version: distance, terrain band, key segments and effective timestamp.
- Entrants/followed riders and pre-start classification snapshot.
- Importance, recommendation format/band, reason codes, confidence, missing inputs.
- For completed analysis: timestamped groups/gaps/distance, finish result, classification snapshots, route changes, race decisions.

## Extended fields

- Rider GPS/power when legally and consistently available, group-resolution confidence.
- Attack/catch/bridge annotations, team resources/control, sprint positioning.
- Weather/surface observations, crashes/mechanicals and attribution.
- Classification scenario simulations, time bonuses/cuts, broadcast chapters/products/territory.

## Checks

- All records are `source=MOCK`, fictional, and display a Mock badge in prototypes.
- Non-revealed `protectedOutcome` is null.
- Only revealed records contain winner, result gaps, actual route changes, groups, incidents, classifications after finish, or chapters.
- ISO UTC timestamps; feature value/confidence/coverage in `[0,1]`.
- Same stable ID across variants is one lifecycle, not duplicates.
- Safe reasons cannot imply attack, breakaway, sprint, crash, weather occurrence, winner, gap, or classification movement.
