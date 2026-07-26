# Importance and Watchability Model

## Separate questions

`priority_user = .35*importance_pre + .45*watchability_post + .20*personal`

**Recommendation:** keep components separate. Upcoming and Blind-mode ranking
must omit/renormalize post-match watchability because its rank leaks outcome shape.

## Pregame importance (0–100)

`I=100*(.28*stage + .25*qualificationLeverage + .15*poolLeverage + .12*tieLeverage + .08*rivalry + .07*participantQuality + .05*rarity)`

Inputs are 0–1. Tie leverage explicitly models first-leg result and the edition's
Golden Set trigger. Qualification leverage is the change in advancement/seed
probability across plausible match outcomes. Official scenarios outrank
simulation; label simulations `HYPOTHETICAL` with rule/model/snapshot.

## Post-match watchability (0–100)

With rallies:

`W=100*(.28*suspense + .18*volatility + .16*rallyQuality + .12*runExchange + .10*serveReceive + .08*defenceBlock + .05*stakesRealized + .03*atmosphere)`

A fifth/third/Golden Set is not an automatic bonus: it is both a spoiler and a
lossy consequence of the path. Straight-set matches can showcase elite quality;
error exchanges can be close but poor.

- `suspense = mean(4*p_t*(1-p_t)*leverage_t)` over rallies, where `p_t` is match-
  win probability derived from discipline/rule/strength/score/server state.
- `volatility = min(1, Σmin(|Δp|,.25)/2)`; cap corrections/challenges.
- Proxy without calibrated probability: weighted fraction of rallies within 2,
  late ties, deuce rallies and set/match points, normalized by set target.
- `rallyQuality`: transition/long-rally and successful-action rates minus
  unforced-error rate, provider-definition compatible and discipline-calibrated.
- `runExchange`: rewards consequential runs by both sides, not one-sided routs.
- `serveReceive`: opponent-adjusted serve pressure and sideout resilience.
- `defenceBlock`: action-value model where available; box-score block counts cap
  confidence because touches and resulting transitions are absent.

Indoor and beach require separate probability/calibration models: player count,
set targets, substitutions/rotations, block contact and weather differ.

## Viewing format

- **Full:** sustained suspense, rally quality or high personal/tactical value.
- **Condensed 15–30 min:** strong runs/turning sets without sustained quality.
- **Highlights 5–12 min:** isolated rallies, skill exhibition or one-sided match.
- **Deciding/Golden Set only:** only after reveal and when lawful clips exist.
- **Skip/recap:** low importance, watchability and personal relevance.

Return format, estimated minutes, confidence and reasons. Never infer catalog
availability or expose result-derived reasons in protected mode.

## Calibration and uncertainty

Normalize rally length, ace/error/block rates and margins by discipline,
competition, gender/category, season and stage, using hierarchical shrinkage for
sparse events. Provider/stat-crew changes form new cohorts. Never rank beach with
indoor thresholds or youth with senior set targets.

Suggested confidence: full rally+actions+context .90; rally winners only .78;
set scores+stats .55; set scores .40; final score .20; schedule pre-match only.
Renormalize available weights and apply coverage penalty; missing is not average.

## Edge cases

Unbounded deuce scores; deciding-set target differences; competition-specific
best-of-three indoor; Golden Set before/after 2026 CEV change; pool tiebreaks by
match points/set ratio/point ratio; incomplete pools; forfeits and awarded 0-3/
0-2 scores; withdrawal/injury; abandoned/resumed match; beach medical timeout;
pair replacement rules; sanctions/penalty points; challenge overturn/duplicate
rally; wrong server/rotation correction; data feed resetting set number; weather
delay; shortened youth formats. Forfeits receive no fabricated rally path.

## Validation

Freeze corrected fixtures and test chronological score validity, win-by-two,
server changes, set completion, deuce/match-point state, Golden Set and forfeit
profiles. Backtest by discipline/competition/stage; hold out competitions and
providers. Collect blinded full/condensed/highlights labels from multiple raters.
Measure rank correlation, top-k precision, calibration, format regret, rater
agreement and spoiler incidents per 1,000 protected impressions. Validate that
personal models outperform universal ranking for indoor and beach separately.
