# Rally Data Points

## Raw facts

**Recommendation — MVP:** stable championship/rally/leg/stage/crew/car/class IDs;
season/round/status; crew driver/co-driver, entrant/manufacturer/category and point
eligibility; rally UTC/local schedule; stage number/name/type, competitive length,
surface, scheduled/actual start, running order; official stage elapsed time,
penalty and notional time separately; stage and cumulative classification after
each stage; gap to leader/ahead; stage status (`SCHEDULED`, `RUNNING`, `COMPLETE`,
`CANCELLED`, `INTERRUPTED`, `NEUTRALISED`); retirement/restart status; source,
fetched/corrected/provisional/final timestamps; explicit scoring/rule profile.

**Recommendation — extended:** split locations/times and reliability; GPS speed/
trace, onboard/video timestamps; tyre compound/count, road position, forecast and
observed weather, surface degradation, dust/visibility, car setup/service actions;
incident type/location/severity, puncture/wheel change, spin/stall, mechanical
issue, flags, crew quotes; time-control arrival/departure, lateness; steward
decision document; championship probability and manufacturer nomination.

Official time, penalty and notional assignment are distinct facts. Keep raw and
revised classifications; never overwrite history without correction provenance.
Do not infer puncture/retirement from a slow split alone.

## Derived metrics

- Stage swing: change in cumulative gap/rank caused by competitive stage time,
  with penalty and notional components shown separately.
- Split pressure: cumulative leader/nearest-rival gap path at comparable splits;
  compare only crews that have reached the same control under compatible conditions.
- Classification pressure: closeness and probability of position change, weighted
  by stages/km remaining and points/title stakes.
- Lead change: overall leader A → B after official stage classification; distinguish
  provisional timing and changes caused solely by later penalties.
- Stage competitiveness: robust spread among eligible front-running crews per km,
  adjusted for category and conditions.
- Volatility: bounded sum of position/win-probability changes across stages.
- Recovery: position/time regained after setback; restart recovery is not an
  overall-comeback claim if the crew is no longer competitive for victory.
- Road-order disadvantage: expected time effect by start slot, surface cleaning/
  degradation and weather cohort; only model where enough comparable history exists.
- Reliability drama: attrition hazard based on context; incidents themselves are
  outcome-sensitive and not an automatic entertainment bonus.
- Power Stage/Sunday leverage: rule-versioned points probability, separate from
  overall rally win probability.

## Context

Championship standings and points available; title/manufacturer/category scenarios;
rally prestige; surface mix and forecast; itinerary/competitive kilometres;
road-order rule and starting slot; opening/closing day; Power Stage designation;
Super Sunday definition; class/category and nomination eligibility; home rally;
crew/manufacturer history, form and milestones known beforehand; service/restart/
penalty rules. Narratives identify both crew members and evidence window.

## Personalization

Followed crew/driver/co-driver/manufacturer/nation/category/rally; preference for
onboards, speed, technical driving, endurance, changing conditions, recoveries,
title stakes or underdogs; tolerance for incidents; available time; replay rights;
desired unit (`RALLY`, `DAY`, `STAGE`, `ONBOARD`); spoiler strictness; known result.

## Spoiler policy

| Field | Blind/pre-event | Completed protected | Revealed |
|---|---|---|---|
| Entry, route, surface, schedule, pre-event stakes | allow | allow | allow |
| Stage/rally winner, times, gaps, classification | forbid | forbid | allow |
| Stages actually completed/cancelled, duration | forbid | forbid | allow |
| Puncture, crash, retirement/restart, penalty | forbid | forbid | allow |
| Lead/split swings, comeback, Power/Sunday points | forbid | forbid | allow |
| “Chaos/classic”, rating/rank, format reason | forbid | forbid by default | allow |
| Thumbnail, URL, alt text, analytics | audit | audit/forbid leaks | allow |

Protected explanations use only pre-start facts: “mixed-surface opener with a
close title table.” Hide itinerary completion and number of viewable stage clips.

## Missing data

Schedule/standings supports importance only. Final classification cannot reconstruct
stage swings. Stage times without splits support stage/rally gap paths, not in-stage
pressure. Missing crews at a stage require status/notional evidence before inference.
No conditions cohort means omit road-order effect. Emit coverage, missing inputs,
confidence, provisional/final state and last correction.
