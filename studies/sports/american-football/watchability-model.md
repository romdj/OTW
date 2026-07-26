# American Football Watchability Model

## Separate importance from observed quality

### Pre-game importance

Normalize features inside NFL/NCAA competition cohorts:

```text
importance = .28*postseasonLeverage + .20*teamStrength
           + .16*personalAffinity + .14*matchupBalance
           + .12*rivalryContext + .10*scheduleProminence
```

- `postseasonLeverage`: modeled change in qualification/seed/title probability, or rule-table stage value.
- `teamStrength`: opponent-adjusted pre-game estimate; NCAA ranking authority must be explicit.
- `matchupBalance`: uncertainty near 50%, not record similarity.
- `rivalryContext`: curated provenance and user relevance; never inferred from team names.
- `scheduleProminence`: playoff/bowl/prime fixture context, not TV network alone.

If scenario inputs are unavailable, use a documented stage/round table, lower confidence, and do not claim clinching implications.

### Post-game watchability

```text
watchability = .30*tension + .20*competitiveBalance
             + .16*turningPoints + .12*stakes
             + .10*execution + .07*narrativeFit + .05*personalFit
```

- `tension`: top-leverage valid plays and drive endpoints, capped per drive.
- `competitiveBalance`: `1 - mean(2*abs(WP-.5))`, time-weighted over non-garbage plays.
- `turningPoints`: clustered WP swings; reversed/nullified plays do not count twice.
- `stakes`: frozen pre-game importance excluding personal affinity.
- `execution`: opponent-adjusted successful/explosive plays and pressure, with turnover luck uncertainty.
- `narrativeFit`: revealed-only comeback/upset/late-drive descriptors.
- `personalFit`: separately explainable user preference match.

**Hypothesis.** Sustained balance plus late drive leverage will predict full-replay satisfaction better than total points, margin, or lead-change count. Validate this.

## Transparent play metrics

For valid play `i`:

```text
leverage_i = abs(WP_success_i - WP_failure_i)
closeness_i = max(0, 1 - 2*abs(WP_before_i - .5))
tension_i = leverage_i * closeness_i
```

Observed `WPA_i = WP_after_i - WP_before_i` describes realized swing; leverage describes potential importance. Do not substitute one for the other.

```text
garbagePlay = max(WP, 1-WP) >= cohortThreshold
              AND leverage <= lowLeverageThreshold
```

Thresholds must be trained by ruleset/time remaining, not fixed globally. Kneel-downs are analytically noncompetitive but can confirm high pre-snap certainty; exclude them from execution.

Revealed-only:

```text
comebackDepth = 1 - 2*min(eventualWinnerWP)
upsetMagnitude = max(0, .5 - preGameWinnerProbability) * 2
```

## Missingness and uncertainty

- `HIGH`: reconciled play/drive stream, known ruleset and inputs, official final.
- `MEDIUM`: complete scoring drives and clock, incomplete play details.
- `LOW`: scoring summary only, missing timeouts/rules inputs, suspended game.
- `NONE`: forfeit/no contest, contradictory outcome, or unresolved identity.

Each component returns value, cohort, model version, coverage, and uncertainty reason. Renormalize only if ≥65% of neutral-quality weight is observed; otherwise return no overall band. Use within-cohort percentiles before any NFL/NCAA comparison.

## Viewing format

- Full replay: high sustained tension/personal fit and sufficient budget.
- Condensed: meaningful drives but substantial low-leverage/interruption time.
- Highlights: concentrated turning points or limited user affinity.
- Recap: context matters, replay value/data confidence does not.
- Skip: low relevance and low observed band; avoid unexplained skip for followed teams.

Strict hidden mode sets `blind=true` and uses only pre-game features. Format must not reveal overtime, comeback, game duration, or exact event shape.

## Validation

1. Sample by NFL/NCAA division, season/ruleset, week, postseason, expected spread, data completeness, and game length.
2. Collect blinded expert labels for stakes, leverage, execution and garbage time; collect viewer replay satisfaction and preferred format separately.
3. Measure ordinal agreement, calibration, top-k follow-through, format accuracy, and four-week recommendation utility.
4. Audit errors by league, favored/underdog team, scoring environment, nationally prominent versus small programs, and missingness.
5. Ablate pre-game, scoring-summary, drive, play-level and personalization features.
6. Maintain spoiler regression tests across copy, DOM, accessibility tree, thumbnails, URLs, analytics, standings and next-game navigation.

Initial tier thresholds (`Must watch ≥ cohort p85`, `Worth ≥ p60`, `Highlights ≥ p35`) are hypotheses. Version and recalibrate them from user outcomes.
