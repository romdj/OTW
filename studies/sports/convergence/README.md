# Cross-Sport Convergence Study

This package turns 12 sport-analyst studies into a frontend/UX fixture contract without flattening sport-native meaning. It is a recommendation for mock-data experiments, not a production GraphQL or persistence schema.

## Scope

Reviewed packages: [American football](../american-football/), [association football](../association-football/), [basketball](../basketball/), [cycling](../cycling/), [Formula 1](../formula1/), [handball](../handball/), [ice hockey](../ice-hockey/), [MotoGP](../motogp/), [rally](../rally/), [Superbike](../superbike/), [tennis](../tennis/), and [volleyball](../volleyball/). Each source package remains authoritative for sport evidence, feature definitions, rule caveats, and full mock records.

## Findings

Only a small surface truly converges:

- Stable identity, sport discriminator, display identity, competition context, scheduled time, lifecycle state, and provenance.
- A ruleset reference and an optional parent/series hierarchy.
- Pre-event importance, post-event watchability, viewing-format recommendation, confidence, and missing-input disclosure.
- Explicit spoiler mode and disclosure state.
- Participant affinity and safe, coded explanations.

Scores, clocks, periods, sets, stages, laps, classifications, routes, standings, ties, and sessions do **not** converge safely. They belong in discriminated sport details and protected outcome payloads.

## Deliverables

- [Shared event envelope](shared-event-envelope.md): minimal TypeScript-style contract and lifecycle semantics.
- [Discriminated sport details](discriminated-sport-details.md): native payloads, hierarchies, naming conflicts, and optionality.
- [Mock catalog](mock-catalog.json): one normalized fictional card fixture per sport, traceable to its source study.
- [UI experiment plan](ui-experiment-plan.md): card/filter/detail hypotheses and tests.
- [Qualitative watchability](qualitative-watchability.md): the universal, sport-calibrated meaning of “worth watching.”

## Non-negotiable boundaries

All catalog records are `source: "MOCK"` and `fictional: true`. A hidden outcome is absent, not CSS-hidden. Safe DOM, accessibility text, URLs, images, analytics, notifications, prefetch caches, sorting, and navigation must obey the same disclosure boundary. Viewing format is a recommendation, not proof that a replay product exists.

## Unresolved decisions

1. Whether `COMPLETED_HINTS` may show an outcome-derived watchability band; strict mode cannot.
2. Whether “full” means entire broadcast, world feed, or sporting action; cycling/rally need final-hours/stage-specific variants.
3. Whether event-series containers are themselves recommendable or only navigational.
4. Whether UI labels use `importanceBand` and `watchabilityBand` together after reveal.
5. How to compare bands across sport cohorts before calibration.
6. Which safe sorting policy avoids weak spoilers; pre-event importance is the safest default.

These require UX experiments and validation, not schema guesswork.
