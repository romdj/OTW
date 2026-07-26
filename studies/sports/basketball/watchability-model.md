# Basketball Watchability Model

## Two temporally valid outputs

`preGameImportance` uses only data known at tip-off and is safe in strict mode. `postGameWatchability` uses observed paths and is protected. Preserve `featuresAsOf`, ruleset, league, model version, coverage, and whether possession or win-probability states were inferred.

## Pre-game importance

Recommended starting hypothesis, all features `[0,1]`:

`I = 0.30S + 0.25P + 0.20E + 0.15U + 0.10N`

- `S`: stakes—elimination, clinch, series/tournament leverage, standings consequence.
- `P`: explicit personal relevance.
- `E`: expected competitive balance from a non-outcome strength model.
- `U`: uncertainty from availability, matchup, youth/rotation, or single-elimination format.
- `N`: verified narrative continuity: rivalry, return, milestone, rematch.

Importance is not predicted entertainment. A title game may be important and one-sided.

## Post-game watchability

`W_raw = 0.28T + 0.18G + 0.14X + 0.12C + 0.10R + 0.08D + 0.06Q + 0.04N`

- `T`, tension: integrated competitive uncertainty across possessions, weighted by leverage and time.
- `G`, game-flow dynamism: meaningful swings/runs/control changes, not raw lead-change count.
- `X`, execution: difficult shot making, creation, defense, rebounding, and low-error high-pressure play.
- `C`, climax: competitive, consequential late possessions and final-sequence quality.
- `R`, recovery: deficit reduction or comeback relative to time/pace probability.
- `D`, distinctive performance: individual/team performance rarity with contextual adjustment.
- `Q`, consequence: realized playoff/tournament/standings narrative.
- `N`, novelty: rare, verified occurrences without double-counting performance.

Shrink sparse observations toward league/session priors:

`W = confidence * W_raw + (1 - confidence) * leaguePhasePrior`

Publish calibrated bands—`exceptional`, `strong`, `selective`, `recap`—rather than a precise number by default.

## Feature definitions

### Tension and leverage

Preferred: integrate `4p(1-p)` over live possessions, where `p` is calibrated home-team win probability. Weight later possessions moderately and cap repeated dead-ball events. If no validated model exists, use a league/rules-aware margin-time state table with lower confidence.

Do not use the final result as an input to earlier win probability. Validate probability calibration separately by NBA, WNBA, NCAA men, NCAA women, phase, and era.

### Game-flow dynamism

Detect runs and control changes from possession-indexed margin. A control change requires crossing from one team's lead to the other's, with ties separate. Score:

`G = meaningfulSwingMagnitude * uncertaintyAtSwing * persistence`

This discounts 2-0 “runs,” repeated one-point alternation, and changes that immediately reverse without creating a new competitive state.

### Comeback/recovery

Track maximum deficit later erased to tie, lead, or win, but normalize by possessions/time remaining and pre-game balance. Deep first-quarter deficits are less inherently dramatic than late recoveries. Outcome-specific labels remain protected.

### Climax

Use possession leverage, execution, uncertainty, and stoppage-adjusted viewing cost in the final competitive phase. The NBA five-minutes/within-five “clutch” definition is useful as a comparable raw flag, but OTW should also model one-possession states and actual leverage. Overtime adds climax only after reveal; do not mechanically award a large bonus.

### Garbage-time discount

Estimate comeback probability at each possession. Mark low leverage only after probability remains below a calibrated threshold for a persistence window; allow recovery if the state becomes competitive again. Discount contribution to tension, but retain personally relevant bench/debut or record context separately.

`effectiveAction = actionValue * (0.25 + 0.75 * competitiveLeverage)`

The 0.25 floor is a hypothesis preventing complete erasure of skill and fan-specific value.

### End-game foul drag

Identify sequences dominated by intentional fouls/free throws/timeouts with little probability movement. Calculate `deadBallSecondsPerLeverageUnit` when real timestamps exist. Use it to prefer condensed rather than lower sporting quality. Never infer intention from a foul code alone; use clock, margin, possession, repeated pattern, and reviewable tagging.

### Shot quality and individuals

Only use expected shot value when model inputs and calibration are documented. A model lacking defender distance or action context estimates location quality, not true shot quality. Individual rarity must compare league, era, role, pace, minutes, and opponent; avoid arbitrary round-number bonuses. Team outcome and player line stay protected.

## Personal utility and format

`U_user = W + boundedAffinity + tasteMatch - knownResult - accessCost`

Affinity changes the recommendation, not factual game-quality features. Cap it to avoid calling a blowout a classic solely because a followed team played.

| Game shape and user constraint | Format hypothesis |
|---|---|
| Sustained tension/execution; enough time | Full replay |
| Strong competitive passages plus long low-leverage/foul stretches | Condensed |
| One or two high-value runs/performances | Highlights |
| Stakes/context exceed observed action or data confidence is low | Recap |
| Low utility under tight budget | Skip |

Actual products and territorial access constrain recommendations. A “final five minutes” chapter itself can imply closeness; protect chapters until authorized.

## Confidence

Feature outputs include value, confidence, temporal/entrant coverage, missing inputs, and reason codes. Critical PBP gaps cap tension and climax confidence. Box-score-only analysis may support performance/context but cannot reliably establish path, comeback, lead changes, clutch, or garbage time.

## Validation

1. Stratify games across leagues, phases, eras, margins, pace, OT/no-OT, full/missing PBP, and audience profiles.
2. Collect independent ratings from casual and expert viewers for full-replay value, preferred format, traits, and spoiler severity.
3. Measure ranking correlation, band calibration, top-k precision, format accuracy, and inter-rater agreement by league.
4. Compare baselines: final margin, OT flag, lead changes, total points, star box score, pre-game stakes, and editorial choices.
5. Ablate win probability, possessions, shot quality, individual rarity, and stakes. Confirm personalization improves held-out individual choice over universal scores.
6. Audit false positives: intentional-foul marathons, noisy early lead changes, high-scoring blowouts, stat-padding. Audit false negatives: defensive close games, tactical adjustments, low-scoring high execution.
7. Backtest probability calibration and garbage thresholds without leaking future state.
8. Spoiler-test DOM, accessible names, URLs, notifications, images, logs, and network payloads. Track critical spoiler incidents per 1,000 protected impressions.

PMF metrics are recommendation-follow rate, “format was right,” viewing regret, repeat planning, and spoiler incidents—not agreement with a single expert score.
