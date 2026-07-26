# OTW.sport UX Study

## Decision summary

OTW should be designed as a **spoiler-safe viewing planner**, not a scores app or a generic “IMDb for sports.” Its core promise is: *given what I care about and the time I have, tell me whether to watch the full replay, highlights, or skip—without telling me what happened.*

The initial experience should serve F1, tennis, and ice hockey through one shared decision model while preserving sport-specific event structure. The first release should optimize the morning catch-up journey; weekend planning is secondary.

## Evidence base and limits

Repository evidence includes the existing prioritization model, `/discover` route, `EventCard`, and `doc/features/prioritization-engine.md`. External evidence is linked inline throughout this study. Notable signals:

- A 2025 IBM survey reports strong interest in personalized sports content and AI features, including among tennis fans ([IBM Sports Survey PDF](https://filecache.mediaroom.com/mr5mr_ibmnewsroom/199459/IBM_Sport_Survey_Report_2025.pdf)). It supports the category, not OTW demand.
- Spoiler research is mixed and highly sensitive to medium, involvement, and spoiler type: short-story results cannot safely be generalized to committed sports fans ([Leavitt & Christenfeld](https://pubmed.ncbi.nlm.nih.gov/21841150/); [Daniel & Katz](https://journals.sagepub.com/doi/10.1177/0033294118793971); [Rosenbaum & Johnson](https://www.tandfonline.com/doi/abs/10.1080/15213269.2017.1338964)).
- Explainable recommendation can improve understanding and calibrated trust, but explanations must be faithful rather than persuasive decoration ([Zhang & Chen survey](https://arxiv.org/abs/1804.11192); [Balog & Radlinski](https://doi.org/10.1145/3605357)).

All proposed behaviors remain **hypotheses until tested with target users**.

## Study contents

- [Users and jobs to be done](users-and-jtbd.md)
- [Journeys and information architecture](journeys-and-information-architecture.md)
- [Spoiler safety and trust](spoiler-safety-and-trust.md)
- [Qualitative watchability experience](qualitative-watchability-experience.md)
- [Validation plan](validation-plan.md)

## Product principles

1. Ask “how much time?” before showing a feed.
2. Recommend a viewing format, not merely rank events.
3. Treat every metadata field as a possible spoiler.
4. Keep reveal actions local, explicit, reversible only by leaving the revealed state.
5. Explain recommendations with user-relevant inputs and data freshness.
6. Never imply replay availability unless it has been verified.
7. Use a shared vocabulary—Full replay, Highlights, Skip—then add sport-specific context.
8. Make uncertainty visible; do not fabricate precision.

## Prioritized roadmap

**P0 — Validate:** concierge morning brief, no-score spoiler mode, time-budget selector, format recommendation, “right for me?” feedback.

**P1 — Earn trust:** verified watch links, faithful “Why?” sheet, corrections, watched-state sync, notification controls.

**P2 — Deepen:** weekend queue, household/device handoff, preference learning, newcomer explanations.

**Defer:** social feed, public ratings, achievements, universal standings hub, and auto-generated prose not grounded in source data.
