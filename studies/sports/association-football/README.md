# Association-Football Decision Data Study

This study defines the data OTW needs to judge pre-match importance,
post-match watchability, spoiler-safe explanations, personal relevance and the
right viewing format. It covers domestic leagues, group stages, single-match
cups, two-leg knockout ties and finals. It is research, not an implemented
provider schema.

## Reading map

- [data-points.md](data-points.md): raw, derived, contextual, personal and
  spoiler-forbidden fields.
- [watchability-model.md](watchability-model.md): formulas, uncertainty,
  calibration, edge cases and validation.
- [qualitative-watchability.md](qualitative-watchability.md): attacking intent,
  transitions, spatial/tactical quality and three data grades beyond box scores.
- [mock-data-contract.md](mock-data-contract.md): lifecycle/disclosure rules.
- [mock-events.json](mock-events.json): fictional `source: "MOCK"` fixtures.

Labels: **Evidence** is sourced fact; **Inference** follows from evidence;
**Recommendation** is an OTW hypothesis requiring validation.

## Primary sources

- **Evidence:** [IFAB Law 7](https://www.theifab.com/laws/latest/the-duration-of-the-match/) defines two 45-minute halves, allowance for time lost, the fourth official's *minimum* added time, and default handling of abandoned matches.
- **Evidence:** [IFAB Law 5](https://www.theifab.com/laws/latest/the-referee/) states that referee decisions on play facts, including goals and result, are final, subject to the Laws' review mechanisms.
- **Evidence:** [IFAB penalties procedure](https://www.theifab.com/laws/latest/determining-the-outcome-of-a-match/) distinguishes a penalty shoot-out from the match itself.
- **Evidence:** [UEFA Champions League 2026/27 Article 21](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-21-Knockout-system-extra-time-and-penalty-shoot-outs-Online?contentId=aBOyMYjtgYYIYwn~YRHF5Q) defines aggregate equality after two legs, two 15-minute extra-time periods and penalties; the model must not assume an away-goals rule.

Competition regulations—not sport-wide defaults—own points, tiebreakers,
extra-time, replay, abandonment and qualification semantics. Version every rule
profile by competition, season and stage.
