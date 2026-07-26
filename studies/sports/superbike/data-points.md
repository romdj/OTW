# Superbike Data Points

## Weekend structure

**Evidence.** In WorldSBK, Superpole determines Race 1 and Superpole Race grids. The top nine Superpole Race finishers form Race 2's first three rows, with positions from tenth onward based on Superpole; the Superpole Race also awards championship points ([WorldSBK glossary](https://www.worldsbk.com/en/glossary)). Rules and points must be season-versioned against the [FIM regulations](https://www.fim-moto.com/fileadmin/user_upload/Documents/2026/2026_FIM_WorldSBK_WorldSSP_WorldSPB_WorldWCR_World_Championship_Regulations_CLEAN_FINAL.pdf).

## Raw facts

| Group | Fields | Notes |
|---|---|---|
| Identity | championship/round/session/circuit IDs, season, class | This study targets WorldSBK, not WorldSSP/SPB/WCR. |
| Session | practice/Superpole/R1/SPR/R2, schedule/actual time, status, distance/time, ruleset | Preserve dependencies and restart versions. |
| Entrant | rider, nation/number, manufacturer, team, regular/replacement/wildcard | Rider/team/manufacturer titles are distinct. |
| Timing | lap/sector timestamps/times, gaps, intervals, rank, valid/deleted, pit/out/in lap | Retain corrections and timing quality. |
| Race state | lap, running order, gaps, pits, laps complete, classification/status | Protected after start. |
| Grid | grid and derivation (Superpole/SPR), penalties, pit-lane start | Final grid can differ from source result. |
| Conditions | track/air temperature, wet declaration, precipitation/wind, flag/track state | Timestamp changes. |
| Tyres | option/compound, front/rear, age/change, wet/dry | Only official-event supplier tyres are authorized under 2026 rules; use only reliable allocation/use data. |
| Incident | crash/retirement/restart, track limits, long-lap/grid/time/disqualification, medical status | Do not infer fault/cause. |
| Championship | rider/team/manufacturer standings before session, available points, clinch scenarios | Freeze before lights-out. |
| Provenance | source IDs, fetched/effective time, finality/completeness/correction | Model provenance is mandatory. |

## Derived metrics

- Championship leverage: expected change in rider/team/manufacturer title probability.
- Weekend leverage: downstream effect on later grids plus points, session-type specific.
- Grid surprise: actual versus expected Superpole/grid distribution, adjusted for rider, machine and circuit.
- Superpole jeopardy: pole/front-row uncertainty and late valid-lap pressure.
- Pace convergence: dispersion of representative clean laps under comparable conditions/tyres.
- Battle density/tension: persistent close gaps, closing rates, position/points leverage.
- Persistent lead/position changes excluding pits, crashes, penalties, corrections and start transients.
- Recovery/upset magnitude: outcome-dependent and revealed-only.
- Strategy divergence: verified tyre/pit choices, never inferred from lap time alone.
- Manufacturer/team relative performance with rider/circuit shrinkage.
- Weekend arc: how results change later-session importance; never leak earlier outcome in protected mode.

**Recommendation.** Do not call a rank swap an overtake unless an authoritative feed defines it. Otherwise expose `persistentOnTrackPositionGainEstimate` with exclusions/method. Position order changes can arise from pits, incidents, penalties, timing corrections or start sequencing.

## Context and personalization

Context: round/stage and remaining points; circuit passing/tyre history with era shrinkage; home rider/team/manufacturer; rivalry provenance; manufacturer concession context; weather forecast; injury/return/substitute; Superpole Race grid implications; results from earlier sessions only at the user's disclosure level.

Personalization: followed rider/team/manufacturer/nation; preference for Superpole, sprint action, strategy, battles, recoveries or wet racing; time/session budget; watched/queued state; replay service/territory; known-result state and spoiler mode.

## Spoiler-forbidden fields

| Protected state | Must not enter DOM, accessible labels, URLs, images, notifications, logs, analytics, ordering |
|---|---|
| Live-safe | timing/order, lap/time, leader, gaps, flags/weather change, crash/penalty, live points. |
| Completed-hidden | classification, pole/grid, gap/duration/laps, DNF/DNS, red flag/restart, penalties, lead changes/recovery, title movement, Race 2 grid, outcome-derived tier/format. |
| Revealed | Outcome/structure permitted only after explicit event reveal. |

Race 2 navigation can leak Superpole Race outcomes. Strict mode must use pre-session context and a safe grid payload independently authorized.

## MVP and extended fields

**MVP:** IDs, WorldSBK class, season/round/circuit, session type/dependencies/ruleset, schedule/status, entrants with team/manufacturer/entry role, standings before, pre-session importance/probability/confidence, affinity, availability and provenance. Isolate all results.

**Extended:** corrected high-frequency lap/sector/gap/order, pits, grid derivation/penalties, tyres, flags/restarts, weather, adjudicated incidents, championship simulation, circuit priors, race-control messages and replay segment timings.

## Edge cases and quality

- DNS/DNQ/withdrawn/unfit/replacement/wildcard: represent entry, participation and start separately.
- Replacement changes event entrant without rewriting the regular rider's identity/history.
- Red flags/restarts/shortened races: store segments, official distance and classification rule.
- Cancelled Superpole Race: Race 2 grid fallback must come from the applicable regulation, never guesswork.
- Provisional/post-race penalties can change grid, points and results; expose finality.
- Missing timing: classification-only, LOW confidence, suppress battle/pace/overtake claims.
- Validate unique ranks, lap monotonicity across segments, gaps to leader, valid/deleted laps, grid source, entrant IDs, points scale and amended final classification.
