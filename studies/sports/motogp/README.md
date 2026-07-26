# MotoGP Data Analysis Study

## Purpose

This study defines the MotoGP-class evidence OTW needs to recommend weekend sessions without leaking outcomes. It covers free practice, Practice, Q1/Q2, Sprint and Grand Prix races. Integration and production code are parked.

## Deliverables

- [Data points](./data-points.md): facts, derived/contextual/personal/protected fields and scope.
- [Watchability model](./watchability-model.md): session-specific scoring, uncertainty and validation.
- [Qualitative watchability](./qualitative-watchability.md): expected order, persistent battles, disruptions and data grades.
- [Mock contract](./mock-data-contract.md): disclosure and lifecycle requirements.
- [Mock events](./mock-events.json): fictional `source: "MOCK"` session fixtures.

## Evidence convention

- **Evidence:** supported by MotoGP/FIM material.
- **Recommendation:** OTW product/analytical choice requiring validation.
- **Hypothesis:** relationship to test historically and with viewers.

Primary references: [2026 FIM Grand Prix regulations](https://www.fim-moto.com/fileadmin/user_upload/Documents/2026/FIM_2026_MotoGP__Moto2___Moto3_World_Championship_Regulations.pdf), [MotoGP rules overview](https://www.motogp.com/en/news/2025/03/11/what-are-the-motogp-rules-a-complete-overview/521386), [qualifying guide](https://www.motogp.com/en/news/2025/01/31/how-does-motogp-qualifying-work-the-complete-guide/517526), and [points explanation](https://www.motogp.com/en/news/2025/01/28/what-is-the-motogp-points-system-all-you-need-to-know/517281).

## Product conclusion

**Recommendation.** Treat every session as its own event and model `PRACTICE`, `QUALIFYING`, `SPRINT`, and `RACE` separately. A practice's value is progression/pace discovery; qualifying is lap-time and cut-line jeopardy; races are position, battle and championship dynamics. Never use a universal overtaking count unless its detection contract is known.
