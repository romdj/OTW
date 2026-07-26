# Watchability and Importance Model

## Separate the questions

**Recommendation:** never blend anticipated importance and observed
watchability before storing them.

`priority_user = pregame_importance * 0.35 + postgame_watchability * 0.45 + personal_relevance * 0.20`

Weights are product hypotheses. For upcoming games, omit postgame watchability
and renormalize. For Blind mode, rank primarily on pregame importance and user
affinity because a postgame-derived rank is itself a spoiler.

## Pregame importance (0–100)

`I = 30*stage + 25*qualification_leverage + 15*series_leverage + 10*rivalry + 10*team_quality + 10*rarity`

Each input is 0–1. `stage` maps regular season/group, playoff, elimination,
medal/final using competition-specific configuration. `qualification_leverage`
is the absolute change in qualify/seed probability across plausible outcomes.
`series_leverage` uses pregame series state. Official published scenarios beat
simulation; label simulations `HYPOTHETICAL`, include model/version/snapshot,
and never overwrite official standings.

## Postgame watchability (0–100)

When event-level data exists:

`W = 100 * (0.27*suspense + 0.18*volatility + 0.14*pressure + 0.10*specialTeams + 0.10*goaltending + 0.09*pace + 0.07*physicality + 0.05*significance)`

**Inference:** close final score and OT are lossy outcome labels. Suspense should
measure the path, while OT/SO is a structural feature within that path—not an
automatic bonus. A dominant performance may still rate highly for users who
prefer excellence, but not via suspense.

### Suggested formulas

- `suspense = mean(4*p_t*(1-p_t)*leverage_t)` over regulation/OT, where `p_t`
  is home win probability. `leverage_t` rises late and in sudden death.
- `volatility = min(1, sum(min(abs(Δp), .35)) / 2.0)`. Cap single events so a
  correction or shootout encoding cannot dominate.
- Without WP: use `(tiedSeconds + .65*oneGoalSeconds + .25*twoGoalSeconds) /
  playedSeconds`, plus late-tie/go-ahead indicators. Mark `PROXY`.
- `pressure = mean(top rolling 5-minute xG/attempt imbalance windows)`; score
  both teams' dangerous surges, not just total shots.
- `goaltending = sigmoid(abs(GSAx_home)+abs(GSAx_away))`, adjusted for shot
  quality/sample. With only saves, use competition-season z-score and cap 0.6.
- `pace = robust_z(events per 60)` by competition/season. Do not compare raw NHL
  hit counts to IIHF if recording practice differs.

Score effects matter: leading teams often trade offence for clock/territory.
Normalize pressure by score state and period; do not equate a trailing team's
late shot volume with balanced end-to-end quality.

## Viewing format

- **Full replay:** high sustained suspense/pressure, tactical or goalie-duel
  preference, high personal/stakes score, and enough time.
- **Condensed (15–30 min):** high volatility/key sequences but modest sustained
  play, or time budget below full length.
- **Highlights (5–12 min):** isolated high-leverage events, milestones, or
  lopsided path with notable plays.
- **Skip/recap:** low importance, low watchability and low personal relevance.

Return format, confidence, estimated minutes, and 2–3 reason codes. Availability
and replay length come from rights/catalog data, never guessed. In protected
mode reason codes must be pregame-safe.

## Edge cases

Postponed/abandoned games; forfeits and awarded scores; delayed/corrected plays;
neutral venues; empty-net goals inflating margin; shootout's single standings
goal; own goals/credited scorers; goalie change without pull; simultaneous
penalties; delayed penalties; major penalties that survive a goal; IIHF stage
format changes; continuous playoff overtime; series-clinching game; group
three-way tiebreak mini-tables; eliminated PWHL teams under Gold Plan; missing
or duplicated event IDs. Compute from regulation score before shootout when
measuring scoring margin.

## Uncertainty and validation

Emit `score`, `band`, `coverage`, `confidence`, input timestamps and model
version. Suggested confidence: event PBP+shots+context ≥.85; goals+shots .65;
box score .40; schedule only is pregame-only. Never impute a missing factor as
average and report high confidence; renormalize available weights and apply a
coverage penalty.

Validate on stratified NHL/PWHL/IIHF seasons and stages. Freeze corrected event
fixtures; test rule profiles, chronological score reconstruction, shootout
scoring, goalie pulls and missingness. Obtain blinded fan full-vs-condensed-vs-
highlights judgments; measure rank correlation, calibration, top-k precision,
format regret, subgroup performance and spoiler incidents. Hold out entire
competitions/seasons to detect provider and rule leakage. Human editorial labels
are noisy: use multiple raters and report agreement.
