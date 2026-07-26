# Importance and Watchability Model

## Units and scores

Compute separately for stage, leg/day and rally; aggregate only with explicit
weights. `priority_user=.35*importance_pre+.45*watchability_post+.20*personal`.
Upcoming/Blind ranking omits post-event score because it leaks outcome shape.

## Pregame importance

`I=100*(.28*championshipLeverage+.20*roundStage+.14*fieldQuality+.12*routeChallenge+.10*surfaceWeather+.08*crewManufacturerAffinity+.05*prestige+.03*rarity)`

Championship leverage is expected title/points probability change across plausible
outcomes, including overall/Sunday/Power scales for that regulation version.
Official scenarios outrank simulations; simulations are `HYPOTHETICAL` with rules,
model, eligibility, standings snapshot and remaining rounds.

## Post-event watchability

`W=100*(.26*classificationPressure+.18*volatility+.15*stageBattle+.12*splitPressure+.10*conditionsChallenge+.08*recovery+.06*technicalPerformance+.05*stakesRealized)`

- `classificationPressure=mean(4*p_t*(1-p_t)*remainingLeverage)` for rally-win or
  target-position probability after each stage.
- `volatility=min(1,Σmin(|Δp|,.35)/2)`; corrections/penalties are separate events.
- No probability model: percentile of leader/nearest-rival gap per competitive km
  versus stage/km remaining, labelled `PROXY`.
- `stageBattle`: closeness and alternating stage wins among relevant crews, adjusted
  for category/conditions; do not reward a broad field spread.
- `splitPressure`: uncertainty through comparable splits. Exclude interrupted/non-
  comparable cohorts and disclose coverage.
- `conditionsChallenge`: within-event evidence of surface/weather variation, not
  generic “rain equals drama.”
- `recovery`: competitive time/positions recovered, capped so a prior incident does
  not automatically inflate score.

Safety incidents, punctures and retirements are narrative facts after reveal, not
positive factors by default. Technical mastery can make a dominant stage valuable
for appropriate users but receives no suspense credit.

## Multi-day aggregation

Weight stages by competitive kilometres, classification leverage and coverage,
not equal count. Preserve stage-level peaks so a dull overall rally can still yield
a recommended stage. Day summaries separate overall, Super Sunday and Power Stage
classifications. Never add bonus points using another season's rules.

## Viewing format

- **Full rally/day:** sustained classification pressure and high personal/stakes.
- **Stage replay/onboard:** exceptional stage/split/technical performance.
- **Condensed 20–45 min:** several swings across days without sustained pressure.
- **Highlights 5–15 min:** isolated incident, Power Stage or dominant exhibition.
- **Skip/recap:** low importance/watchability/personal value.

Return unit, format, estimated minutes, coverage/confidence and reason codes. Rights
and clip availability must be real. Protected mode uses pre-event reasons only.

## Calibration and uncertainty

Calibrate by championship/category, season/rule version, surface, stage type and
distance, with hierarchical shrinkage. Timing precision and split density vary;
do not compare WRC Rally1 spread directly with WRC2 or national historic rally.
Suggested confidence: official stages+splits+statuses+context .9; stage times .75;
final classifications .4; schedule pre-event only. Renormalize and penalize missing
coverage; never treat notional time as measured performance.

## Edge cases

Cancelled/shortened/neutralised/interrupted stages; notional times revised later;
red flags; crews starting before rivals finish; dead heat/time precision; duplicate
or missing split; super-special parallel start; check-in/false-start/chicane/service
penalties; exclusion after provisional finish; retirement then permitted restart;
engine change and point ineligibility; manufacturer nomination; Power Stage stopped
before all eligible crews; route/Power designation changed; mixed classes; zero-
competitive-km leg; force majeure; spectator safety cancellation. Classification
must carry `PROVISIONAL`, `OFFICIAL`, or `FINAL_AFTER_APPEAL`.

## Validation

Freeze steward-corrected rallies and test stage/cumulative arithmetic, penalty and
notional separation, ties, restart eligibility, Sunday/Power scoring per season,
cancelled stages and correction replay. Backtest across surface/category/rule eras;
hold out rallies/championships/providers. Collect multi-rater choices for full day,
condensed, stage/onboard or skip. Measure rank correlation, top-k precision,
calibration, format regret, rater agreement and spoiler incidents. Verify that
personal crew/surface tastes improve recommendations over a universal list.
