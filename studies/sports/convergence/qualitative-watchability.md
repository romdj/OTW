# Qualitative Watchability Framework

## Purpose

“Worth watching” is not synonymous with close, high-scoring, high-volume, prestigious, or personally favorable. OTW should preserve several independent judgments and combine them only at the final, viewer-specific decision layer.

Research supports treating suspense as one contributor rather than a universal answer. Controlled and observational work finds audience and disposition differences in responses to close contests ([Bryant, Rockwell & Owens](https://doi.org/10.1177/019372394018004003); [Gan et al.](https://doi.org/10.1177/019372397021001004)), while broader outcome-uncertainty evidence is mixed ([Ferguson](https://doi.org/10.1111/1475-4932.12735)). Recent football analytics explicitly separate suspense from surprise ([Flepp, Pawlowski & Richardson](https://arxiv.org/abs/2506.21253)). These findings support a multidimensional, taste-aware model—not “close game = good game.”

This framework synthesizes the 12 sport studies. Their `data-points.md` and `watchability-model.md` files remain authoritative for sport-native operational definitions.

## Four judgments that must remain separate

| Judgment | Question | Typical evidence |
|---|---|---|
| Competitiveness | Was the relevant outcome credibly uncertain? | calibrated state probabilities, gaps/margins, remaining opportunity |
| Eventfulness | How much meaningful state change occurred? | possessions, attacks, rallies, laps, groups, scoring chances, transitions |
| Aesthetic quality | Was there exceptional execution, coordination, invention, or technique? | event stream plus sport-specific technical labels/tracking/expert review |
| Importance | Why did this matter beyond the immediate contest? | pre-event rules, classification/tournament leverage, historic context |

Personal relevance is a fifth, user-specific utility modifier. It must not rewrite the first four facts.

A 1–0 football match can be tactically rich, intensely uncertain, and beautifully defended. A 145–102 basketball game can be high-volume but settled early. A dominant time trial or qualifying lap can be aesthetically exceptional without competitive suspense. A championship decider can be important but poor viewing. OTW should say which of these is true.

## Universal qualitative dimensions

Each dimension uses a universal question and sport-calibrated evidence. Values are `[0,1]`, but UI should initially show `LOW | MEDIUM | HIGH | VERY_HIGH`, confidence, and at most two reasons.

### 1. Suspense / uncertainty

**Universal question:** For how long, and at which consequential moments, were relevant outcomes credibly unresolved?

Use temporally valid probabilities or calibrated proxies and integrate uncertainty over meaningful opportunity remaining. “Relevant outcome” may be winner, qualification, stage/GC, set, grid, title, or a followed participant's objective. A final small margin does not prove sustained suspense; a late large gap does not erase earlier uncertainty.

### 2. Meaningful action density

**Universal question:** How much consequential action occurred per unit of consumable viewing time?

Count only actions that change state, create/deny opportunity, demonstrate skill, or advance a contest. Discount repetitive low-leverage volume: basketball intentional fouls, football kneel-downs, harmless possession, cycling GPS jitter/futile attacks, routine racing passes caused solely by pit cycles, or volleyball side-outs without pressure. Use actual replay/broadcast time where known; sporting clock alone is not viewing cost.

### 3. Intent / progression

**Universal question:** Did actions visibly pursue and advance comprehensible objectives?

Examples include building field position, changing press/coverage, constructing a tennis point, isolating a rider, setting up a sprint, managing tyres, bridging a rally gap, building a volleyball serve/attack pattern, or progressing through qualifying. This distinguishes purposeful development from noisy activity. Intent is often inferred; require tactical annotations or expert confidence rather than mind-reading participants.

### 4. Volatility / transitions

**Universal question:** Did control, advantage, or plausible outcome paths change meaningfully?

Measure persistent state changes, not raw lead changes, passes, breaks, or score alternation. Separate organic transitions from administrative resets, pit cycles, neutralizations, penalties, and corrections. Volatility can be exciting but incoherent; it is not inherently high quality.

### 5. Tactical tension

**Universal question:** Were multiple credible choices or latent threats active even when visible counts were low?

Examples: football field-position/fourth-down pressure; soccer shape and transition threat; basketball lineup/coverage and foul constraints; cycling chase resources; motorsport tyre/pit windows; tennis return pressure; hockey matchup/empty-net choices; volleyball serve/rotation pressure; rally tyre/pace tradeoffs. This dimension is where excellent low-count contests are recovered.

### 6. Expressive skill

**Universal question:** Did participants execute unusually difficult, precise, inventive, coordinated, or resilient actions?

Calibrate within sport, era, category, role, conditions, and opportunity. Do not equate star identity, speed, scoring, or a round-number statistic with quality. Summary data rarely supports this dimension strongly; event stream plus technical context or human labels is normally required.

### 7. Flow / rhythm

**Universal question:** Did the viewing experience sustain coherent engagement rather than fragment into dead time or repetitive administration?

Flow may arise from uninterrupted play, a readable tactical arc, escalating sequences, or alternating pressure. Penalize excessive low-value stoppage and incoherent repetition, not legitimate pauses that deepen tactical tension. Broadcast editing strongly affects this dimension, so distinguish competition flow from product flow.

### 8. Adversity / recovery

**Universal question:** Did a participant respond meaningfully to an evidenced setback?

Setbacks include deficit, poor start/grid, lost set, mechanical, penalty, weather, injury/availability constraint, team isolation, or tactical failure. Normalize recovery by opportunity and expected difficulty. A comeback is an outcome/structural spoiler; keep the dimension protected until authorization.

### 9. Stakes / narrative

**Universal question:** What verified consequence or ongoing arc gave actions meaning?

Split `preEventStakes` from `realizedNarrative`. The first uses frozen championship, elimination, rivalry, milestone, or series context and can be safe. The second includes clinching, upset, record, advancement, or classification change and is protected. Prestige alone cannot raise observed quality.

### 10. Novelty / historic significance

**Universal question:** Was something genuinely rare within an adequately covered, correctly defined comparison class?

Require a denominator, era/category scope, and history coverage. “First ever” is forbidden when history is incomplete. Novelty can justify recap/highlights even when suspense is low; it must not automatically produce “full replay.”

### 11. Personal relevance

**Universal question:** How strongly does this event match the viewer's explicit affinities, knowledge, taste, and time budget?

Components: followed entities, preferred dimensions, narrative continuity, desired technical depth, already-known result, access, and available minutes. Cap affinity effects on universal claims. Say “highly relevant to you,” not “an exceptional contest,” when only personalization is high.

## Racing lens: Formula 1, MotoGP, Superbike, and rally

Expected-order, lights-to-flag dominance is usually low in suspense and competitive-state transition, even when lap speed is high. Racing therefore needs the following sport-calibrated subfeatures beneath the universal dimensions:

- `expectationDivergence`: how far credible performance/order departs from pre-session strength, grid/start order, or pace expectations. An underdog/upset path can raise novelty, recovery, and uncertainty; the eventual upset label is protected.
- `competitiveStateTransitions`: persistent changes in leader/battle groups, credible position paths, stage projections, or championship state. Discount routine pit cycles, timing jitter, and administrative classification corrections.
- `strategicBranchPoints`: moments when tyre, stop, energy/power, setup, pace, or team choices create multiple viable futures. A branch can create tactical tension without an overtake.
- `fieldCompression`: reduced physical/time gaps that restore credible competition. Safety-car/yellow/red-flag compression is not organic skill and should raise suspense only after credible racing resumes.
- `reliabilityUncertainty`: evidenced risk or occurrence of mechanical/technical failure. It can disrupt expectation and narrative, but is not expressive skill and must not be rewarded for danger or loss alone.
- `conditionsVolatility`: rain, surface, wind, temperature, visibility, or grip changes that alter viable strategies and performance. Strategically timed change matters more than a weather-event count.
- `championshipLeverage`: plausible effect on title/classification outcomes under the effective ruleset, separated into safe pre-session stakes and protected realized consequence.

A leader-dominated race can remain tense when pressure is close, tyre/reliability uncertainty is credible, or championship leverage makes one error decisive. Conversely, repeated flags may create resets and position changes while damaging flow/rhythm. Crashes, injury, and danger never earn quality points; only their neutral competitive-state consequences may be described, with harm excluded. Mechanical failure is narrative disruption/adversity, not athletic execution.

The 2021 Abu Dhabi Formula 1 finale illustrates why field-wide overtake counts are insufficient: the two title contenders entered level on points ([Formula 1 pre-race context](https://www.formula1.com/en/latest/article/what-to-watch-for-in-the-abu-dhabi-gp-the-championship-decider-nervous.1DFTdUW3mbcjM8ManPkbYJ), [FIA event decisions](https://www.fia.com/documents/championships/fia-formula-one-world-championship-14/season/season-2021-1108)). It is a historical example of maximal championship leverage and late suspense, not a training label for procedural quality; the FIA separately published an [executive summary report](https://www.fia.com/sites/default/files/2021_f1_abu_dhabi_grand_prix_-_report_to_the_wmsc_-_19_march_2022.pdf). OTW must keep competitive suspense, sporting execution, procedural controversy, and broad-field action distinct.

## Universal schema, sport-calibrated measurement

The 11 dimension names and questions can converge. Their operational inputs, priors, thresholds, and even availability cannot.

| Dimension | Universal? | Must be calibrated by |
|---|---|---|
| Suspense | Construct | outcome type, rules, phase, time/opportunity model |
| Action density | Construct | native action taxonomy and broadcast format |
| Intent/progression | Construct | tactical grammar and annotation reliability |
| Volatility | Construct | stable state definition and administrative artifacts |
| Tactical tension | Construct | sport rules, viable choices, expertise level |
| Expressive skill | Construct | role, category, era, difficulty model |
| Flow | Construct | sport rhythm and broadcast product |
| Recovery | Construct | setback baseline and remaining opportunity |
| Stakes | Construct | competition rules and temporal snapshot |
| Novelty | Construct | historical cohort and coverage |
| Personal relevance | Construct | individual preferences and viewing context |

Never compare raw feature values cross-sport until calibrated against human judgments in matched cohorts. The UI can display common labels while reason copy remains sport-native.

## Composition without double counting

Do not begin with one weighted sum. Maintain a profile and a small set of orthogonal composites:

```text
competitiveness = suspense
eventfulness    = actionDensity + transitions (correlation-adjusted)
aestheticQuality= expressiveSkill + intentProgression + tacticalTension + flow
importance      = preEventStakes + protectedRealizedNarrative
personalUtility = taste-weighted profile + affinity + format/time/access constraints
```

Rules:

1. One raw observation may support several dimensions, but each contribution records a `factId` and attribution weight. Total attribution from one fact is capped.
2. Causal sequences are not multiple independent bonuses: deficit → recovery → lead change → win is one arc with several descriptors, not four additive events.
3. Stakes affects meaning/personal utility, not suspense or skill.
4. Novelty is a tag/composite input, not a multiplier across every dimension.
5. Incidents create adversity or transitions only through competitive effect; never reward harm.
6. Use correlation-aware models/regularization and report ablations. If removing “lead change count” barely changes human agreement, remove it.
7. Viewing format can depend on shape: strong climax plus weak flow suggests condensed, not a lower quality claim.

### Archetypes

| Profile | Correct interpretation |
|---|---|
| High volume, low uncertainty, low intent | Eventful-looking but likely recap/highlights |
| Low count, high tactical tension/skill/flow | Excellent full or condensed candidate |
| Dominant, exceptionally skillful, historic | Aesthetic/historic highlight; full only for matching viewers |
| Chaotic, volatile, low execution | Potentially entertaining, not aesthetically excellent |
| Important, low action and settled early | Important recap, not must-watch replay |
| Personally relevant, universally ordinary | Recommend honestly as “for you” |

## Data-grade confidence

Use capability grades, not provider prestige:

| Grade | Evidence | Supported claims |
|---|---|---|
| `G0_IDENTITY` | schedule/participants/rules only | pre-event context and affinity |
| `G1_SUMMARY` | final result/classification/box summary | outcome, broad performance; no path claims |
| `G2_EVENT_STREAM` | ordered, timestamped native events | suspense proxies, transitions, action density, recovery, basic flow |
| `G3_STATE_STREAM` | continuous score/gap/position/possession/group state | calibrated tension, control, tactical windows |
| `G4_TRACKING_CONTEXT` | spatial/technical/tracking plus validated models | shot/action difficulty, positioning, richer intent/skill |
| `G5_HUMAN_AUGMENTED` | trained labels with evidence anchors | tactical intent, aesthetic execution, narrative coherence |

Grades are not linear quality scores. A complete tennis point stream may be G2/G3; rally splits may support strong uncertainty despite no continuous tracking. Each dimension declares `minimumGrade`, actual `grade`, coverage, confidence, and missing inputs. Never infer absent events as zero.

## Human labeling and evaluation

### Label protocol

1. Sample within sport × format × category × era × data grade, deliberately including counterexamples.
2. Show trained raters full or standardized condensed coverage without model outputs. Record whether they knew the result.
3. Rate each dimension independently on behaviorally anchored five-point scales plus `cannot judge`.
4. Require timestamp/chapter evidence for action, skill, tactical tension, recovery, and flow labels.
5. Separately ask: full/condensed/highlights/recap/skip, ideal start point, overall worth, and confidence.
6. Collect familiarity, affinities, and taste rankings; do not average them away.
7. Double-label at least 20–30%, adjudicate ontology failures, and maintain a counterexample regression set.

Measure ordinal agreement (weighted kappa/ICC as appropriate), rank correlation, per-dimension calibration, top-k precision, format regret, and subgroup error. Low agreement may reveal legitimate taste or a bad rubric; distinguish them through evidence anchors and follow-up interviews.

### Disagreement model

Represent a rating as:

`rating(viewer,event) = sharedProfile(event) · tasteWeights(viewer) + affinity + context + residual`

Use hierarchical partial pooling by sport familiarity and taste cluster while retaining individual uncertainty. Learn taste only from explicit controls and causal-enough feedback (“too slow,” “wanted more tactics,” “format too long”), not clicks alone. Provide a universal profile and “why for you” separately. Minority tastes are not annotation noise.

## Twelve-sport counterexample regression set

| Sport | Counterexample the model must handle |
|---|---|
| American football | High-scoring blowout with explosive-play volume versus low-scoring field-position game with repeated high-leverage fourth-down choices |
| Association football | 0–0 with coordinated pressing, dangerous transitions and late uncertainty versus 5–0 settled early through defensive errors |
| Basketball | Fast 145–102 blowout versus 88–86 defensive contest with coherent adjustments and clean late execution |
| Cycling | Small bunch gaps after a routine sprint versus a large final gap created by a compelling long-range tactical duel |
| Formula 1 | Expected-order lights-to-flag dominance with no credible pressure versus few passes but close pressure, strategic branch points, reliability uncertainty, or title leverage; routine DRS/pit-cycle changes do not rescue the former |
| Handball | High goal count with one side clear early versus lower-scoring goalkeeper/defensive contest with meaningful possession pressure |
| Ice hockey | Shot-heavy comfortable win from low-danger attempts versus low-shot game with elite goaltending, special-teams tension and late uncertainty |
| MotoGP | Numerous low-consequence midfield passes versus a close lead pressure/tyre branch; a dominant masterclass can rate high in skill but remains low in uncertainty unless reliability or championship state stays live |
| Rally | Large final gap after repeated split reversals, underdog expectation divergence, reliability risk, or strategically timed weather versus a tiny final gap produced by stable progression or timing correction |
| Superbike | Overtake-heavy early laps that settle quickly versus sparse passes with sustained pressure, tyre/reliability branches and Race-2-grid tension; repeated flags can add transitions while reducing flow |
| Tennis | Five-set match with lopsided sets/low point tension versus straight sets containing long, high-pressure games and extraordinary point construction |
| Volleyball | Five sets dominated alternately with little rally suspense versus three tight sets with serve pressure, defensive skill and tactical adjustment |

Each source study already explains the sport-native evidence needed to distinguish these cases; convergence supplies the questions, not shortcuts.

## Spoiler safety

All post-event dimensions are weak or strong spoilers because even “high suspense” reveals event shape. In `NO_HINTS`, expose only pre-event stakes, personal relevance, and pre-event uncertainty—clearly labeled as predictions. In Light Context, a generic taste match may be allowed only with consent. Full profiles, format rationale, chapters, adversity, novelty, and realized narrative require reveal.

Never leak profiles through sorting, radar-chart alt text, CSS-hidden SVG, analytics, cache keys, notifications, thumbnails, or page metadata. Protected profiles should be separately fetched.

## Mock UI profiles

These records are standalone fictional fixtures for component exploration; every record is explicitly mock data.

```json
{
  "source": "MOCK",
  "fictional": true,
  "profiles": [
    {
      "id": "mock-quality-low-count-excellent",
      "source": "MOCK",
      "fictional": true,
      "label": "Low-count tactical excellence",
      "dataGrade": "G3_STATE_STREAM",
      "dimensions": {
        "suspense": "HIGH", "actionDensity": "LOW", "intentProgression": "VERY_HIGH",
        "volatility": "LOW", "tacticalTension": "VERY_HIGH", "expressiveSkill": "HIGH",
        "flow": "HIGH", "adversityRecovery": "MEDIUM", "stakesNarrative": "HIGH",
        "noveltyHistoric": "LOW", "personalRelevance": "MEDIUM"
      },
      "composites": { "competitiveness": "HIGH", "eventfulness": "LOW", "aestheticQuality": "VERY_HIGH", "importance": "HIGH" },
      "format": "FULL",
      "confidence": { "band": "HIGH", "coverage": 0.94 }
    },
    {
      "id": "mock-quality-high-volume-boring",
      "source": "MOCK",
      "fictional": true,
      "label": "High-volume settled contest",
      "dataGrade": "G2_EVENT_STREAM",
      "dimensions": {
        "suspense": "LOW", "actionDensity": "VERY_HIGH", "intentProgression": "MEDIUM",
        "volatility": "LOW", "tacticalTension": "LOW", "expressiveSkill": "MEDIUM",
        "flow": "MEDIUM", "adversityRecovery": "LOW", "stakesNarrative": "MEDIUM",
        "noveltyHistoric": "LOW", "personalRelevance": "LOW"
      },
      "composites": { "competitiveness": "LOW", "eventfulness": "HIGH", "aestheticQuality": "MEDIUM", "importance": "MEDIUM" },
      "format": "HIGHLIGHTS",
      "confidence": { "band": "HIGH", "coverage": 0.97 }
    },
    {
      "id": "mock-quality-dominant-masterclass",
      "source": "MOCK",
      "fictional": true,
      "label": "Dominant expressive masterclass",
      "dataGrade": "G5_HUMAN_AUGMENTED",
      "dimensions": {
        "suspense": "LOW", "actionDensity": "MEDIUM", "intentProgression": "HIGH",
        "volatility": "LOW", "tacticalTension": "MEDIUM", "expressiveSkill": "VERY_HIGH",
        "flow": "VERY_HIGH", "adversityRecovery": "LOW", "stakesNarrative": "HIGH",
        "noveltyHistoric": "VERY_HIGH", "personalRelevance": "MEDIUM"
      },
      "composites": { "competitiveness": "LOW", "eventfulness": "MEDIUM", "aestheticQuality": "VERY_HIGH", "importance": "VERY_HIGH" },
      "format": "CONDENSED",
      "confidence": { "band": "MEDIUM", "coverage": 0.86 }
    },
    {
      "id": "mock-quality-chaotic-not-excellent",
      "source": "MOCK",
      "fictional": true,
      "label": "Chaotic, volatile, error-heavy",
      "dataGrade": "G3_STATE_STREAM",
      "dimensions": {
        "suspense": "VERY_HIGH", "actionDensity": "HIGH", "intentProgression": "LOW",
        "volatility": "VERY_HIGH", "tacticalTension": "MEDIUM", "expressiveSkill": "LOW",
        "flow": "LOW", "adversityRecovery": "HIGH", "stakesNarrative": "MEDIUM",
        "noveltyHistoric": "LOW", "personalRelevance": "HIGH"
      },
      "composites": { "competitiveness": "VERY_HIGH", "eventfulness": "VERY_HIGH", "aestheticQuality": "LOW", "importance": "MEDIUM" },
      "format": "CONDENSED",
      "confidence": { "band": "HIGH", "coverage": 0.92 }
    }
  ]
}
```

UI recommendation: use labeled rows or compact chips for at most three salient dimensions on cards. Radar charts imply commensurability, are hard to compare/accessibly describe, and should be tested only on revealed detail views.

## Traceability

Dimension definitions derive from recurring constructs across all 12 `data-points.md` and `watchability-model.md` files. Examples retain native interpretation: possession leverage (American football/basketball/handball/hockey), chance/rally/point construction (association football/volleyball/tennis), group and classification state (cycling/rally), and timing/position/strategy state (Formula 1/MotoGP/Superbike). No sport-native rule or threshold is replaced here.
