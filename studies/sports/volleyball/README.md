# Volleyball Decision Data Study

This study defines OTW data for pre-match importance, post-match watchability,
spoiler-safe explanation, personalization and viewing-format selection across
indoor and beach volleyball. It is research, not a provider integration.

## Files

- [data-points.md](data-points.md): raw, derived, contextual, personal and
  forbidden fields.
- [watchability-model.md](watchability-model.md): formulas, confidence,
  calibration, edge cases and validation.
- [mock-data-contract.md](mock-data-contract.md): lifecycle/disclosure contract.
- [mock-events.json](mock-events.json): fictional `source: "MOCK"` examples.

Labels: **Evidence** is sourced fact; **Inference** follows evidence;
**Recommendation** is an OTW hypothesis requiring validation.

## Primary rules

- **Evidence:** [FIVB Official Volleyball Rules 2025–2028](https://www.fivb.com/volleyball/the-game/official-volleyball-rules/) are the current indoor rules.
- **Evidence:** [FIVB basic rules](https://www.fivb.com/volleyball/the-game/basic-rules/) describes rally scoring, indoor first-four sets to 25, deciding set to 15, and three contacts in addition to block contact.
- **Evidence:** [FIVB Beach Volleyball Rules 2025–2028](https://www.fivb.com/wp-content/uploads/2025/02/FIVB-BeachVolleyball_Rules2025_2028-EN-v01.pdf) govern beach: two-player pairs, no fixed court positions and beach-specific contact/block rules.
- **Evidence:** [CEV's 2026 Golden Set update](https://inside.cev.eu/articles/cev/cev-announces-revisited-golden-set-rule/) shows that two-leg qualification logic changes by edition: future CEV ties trigger a Golden Set when match wins are level, replacing the prior ranking-points trigger.

Rule profiles must be versioned by discipline, competition, season and stage.
Do not assume that every event uses FIVB senior formats or the same Golden Set.
