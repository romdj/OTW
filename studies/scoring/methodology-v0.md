# Qualitative Watchability Score Methodology v0

## 1. Purpose and product contract

The Event Watchability Score estimates how strongly a completed event exhibited broadly observable qualities that can make it rewarding to watch. It is a historical reference, not a prediction of universal enjoyment.

It does **not** answer:

- whether a particular user will like the event;
- whether they should watch a replay or highlights;
- whether an event, participant, sport, or style is intrinsically superior;
- who won or how the event unfolded.

Those distinctions should remain visible in the data model and product language. Exact scores and post-event dimensions belong only in a spoiler mode that permits them.

## 2. Design requirements

The v0 aggregator must:

1. Reward several independent strong qualities.
2. Avoid dilution from attributes that are irrelevant or simply absent.
3. Prevent one noisy high attribute from producing an elite score.
4. Keep missing evidence distinct from evidence of absence.
5. Support different sport-specific signals beneath a shared semantic profile.
6. Be inspectable, reproducible, and versioned.
7. Remain calibratable against viewers’ felt experience.

The model is intentionally a **positive-quality magnitude model**. A low “comeback” value is not a negative quality and must not be averaged into an event that was tactically outstanding. Genuine negative experiences—long non-competitive dead time, severe interruption, or incomplete events—belong in explicit deductions or completion rules, not as hundreds of zero-valued tags.

## 3. Taxonomy

### Shared dimensions

| Dimension | Question | Example positive tags | Must not mean |
|---|---|---|---|
| Competitive uncertainty | Was the meaningful outcome unresolved? | sustained uncertainty, credible alternatives, late pressure | merely a close final score |
| Volatility | Did control, threat, or strategic advantage shift? | momentum shifts, changing advantage, recovery pressure | only scoring changes |
| Tactical/strategic richness | Did choices, adaptations, and constraints reward attention? | contrasting approaches, adaptation, resource trade-off | complexity for its own sake |
| Execution/mastery | Was exceptional skill or control demonstrated? | precision, defensive mastery, technical consistency | winner worship or dominance alone |
| Intensity/tempo | Was meaningful pressure or action sustained? | transition threat, attacking intent, sustained pressure | raw speed, score count, or violence |
| Stakes/context | Did the event carry meaningful pre-existing consequence? | elimination stakes, title implications, rivalry context | popularity or broadcast prominence |
| Historical/narrative significance | Did verified context make it unusually memorable? | record context, milestone, exceptional rarity | social-media buzz by itself |

The shared taxonomy allows a common explanation vocabulary. Each sport owns its signal definitions and baselines.

### Sport-specific tag examples

**F1**

- Uncertainty: modeled competitive outcome uncertainty across meaningful race phases.
- Volatility: material changes in strategic advantage, not merely position changes caused by pit cycles.
- Strategy: tyre/resource trade-offs, viable alternative strategies, adaptation to changing constraints.
- Mastery: sustained pace or defensive/race-management execution relative to context.
- Intensity: credible on-track or strategic pressure.

**Tennis**

- Uncertainty: point/game/set state assessed with pre-point win probability, not set count alone.
- Volatility: meaningful changes in leverage and control.
- Tactics: contrasting patterns, serve/return adaptation, court-position changes.
- Mastery: shot tolerance, serving/returning quality, defensive or attacking execution relative to surface.
- Intensity: sustained high-leverage exchanges, not match length.

**NHL**

- Uncertainty: game-state uncertainty using time and score context.
- Volatility: changes in threat/control, not goals alone.
- Tactics: matchup adaptation, forecheck/neutral-zone structure, special-teams strategy.
- Mastery: goaltending, defensive suppression, finishing, puck management relative to chance quality.
- Intensity: sustained transition threat or territorial pressure, not hit count alone.

### Tag record

Each tag observation must include:

```text
tag_id, taxonomy_version, dimension_id, sport_definition_version
raw_value, normalized_value, direction, applicability
evidence_source_ids, evidence_quality, confidence
time_scope, actor_scope, spoiler_class, generated_at
```

`applicability` is `active`, `inactive`, `not_applicable`, or `unknown`. Only `active` positive-quality tags can contribute. `inactive` is observed absence; `unknown` is missing evidence. Neither is silently converted to zero.

