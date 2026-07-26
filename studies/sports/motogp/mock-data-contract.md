# MotoGP Mock Data Contract

## Boundary

All fixtures are fictional UI inputs. The document and every session carry `source: "MOCK"` and `isSynthetic: true`; never ingest them into production, provider contracts or model evaluation.

Each fixture separates:

- `safe`: weekend/session identity, schedule, entrants/context, pre-session importance and blind recommendation.
- `liveSafe`: only “In progress” under strict protection.
- `protected`: live timing/incidents/classification inaccessible before authorization.
- `revealed`: outcome, structure, metrics and explanation.

Variants exercise `PRACTICE_PRE`, `QUALIFYING_LIVE_SAFE`, `SPRINT_COMPLETED_HIDDEN`, `RACE_REVEALED`, and `SUBSTITUTE_MISSING_TIMING`.

## Acceptance criteria

- Protected UI contains no order, leader, grid/pole, lap/time remaining, gaps, Q2 progress, flags, weather change, crashes, penalties, DNF, classification or championship movement.
- Reveal is explicit/event-scoped; protected fields are not preloaded into DOM or analytics.
- URLs, accessible labels, notifications, imagery, sorting and next-session navigation obey the boundary.
- Rider, team and manufacturer are distinct identities; replacement status never mutates the regular entrant.
- Low-timing fixtures show uncertainty and never invent overtakes, battles, tyres or pace.
- Recommended format and actual replay availability remain separate.
