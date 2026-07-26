# UI Implementation Roadmap

## Principle

Build the decision loop before broad page coverage. A polished standings page does not validate OTW’s product promise; a usable, safe viewing plan does.

## Phase 0 — Validation and contracts (2–4 days)

**Deliverables**

- Confirm the `EventPresentation` model with F1, tennis, and hockey data owners.
- Inventory every field that can reveal an outcome.
- Define four viewing formats and duration semantics.
- Test three low-fidelity card variants with 5–8 target users.

**Exit criteria**

- Users can identify the recommended event and format in under 5 seconds.
- No participant mistakes the universal score for the primary action.
- Spoiler-sensitive users understand what will be revealed before confirming.

## Phase 1 — Foundations (3–5 days)

**Deliverables**

- Semantic CSS tokens mapped into Tailwind/DaisyUI.
- System/Light/Dark themes.
- Typography, spacing, border, focus, and motion rules.
- Button, IconButton, Badge, Skeleton, Dialog, Sheet, Meter primitives.
- Visual fixture route or component workshop.

**Verification**

- Contrast checks in both themes.
- Keyboard completion and reduced-motion inspection.
- 320 px reflow and 200% zoom.

## Phase 2 — Core recommendation loop (5–8 days)

**Deliverables**

- `SpoilerModeControl` and `SpoilerGuard`.
- `TimeBudgetControl`.
- `EventRecommendationCard` variants.
- `PrioritySection` and `ViewingPlan`.
- Queue action and honest `ViewingOptions`.
- Skeleton, empty, stale, partial-error, and offline states.

**Exit criteria**

- A user can set time, choose an event, queue it, and inspect safe reasons without outcome leakage.
- Must/Worth hierarchy survives refresh and responsive changes.
- Protected data is absent from safe DOM/accessibility/analytics payloads.

## Phase 3 — Sport adapters (4–6 days)

Implement adapters in this order:

1. **Ice hockey:** validates familiar two-team structure and completed-game formats.
2. **Tennis:** validates round/surface and variable duration.
3. **F1:** validates the non-versus event title and session hierarchy.

For each, add fixtures for upcoming, completed, postponed/cancelled, missing provider, long participant names, and unusual competition context.

**Exit criteria**

- One component grammar supports all three without sport-specific card forks.
- Domain vocabulary is accurate.
- Sport accents remain secondary and accessible.

## Phase 4 — Detail and explanation (4–6 days)

**Deliverables**

- Event detail route.
- `EventCharacter` expanded meters.
- Personalized reasons and model-method disclosure.
- Confirmed reveal flow and hide-again action.
- Availability, territory, last-updated, and provenance presentation.

**Exit criteria**

- Recommendation rationale is understandable without exposing the result.
- Numeric model detail is optional.
- Back navigation restores filters, scroll, and safe mode.

## Phase 5 — Navigation and retention surfaces (3–5 days)

- Responsive top/bottom navigation.
- Queue and Watched history.
- Preference editing.
- Morning-plan notification entry point.
- Do not add community, reviews, broad stats, or per-sport home pages yet.

## Phase 6 — Hardening and measurement (ongoing)

### Product events

Track:

- plan viewed;
- time budget changed;
- safe explanation opened;
- recommendation queued;
- viewing option followed;
- result reveal requested/confirmed;
- recommendation marked useful/not useful.

Analytics must never include hidden outcome text. Measure time-to-first-choice, recommendation-follow rate, reveal rate, spoiler complaints, and return use—not generic card clicks.

### Test matrix

- browsers: current Safari, Chrome, Firefox, Edge;
- widths: 320, 375, 768, 1024, 1280;
- input: touch, pointer, keyboard;
- themes: system light/dark, increased contrast where available;
- assistive checks: VoiceOver and NVDA/JAWS sample;
- network: slow, stale cache, partial provider outage, offline;
- copy: English plus long-string pseudo-localization.

## Prioritized backlog

### P0 — required for credible MVP

- page-level spoiler policy;
- typed display model;
- recommendation-first cards;
- time budget;
- tiered vertical feed;
- queue;
- all responsive/error/loading states;
- WCAG 2.2 AA foundations.

### P1 — strengthens utility

- verified viewing availability;
- event-character detail;
- morning plan;
- Watched history;
- recommendation feedback.

### P2 — after retention evidence

- richer filters and custom time budget;
- editorial collections;
- sharing a spoiler-safe plan;
- advanced model explanations.

### Defer

- social feed, reviews, achievements, bespoke layouts per sport, live-timing dashboards, dense standings as the default destination, animated excitement charts, and native-app-only UI.

## Decision log

| Decision | Reason | Revisit when |
|---|---|---|
| Vertical ranked feed | preserves order and comparison | users regularly browse >20 events |
| Score is secondary | action and personal fit matter more | research shows score drives choice safely |
| One card grammar | product coherence and maintainability | a sport fails comprehension testing |
| Safe mode is global | prevents inconsistent child states | users demand per-league defaults |
| No imagery dependency | speed, licensing, spoiler risk | owned editorial assets prove useful |
| WCAG 2.2 AA baseline | accessibility and trust | never lower; consider AAA enhancements |

## Definition of done

A UI increment is complete only when it works with real-shaped fixtures, keyboard-only operation, both themes, reduced motion, 320 px reflow, slow/failed data, and explicit spoiler audit. Screenshots are required for PRs, but behavior and safety tests are the acceptance evidence.
