# Tennis Data Analysis Study

## Purpose

This study defines the tennis evidence OTW needs to recommend **what to watch and in which format** without exposing an outcome. It covers ATP, WTA, singles, doubles, and Davis Cup. Provider selection and production integration are deliberately out of scope.

## Deliverables

- [Data points](./data-points.md): facts, derived/contextual/personal features, data quality, and MVP scope.
- [Watchability model](./watchability-model.md): reproducible pre-match importance and post-match watchability models.
- [Mock contract](./mock-data-contract.md): safe UI states and field-level disclosure rules.
- [Mock events](./mock-events.json): fictional fixtures for product exploration; every record is explicitly `source: "MOCK"`.

## Evidence conventions

- **Evidence** describes a rule or definition supported by a primary source.
- **Recommendation** is an OTW product/analytical choice that must be validated.
- **Hypothesis** is an unproven relationship to test with users or historical matches.

Official starting points include the [ITF Rules of Tennis](https://www.itftennis.com/en/about-us/governance/rules-and-regulations/), [ATP Rulebook](https://www.atptour.com/en/corporate/rulebook), [ATP ranking FAQ](https://www.atptour.com/en/rankings/rankings-faq), [WTA rules](https://www.wtatennis.com/news/1347389/wta-rules), [WTA rankings explanation](https://www.wtatennis.com/rankings-explained), and [Davis Cup format](https://www.daviscup.com/en/about/format).

## Product conclusion

**Recommendation.** Tennis cards should share OTW's generic event envelope but retain `tour`, `discipline`, `format`, `surface`, round, and—when applicable—event → tie → match context. A single universal excitement number should not be compared across ATP/WTA, singles/doubles, or best-of-three/best-of-five until it is calibrated within each cohort. UI fixtures should use qualitative bands and confidence first.
