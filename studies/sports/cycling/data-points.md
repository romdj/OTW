# Cycling Data Points

## Event and stage model

`RaceEvent` owns competition edition, category, discipline, teams/starters, calendar dates, event format, stages, and cumulative classifications. `Stage` owns route/version, start list, timing/state, result, and stage-level analysis. A one-day road race, ITT, and cyclocross race are single-stage events but retain both levels for consistency. Do not average stage scores into an event score without modeling narrative continuity and user viewing state.

Persist `discipline`, `category`, `competitionClass`, `rulesetRevision`, and organizer-specific regulations. The UCI publishes independently versioned Road and Cyclo-cross rules ([regulations](https://www.uci.org/regulations/3MyLDDrwJCJJ0BGGOFzOat)); formats and classification rules change.

## Raw facts

| Group | Fields | Purpose |
|---|---|---|
| Identity | event/stage/edition IDs, date, class, category, format, ruleset | Stable semantics |
| Calendar | scheduled/actual UTC, status, postponement/cancellation | Lifecycle |
| Route | version/effective time, start/finish, distance, elevation, terrain segments, climbs/cobbles/gravel/circuits, finish profile | Tactical context |
| Entrants | rider/team/nation IDs, bib, role if declared, start/DNS/withdrawal status | Affinity and group composition |
| Race state | timestamp/distance remaining, group IDs/order/composition, gaps with measurement method | Tactical evolution |
| Actions | attack/catch/split/bridge/drop, pit/bike change, feed, mechanical/crash when supported | Transitions, with attribution confidence |
| Timing | checkpoints, finish times/gaps, bonuses, neutralized zones | Results/classifications |
| Classifications | stage, GC, points, mountains, youth/team/other jersey rules and snapshots | Stakes and outcomes |
| Conditions | measured/forecast weather, surface, wind, temperature; route/safety decisions | Context and disruption |

UCI safety protocols can produce altered starts, neutralized sections, stopped/restarted racing, and recalculated gaps; the UCI describes restart guidance and grouped restarts ([SafeR update](https://www.uci.org/pressrelease/the-uci-provides-update-on-safers-activities-for-safety-in-road-races/SmJSBe9k32iQpUwV0V7gu)). Preserve route versions and decision timestamps rather than rewriting history.

## Derived metrics

Every feature returns value, confidence, coverage, model version, and missing inputs.

- `competitiveUncertainty`: probability distribution over relevant winner/classification outcomes through time.
- `tacticalTransitionRate`: meaningful changes between peloton/group/control states per competitive hour.
- `attackQuality`: separation achieved, attacker strength/composition, terrain/timing, chase response, and outcome uncertainty—not raw attack count.
- `breakawayViability`: evolving survival probability based on gap, composition, distance, terrain, chase resources, wind, and era/format.
- `groupComplexity`: number and relevance of active groups plus bridge/catch possibilities.
- `classificationLeverage`: plausible effect on GC/jerseys/series from current state.
- `gcContest`: sustained credible time-gap threat among relevant GC riders, not merely final movement.
- `sprintUncertainty`: number/strength/position/resources of credible sprint outcomes, lead-out disruption, finish geometry, and remaining distance.
- `terrainRealization`: whether route features created selection/tactical choice; route difficulty alone is pre-event context.
- `performanceRarity`: format/category/era-adjusted performance with opportunity and data completeness.
- `incidentImpact`: effect of weather, crash, mechanical, neutralization, or penalty on competitive state; never incident count alone.

Final gaps are weak proxies: a large gap may follow a compelling long-range contest; a small bunch-race gap may contain little selection; time trials can be tense through intermediate splits despite orderly racing.

## Context and personalization

Context includes one-day prestige, championship status, stage-race day, remaining terrain, queen/final stage, GC and jersey margins before start, time bonuses, cut/time-limit rules, prior workload, team objectives, home/defending champion, season ranking, and cyclocross series standings. Freeze all at start.

Personal features include followed riders/teams/nations/races, preference for GC, breakaways, sprinting, climbing, classics, time trials, cyclocross technique, mud/weather, tactical depth, and available viewing time. Novices need group/jersey explanations; experts may want gaps, terrain and chase composition. Never infer nationality allegiance.

## Format-specific relevance

### One-day road race/classic

Use route selection points, group fragmentation, attack/bridge/catch sequence, team numerical advantage, remaining helpers, breakaway viability, and uncertainty to finish. Prestige raises importance, not observed quality.

### Road stage race

Each stage combines stage-win uncertainty with classification leverage. Sprint stages may matter through positioning and jersey points even when GC is stable. Mountain stages emphasize group selection, pacing, attacks, time gaps, and GC threat. A transition stage can reward a breakaway audience. Store stage and post-stage classification separately.

### Time trial

Riders start separately at intervals; UCI describes the individual format in its [road overview](https://www.uci.org/article/about-road-cycling/3R0Ls046rySKwc4fjq5yVc). Key signals are checkpoint rank/gap evolution, pacing reversals, start-order context, conditions changing across start times, equipment incidents, and GC projection. On-road proximity is not competitive proximity.

### Sprint finish

Measure credible contenders, lead-out organization, late group state, positioning transitions, wind/finish geometry, and uncertainty—not only pass/attack counts. Repetitive safe kilometers should influence viewing format, not erase final execution.

### Cyclocross

Model lap/checkpoint gaps, start position, technical sections, running/pit/bike changes, group formation, errors/mechanicals, surface evolution, and series/championship stakes. Course conditions can change lap by lap. A late close gap may still be tactically settled; a larger gap can follow repeated technical exchanges.

## Spoiler classification

| Class | Examples | Strict mode |
|---|---|---|
| Pre-start safe | race/stage identity, published route, scheduled start, pre-start classification, forecast, followed rider | Allowed |
| Evaluative | rank, “epic,” “chaotic,” post-race format recommendation | Hidden |
| Structural | break formed/survived, bunch sprint, actual weather, crashes, route shortening, stage duration | Hidden |
| Outcome | winner, podium, gaps, GC/jersey changes, withdrawal/penalty, time cut | Forbidden |
| Indirect | next-stage jersey wearer, changed start list, winner image, result URL/analytics | Forbidden |

## Edge cases and limitations

- Gaps are estimates, stale, corrected, or measured between vehicles/groups rather than exact riders.
- Group identity changes rapidly; neutralization, convoy blockage, GPS loss, tunnels, and broadcast inference reduce confidence.
- Attacks and tactical intent often require editorial annotation; telemetry alone cannot reliably identify them.
- Route deviation, shortened stage, cancelled climb, changed finish, neutralized time, stopped/restarted event.
- DNS, DNF, OTL, DSQ, relegation, time/points penalty, result appeal, jersey reassignment, team withdrawal.
- Same-time rules, bunch timing, bonus seconds, countback, team classifications, and category-specific rules.
- Cyclocross lapped/80% removal and pit/bike-change rules depend on the effective regulation.
- Weather causality is uncertain; report observation and impact separately.
- Women's/men's, junior/U23/elite fields and calendars require their own baselines; never treat coverage gaps as lower quality.

Missing groups/actions are unknown, not zero. A finish-only feed supports result display but not a defensible watchability path.
