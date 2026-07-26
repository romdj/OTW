# Rally Decision Data Study

This study defines OTW data for pre-event importance, stage/rally watchability,
spoiler-safe explanation, personalization and viewing-format selection. The
hierarchy is championship → rally → leg/day → special stage → split. It is not
an implemented provider contract.

## Files

- [data-points.md](data-points.md): raw, derived, contextual, personal and
  spoiler-forbidden fields.
- [watchability-model.md](watchability-model.md): formulas, confidence,
  calibration, edge cases and validation.
- [qualitative-watchability.md](qualitative-watchability.md): corrected-time
  pressure, expected order, disruptions and discipline-specific data grades.
- [mock-data-contract.md](mock-data-contract.md): hierarchy/lifecycle contract.
- [mock-events.json](mock-events.json): fictional `source: "MOCK"` fixtures.

Labels: **Evidence** = sourced fact; **Inference** = conclusion; and
**Recommendation** = OTW hypothesis requiring validation.

## Primary sources

- **Evidence:** [FIA WRC regulations index](https://www.fia.com/regulation/category/704) publishes versioned 2025 and 2026 sporting regulations.
- **Evidence:** [2026 FIA WRC Sporting Regulations](https://www.fia.com/system/files/documents/wrc_2026_sr_version_13_january_2026.pdf) defines classifications, running order, notional times, restart, penalties and the Power Stage. The Power Stage is the final stage, timed to the millisecond; eligibility and final classification affect bonus points.
- **Evidence:** [FIA 2025/26 points decision](https://www.fia.com/news/world-motor-sport-council-meeting-rwanda-heralds-long-term-vision-wrc-global-karting-plan-and) gives 25-17-15-12-10-8-6-4-2-1 overall, 5-4-3-2-1 Sunday and 5-4-3-2-1 Power Stage points.
- **Evidence:** [FIA 2026 updates](https://www.fia.com/news/updates-2026-fia-wrc-sporting-regulations-approved-world-motor-sport-council) documents engine-change penalties/ineligibility, late-start notional time and service changes.
- **Evidence:** [WRC A–Z](https://www.wrc.com/en/misc/a-z) defines operational terms including running order, target time, time control and Super Sunday.

Never use current WRC rules as universal rally rules. Store organizer,
championship, category, season, regulation version and event supplementary rules.
