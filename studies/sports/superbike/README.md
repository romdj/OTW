# Superbike Data Analysis Study

## Purpose

This study defines WorldSBK evidence for spoiler-safe session recommendations: practice, Tissot Superpole, Race 1, Superpole Race, and Race 2. Provider integration and production code are parked.

## Deliverables

- [Data points](./data-points.md): raw, derived, contextual, personal and protected fields.
- [Watchability model](./watchability-model.md): session scoring, confidence and validation.
- [Qualitative watchability](./qualitative-watchability.md): session-aware order changes, pressure, flow and safety treatment.
- [Mock contract](./mock-data-contract.md): disclosure/lifecycle requirements.
- [Mock events](./mock-events.json): fictional `source: "MOCK"` fixtures.

## Evidence convention

- **Evidence:** supported by FIM/WorldSBK sources.
- **Recommendation:** OTW product/analytical choice requiring validation.
- **Hypothesis:** relationship to test historically and with viewers.

Primary references include the [2026 FIM WorldSBK regulations](https://www.fim-moto.com/fileadmin/user_upload/Documents/2026/2026_FIM_WorldSBK_WorldSSP_WorldSPB_WorldWCR_World_Championship_Regulations_CLEAN_FINAL.pdf), [WorldSBK glossary](https://www.worldsbk.com/en/glossary), and official [WorldSBK rules/news](https://www.worldsbk.com/en/news).

## Product conclusion

**Recommendation.** Treat all five session types separately and model the weekend dependency graph. Superpole sets Race 1 and Superpole Race grids; Superpole Race results contribute points and determine Race 2's leading grid positions. A session can therefore matter even when its standalone action is modest.
