# Formula 1 Watchability Model

## Separate predictions from observations

OTW needs two outputs:

- **Pre-session importance** uses only information available at `scheduledStart`. It may appear in strict spoiler mode.
- **Post-session watchability** uses observed session shape and is protected. It estimates viewer reward, not sporting merit.

Never train or calculate either with information from the wrong temporal side of the boundary. Preserve `featureAsOf`, `rulesetRevision`, `coverage`, and `modelVersion`.

## Proposed features

All values are normalized to `[0,1]`. The definitions below are recommendations, not FIA facts.

### Pre-session importance

`I = 0.35C + 0.20P + 0.15R + 0.15U + 0.15A`

- `C`, championship leverage: expected standings/title consequence across plausible outcomes.
- `P`, personal relevance: explicit affinity and established user narratives.
- `R`, session relevance: race > qualifying/Sprint > Sprint qualifying > practice by default, user-adjustable.
- `U`, pre-start uncertainty: closeness of pace estimates, forecast variability, penalties, limited practice.
- `A`, arc relevance: regulation debut, return, milestone, or unresolved rivalry; evidence-dated.

**Title leverage.** Simulate legal points outcomes under the stored ruleset. A defensible simple proxy is the fraction of plausible outcomes that change championship leader, elimination state, or materially change normalized gap. Mathematical eligibility alone is binary and overstates distant contenders.

### Post-session watchability

`W_raw = 0.22T + 0.16V + 0.16S + 0.12J + 0.12D + 0.10X + 0.07Q + 0.05N`

- `T`, tension: closeness sustained among positions relevant to the viewer, weighted late but not exclusively.
- `V`, meaningful volatility: unexpected changes after removing routine pit-cycle artifacts.
- `S`, strategy: viable approach divergence, convergence, undercut/overcut pressure, tyre uncertainty.
- `J`, jeopardy: credible risk of losing a meaningful position or failing a qualifying cut.
- `D`, drama impact: weather, flags, incidents, reliability, or penalties weighted by competitive effect—not count.
- `X`, execution: high-quality laps, defence, passes, pit work, and recovery relative to credible baseline.
- `Q`, consequence: realized championship/season narrative significance, protected after completion.
- `N`, novelty: rare but verifiable conditions or achievement, era-adjusted.

Apply a data-quality shrinkage rather than multiplying by coverage to zero:

`W = confidence * W_raw + (1 - confidence) * sessionTypePrior`

This makes uncertainty explicit and prevents sparse feeds from looking dull. Show a public band only after calibration: `exceptional`, `strong`, `selective`, `recap`, with no numeric score by default.

## Operational definitions

### Tension

For each timed sample, identify battle groups whose interval is within a session/era-adjusted attack threshold. Weight track position, user relevance, remaining distance, tyre offset, and whether overtaking is operationally plausible. Integrate over competitive time. Do not call Safety Car bunching organic closeness until racing resumes.

### Volatility

Calculate weighted position changes between stable checkpoints. Discount pit-cycle swaps that reverse after stop cycles; separate passes, pit gains, penalties, retirements, and neutralization resets. Report both observed and attributable coverage.

### Strategy divergence

At checkpoint `t`, compute diversity of plausible tyre/stop states among competitive cars (normalized entropy), then multiply by probability that strategies converge on track. Compound diversity without competitive interaction is not automatically watchable.

### Qualifying jeopardy

For each segment, combine distance to cut line, remaining attempts, track evolution, lap validity risk, and probability of elimination. Integrate over time. A late red flag is high impact only when it changes credible attempts.

### Practice information gain

Compare uncertainty distributions before and after practice for pace order, tyre degradation, and reliability. This requires estimates; expose low confidence because fuel and programmes are hidden. Technical viewers may weight it highly, casual viewers near zero.

## Session weights

| Session | Emphasize | Downweight |
|---|---|---|
| FP1/FP2/FP3 | information gain, rookie/debut, representative long runs, changing conditions, reliability | raw classification, isolated fastest lap |
| Sprint Qualifying | cut-line jeopardy, track evolution, lap execution, surprise | long-run strategy |
| Qualifying | pole/front-grid contest, all cut lines, late attempts, penalties | championship consequence if grid is later altered |
| Sprint | immediate tension, passes, position change, points consequence | deep multi-stop strategy expectation |
| Race | sustained tension, strategy, execution, incidents, consequence | incident counts without effect |

## Personalization and viewing format

Personalized utility should reweight feature contributions, not rewrite observed facts:

`U_user = W + affinityLift + tasteMatch - knownResultPenalty - accessPenalty`

Cap affinity lift so a followed driver does not turn an uneventful session into an “exceptional” claim. Explain the largest faithful contributions, e.g. “fits your strategy preference” and “important for a followed constructor.”

Provisional format policy:

| Conditions | Recommendation |
|---|---|
| High sustained tension/strategy; adequate time and replay | Full |
| Strong peaks but long low-information periods | Condensed |
| Few localized decisive/high-skill passages | Highlights |
| Context matters, observed action weak or data confidence low | Recap |
| Low personal utility and scarce time | Skip |

Format is constrained by actual products and territory. Estimated viewing minutes must be marked approximate and kept hidden if actual session duration leaks structure.

## Uncertainty

Each feature returns `{value, confidence, coverage, reasons, missingInputs}`. Overall confidence combines temporal coverage, entrant coverage, feed consistency, and attribution certainty. It is not the mean of feature confidences: critical missing timing may cap the result. Use language such as “limited timing data” and avoid a band when confidence is below a calibrated threshold.

## Validation strategy

1. Build a stratified historical sample across sessions, circuits, wet/dry conditions, eras, dominant/close seasons, and interrupted events.
2. Have knowledgeable and casual viewers independently rate full-replay value, best format, traits, and spoiler severity—without revealing engineered scores.
3. Measure rank correlation and calibration by session type; measure top-k precision for “full/condensed.” Inter-rater agreement sets the practical ceiling.
4. Compare against baselines: session type only, prestige only, lead changes, overtakes, and editorial rating.
5. Run ablations for timing, strategy, incidents, and championship context. Test whether personalization improves held-out individual choices over universal ranking.
6. Audit false positives (“many passes, little tension”) and false negatives (“few passes, sustained strategic uncertainty”).
7. Validate across rules eras and re-calibrate, never silently pool them.
8. Conduct a spoiler audit per field/surface. Target critical incidents per 1,000 protected impressions and zero outcome fields in safe DOM/network payloads.

MVP success should focus on choice utility: recommendation-follow rate, “format was right,” regret, week-four use, and spoiler incidents—not only agreement with expert scores.
