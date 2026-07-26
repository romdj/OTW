# Handball Data Points

## Rules and structure

**Evidence.** Senior indoor handball normally uses two 30-minute halves. When a winner is required, the IHF rules permit two 5-minute halves of overtime, potentially a second such period, then the competition's tie-break procedure; if 7-metre throwing is chosen, five eligible throwers per side begin the sequence ([IHF Rules 2:1–2:2](https://www.ihf.info/sites/default/files/2025-07/09A%20-%20Rules%20of%20the%20Game_Indoor%20Handball_E.pdf)). Competition regulations can vary timeouts, advancement, aggregate ties, and tie-breakers, so store their version.

## Raw facts

| Group | Fields | Notes |
|---|---|---|
| Identity | stable match/team/competition IDs, season, competition, category | Separate men's/women's/youth cohorts; never join by name. |
| Schedule | scheduled/actual start, timezone, venue, home/away/neutral, phase, round, leg | Postponed/abandoned/cancelled are distinct. |
| Rules | rule version, 2×30 confirmation, timeout policy, extra-time/shootout and aggregate rules | Do not infer from `handball`. |
| Clock/state | half/period, elapsed/remaining clock, score, possession if known, suspensions, timeouts | Protected during and after play. |
| Event | sequence, clock, team/player, event type, goal/shot result, location, assist, turnover, foul, suspension, timeout | Preserve corrections/nullifications. |
| Shot | shooter, goalkeeper, location/type, outcome, fast break, 7-metre, empty-net | Denominators are essential. |
| Goalkeeper | shots faced, saves, goals allowed, 7m faced/saved, minutes | Line changes must be represented. |
| Team | possessions/estimate, attacks, shots, goals, turnovers, fast breaks, exclusions, 7m attempts | Provider definitions must be documented. |
| Context | group table before match, knockout/leg, aggregate score, advancement scenario | Freeze at throw-off. |
| Provenance | source IDs, fetched/effective time, completeness, correction/finality | Model version belongs with derived data. |

## Derived metrics

- Pre-match win/draw/advance probability with ruleset and cohort uncertainty.
- Possession estimate when possession events are absent; label method and error.
- Attack efficiency: goals per possession/attack relative to competition baseline.
- Shot quality and goalkeeping value: actual goals/saves relative to expected goals, only with validated shot locations/types.
- Event leverage: difference in match- or qualification-win probability across possible outcomes.
- Tension: leverage weighted by contemporaneous probability closeness.
- Competitive balance: time-weighted distance from 50% match probability.
- Lead changes/ties: deduplicated score-state transitions, weighted by clock and leverage.
- Run intensity: goals in a bounded interval or consecutive possessions, adjusted for opponent possessions and baseline pace.
- Comeback depth/upset magnitude: result-dependent and revealed-only.
- Late leverage: high-leverage possessions/events in a competition-calibrated closing window; five minutes is a candidate, not a universal truth.
- Exclusion impact: probability/efficiency change during two-minute suspensions; do not attribute causally to the excluded player without controls.
- Seven-metre pressure: leverage-weighted attempts, not raw conversion rate.
- Aggregate leverage: probability of advancing across both legs, including current aggregate and tie-break rules.

**Recommendation.** Goalkeeper “impact” requires shots faced and preferably expected-goal context. Save percentage alone is confounded by shot quality and defense; when only totals exist, label it descriptive.

## Context and personalization

Context: domestic league/cup, IHF/EHF competition, group versus knockout, table/qualification consequence, first/second leg and aggregate, final/medal match, historical rivalry with editorial provenance, team strength/form, rest/travel, home/neutral site.

Personalization: followed team/nation/player/goalkeeper, competition and national-team affinity, attack/defense/goalkeeping preferences, love of fast pace/comebacks, tolerance for lopsided elite performance, available time, replay access/territory, known-result state, and spoiler mode.

## Forbidden spoiler fields

| Protected state | Must not enter UI, DOM, accessibility labels, URL, thumbnails, logs, analytics, or ordering |
|---|---|
| Live-safe | score, clock/half, possession, exclusions, timeout, match/aggregate probability, “close,” “run,” or “upset brewing”. |
| Completed-hidden | winner/score, margin, extra time/shootout, duration, comeback/upset, lead changes, goalkeeper heroics, cards/exclusions, aggregate winner, next opponent, post-match watchability/tier. |
| Revealed | Outcome data allowed only after explicit event-scoped reveal. |

Strict mode uses pre-match information only. “Penalty shootout classic,” replay duration, or a result-derived Full Replay badge are structural/evaluative spoilers.

## MVP and extended sets

**MVP:** IDs, competition/category/season/phase/round/leg, ruleset, scheduled time/status, venue/neutral, teams, records/table position before match, aggregate before match, strength/advance estimate with confidence, personal affinity, availability, and provenance. Keep result payload physically separate.

**Extended:** corrected event stream, possession boundaries, shots and locations, goalkeeper matchup, 7m events, exclusions, turnovers, fast breaks, timeouts, expected-goal models, live aggregate probability, measured replay segments, injuries/rosters, rest/travel, and editorial rivalry.

## Edge cases and quality checks

- Walkover/forfeit: no viewing contest; exclude from watchability.
- Abandoned/suspended: partial, low confidence, never assume final.
- Extra time/7m shootout: ruleset-specific and protected.
- Two legs: distinguish match winner from aggregate qualifier; first-leg watchability can be high without deciding advancement.
- Group dead match: qualification leverage may be zero while affinity remains high.
- Empty-net goals, own goals, goalkeeper substitutions, simultaneous penalties, advantage and nullified goals need explicit semantics.
- Missing events: use score snapshots/half splits, cap confidence, and suppress run/leverage/goalkeeper claims.
- Validate monotonic event order (allow corrections), legal clocks, score increments, shot totals, 7m numerators, suspension intervals, final winner, and aggregate arithmetic.
