# American Football Data Points

## Rules and competition context

**Evidence.** NFL regulation is four 15-minute quarters. Overtime and clock provisions are explicit rules and can change by season; the 2026 rulebook contains distinct regular-season and postseason procedures ([NFL Rulebook](https://operations.nfl.com/rules-officiating/2026-nfl-rulebook)). Do not infer the applicable rule from a generic `NFL` label.

**Evidence.** NCAA football has its own rules for timing, overtime possessions and scoring. OTW must version the ruleset by season ([NCAA rules publication](https://www.ncaapublications.com/p-4693-2025-ncaa-football-rules-book.aspx)). CFP rankings are committee outputs and are not interchangeable with AP/coaches polls or computer ratings ([CFP protocol](https://collegefootballplayoff.com/sports/2016/10/24/selection-committee-protocol)).

## Raw facts

| Group | Minimum fields | Important detail |
|---|---|---|
| Identity | game/team/competition IDs, league, season, season type, week | NCAA team identity and neutral-site naming require reconciliation. |
| Schedule | scheduled/actual start, timezone, venue, home/away/neutral, broadcast | Keep postponement/cancellation separately. |
| Context | regular/postseason, conference/division, round, bowl, rivalry, rankings at kickoff | Store ranking authority and publication date. |
| Rules | ruleset/version, quarter length, overtime format, timeout/clock rules | Never infer across seasons. |
| Game state | period, clock, possession, score, timeouts, down, distance, yard line, goal-to-go | Protected once game begins. |
| Play | sequence, drive ID, type, start/end state, yards, scoring, turnover, penalty, review | Preserve nullified plays and corrections. |
| Drive | offense, start/end time/field position, plays, result, points | Drives/possessions are core viewing units. |
| Team stats | plays, yards, EPA where available, success, turnovers, sacks, explosive plays, red-zone trips | Retain raw numerators/denominators. |
| Player stats | passing/rushing/receiving/defense/kicking | Not required for MVP watchability. |
| State/provenance | status, finality, source IDs, fetched/effective time, completeness, correction | Distinguish official final from provisional final. |

## Derived metrics

- Pre-game win probability and uncertainty, frozen at kickoff.
- Play leverage: `abs(WP_if_success - WP_if_failure)` given score, clock, possession, field position, down/distance, timeouts, ruleset.
- Tension: leverage weighted by contemporaneous game closeness.
- Competitive balance: time-integral of distance from 50% win probability.
- Lead changes/ties: count only actual changes; weight by remaining time/leverage.
- Comeback depth: eventual winner's minimum win probability or largest deficit; revealed-only.
- Upset magnitude: pre-game probability against eventual winner; revealed-only.
- Turning points: clustered high absolute win-probability changes, avoiding double-counting penalty/review corrections.
- Garbage-time share: proportion of valid plays with both low leverage and extreme win probability. Avoid a universal score-margin threshold.
- Offensive/defensive execution relative to opponent- and competition-adjusted baselines.
- Drive drama: high-leverage scoring, turnover, fourth-down, goal-line, or end-of-half possessions.
- Pace/interruption: valid plays per broadcast minute and stoppage burden where measured.

**Recommendation.** Treat win probability as a model estimate, not observed truth. Store model/version and never mix WP deltas from different models in one game.

## Contextual and personalization fields

Context: NFL division/conference/playoff leverage; clinching/elimination scenarios; NCAA conference standings, CFP ranking, poll authority, bowl/playoff/conference-title implications, strength of schedule, rivalry with editorial provenance, ranked matchup, neutral-site/bowl context. A named bowl alone is not a stable stakes proxy.

Personalization: followed team/player/conference, alumni/location affinity, NFL/NCAA familiarity, rivalry interest, offense/defense/tactical preferences, upset tolerance, time budget, replay services/territory, known-result state, and spoiler mode.

## Spoiler-forbidden fields

| Protected state | Do not render, preload, log, encode in URL, alt text, sorting, or analytics |
|---|---|
| Live-safe | score, period/clock, possession, game progress, injury, WP, “close game,” upset/lead wording. |
| Completed-hidden | winner/score, overtime, duration, comeback, upset, lead changes, final stats, next-round opponent, standings/ranking changes, celebration image, post-game watchability/tier. |
| Revealed | Outcome information permitted only after explicit event-scoped reveal. |

Even “overtime thriller,” condensed duration, or a high post-game tier leaks structure. Strict recommendations must use pre-game importance and affinity only.

## MVP and extended sets

**MVP:** IDs, NFL/NCAA/competition, season/week/type/round, ruleset, kickoff, venue/neutral flag, teams, pre-game records/ranking with authority/date, pre-game win probability/confidence, playoff/ranking context, status, affinity, availability, provenance. For completed games, physically isolate outcome payload.

**Extended:** complete corrected play-by-play, drive boundaries, down/distance/field position/timeouts, penalties/reviews, WP/EPA model inputs, injuries, broadcast/replay durations, advanced team/player baselines, weather, betting-free consensus strength models, and versioned postseason scenario simulations.

## Edge cases and data quality

- Cancelled/postponed/no-contest: no post-game score.
- Forfeit: outcome exists without a played viewing experience; exclude from watchability.
- Suspended/abandoned: mark partial; do not compare duration or comeback normally.
- Missing plays/clock: fall back to drive or scoring summary and cap confidence.
- Duplicate/reordered plays, accepted/declined penalties, overturned reviews, kneel-downs and spikes need explicit semantics.
- Overtime: use the season/competition procedure; its presence remains protected.
- NCAA: missing lower-division data, inconsistent rankings, bowl opt-outs and uneven schedule strength increase uncertainty.
- Validate score increments, drive possession alternation exceptions, field-position bounds, period/clock monotonicity (allow corrections), and final winner consistency.
