# Tennis Watchability Model

## Two scores, two information boundaries

**Recommendation.** Never overwrite pre-match importance with post-match watchability.

### Pre-match importance

Normalize inputs to `[0,1]` within competition cohort:

```text
importance = 0.30*stage + 0.20*competitorStrength
           + 0.15*qualificationConsequence + 0.15*personalAffinity
           + 0.10*matchupNovelty + 0.10*context
```

- `stage`: rule-table value for final, semifinal, elimination round, etc.; not merely round name.
- `competitorStrength`: calibrated expected quality from ranking/surface strength, not rank proximity.
- `qualificationConsequence`: title, advancement, finals qualification, or Davis Cup tie leverage.
- `personalAffinity`: user-controlled and clearly separated from objective context.
- `matchupNovelty`: surface-adjusted H2H narrative with sample-size shrinkage.
- `context`: defensible rivalry/home/national significance.

For Davis Cup, replace `qualificationConsequence` with expected tie leverage and compute it before the match. A dead match receives zero tie leverage, though player affinity can still recommend it.

### Post-match watchability

When point-by-point data is complete:

```text
quality = 0.30*tension + 0.18*balance + 0.15*stakes
        + 0.12*performance + 0.10*turningPoints
        + 0.08*formatFit + 0.07*personalFit
```

- `tension`: mean of the top-decile point leverage × match-win closeness, with a cap so one long deuce does not dominate.
- `balance`: inverse integrated absolute match-win-probability advantage; rewards sustained uncertainty.
- `stakes`: pre-match stage plus live Davis Cup tie leverage, frozen independently of winner.
- `performance`: both competitors versus tour/surface serve-return baselines; avoid rewarding errors as “quality”.
- `turningPoints`: number and magnitude of distinct probability swings, clustered by game.
- `formatFit`: whether full/condensed/highlights suits the user's budget.
- `personalFit`: affinity/taste; displayed separately from neutral quality.

**Hypothesis.** Tension and balance will predict replay satisfaction better than total duration or deciding-set presence. Validate rather than assuming.

## Transparent calculations

Let `p_before` be server match-win probability before a point, `p_server` after the server wins it, and `p_receiver` after the receiver wins it:

```text
pointLeverage = abs(p_server - p_receiver)
pointCloseness = 1 - 2*abs(p_before - 0.5)
pointTension = pointLeverage * max(0, pointCloseness)
```

Match probabilities must encode server, current point/game/set score, best-of and final-set rule. Calibrate independently by cohort. Break point is a useful label, not a sufficient leverage model.

```text
upsetMagnitude = max(0, preMatchWinnerAgainstProbability - 0.5) * 2
comebackDepth = 1 - 2*minimumWinnerInPlayProbability
```

Both require knowing the winner and are outcome spoilers. They belong only in revealed payloads.

With game/set data but no points, estimate:

```text
aggregateQuality = 0.40*setBalance + 0.25*gameBalance
                 + 0.20*preMatchStakes + 0.15*personalFit
```

Mark `method=AGGREGATE`, cap confidence at `MEDIUM`, and never claim point pressure, saved match points, or comeback depth.

## Confidence and missingness

Return a band and reasons, not false precision:

```text
HIGH   complete point stream + known format + reconciled result
MEDIUM complete set/game score + known format; no point stream
LOW    partial score, missing baselines, retirement, or uncertain format
NONE   walkover, invalid score, or unreconciled identity
```

Each factor records `value`, `cohort`, `method`, `available`, and `uncertaintyReason`. Renormalize weights only when at least 60% of neutral-quality weight is observed; otherwise do not score.

## Viewing-format recommendation

**Recommendation.** Keep recommendation and availability distinct.

- Full replay: high personal fit and sustained tension/quality; budget ≥ estimated replay length.
- Condensed: high stakes/turning points but budget insufficient, or long low-leverage intervals.
- Highlights: concentrated turning points or moderate personal fit.
- Recap: contextual relevance without sufficient replay value/data.
- Skip: low pre-match affinity and low-confidence/low-band quality; never assign to followed players without explaining preference conflict.

In strict completed mode, use pre-event inputs only and label the decision `blindRecommendation=true`. Do not let format leak duration, retirement, or deciding-set structure.

## Validation plan

1. Build stratified samples by ATP/WTA, singles/doubles, best-of, surface, category, round, and data completeness.
2. Obtain blind expert annotations for tension, quality, stakes, and recommended format; obtain viewer post-watch satisfaction separately.
3. Evaluate ordinal agreement (weighted kappa/Spearman), calibration by band, top-k usefulness, and format-choice accuracy.
4. Audit subgroup error and score distributions; cross-tour medians should not be forced equal, but systematic instrumentation bias must be explained.
5. Run ablations: pre-match only, aggregates, point leverage, personalization. Require measurable benefit before exposing a factor.
6. Maintain spoiler regression cases for outcome, structure, evaluative copy, images, URLs, analytics and navigation.

Initial product thresholds are hypotheses: `Must watch ≥ cohort p85`, `Worth ≥ p60`, `Highlights ≥ p35`; show bands, not numbers. Recalibrate only with versioned data and retain model version/provenance.
