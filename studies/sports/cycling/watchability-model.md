# Cycling Watchability Model

## Separate outputs

Pre-start importance uses only data frozen at actual start and is safe. Post-event watchability uses observed race state and is protected. Calculate both per stage and, separately, event-level catch-up utility.

## Pre-start importance

All features are normalized `[0,1]`:

`I = 0.30C + 0.25P + 0.18R + 0.15U + 0.12N`

- `C`: classification/championship leverage under applicable rules.
- `P`: explicit personal relevance.
- `R`: route-format relevance to race and likely objectives.
- `U`: pre-start competitive uncertainty, roster strength, weather and route uncertainty.
- `N`: verified narrative continuity such as title defence, rivalry, return, or final/queen stage.

Do not label a mountain stage automatically “must watch”; importance is not realized action.

## Post-event watchability

`W_raw = 0.24U + 0.20T + 0.15A + 0.12L + 0.10X + 0.08D + 0.07Q + 0.04N`

- `U`, sustained outcome uncertainty across relevant contests.
- `T`, tactical transitions: meaningful group/control changes.
- `A`, attack/breakaway quality: credible, consequential initiatives.
- `L`, classification leverage realized or threatened.
- `X`, execution: descending, sprinting, pacing, technical skill, teamwork when supportable.
- `D`, incident/condition impact, without rewarding harm.
- `Q`, climax: late convergence, sprint uncertainty, final-lap/time-check tension.
- `N`, rarity/novelty adjusted for discipline and era.

`W = confidence * W_raw + (1-confidence) * formatPrior`

Publish calibrated bands, not numeric precision. Never award spectacle points for injury severity.

## Operational features

### Uncertainty

At observation `t`, estimate probabilities for stage/race winner and user-relevant classifications. Use normalized entropy or `1 - max(p)` and integrate over competitive time. Report the probability model and calibration set. Without a model, use group/gap/terrain heuristics with lower confidence.

### Tactical transitions

Represent state as `{groups, composition, gaps, controlTeam, terrainSegment}`. A transition is meaningful when it changes credible outcome paths: selected group, successful bridge, catch, team isolation, or responsibility shift. Apply a persistence threshold to suppress GPS/group jitter.

### Breakaway and attack quality

`attackQuality = separation * viabilityChange * competitiveRelevance * persistence`

An attack count is not useful by itself. Breakaway viability must be format-specific and time-varying. A catch can resolve uncertainty or create a new sprint contest; score the transition, not a preferred outcome.

### GC/classification leverage

Simulate finish-time/bonus scenarios from the current state under stored rules. Score credible changes to lead, podium, jerseys, elimination/time limit, or a followed rider's objective. Separate `threatened` from `realized`; the latter is an outcome spoiler.

### Sprint uncertainty

Estimate credible winner set, lead-out/support state, group size, positioning, finish profile, and distance. Weight uncertainty near the finish but preserve value from earlier crosswind/selection. A large bunch is not automatically an exciting sprint.

### Time trial tension

Use checkpoint prediction error, rank reversals, projected GC changes, remaining course, and start-order/condition comparability. Avoid comparing raw times before normalizing distance/checkpoint and timing precision.

### Cyclocross tension

Integrate gap relative to expected section/lap variability, remaining laps, technical/pit state, and rider-specific pace uncertainty. Count lead changes only when timing/order is stable beyond a persistence window.

## Personal utility and format

`U_user = W + boundedAffinity + tasteMatch + objectiveMatch - knownResult - accessCost`

Affinity changes utility, never observed facts. An uneventful ride by a favorite may be personally relevant without being universally exceptional.

| Shape | Recommendation hypothesis |
|---|---|
| Sustained uncertainty/transitions across coverage | Full |
| Long event with identifiable decisive/tactical window | Final hours / condensed |
| Localized finish, climb, TT checkpoint, or CX final laps | Highlights |
| Classification significance but weak/uncertain observation | Recap |
| Low utility within time budget | Skip |

Chapters and “watch from km 60” leak event structure and require reveal authorization. Recommended minutes must reflect actual available coverage, not sporting duration.

## Event-level recommendation

For a stage race, select stages under a time budget using marginal narrative value:

`stageUtility = personalUtility + classificationInformationGain - overlapWithAlreadyWatched`

Do not average scores. A recap may bridge skipped stages so later classifications make sense. Strict mode can construct a blind plan only from pre-start importance.

## Confidence

Each feature includes temporal/rider/group coverage, timing precision, attribution source, and missing inputs. GPS-only data caps tactical attribution. Checkpoint-only data may support TT tension but not road attack sequence. Finish results alone cannot support transition, uncertainty-path, or breakaway claims.

## Validation

1. Sample road one-day, flat/hilly/mountain stages, ITT/TTT, women's/men's categories, cyclocross conditions, eras, and feed completeness.
2. Ask casual and expert viewers for full-replay value, best start point/format, traits, and spoiler severity; measure agreement.
3. Test ranking correlation, band calibration, top-k/format accuracy, and chapter usefulness by format.
4. Compare simple baselines: final gap, winner prestige, number of attacks, route difficulty, GC change, last-hour-only editorial rating.
5. Ablate group state, terrain, classifications, action annotations, and personalization. Validate on held-out races and viewers.
6. Review false positives (many futile attacks, crash-driven selection, predictable bunch) and false negatives (long-range tactical duel, close TT projections, technical CX exchanges).
7. Recalibrate by category/era; audit systematically poorer confidence caused by unequal data coverage.
8. Spoiler-audit visible/accessibility/network/URL/image/log fields. Track critical incidents per 1,000 protected impressions.

Success is correct viewing choice and format, repeat use, low regret, and spoiler safety—not agreement with final time gaps.
