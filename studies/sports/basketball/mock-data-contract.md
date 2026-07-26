# Basketball Mock Data Contract

## Envelope

`mock-events.json` is a UI fixture, not a provider schema. Every record has:

- `schemaVersion`, stable `id`, `source: "MOCK"`, `fictional: true`.
- `variant`: `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_HIDDEN`, or `REVEALED`.
- `knowledgeAsOf`, `spoilerLevel`, and competition-specific `event.rulesetRevision`.
- `recommendation` with temporal basis, importance/watchability bands, format, reasons, traits, confidence, and missing inputs.
- `safeContext` and a separately gated `protectedOutcome`.

Teams, players, schools, scores, competitions, and dates are fictional. Prototype surfaces must display a Mock marker.

## Reveal policy

- `PRE_EVENT`: participants, schedule, pre-tip standings/seeds/series context, declared availability, and pre-game importance only.
- `LIVE_SAFE`: identity plus neutral “in progress”; no score, clock, period, foul state, or live ranking.
- `COMPLETED_HIDDEN`: may hold a protected internal recommendation band for Light context, but never winner, score, margin, overtime, duration, comeback, star line, bracket/standings change, or structural reason.
- `REVEALED`: may include outcome, score/possession paths, model features, notable performance, and viewing chapters.

Production should fetch protected data only after authorization; hiding delivered JSON with CSS is insufficient.

## MVP fields

- League/category, season/phase, ruleset, game ID, teams, UTC schedule/status, venue/neutral site.
- Pre-tip record/seed/series snapshot and followed participants.
- Lifecycle variant and spoiler mode.
- Pre-game importance; protected post-game band/format; reason codes; confidence/missing inputs.
- For completed calculation: timestamped period/clock/score PBP, inferred/known possessions, final classification, and pre-tip context snapshot.

## Extended fields

- Lineups/substitutions, shot locations/context/expected value, tracking and matchup data.
- Calibrated win-probability path with model metadata.
- Review/challenge, foul-intent classification, real-time stoppage durations.
- Individual rarity baselines, full history, injuries and availability provenance.
- Series/bracket simulations, verified broadcast products, chapters, and territory.

## UI and contract checks

- Estimated minutes use `minutesEstimated: true`.
- Reasons are selected from vetted `reasonCodes`; strings are prototype copy.
- Safe reasons contain no result verbs, margin, comeback, overtime, decisive player, or structural event.
- Only `REVEALED` can contain `winner`, `finalScore`, `overtimePeriods`, `scorePath`, or individual final lines.
- Values/confidence/coverage are finite and in `[0,1]`.
- The same ID across variants is one game's lifecycle, not duplicate games.
- Never place protected fields in DOM, accessible tree, URL, analytics, notification, image metadata, or prefetched safe response.
