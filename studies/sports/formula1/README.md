# Formula 1 Data Analysis Study

This study defines the Formula 1 information OTW needs to recommend a session without exposing its outcome. It is an analytical and UI prototyping contract, not a provider specification. All example records are fictional and explicitly marked `source: "MOCK"`.

## Product question

For each practice, qualifying, Sprint, or Grand Prix, OTW should answer:

1. How important was it before it began?
2. After completion, how rewarding is it likely to be for this viewer?
3. Which explanation is safe at the viewer's selected spoiler level?
4. Is full replay, condensed coverage, highlights, recap, or skip the best use of their time?

The current code already models weekends, sessions, standings context, weather, tyres, and a predicted excitement score. This study recommends separating immutable facts, observed session data, derived features, personalization, and protected outcomes. In particular, `predictedExcitement` should never be confused with post-session watchability.

## Documents

- [Data points](data-points.md): field inventory, session differences, eras, and spoiler classification.
- [Watchability model](watchability-model.md): feature definitions, scoring, uncertainty, and validation.
- [Qualitative watchability](qualitative-watchability.md): expected order, race-state change, disruption, flow, and full-race calibration.
- [Mock-data contract](mock-data-contract.md): UI-facing contract and reveal rules.
- [Mock events](mock-events.json): four lifecycle variants for one fictional weekend plus additional session examples.

## Evidence policy

Rules and definitions are facts only when linked to the [current FIA Formula 1 regulations index](https://www.fia.com/regulations/sporting-regulations/formula-1), FIA documents, or Formula 1's official explainers. Feature weights, thresholds, labels, and viewing recommendations are OTW hypotheses and must be validated. Regulations are versioned: persist `regulationEra` and the ruleset revision used for every derivation.

## Key decisions

- Model a weekend as a container and each track session as a recommendable event.
- Keep pre-session importance available even in the strictest spoiler mode.
- Store outcomes in a separately authorized payload; do not merely hide them with CSS.
- Prefer bands and faithful reasons over false-precision public scores.
- Never infer excitement from winner identity, prestige, or overtakes alone.
- Design for partial timing feeds, delayed steward decisions, abandoned sessions, and rules changes.

Provider integration is deliberately parked. The mock contract exists to let UI/UX work proceed independently.
