# American Football Data Analysis Study

## Purpose

This study defines the NFL and NCAA football evidence OTW needs to rank games and recommend full replay, condensed game, highlights, recap, or skip. Provider integration and production code are out of scope.

## Deliverables

- [Data points](./data-points.md): raw, derived, contextual, personalized, and protected fields.
- [Watchability model](./watchability-model.md): pre-game importance and post-game watchability calculations.
- [Mock contract](./mock-data-contract.md): lifecycle and spoiler-disclosure rules.
- [Mock events](./mock-events.json): fictional `source: "MOCK"` UI fixtures.

## Evidence convention

- **Evidence:** supported by a primary rules or competition source.
- **Recommendation:** OTW analytical/product decision requiring validation.
- **Hypothesis:** relationship to test against viewers and historical games.

Primary references: [2026 NFL Rulebook](https://operations.nfl.com/rules-officiating/2026-nfl-rulebook), [NFL tiebreaking procedures](https://www.nfl.com/standings/tie-breaking-procedures), [NCAA football rules](https://www.ncaapublications.com/p-4693-2025-ncaa-football-rules-book.aspx), [CFP selection protocol](https://collegefootballplayoff.com/sports/2016/10/24/selection-committee-protocol), and the [NCAA statistics manual](https://www.ncaa.org/sports/2013/11/19/statistics-policies-and-guidelines.aspx).

## Product conclusion

**Recommendation.** Preserve a sport-neutral event envelope, but calculate leverage within `competition × season × ruleset`. NFL and NCAA games look structurally similar yet differ in overtime, clock administration, postseason context, ranking systems, schedule strength, and data consistency. Cards should expose qualitative importance/watchability bands and confidence before numeric scores.