## 4. Aggregation alternatives

Assume normalized active dimension scores `d_j` in `[0,100]`.

### Arithmetic mean

`mean(d)` is easy to explain but punishes events merely because many taxonomy dimensions are inactive. A 95 tactical masterclass becomes mediocre when averaged with six irrelevant zeros. Reject as the primary aggregator.

### Euclidean/RMS magnitude

`RMS = sqrt(sum(d_j²) / n)` emphasizes strong dimensions. If `n` is the full taxonomy it still dilutes through irrelevant zeros; if `n` is active dimensions, one 100 becomes 100. Raw Euclidean norm also grows with the number of tags and makes taxonomy expansion alter old scores. Useful intuition, unsafe alone.

### Generalized/power mean

`M_p = (sum(w_j d_j^p) / sum(w_j))^(1/p)` interpolates between arithmetic mean (`p=1`), RMS (`p=2`), and maximum (`p→∞`). A moderate `p` rewards peaks without becoming max-only. It is the best transparent base family if active-set selection and evidence safeguards are explicit.

### Top-k and rank-weighted aggregation

Using only the strongest `k` dimensions prevents taxonomy size and irrelevant attributes from diluting a score. It also risks ignoring genuine breadth and creates threshold discontinuities. Rank weights and a small `k` make the behavior stable enough for v0; publish selected dimensions in the explanation.

### Softmax/log-sum-exp

Softmax provides a differentiable “soft maximum,” but temperature is unintuitive and high values can dominate quickly. It is useful for later learned ranking, not ideal for an auditable historical score.

### Complement/noisy-OR

`1 - product(1 - q_j)` models “at least one compelling reason.” It avoids dilution but saturates rapidly as tags accumulate and assumes a probabilistic independence the qualities do not have. It can reward tag proliferation.

### Geometric mean

`product(d_j)^(1/n)` rewards balance and strongly penalizes any low dimension. That contradicts the premise that a tactical masterclass can be compelling without volatility. Reject for the event score; it may suit a future “all-rounder” badge.

### Maximum

`max(d)` perfectly avoids dilution and perfectly exposes the model to one noisy signal. Reject.

### Interaction bonuses and caps

Interactions can represent experiences greater than their parts—high uncertainty plus high stakes, or tactical richness plus mastery. Unbounded bonuses invite double counting because source signals are often correlated. Use only pre-registered interactions, require independent evidence, and cap their total contribution.

## 5. Recommended v0 formula

### Step A: normalize raw signals

For each sport-specific raw signal, calculate a percentile or calibrated monotonic transform against a suitable reference cohort:

```text
same sport + competition class + format + era/season window
```

Map to `[0,100]`, winsorizing extreme raw inputs at pre-registered bounds. Never normalize F1 overtakes directly against NHL goals or tennis breaks. Freeze normalization tables for a published model version.

### Step B: combine tags within a dimension

Correlated tags must not become independent votes. Group them into evidence families, combine within family first, then combine families using fixed sport-specific weights. A dimension curator records whether the evidence indicates an active quality.

For tag confidence `c_i ∈ [0,1]`, use a conservative effective value:

`x_i* = x_i × sqrt(c_i)`

This reduces a 100-valued tag at 0.49 confidence to 70 rather than treating it as certain. Tags below minimum publishable confidence `0.50` cannot activate a dimension; they remain visible as missing/weak evidence internally.

The dimension value is a weighted mean of effective evidence-family values, not of every raw feature. This prevents providers with more fields from receiving higher scores.

### Step C: select active dimensions

Order active dimension values descending and select at most four. Let the resulting values be `d_1…d_k`, where `1 ≤ k ≤ 4`. `not_applicable`, `unknown`, inactive, and dimensions below the activation threshold do not enter the denominator.

Use rank weights:

`r = [1.00, 0.80, 0.60, 0.40]`

### Step D: calculate robust magnitude

Use power `p = 1.5`:

`M = (sum(r_j × d_j^1.5) / sum(r_j))^(1/1.5)`

This rewards strong dimensions more than an arithmetic mean but is less peak-dominated than RMS.

### Step E: require supporting evidence

A single strong dimension should create a good specialist event, not an automatic all-time classic. Apply:

