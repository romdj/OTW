# Qualitative Racing Watchability

## What the classification misses

Pole-to-flag running in expected performance order is generally low in uncertainty
and state change, even when technically excellent. Raw overtakes also mislead:
pit-cycle swaps, lapping and DRS-assisted completion do not equal a sustained
battle. Describe the race first on independent axes: `competitiveUncertainty`,
`battlePressure`, `meaningfulStateChange`, `strategyBranching`, `upsetRecovery`,
`execution`, `flow`, and `stakes`. A final user-weighted score is secondary.

Close pressure, tyre-offset convergence or title leverage can make an unchanged
leader tense. A surprise winner after rivals retire is an upset but not necessarily
a high-skill contest. Mechanical failure is disruption/narrative, never execution;
crash, injury and danger contribute **zero** entertainment value. Safety Cars, VSCs,
red flags and rain score only their competitive effect. Repeated stoppages incur a
flow penalty, and artificial bunching is not organic closeness.

## Data grades and features

- **Classification (confidence ≤.40):** grid/final order, status, laps and gaps.
  Estimate persistent net gains, expected-order deviation and finish uncertainty
  only as coarse proxies; cannot claim battles or strategy.
- **Lap/timing (≤.75):** stable lap order/gaps, sectors, pits, tyres, weather,
  race-control and penalties. Detect attack windows, closing pressure, persistent
  on-track changes, undercut/overcut branches, reliability shocks and neutralized
  time. Tag every change by cause and discount reversals inside a pit cycle.
- **Telemetry/video/steward-complete (≤.90):** car traces, tyre estimates, GPS/video
  and finalized decisions support defensive execution, alternative-line pressure,
  traffic cost and causal attribution. Missing tyre life or hidden damage remains
  uncertainty, not average performance.

`expectedOrder` must be a frozen pre-start probability distribution conditioned on
car/driver form, circuit, grid and known penalties—not team fame or hindsight.
Report expected-order surprise separately from the race-shape dimensions.

## Counterexamples and MOCK contrasts

- `source=MOCK`: Meridian GP—pole sitter leads every lap by 14–20 s, order matches
  forecast, one routine stop. High execution, low uncertainty/change: highlights.
- `source=MOCK`: Foundry GP—underdog stays in a three-car fight; two viable tyre
  branches converge late without contact. High pressure/strategy/upset potential:
  full replay even if the lead changes once.
- `source=MOCK`: Coastal GP—four stoppages repeatedly reset gaps. High disruption
  but low flow; do not infer quality from restart or overtake counts.

The [official 2021 Abu Dhabi classification](https://www.fia.com/events/fia-formula-one-world-championship/season-2021/abu-dhabi-grand-prix/race-classification)
and [FIA championship table](https://www.fia.com/events/fia-formula-one-world-championship/season-2021/2021-classifications)
provide a real counterexample: two title contenders entered the decider level on
points and the title remained outcome-sensitive to the final lap, so stakes and
suspense were maximal despite long periods led by one car. The FIA's
[executive summary](https://www.fia.com/sites/default/files/2021_f1_abu_dhabi_grand_prix_-_report_to_the_wmsc_-_19_march_2022.pdf)
documents the Safety Car procedure and subsequent analysis. OTW must not treat the
crash that triggered it or controversial officiating as positive; those are neutral
causal disclosures after reveal, separate from the measured title uncertainty.

## Calibration and spoilers

Three or more raters watch full races and annotate five-lap windows plus whole-race
axes, stoppage frustration, best format and evidence timestamps. Stratify by era,
circuit, weather, dominance, title leverage and feed grade; hold out seasons and
raters. Test false positives from pit cycles, restarts and attrition, and false
negatives from pressure without passes. Publish per-axis confidence/coverage and
calibrated intervals; missing critical timing suppresses the final band.

Before reveal, expose only pre-race importance and preference fit. Never reveal
changes, flags, weather evolution, failures, duration, finish surprise, dimensions
or format. After reveal, say “sustained close pressure” or “divergent strategies
converged”; name results/incidents only at the user's outcome-detail level. Feature
IDs, thumbnails, URLs and analytics must obey the same boundary. Rules semantics
come from the versioned [FIA F1 regulations](https://www.fia.com/regulations/sporting-regulations/formula-1);
all watchability mappings are OTW hypotheses requiring the full-race study above.
