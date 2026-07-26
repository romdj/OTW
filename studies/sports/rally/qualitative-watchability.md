# Qualitative Rally Watchability

## Corrected-time racing, not road order

Rally position change means a persistent change in stage or cumulative corrected-
time classification after measured time, penalties and official notional-time
updates—not a car passing another on the road. Expected order is a frozen pre-rally
crew/car/surface/start-position distribution and must be recomputed separately for
stage wins, day points, class and overall rally.

Report `correctedTimePressure`, `splitUncertainty`, `classificationChange`,
`routeStrategy`, `upsetRecovery`, `technicalExecution`, `flow`, and `stakes`
separately. Expected-order dominance with broad cumulative gaps is generally low in
uncertainty, but a leader under sustained split pressure or title leverage can be
tense without losing first place. Weather/surface evolution and road order matter
only when comparable cohorts and causal evidence exist. Mechanical failure is
disruption/narrative, not skill. Crashes, injury and danger never add value;
neutralized/cancelled stages reduce continuity even if they alter classification.

## Data grades

- **Final classification (confidence ≤.40):** coarse expected-order deviation and
  final spread only; penalties/notional times must be separated.
- **Stage plus split timing (≤.78):** remaining-distance-normalized win probability,
  alternating stage advantage, split trajectories, corrected-time lead changes,
  penalties, restart and condition cohorts.
- **Telemetry/onboard/route observation (≤.90):** braking/line execution, surface
  evolution, puncture evidence and road-position effects. Never compare splits from
  materially different conditions as equal competition.

Return unit (`STAGE`, `DAY`, `RALLY`), dimension confidence, coverage, correction
status and missingness. Provisional updates replace—not stack with—earlier values.

## MOCK contrasts

- `source=MOCK`: Pine Rally—pre-event favourite wins every stage and leads by two
  minutes with comparable conditions: mastery high, uncertainty low.
- `source=MOCK`: Granite Rally—lower-seeded crew and favourite alternate split
  advantage; 5.2 seconds cover them before the final stage: full day/final stage.
- `source=MOCK`: Moor Rally—localized rain creates a genuine cohort crossover, then
  two stages are neutralized. Conditions branch rises but flow/coverage falls.

## Calibration and spoilers

Full-rally raters annotate each stage/split narrative and day-level continuity,
with at least three raters and separate skill/enjoyment labels. Stratify surface,
category, route order, weather, distance and rule era; hold out rallies/providers.
Audit false drama from notional revisions, incomparable splits and famous crews.

Strict mode reveals only pre-start importance. Hide gaps, order/split changes,
weather realization, failures, neutralizations, event length, dimensions and format.
After reveal, explanations may describe “sustained corrected-time pressure” without
the winner or gap unless authorized. The
[FIA WRC regulations index](https://www.fia.com/regulation/category/704) and
[2026 sporting regulations](https://www.fia.com/system/files/documents/wrc_2026_sr_version_13_january_2026.pdf)
govern classification, running order, notional time, restart and neutralization;
the watchability mapping is an OTW hypothesis requiring full-event annotation.