`S = 0.82 + 0.18 × (1 - exp(-sum((d_j / 65)^2 for j=2…k)))`

`Base = M × S`

With one dimension, `S = 0.82`; independent supporting dimensions gradually restore the full magnitude. Low irrelevant dimensions are absent, so they do not dilute. Low active dimensions add little support and cannot inflate substantially.

### Step F: bounded interactions and deductions

Add only registered bonuses:

- uncertainty × stakes: `0–3`
- tactics × mastery: `0–3`
- volatility × uncertainty: `0–2`

Total interaction bonus is capped at `+6`, even if all qualify. Each requires both dimensions ≥70, confidence ≥0.70, and non-duplicative evidence.

Apply explicit deductions after bonuses, each with an auditable rule:

- materially incomplete/abandoned event: score withheld or special status, not an arbitrary penalty;
- prolonged non-competitive dead time: up to `−8` where sport-valid;
- integrity/data anomaly: score withheld pending review.

Final:

`W = clamp(round(Base + Bonus - Deduction), 0, 100)`

### Evidence caps

- Fewer than two independent evidence families: score capped at 74.
- Only one active dimension: score capped at 82 before deductions.
- Overall evidence confidence below 0.65: provisional score capped at 79.
- Critical feed missing or inconsistent: do not publish an exact score.

These caps are guardrails, not substitutes for calibration.

## 6. Why v0 meets the requirements

- **No irrelevant dilution:** only active positive dimensions enter; taxonomy expansion does not add zeros.
- **No one-tag classic:** evidence families, confidence shrinkage, support factor, and caps constrain a single peak.
- **Multiple paths to excellence:** tension, tactical mastery, volatility, or stakes can combine differently.
- **Transparent:** every selected dimension and interaction can be displayed.
- **Stable:** fixed top-four ranks prevent tag-volume inflation.
- **Calibratable:** `p`, rank weights, activation thresholds, support scale, and caps are explicit parameters.

## 7. Worked conceptual examples

Values below illustrate formula behavior; they are not calibrated claims about real events.

### F1: strategically rich race

Active confidence-adjusted dimensions:

- Strategy 91
- Uncertainty 82
- Volatility 73
- Mastery 68

`M ≈ 81.5`; support `S ≈ 1.00`; base `≈81.2`. Strategy × mastery qualifies for `+2`; uncertainty-related interactions add `+2`. Final illustrative score: **85**.

Interpretation: several qualities support the result. Overtake count alone cannot create it. A race with “overtakes 98” but no independent uncertainty, strategy, or mastery evidence would remain capped and confidence-adjusted.

### Tennis: high-control masterclass

Active dimensions:

- Mastery 96
- Tactical richness 88
- Intensity 62

Uncertainty and volatility are inactive, not zeros. `M ≈ 85.4`; support `S ≈ 0.99`; base `≈84.4`; tactics × mastery adds `+3`. Final illustrative score: **87**.

This can score highly without being close. The method recognizes dominant execution and tactical clarity while preventing the single 96 from becoming a 96 event score.

### NHL: tense, high-transition game

Active dimensions:

- Uncertainty 90
- Intensity 85
- Volatility 78
- Stakes 65

`M ≈ 82.6`; support `S ≈ 1.00`; base `≈82.4`; uncertainty × volatility and uncertainty × stakes add `+3`. Final illustrative score: **85**.

Goals and hits are not direct synonyms for quality. Expected-goal threat, score/time context, territorial shifts, and evidence independence matter.

### Tactical 0–0 principle

A 0–0 match in any low-scoring invasion sport can be an attacking, defensive, or tactical masterclass. Final score supplies almost no sufficient evidence of experience quality.

Illustrative profile:

- Tactical richness 94
- Defensive/execution mastery 91
- Intensity/credible threat 76
- Stakes 70
- Uncertainty 68

It can rate highly because several independent positive qualities are active. Conversely, a 4–3 result with poor execution, isolated scoring events, and long dead periods must not automatically outrank it. The same principle applies to a straight-sets tennis masterclass, an F1 race controlled through complex strategy, or an NHL goaltending duel.

## 8. Evidence confidence and score confidence

Keep these separate:

