# Superbike Watchability Model

## Pre-session importance

```text
importance = .28*championshipLeverage + .20*weekendConsequence
           + .17*personalAffinity + .14*competitiveExpectation
           + .11*eventProminence + .10*context
```

- `weekendConsequence`: Superpole grid effect; Race 1 points; Superpole Race points plus Race 2 grid; Race 2 points.
- `championshipLeverage`: expected title probability change using session-specific points.
- `competitiveExpectation`: pre-session uncertainty/pace convergence with circuit adjustment.

If simulations are unavailable, use a session/round rule table, lower confidence, and avoid clinch claims.

## Post-session models

```text
practice = .30*paceConvergence + .24*improvementPressure + .18*setupUncertainty
         + .14*weekendConsequence + .08*conditions + .06*personalFit

superpole = .31*poleJeopardy + .24*lateImprovement + .18*gridSurprise
          + .13*weekendConsequence + .08*stakes + .06*personalFit

race = .28*battleTension + .20*leadUncertainty + .17*positionVolatility
     + .14*stakes + .09*strategyDivergence + .07*execution + .05*personalFit
```

Use the race model separately for Race 1, Superpole Race and Race 2, calibrated by session type/distance.

**Hypothesis.** Persistent battles plus outcome uncertainty predict replay satisfaction better than crash count, total order changes or finish gap.

## Transparent metrics

```text
proximity = exp(-gapSeconds / circuitBattleScale)
closing = clamp((gap[t-k] - gap[t]) / k, -1, 1)
battleTension = proximity * (0.6 + 0.4*max(0, closing)) * positionLeverage
```

Require consecutive valid samples; exclude pits, flag-affected intervals, timing corrections and lapping ambiguity.

```text
paceConvergence = 1 - normalizedMAD(representativeCleanLapPace)
gridSurprise_r = abs(actualGridPercentile - expectedGridPercentile)
```

Representative pace requires minimum clean laps under comparable tyre/condition windows.

Revealed-only:

```text
recoveryMagnitude = max(0, worstPersistentPosition - finishPosition) / fieldSize
upsetMagnitude = max(0, .5 - preSessionWinnerProbability) * 2
```

Crashes and injuries never add neutral quality. Recovery may add narrative fit without rewarding the incident.

## Confidence

- `HIGH`: reconciled high-frequency timing, grid derivation, flags/pits and official final.
- `MEDIUM`: lap order/gaps plus classification; incomplete tyres/sectors.
- `LOW`: final result/grid only, provisional penalty, replacement baseline missing.
- `NONE`: cancelled/no valid classification or contradictory identity/result.

Record cohort, method, coverage, model version and uncertainty per factor. Renormalize only with ≥65% weight observed. Compare within `sessionType × circuit × era/ruleset`; do not calibrate Superpole Race against full races.

## Viewing format

- Full replay: sustained battle/jeopardy plus affinity/stakes and budget.
- Condensed: meaningful phases separated by low-action laps.
- Highlights: concentrated grid attempts/battles or moderate relevance.
- Recap: weekend/title context but insufficient replay evidence.
- Skip: low relevance and observed band; never silently skip followed riders.

Strict completed mode uses pre-session inputs (`blind=true`) and cannot leak restarts, wet changes, crashes, shortened distance, grid outcome or duration.

## Validation

1. Stratify by session type, circuit, weather, era/rules, championship stage, field and timing completeness.
2. Experts label jeopardy, battle persistence, strategy, execution and stakes; viewers separately label satisfaction and format.
3. Measure ordinal agreement, calibration, top-k follow-through and format accuracy.
4. Audit factory/independent, manufacturer, prominent/less-known riders, replacements, weather and data-rich/poor errors.
5. Ablate classification, laps, intervals, tyres/flags and personalization.
6. Spoiler regression-test classification, grid dependencies, flags/incidents, thumbnails, URLs, accessible text, analytics and later-session navigation.

Initial Must Watch ≥ cohort p85, Worth ≥ p60 and Highlights ≥ p35 thresholds are versioned hypotheses.
