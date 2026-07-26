# Qualitative Watchability Beyond the Box Score

## Principle and limits

**Recommendation:** describe *what kind of match occurred* before estimating
whether a viewer will enjoy it. Possession, goals, shots and xG are useful but
insufficient alone:

- possession measures control time, not attacking intent or progress;
- goals are rare outcomes and can hide an absorbing scoreless contest;
- shots mix speculative attempts with well-developed chances;
- xG values shot locations/contexts, but omits dangerous moves that never become
  shots, defensive prevention, off-ball movement and much individual execution.

A 0-0 or 1-1 can therefore be excellent: repeated line-breaking transitions,
goal-saving interventions, evolving tactical adaptations and unresolved stakes can
persist for 90 minutes. Conversely, 70% possession can be sterile when circulation
is slow, lateral, far from goal and never disrupts the defensive block.

## Descriptive dimensions

Keep these 0-1 dimensions separate and display uncertainty; do not collapse them
into a culturally loaded label such as “beautiful football.”

| Dimension | Observable question | Important counterexample |
|---|---|---|
| Attacking intent | Does possession seek valuable space or merely retain the ball? | Direct play is not inherently ambitious; patient circulation may create an opening. |
| Progression and chance development | Are lines broken and possessions increasing threat before shots? | High xG from one penalty is not sustained creation. |
| Transitions and turnovers | Do changes of possession create open, consequential phases? | Many turnovers may reflect poor technique rather than exciting transition play. |
| Press/counterpress | Is pressure coordinated, timely and capable of forcing/recovering? | PPDA alone confuses opponent passing style and game state with press quality. |
| Tempo and rhythm | Are meaningful actions dense, with useful variation and accelerations? | Constant speed can be frantic but monotonous; pauses can build tension. |
| Tactical tension | Are teams posing and solving spatial problems under uncertainty? | A compact 0-0 can be elite; identical low event counts can also mean mutual inertia. |
| Defensive quality | Are chances prevented through positioning, cover and recovery? | Few shots can indicate great defending or weak attacking; video/context distinguishes them. |
| Skill and expression | Do difficult actions create or deny advantage? | Flourishes without consequence must not dominate the rating. |
| Competitive uncertainty | Are match or qualification outcomes plausibly live over time? | A close final score may conceal 89 minutes of one-way control. |
| Narrative stakes | Do verified competition/player contexts make phases consequential? | Prestige, crowd size and famous teams are not intrinsic quality. |

Report both teams' contributions. Preserve stylistic descriptors—patient/direct,
high/deep block, positional/fluid, controlled/chaotic—as neutral axes. Normalize by
competition, season, match state and data provider; audit by gender, region, level
and rater familiarity. Let users weight dimensions (for example tactical control
versus transitions) instead of defining one style as universal taste.

## Observable proxies by data grade

### Grade A — box score only

Use possession, shots/on-target, corners, saves, fouls/cards, score path if present,
and effective playing time. Derive balance, shot exchange, save involvement and
late-state uncertainty. At most infer `attackingActivity`, never pressing quality,
spatial progression, defensive excellence or skill. Sterility may be flagged only
as `POSSIBLE` (high possession share with low shot/on-target output). Confidence
ceiling: **0.45**.

### Grade B — event stream

Use timestamped, located passes/carries/duels/pressures/recoveries, possession IDs,
qualifiers and compatible xG/action-value models. Derive:

- forward and line-breaking progression; box entries; deep completions; possession
  value added; threat created before a shot;
- turnover-to-entry/shot time, transition distance and value swing;
- high regains, recovery within 5/8 seconds of loss, pressure success and bypass;
- meaningful actions per effective minute, spell duration, accelerations and
  alternation between sustained pressure and release;
- development chains, difficult completion under pressure, saves/blocks and
  last-defender interventions.

Provider “pressure” semantics differ, and events do not observe unrecorded runs or
space denied. Confidence ceiling: **0.75**.

### Grade C — synchronized tracking plus events

