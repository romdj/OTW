# Superbike Mock Data Contract

## Boundary

All records are fictional UI inputs, not forecasts/provider data. Document and session carry `source: "MOCK"` and `isSynthetic: true`; never ingest into production, provider tests or model evaluation.

Each session separates `safe` pre-session context, strict `liveSafe`, inaccessible `protected` timing/results, and explicitly authorized `revealed` analysis.

Variants: `PRACTICE_PRE`, `SUPERPOLE_LIVE_SAFE`, `RACE1_COMPLETED_HIDDEN`, `SUPERPOLE_RACE_REVEALED`, and `RACE2_REPLACEMENT_MISSING_TIMING`.

## Acceptance criteria

- Safe UI contains no timing/order, lap, gaps, pole/grid, flags/weather change, incidents, penalties, classification, championship movement or Race 2 grid consequence.
- Reveal is explicit/session-scoped; protected payloads do not enter DOM, analytics or prefetch caches.
- Accessible labels, notifications, imagery, URLs, sorting and cross-session navigation obey the same boundary.
- Race 2 grid source can be displayed only at the permitted disclosure level.
- Rider/team/manufacturer and replacement/regular identities remain separate.
- Classification-only fixtures never claim passes, battles, pace or tyre strategy.
- Recommendation format is not replay availability.
