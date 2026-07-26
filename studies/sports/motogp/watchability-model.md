# MotoGP Watchability Model

## Pre-session importance

```text
importance = .30*championshipLeverage + .18*sessionConsequence
           + .17*personalAffinity + .14*competitiveExpectation
           + .11*eventProminence + .10*context
```

- `championshipLeverage`: expected title probability change, including session-specific points.
- `sessionConsequence`: Practice→Q2, Q1→Q2, qualifying→grid, or race points.
- `competitiveExpectation`: uncertainty/convergence from pre-session strength and circuit fit.
- `context`: verified home/return/rivalry/weather factors.

If championship simulation is unavailable, use a round/session rule table, lower confidence, and avoid clinch claims.

## Session-specific post-session models

```text
practice = .28*cutLineJeopardy + .22*paceConvergence + .18*lateImprovement
         + .14*sessionConsequence + .10*conditionChange + .08*personalFit

qualifying = .30*cutLineJeopardy + .24*poleUncertainty + .18*lateImprovement
           + .12*gridSurprise + .10*stakes + .06*personalFit

sprintOrRace = .27*battleTension + .20*leadUncertainty + .17*positionVolatility
             + .13*stakes + .10*strategyDivergence + .07*execution
             + .06*personalFit
```

**Hypothesis.** Persistent close battles and late outcome uncertainty predict satisfaction better than raw position changes, crash count or winner margin.

## Transparent metrics

For a tracked battle between riders `a,b`:

```text
proximity = exp(-max(0, gapSeconds) / circuitBattleScale)
closing = clamp((gap[t-k] - gap[t]) / k, -1, 1)
battleTension = proximity * (0.6 + 0.4*max(0, closing)) * outcomeLeverage
```

Require consecutive valid samples and exclude pit transitions, yellow/red conditions, timing corrections and lapped-rider ambiguity.

```text
paceConvergence = 1 - normalizedMAD(representativeCleanLapPace)
gridSurprise_r = abs(actualGridPercentile - expectedGridPercentile)
```

Representative pace needs clean laps, consistent condition/tyre windows and minimum samples. Otherwise unavailable.

Revealed-only:

```text
recoveryMagnitude = max(0, worstPersistentPosition - finishPosition) / fieldSize
upsetMagnitude = max(0, .5 - preSessionWinnerProbability) * 2
```

Do not reward crashes. A recovery can add narrative fit, but incident severity never increases the neutral score.

## Confidence

- `HIGH`: reconciled high-frequency timing, official final classification, flags/pits and known rules.
- `MEDIUM`: lap classifications/gaps and incidents, incomplete tyre/sector detail.
- `LOW`: final classification/grid only, uncertain penalty finality, substitute baseline absent.
- `NONE`: cancelled/no classification, contradictory entrant/results.

Each factor records cohort, method, coverage, model version, and uncertainty. Renormalize only with ≥65% of session model weight; otherwise no overall band. Calibrate by `sessionType × circuit × era/ruleset`, with Sprint-era comparisons beginning only when formats are comparable.

## Viewing format

- Full replay: sustained battles/jeopardy, high affinity/stakes, adequate budget.
- Condensed: meaningful phases separated by low-action running.
- Highlights: concentrated decisive attempts/battles or moderate affinity.
- Recap: championship/context relevance without sufficient timing confidence.
- Skip: low relevance and observed band; never silently skip a followed rider.

Strict hidden mode uses pre-session inputs only (`blind=true`). It must not reveal red flags, shortened distance, crashes, weather shifts or event duration through format/copy.

## Validation

1. Stratify by session, circuit, dry/mixed/wet, Sprint era, championship stage, field size and timing completeness.
2. Experts label qualifying jeopardy, battle persistence, strategy, execution and stakes; viewers label satisfaction and preferred format separately.
3. Measure ordinal agreement, calibration, top-k follow-through and format accuracy.
4. Audit factory/independent teams, prominent/less-known riders, substitute/wildcard, wet/dry and data-rich/poor errors.
5. Ablate classification-only, laps, intervals, tyres/flags and personalization.
6. Regression-test spoilers across classification, grid, flags, incidents, thumbnails, accessible labels, URLs, analytics and next-session navigation.

Initial Must Watch ≥ cohort p85, Worth ≥ p60 and Highlights ≥ p35 thresholds are versioned hypotheses.
