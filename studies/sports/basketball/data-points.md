# Basketball Data Points

## Rules and competition context

Persist `competition`, gender/category where applicable, season, phase, and `rulesetRevision`. NBA rules specify four 12-minute periods, five-minute overtimes, and clock behavior ([Rule 5](https://official.nba.com/rule-no-5-scoring-and-timing/)); its shot clock normally begins at 24 seconds and has rule-specific resets ([Rule 7](https://official.nba.com/rule-no-7-24-second-clock/)). The [2025 WNBA rulebook](https://cdn.wnba.com/sites/4/2025/04/2025-WNBA-Official-Rule-Book.pdf) is a separate authority. NCAA men's games use halves while NCAA women's games use quarters in current rules, with distinct timeout, bonus, review, possession-arrow, and administrative details. Rules change, so do not hard-code them across eras.

## Raw facts

All observations require source, observed/effective time, correction state, and coverage.

| Group | Minimum fields | Analytical use |
|---|---|---|
| Identity | game/team/competition IDs, season, phase, round/series/tournament path, ruleset | Stable context |
| Schedule | scheduled/actual UTC times, venue, neutral site, status/postponement | Lifecycle and travel/context |
| Structure | period type/count/duration, OT duration, shot-clock rules | Correct normalization |
| Pre-game | standings/record snapshot, seeds/rankings, series state, injuries/availability with timestamp, market-neutral strength estimate | Stakes and expectation |
| Play-by-play | sequence ID, period/clock, event type, team/player, points, score after event, possession indicator | Game path and attribution |
| Lineups | substitutions, five players on court, minutes | Matchups and individual context |
| Shots | location, value, made/missed, assisted/blocked, clock; optional defender/expected value | Shot profile and execution |
| Possessions | start/end, offense, outcome, points, turnover/rebound/foul linkage | Pace-independent analysis |
| Box score | minutes, shooting, rebounds, assists, turnovers, fouls, plus/minus | Performance summary, not game shape alone |
| Officials/reviews | fouls, technical/flagrant, challenges/reviews, reversals | Stoppage and consequence |

Scores, final classification, overtime count, comeback result, and final individual lines are protected after tip-off.

## Derived metrics

Every metric returns `{value, confidence, coverage, modelVersion, missingInputs}`.

- `scorePath`: margin after each validated scoring event.
- `possessionPath`: possession-indexed margin, robust across clock/pace differences.
- `winProbabilityPath`: model estimate at each state, only with documented league-specific calibration.
- `competitiveTension`: time/possessions with meaningful uncertainty, increasingly weighted late.
- `leverage`: expected change in win probability caused by a possession/event; never treat the estimate as truth.
- `leadChange`: control changes excluding 0-0 and ties; separately count ties.
- `comebackDepth`: maximum prior deficit overcome to tie/take a lead, plus time and possessions available.
- `swingIntensity`: magnitude/frequency of meaningful probability or margin reversals, smoothed to avoid noisy one-point changes.
- `clutchExposure`: possessions meeting a disclosed definition. NBA editorial/statistical use commonly defines clutch as the last five minutes of the fourth/OT with margin at most five ([NBA example](https://www.nba.com/news/stats-breakdown-coming-through-in-the-clutch)); use it as a descriptive feature, not a universal rule for WNBA/NCAA.
- `garbageTimeShare`: fraction of game with low comeback plausibility, considering margin, time, pace, possession, team strength, and league.
- `endGameFoulDrag`: low-information elapsed viewing time/possessions dominated by intentional fouls, free throws, timeouts, and reviews.
- `shotMakingOverExpectation`: actual points minus expected points from a validated shot-quality model.
- `executionQuality`: turnovers forced/committed, assisted creation, rim protection, rebounding, and shot making adjusted for opposition/context.
- `individualPerformanceRarity`: era/league/role-adjusted percentile with playing-time and opportunity context.

Do not derive possessions by simply summing box-score formulas when reliable play-by-play exists. If possession boundaries are inferred, label them.

## Contextual importance

- Regular season versus in-season tournament, conference tournament, NCAA tournament, play-in, playoffs, or Finals.
- Best-of-series state, elimination/clinching possibility, home court, neutral site, remaining schedule, standings/tiebreak stakes.
- NCAA seed, ranked matchup, conference implications, rivalry, upset likelihood, single-elimination leverage, and bubble/resume context.
- WNBA-specific season length, playoff format, Commissioner's Cup context where applicable, and roster/availability realities.
- Rest, back-to-back/travel, return/debut/milestone, coach change, and prior meeting—timestamped and verified.

Rivalry and brand prominence affect anticipated/personal relevance; they cannot prove post-game quality. “Upset” is protected once it describes the outcome.

## Personalization

- Followed teams, players, schools, conferences, hometown/alumni affinity.
- Preference for close finishes, tactical execution, shooting, defense, individual brilliance, comebacks, upset possibility, or rivalry.
- Familiarity: novice explanations versus lineup/coverage/shot-profile detail.
- Available time, replay products, territory, already-known result, and already-watched portions.
- Spoiler tolerance, including whether recommendation rank, overtime, or player-performance hints are spoilers.

Users must be able to inspect and correct inferred preferences. Do not infer school attendance, gender, gambling interest, or sensitive traits.

## Session and state differences

### Pre-game

Safe inputs include participants, schedule, pre-tip standings/seeds, series state already known, declared availability, neutral-site status, and followed entities. Freeze them at tip-off to prevent changed standings or retrospective injury news leaking the result.

### Live-safe

Strict mode exposes only identity, scheduled context, and “in progress.” Current score, period, clock, foul trouble, lineup, momentum, and elapsed real time can reveal game shape. A custom mode may separately authorize them.

### Completed-hidden

Keep final score, winner, margin, overtime, duration, comeback/lead-change language, decisive player, thumbnails, changed bracket/standings, and outcome-derived ranking outside the payload. Even “instant classic” is a spoiler.

### Revealed

Show score path, decisive stretches, final/provisional status, individual lines, stakes resolved, and honest model confidence. Correct records after stat/league corrections without silently rewriting model versions.

## Data limitations and edge cases

- Missing/reordered/duplicated play-by-play, score corrections, unknown possession, clock corrections, and simultaneous events.
- End-game fouls inflate events, points, free throws, and real duration without equivalent action value.
- Overtime is highly watchable to many users but its existence reveals regulation outcome.
- A large comeback can end in a loss; distinguish “erased deficit,” “took lead,” and “won” only after reveal.
- Garbage time is probabilistic, not a fixed margin. Bench-player/rebuilding-team fans may still value it.
- Shot coordinates/defender distance and lineup data differ in quality by league, season, venue, and competition.
- NCAA rankings, seeds, NET/bubble narratives, and tournament fields are time-dependent; provenance snapshots matter.
- Forfeits, suspended games, double overtime, ejections, reviews after horn, vacated results, stat corrections, and neutral-site naming.
- Individual “career high” requires complete career data; suppress it when history coverage is incomplete.

Missing data is not zero. Fall back to score/clock paths with reduced confidence, never fabricate detailed possessions.
