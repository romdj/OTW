# Handball Data Analysis Study

## Purpose

This study defines the indoor-handball evidence OTW needs for pre-match importance, post-match watchability, spoiler-safe explanation, personalization, and viewing-format selection. Provider work and production code are deliberately parked.

## Deliverables

- [Data points](./data-points.md): facts, derived/contextual/personal fields, disclosure rules, and scope.
- [Watchability model](./watchability-model.md): transparent scoring, confidence, and validation.
- [Mock contract](./mock-data-contract.md): lifecycle and protected-payload requirements.
- [Mock events](./mock-events.json): fictional `source: "MOCK"` fixtures.

## Evidence convention

- **Evidence:** supported by an authoritative rule or competition source.
- **Recommendation:** OTW design or analytical choice requiring validation.
- **Hypothesis:** unproven relationship to evaluate historically and with viewers.

Primary references include the [IHF indoor rules effective July 2025](https://www.ihf.info/sites/default/files/2025-07/09A%20-%20Rules%20of%20the%20Game_Indoor%20Handball_E.pdf), [IHF competition regulations](https://www.ihf.info/media-center/official-documents), and competition-specific regulations such as the [2025/26 EHF Champions League Men regulations](https://www.eurohandball.com/media/g4zjzurr/ehf-champions-league-men-2025_26-regulations.pdf).

## Product conclusion

**Recommendation.** Handball requires possession/shot-level analysis where possible: its high goal count makes final margin and raw lead changes weak proxies. Score within `competition × gender/category × phase × ruleset` cohorts, preserve two-leg aggregate and group-table context, and expose qualitative bands plus confidence before numeric precision.
