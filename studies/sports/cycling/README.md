# Cycling Data Analysis Study

This study defines how OTW can recommend road cycling and cyclocross using mock data while integrations are parked. It treats a multi-day race and each stage as distinct recommendable objects: the event carries cumulative narratives; a stage carries its own route, tactics, result, and viewing format.

## Product questions

For a race, stage, time trial, or cyclocross event:

1. How important was it before the start for classifications and followed riders?
2. How much meaningful tactical uncertainty and sporting execution occurred?
3. What can OTW explain without leaking winner, gaps, attacks, weather, or withdrawals?
4. Is full coverage, final-hours coverage, condensed, highlights, recap, or skip appropriate?

Road cycling officially includes one-day, circuit, stage-race, individual time-trial, and team formats ([UCI overview](https://www.uci.org/article/about-road-cycling/3R0Ls046rySKwc4fjq5yVc)). Current, versioned Road and Cyclo-cross rules are published through the [UCI regulations index](https://www.uci.org/regulations/3MyLDDrwJCJJ0BGGOFzOat). Rules and route facts are evidence; analytical weights and labels are OTW hypotheses.

## Documents

- [Data points](data-points.md): facts, derived/context/personal fields, formats, and spoiler policy.
- [Watchability model](watchability-model.md): formulas, confidence, format logic, and validation.
- [Qualitative watchability](qualitative-watchability.md): contest-specific position, race-state changes, disruptions and calibration.
- [Mock-data contract](mock-data-contract.md): lifecycle and reveal contract.
- [Mock events](mock-events.json): fictional road and cyclocross fixtures.

## Decisions

- Keep `raceEvent` and `stage` IDs, statuses, classifications, and recommendations separate.
- Snapshot routes and classifications at start; later route or standings updates can leak outcomes.
- Model race state as groups, gaps, composition, terrain position, and tactical transitions—not final gaps alone.
- Treat attacks, breakaway survival, crash/weather occurrence, GC changes, and withdrawals as protected.
- Every fixture is marked `source: "MOCK"` and `fictional: true`.
