# Handball Watchability Model

## Pre-match importance

Normalize inside competition/phase cohorts:

```text
importance = .30*advancementLeverage + .20*teamStrength
           + .16*personalAffinity + .14*matchupBalance
           + .12*stage + .08*rivalryContext
```

- `advancementLeverage`: expected change in title/qualification/relegation probability; for second legs use aggregate state and exact tie-break rules.
- `teamStrength`: competition-adjusted estimate, not cross-league raw record.
- `matchupBalance`: uncertainty near 50%, or win/draw distribution where draws stand.
- `stage`: competition-specific rule table.
- `rivalryContext`: curated, sourced, and user-relevant.

When table/scenario simulation is unavailable, substitute a documented phase value, lower confidence, and avoid “must-win” claims.

## Post-match watchability

```text
watchability = .29*tension + .20*balance + .15*turningPoints
             + .12*stakes + .10*execution + .08*paceFit
             + .06*personalFit
```

- `tension`: top-leverage possessions/events, capped per possession and per minute.
- `balance`: time integral of match/advance probability closeness.
- `turningPoints`: clustered probability swings; a goal plus immediate score update is one event.
- `stakes`: frozen pre-match neutral importance.
- `execution`: attack and goalkeeping versus shot/competition baselines, with uncertainty.
- `paceFit`: meaningful attacks and transitions, personalized; high raw goal count is not automatically quality.

**Hypothesis.** Sustained probability balance plus late-leverage possessions will predict replay satisfaction better than goal total or final margin.

## Transparent event formulas

For event `i`:

```text
leverage_i = max(outcomeProbabilitiesAfter_i) - min(outcomeProbabilitiesAfter_i)
closeness_i = 1 - 2*abs(P_homeWin_i - .5)  // conditional when draws cannot stand
tension_i = leverage_i * max(0, closeness_i)
```

In regular matches where draws can stand, use normalized entropy of home/draw/away probability instead of binary closeness. For aggregate ties, compute qualification probability, not current-match win probability.

```text
runIntensity = sum(leverage of consecutive same-team goals)
             / max(1, opponentPossessionsDuringRun)
```

Define a run boundary by possession change and elapsed time; never treat arbitrary “3–0” as equally meaningful.

Revealed-only:

```text
comebackDepth = 1 - 2*min(eventualWinnerProbability)
upsetMagnitude = max(0, .5 - preMatchWinnerProbability) * 2
```

Goalkeeper value with a validated xG model:

```text
goalsPrevented = sum(shotExpectedGoalProbability) - goalsAllowed
```

Without shot quality, show saves/attempts only and cap analytical confidence.

## Missingness and confidence

- `HIGH`: reconciled event/shot stream, correct clock/rules, official final.
- `MEDIUM`: complete scoring timeline plus team totals; no possession/shot quality.
- `LOW`: half scores/final totals only, uncertain aggregate context, abandoned match.
- `NONE`: forfeit, contradictory result, unresolved identity.

Every factor records method, cohort, coverage, model version, and uncertainty reason. Renormalize only if ≥65% of neutral-quality weight is available; otherwise return no overall band. Compare percentiles within competition/gender/phase/rules cohorts before cross-competition display.

## Viewing-format choice

- Full replay: sustained tension, high affinity/stakes, and sufficient budget.
- Condensed: high leverage with long lower-impact stretches.
- Highlights: concentrated runs/turning points or moderate affinity.
- Recap: advancement/table relevance without sufficient replay evidence.
- Skip: low relevance and observed band; never silently skip followed teams.

Strict completed mode uses only pre-match importance (`blind=true`) and must not adjust format using extra time, shootout, margin, or match shape.

## Validation

1. Stratify by domestic/international, men's/women's, group/knockout, one/two legs, ruleset, expected strength, and data completeness.
2. Ask expert raters separately for stakes, tension, execution, goalkeeper performance, and turning points; ask viewers for satisfaction and preferred format after watching.
3. Measure ordinal agreement, calibration by band, top-k recommendation follow-through, and format accuracy.
4. Audit favored/underdog, competition visibility, gender, home advantage, data-rich/data-poor, and high/low scoring errors.
5. Ablate pre-match, score timeline, event stream, shot model, and personalization features.
6. Maintain spoiler regression cases for score, extra time/shootout, aggregate progression, images, URLs, accessible text, analytics and next-round navigation.

Initial thresholds—Must Watch ≥ cohort p85, Worth ≥ p60, Highlights ≥ p35—are hypotheses and must be versioned/recalibrated.