- **Tag confidence:** reliability of a particular inference.
- **Dimension confidence:** quality and independence of evidence supporting the dimension.
- **Coverage:** expected input families received.
- **Score confidence:** stability of the aggregate under plausible input uncertainty.

Estimate score confidence with perturbation: sample tag values from their uncertainty intervals, recompute `W`, and publish the 10th–90th percentile interval internally. User-facing language should be `Good`, `Developing`, or `Limited` until probability calibration is demonstrated.

Do not multiply final score by overall confidence; that would make “unknown” look like “bad.” Use confidence adjustment at evidence level, publication caps, and separate uncertainty display.

## 9. Lifecycle and versioning

Score states:

1. `pending`: insufficient completed-event evidence.
2. `provisional`: score available; feeds/corrections may still arrive.
3. `reviewed`: automated integrity checks passed.
4. `final`: normalization cohort frozen and correction window closed.
5. `revised`: source correction changed the score, with reason.
6. `recalculated`: result under a newer methodology, stored alongside—not over—the historical version.

Persist:

```text
event_id, score, dimensions, selected_dimensions, active_tags
normalization_version, taxonomy_version, sport_model_version
aggregator_version, source_snapshots, confidence, coverage
state, calculated_at, finalized_at, revision_parent, revision_reason
```

Never silently recalculate old scores after changing weights or taxonomy. Historical lists must declare which score series they use.

## 10. Calibration and validation

### Ground truth is plural

Recruit viewers across sports, expertise, preferred styles, language, geography, gender, and competition familiarity. Collect post-watch dimension ratings before showing OTW’s terms or score. Separate:

- “Did this quality occur?”
- “Did you personally enjoy it?”
- “Was full replay worth the time?”

The first calibrates event dimensions; the second calibrates personal fit; the third validates recommendations.

### Calibration procedure

1. Assemble a stratified event set, including low-scoring tactical contests, dominant masterclasses, chaotic but low-skill events, marquee dull events, and lower-profile competitions.
2. Have trained domain raters label evidence using the taxonomy; measure inter-rater reliability.
3. Gather blind viewer dimension ratings and qualitative accounts.
4. Fit only monotonic normalization transforms and declared v0 parameters on a training set.
5. Freeze parameters and evaluate held-out seasons/events.
6. Compare against arithmetic mean, RMS, max, top-k mean, and popularity baselines.

Primary metrics:

- Dimension rank correlation with independent viewer reports.
- Pairwise ranking agreement: “Which event better exhibited the named qualities?”
- Calibration by score band and confidence band.
- Stability under missing/noisy features.
- Score change after one tag is perturbed or removed.
- Distribution parity and residual error by audited segment.
- Percentage of elite scores supported by ≥3 independent evidence families.

### v0 acceptance gates

- Removing any one non-critical tag changes `W` by ≤8 points for 95% of events.
- A single evidence family cannot produce `W > 74`; a single active dimension cannot produce `W > 82`.
- Adding irrelevant/inactive taxonomy tags changes `W` by exactly zero.
- Held-out pairwise agreement exceeds simple sport-specific baselines by ≥10 percentage points.
- At least 70% of viewers agree that the published dimension profile matches the observed event, while personal enjoyment is analyzed separately.
- No persistent calibration/error gap above 10 percentage points across major audited competition, gender, geography/language, expertise, or style segments.

### Kill or redesign conditions

Reject the v0 aggregator if results are dominated by one data family; top-four selection is unstable near thresholds; sparse-data events systematically score lower rather than less confidently; tactical/mastery events require arbitrary manual bonuses to compete; cross-sport percentiles are mistaken for absolute equivalence; or model dimensions fail to match blind qualitative accounts better than a simple popularity or closeness baseline.

## 11. Later extensions, not v0

- Bayesian dimension estimates with explicit priors and posterior intervals.
- Learned monotonic aggregation constrained by the taxonomy.
- Viewer-segment-specific validation without changing the historical event score.
- Community dimension distributions shown separately from the OTW score.
- Cross-sport percentile views after within-sport calibration is trustworthy.
- A “balanced all-rounder” badge using a geometric mean, separate from watchability.

Do not blend community ratings, personal preferences, replay availability, or time budget into the Event Watchability Score. They belong in distinct downstream products.