Add player/ball coordinates, velocity and orientation. Derive pitch-control and
passing-option value, team width/depth/compactness, defensive-line displacement,
space gained, off-ball runs, overloads, pressure arrival time, counterpress shape,
recovery sprint, escape difficulty and prevented options. This can distinguish a
quietly dominant defence from harmless attack and patient manipulation from sterile
circulation. Tracking quality, identity alignment and occlusion must be validated;
confidence ceiling: **0.90**, never 1.0.

## Scoring without erasing meaning

Emit the dimension vector first. A configurable summary is secondary:

`Q = 100 * Σ(userWeight_d * dimension_d * reliability_d) / Σ(userWeight_d * reliability_d)`

Keep competitive uncertainty and verified stakes in the existing watchability
model; do not double-count them inside every qualitative dimension. Return
`dataGrade`, per-dimension confidence, coverage, provider/model versions and an
interval. Missing is unknown, not zero or average. Do not compare Grade A's broad
proxy directly with Grade C's tactical inference; use grade-specific calibration.

### Anti-gaming safeguards

- use possession value *change*, not raw completion or territory counts;
- require progression to survive opponent/game-state baselines and possession-time
  denominators;
- cap repeated low-value shots, turnovers, fouls and duplicate pressure events;
- distinguish forced from unforced losses and successful from bypassed pressure;
- credit both chance creation and prevention, but never reward dangerous conduct;
- reconstruct corrections/VAR before feature computation and detect provider drift;
- require multiple signals before claiming tactical quality or skill.

## Full-match annotation and calibration

1. Sample full matches across competitions, genders, tiers, regions, scorelines and
   styles; oversample 0-0/1-1, lopsided possession and provider edge cases.
2. Blind trained analysts to aggregate statistics and final score where practical.
   Annotate five-minute windows, then the full match, on each dimension—not “good
   football”—with timestamps and short evidence codes.
3. Use at least three raters from varied football cultures and preference profiles.
   Train on a shared rubric; measure weighted agreement and adjudicate disagreements.
4. Fit grade-specific models using competition/provider-held-out folds. Calibrate
   dimension probabilities/intervals, not only the final rank.
5. Evaluate rank correlation, top-k replay precision, false excitement on sterile
   dominance, recall of high-quality low-scoring matches and subgroup error.
6. Recalibrate on new seasons/provider changes; publish model cards and allow user
   feedback only after viewing so popularity and spoilers do not become labels.

## Spoiler-safe explanations

Before reveal, explanations may use only pre-match importance and preferences:
“high qualification leverage” or “fits your tactical-match preference.” Never expose
post-match score shape, tempo, transitions, chances, cards, duration, dimension
scores, confidence changes or recommended replay length. `COMPLETED_PROTECTED` may
say only that a replay is available. After explicit reveal, use neutral evidence:
“frequent high-value transitions” or “elite compact defending limited available
passing lanes”; avoid goals, winner or exact timing unless the user's spoiler level
permits them. Analytics IDs, cache keys and accessibility labels must also be sealed.

## Evidence base

- **Evidence:** [IFAB Laws 7, 10 and 11](https://www.theifab.com/laws/latest/)
  establish playing time, outcome and offside constraints; model possession and
  space within the actual laws rather than treating vendor events as the game.
- **Evidence:** Decroos et al., [*Actions Speak Louder than Goals*](https://arxiv.org/abs/1802.07127),
  introduce context-aware values for on-ball actions because shots/goals omit most
  contributions.
- **Evidence:** Fernández, Bornn and Cervone, [instantaneous EPV](https://arxiv.org/abs/2011.09426),
  model observed and potential actions from spatiotemporal data, supporting pitch
  control and option-value proxies.
- **Evidence:** Bauer and Anzer, [counterpressing detection](https://doi.org/10.1007/s10618-021-00763-7),
  use synchronized event/tracking data and expert-derived labels, illustrating why
  counterpress cannot be recovered reliably from totals.
- **Evidence:** Forcher et al., [defensive pressure characteristics](https://doi.org/10.1080/24733938.2022.2158213),
  analyze successful defensive phases with tracking data, supporting explicit
  treatment of defensive quality.

These works measure football actions, not entertainment. Mapping their constructs
to watchability is an **OTW hypothesis** that requires the annotation protocol above.
