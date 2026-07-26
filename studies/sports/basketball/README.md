# Basketball Data Analysis Study

This study defines the data OTW needs to recommend NBA, WNBA, and US college basketball games using mock data while provider work is parked. It separates pre-game importance from post-game watchability and keeps protected outcomes out of safe payloads.

## Product questions

For each game, OTW should answer:

1. How consequential and personally relevant was it before tip-off?
2. How much meaningful uncertainty, execution, and narrative reward did it contain?
3. Which explanation is faithful but safe at the viewer's spoiler setting?
4. Is full replay, condensed game, highlights, recap, or skip the best use of time?

The shared unit is a game, but rules and context are versioned by competition. NBA regulation periods are 12 minutes and overtime is five minutes under [NBA Rule 5](https://official.nba.com/rule-no-5-scoring-and-timing/); NCAA men's and women's structures differ, and NCAA publishes separate current [women's rules resources](https://www.ncaa.org/championships/playing-rules/womens-basketball-playing-rules/). Never infer period structure from `sport=basketball`.

## Documents

- [Data points](data-points.md): raw, derived, contextual, personal, and protected fields.
- [Watchability model](watchability-model.md): formulas, confidence, garbage-time and end-game handling.
- [Mock-data contract](mock-data-contract.md): UI fixture and reveal contract.
- [Mock events](mock-events.json): fictional NBA, WNBA, and college lifecycle examples.

## Decisions

- Store timestamped possession/score state, not only final box scores.
- Use win probability only when its model, inputs, league, and calibration are known.
- Treat overtime, a comeback, or a star stat line as protected structural/outcome information.
- Discount low-leverage possessions and repetitive intentional-foul sequences rather than equating scoring volume with entertainment.
- Keep observed game quality separate from team popularity, rivalry, and user affinity.
- Mark every mock record `source: "MOCK"` and `fictional: true`.

Rules are evidence only when linked to league/NCAA primary material. Weights, thresholds, labels, and viewing-format policies are hypotheses requiring user validation.
