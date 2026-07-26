# MotoGP Data Points

## Weekend and rules context

**Evidence.** MotoGP weekends include Free Practice, Practice determining direct Q2 entry, Free Practice 2, Q1/Q2, Sprint, warm-up and Grand Prix. The top ten from Practice enter Q2 directly and two advance from Q1; Q2 establishes the leading grid positions ([MotoGP qualifying guide](https://www.motogp.com/en/news/2025/01/31/how-does-motogp-qualifying-work-the-complete-guide/517526)). Sprints are shorter and award a distinct points scale; points from Sprint and race accumulate in the championship ([MotoGP points](https://www.motogp.com/en/news/2025/01/28/what-is-the-motogp-points-system-all-you-need-to-know/517281)). Regulations change, so rules/session format must be versioned.

## Raw facts

| Group | Fields | Notes |
|---|---|---|
| Identity | championship/event/session IDs, season, class, circuit | This study scores MotoGP class only. |
| Session | type, ordinal, scheduled/actual start/end, status, duration/laps, ruleset | Distinguish Practice from free practice. |
| Entrant | rider ID/name/nation, number, constructor, team, bike, regular/replacement/wildcard | Keep rider, team and manufacturer championships separate. |
| Timing | lap/sector timestamps, lap time, gaps, rank at sample, personal/session best, pit/out-lap/in-lap | Preserve deleted/cancelled laps and corrections. |
| Race state | lap, position/order, gaps/intervals, pit status, laps completed, classification/status | Protected after session begins. |
| Grid | source session, grid position, pit-lane start, penalties | Final grid may differ from qualifying classification. |
| Conditions | track/air temperature, wet/dry, precipitation, wind, flag/red-flag state, track status | Timestamp every change. |
| Tyres | compound front/rear, new/used, changes, laps | Only expose claims where allocation/use data is reliable. |
| Incidents | crash, retirement, restart, long-lap/grid/time penalty, track-limits deletion, medical status | Avoid inferring cause. |
| Championship | standings/points before session, possible points, eligibility, clinch scenarios | Freeze before start. |
| Provenance | source IDs, fetched/effective time, completeness/finality/correction | Store model version with derivations. |

## Derived metrics

- Championship leverage: expected change in rider/team/manufacturer title probability from possible session outcomes.
- Grid surprise: difference between expected qualifying rank distribution and actual grid/classification, not championship rank minus grid.
- Qualifying jeopardy: probability near Q1/Q2 or session cut line, weighted by time remaining and valid attempts.
- Lap improvement pressure: valid personal/session-best deltas near session end.
- Pace convergence: dispersion of representative clean-lap pace among relevant riders, adjusted for tyre/conditions where available.
- Race lead/battle changes: classification changes with persistence and timing confidence.
- Battle density: riders within a calibrated interval, adjusted for track/lap/pace and closing rate.
- Position volatility: persistent rank movement excluding pits, timing correction, start transients and classified DNFs where appropriate.
- Comeback/recovery: positions/probability regained after a setback; revealed-only and cause-neutral unless verified.
- Upset magnitude: result against pre-session probability; revealed-only.
- Flag disruption: lost session/race opportunity and restart effects, without equating disruption to quality.
- Tyre-strategy divergence: compound/age differences with adequate data; never infer tyre from pace alone.
- Manufacturer/team performance relative to rider/circuit baseline.

**Recommendation.** “Overtake” is valid only with an explicit provider definition or verified pass event. Position swaps can result from pits, crashes, penalties, timing corrections, riders off circuit or start-line ordering. Otherwise label `persistentOnTrackPositionGainEstimate`, disclose method, and never present it as official overtakes.

## Context and personalization

Context: championship round/stage, remaining points, home rider/manufacturer, title/clinch scenario, circuit passing profile, prior performance with era shrinkage, weather forecast, grid/Practice consequences, rivalry editorial provenance, injury/return/substitute status.

Personalization: followed rider/team/manufacturer/nation, novice/expert, preference for qualifying jeopardy, strategy, close battles, recoveries, wet sessions or technical pace analysis, session/time budget, replay access, known-result state, and spoiler mode.

## Spoiler-forbidden fields

| Protected state | Must not enter DOM, accessible text, URL, thumbnail, notification, log, analytics, or ordering |
|---|---|
| Live-safe | timing/order, leader, lap, remaining time, flags/weather change, crashes, penalty, Q2 status, live championship. |
| Completed-hidden | classification, grid/pole, gaps, duration/laps, DNF/DNS, crash/restart/red flag, penalties, lead changes, recovery/upset, championship movement, next-session ordering, result-derived watchability/tier. |
| Revealed | Outcome/structure allowed only after explicit event-scoped reveal. |

Even “wet-weather classic,” “red-flag drama,” a changed rider image, or Full Replay based on race shape leaks information. Strict mode uses pre-session context only.

## MVP and extended sets

**MVP:** event/session IDs, MotoGP class, season/round/circuit, session type/ruleset, schedule/status, entrants with rider/team/manufacturer/substitute flag, standings before, pre-session importance/probability/confidence, affinity, availability and provenance. For completed sessions, isolate classification physically.

**Extended:** corrected lap/sector samples, gaps/intervals/order, pit/out/in laps, grid penalties, tyre stints, flags/restarts, weather/track state, incidents with adjudicated cause, championship simulation, circuit passing priors, race-control messages and measured replay segments.

## Edge cases and quality

- DNS/DNQ/withdrawn/unfit: distinguish entered, participated and started. FIM rules define participation/start and regulate replacements ([FIM regulations](https://www.fim-moto.com/fileadmin/user_upload/Documents/2026/FIM_2026_MotoGP__Moto2___Moto3_World_Championship_Regulations.pdf)).
- Replacement/wildcard: link entrant for this event without overwriting regular rider identity.
- Interrupted/cancelled session: official classification depends on regulations and elapsed portion; never improvise ([MotoGP interrupted qualifying clarification](https://www.motogp.com/en/news/2023/03/10/gpc-update-clarification-of-interrupted-qualifying-results/415536)).
- Red-flag aggregate timing, restart distance, pit-lane starts, grid penalties and post-race penalties require finality state.
- Missing timing: use classification/grid only, confidence LOW, suppress battles/pace/overtake claims.
- Validate lap monotonicity (allow restarts), unique classification ranks, gap leader consistency, valid/deleted lap flags, entrant identity, points scale, and final amended classification.
