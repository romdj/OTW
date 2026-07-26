# Importance and Watchability Model

## Separate scores

**Recommendation:** store three independent 0–100 scores:

`priority_user = .35*importance_pre + .45*watchability_post + .20*personal`

For upcoming or Blind-mode matches, omit/renormalize post-match watchability.
Post-match ranking is itself a weak spoiler.

## Pre-match importance

`I = 100*(.25*stage + .25*qualificationLeverage + .15*tableLeverage + .10*aggregateLeverage + .10*rivalry + .10*teamQuality + .05*rarity)`

Inputs are 0–1 and competition-specific. Qualification leverage is the expected
change in advancement/seed probability across plausible results. League table
leverage covers title, Europe/promotion and relegation. For a two-leg second leg,
aggregate leverage uses the *pregame* tie state and current rules. Official
scenarios outrank simulation; simulations are `HYPOTHETICAL` with model/version,
table snapshot and remaining-fixture assumptions.

## Post-match watchability

With compatible event data:

`W = 100*(.25*suspense + .15*volatility + .14*chanceQuality + .26*qualitativeMatch + .08*stakesRealized + .05*atmosphere + .07*personalFit)`

Overtime, penalties, goals and red cards are inputs to the path, not automatic
bonuses. A 0-0 can be excellent through high-quality chances/keeping or tactical
control; it can also be low-event. A 5-0 may be valuable for dominance/skill users
but should not receive suspense credit.

### Formulas

- League `suspense = mean(4*pDrawOrEitherOutcomeUncertainty*lateLeverage)` using
  calibrated home/draw/away probabilities.
- Knockout suspense uses qualification probability, not match-win probability:
  `mean(4*q_t*(1-q_t)*lateLeverage)`. Include aggregate before every event.
- `volatility = min(1, Σ min(|Δq|,.35)/1.8)`; cap VAR reversals/corrections.
- No probability feed: weighted share of time tied/one-goal in the relevant
  match or aggregate state plus late equalizer/go-ahead proxies, labelled `PROXY`.
- `chanceQuality`: robust competition-season percentile of total compatible xG,
  big-chance count and post-shot threat. Without xG, shots-on-target proxy capped
  at confidence .55.
- `qualitativeMatch` is a separately reported, confidence-weighted vector covering
  progression, transitions, press, rhythm, tactical/defensive quality and skill;
  see [qualitative-watchability.md](qualitative-watchability.md). Never infer it
  directly from possession or event volume.
- `personalFit` applies a viewer's declared dimension preferences; the neutral
  vector remains available and is never rewritten as objective “beautiful play.”

Red-card state changes denominators, expected possession and chance rates.
Compare post-card output against 10v11 baselines, and avoid treating misconduct
as entertainment by default.

## Viewing format

- **Full replay:** sustained uncertainty/pressure or high tactical-personal value.
- **Condensed 15–30 min:** high volatility and several key phases without sustained quality.
- **Highlights 5–12 min:** isolated decisive/skill events or dominant result.
- **Penalty sequence only:** only after reveal and when rights/timestamps exist.
- **Skip/recap:** low importance, watchability and personal value.

Return format, estimated minutes, confidence and reason codes. Rights/catalog
availability must be real. Protected reasons are pre-match-only.

## Competition calibration

Normalize pace, event counts, xG and card rates within competition, season and
stage, with hierarchical shrinkage for sparse cups. Do not encode “prestige tier”
as intrinsic watchability. Women's, youth and lower-league competitions require
their own baselines, not men's top-flight thresholds. Provider recording changes
must create a new calibration cohort.

## Edge cases

Abandoned/suspended/resumed/replayed/forfeit matches; postponed kickoff; corrected
goals/cards; own goals; VAR overturns; two yellows vs direct red; red card after
final whistle; unequal legs due award; obsolete away-goals rules; neutral finals;
single-leg extra time; penalty shoot-out not part of match score; aggregate tied
after regulation; stoppage beyond displayed minimum; reduced youth match length;
group mini-table tiebreaks; simultaneous final group matches; dead rubbers with
seeding implications. Never mark abandoned as final until competition authority
publishes disposition—IFAB defaults to replay unless rules/organizer decide otherwise.

## Uncertainty and validation

Emit score/band, coverage, confidence, model/calibration version, source and
timestamps. Suggested confidence: event timeline+compatible xG+context .85;
timeline+shots .70; goals only .45; box score .35; schedule only pre-match.
Renormalize available weights and apply a coverage penalty; missing is not average.

Validate chronological reconstruction, `90+n`, aggregate and shoot-out handling
on corrected fixtures. Use stratified seasons/competitions/stages and hold out
entire competitions/providers. Compare with multi-rater full/condensed/highlights
judgments: rank correlation, top-k precision, calibration, format regret and
inter-rater agreement. Audit critical spoilers per 1,000 protected impressions.
Test subgroup performance by competition familiarity and tactical-vs-goals taste.
Calibration must include full-match, window-level qualitative annotation; highlights
cannot label tactical tension, defensive prevention or rhythm faithfully.
