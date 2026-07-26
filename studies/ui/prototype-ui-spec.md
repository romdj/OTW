# OTW Plan Prototype UI Specification

## Purpose and product hierarchy

The prototype must help a viewer answer: **What is worth my time, in which format, and why?** It presents two separate judgments:

- **OTW Score** is OTW's exact, user-independent historical assessment of an event. In Guidance and Full Story, render the exact score with its band: `Exceptional · OTW Score 94`.
- **Your Fit** is a personalized recommendation using tastes, affinities, available time, format, and access: `Great fit · Condensed · ~52 min`.

The score never changes with personal settings. Rank may change because the plan combines the score with personal utility. Community ratings are outside the MVP.

## Disclosure states

Use one radio group: `No hints | Guidance | Full story`. The current state must remain visible near the plan controls and in event detail.

| Mode | Status treatment | Permitted content |
|---|---|---|
| No hints | Shield; neutral blue/green; `Results and post-event quality hidden` | Frozen pre-event context, affinity, schedule, and disclosure-safe format/duration metadata |
| Guidance | Compass/eye; amber; `OTW Scores visible · results hidden` | Exact OTW Score, band, percentile, Your Fit, recommended format, and non-structural taste reasons |
| Full story | Eye; neutral plum/ink; `Results and analysis visible` | Results, protected reasons, dimensions, event shape, and narrative |

Guidance must be honest that the score is a quality hint. Do not describe it as spoiler-free. Moving to Full Story opens a confirmation dialog: `This will show results, scores and event-shape analysis for every event in this plan.` Initial focus is Cancel. Moving to a safer mode hides protected content immediately.

No Hints still responds to the time budget. Use only standardized replay-product durations or estimates known to be disclosure-safe. If none exists, show `Duration unavailable in No hints`; never imply an event fits the budget without evidence.

## Component hierarchy

```text
PlanPrototype
├── PlanHeader
│   └── DisclosureStatus
├── PlanControls
│   ├── DisclosureModeControl
│   └── TimeBudgetControl
├── PlanUpdateStatus
├── RecommendationFeed
│   ├── RecommendationCard (lead)
│   └── RecommendationCard[] (standard)
├── EventDetailPanel
│   ├── ScoreLockup
│   ├── ViewingRecommendation
│   ├── EventCharacter
│   └── ViewingOptions
├── RevealDialog
└── QueueFeedback
```

`PlanPrototype` owns selection and orchestration. Components receive disclosure-safe projections, not a full event object that is merely hidden with CSS. In production, protected payloads are separately fetched.

### Recommendation card

Information order is:

1. Sport, competition, round/session, and date.
2. Event title.
3. Score lockup in Guidance/Full Story.
4. Your Fit, format, and estimated time.
5. At most two permitted reasons.
6. Queue and Details actions.

The lead uses `Exceptional · OTW Score 94`; standard cards may shorten this to `Exceptional · 94` only when the score meaning is already visible on the page. Title and viewing recommendation remain more prominent than the number. Percentile and confidence are secondary. A provisional score is labeled `Provisional`; unsupported precision is not shown.

Cards are semantic `<article>` elements with a heading link or explicit Details button. Buttons are siblings of links. They use one shared geometry across sports; a labeled context line and restrained 2 px accent supply sport identity. F1 is an event title, not a forced versus matchup.

## Responsive layout

### Mobile — 375 px

- Use 16 px gutters and a 343 px content column.
- Header typography: kicker 12/16, title 36/40, introduction 16/24.
- Place a full-width disclosure status below the introduction.
- Render disclosure as three horizontal 44–48 px segments with labels only. Put the selected explanation below at 14/20.
- Render 15, 30, 60, and 120+ minute choices in one horizontal 44 px row.
- Show a plan total such as `1 pick · ~52 of 60 min`.
- Target the lead event title/score to begin by approximately 500–560 px from the page top.
- Lead card padding is 16 px; title 26/30; body 15–16 px. Queue and Details share one 44 px action row.
- Standard cards retain a visible Details action and a 44×44 Queue control.
- Full Story adds a compact result summary on cards; dimensions live in detail.
- Event detail opens as a full-height sheet with a sticky header, close control, focus trap, and safe-area-aware action footer.

### Desktop — 1280 px

Use a maximum content width of approximately 1120 px, a 12-column grid, and 80 px outer gutters:

- **Controls rail:** 3 columns/~248 px; sticky below navigation.
- **Recommendation feed:** 6–7 columns/~600–664 px; vertical list only.
- **Detail inspector:** 3 columns/~280 px; sticky. Before selection, explain how the plan was chosen.

The page header spans the grid. Do not stretch the lead card across the full 1120 px. Below approximately 1100 px, collapse the inspector into an overlay or full route.

## Detail inspector and sheet

Details is functional in every mode and preserves the selected event while the plan reranks.

- **No hints:** identity, hierarchy, schedule, disclosure state, affinity, safe format metadata, Queue.
- **Guidance:** exact score masthead, cohort percentile, confidence, `Why for you`, recommendation, and methodology link; no result or structural dimensions.
- **Full story:** result, full rationale, four assessment composites, sport-native evidence, cohort, and model version.

The four composites are Competitiveness, Eventfulness, Aesthetic quality, and Importance. Use labeled horizontal meters in detail, never a rainbow radar chart. Meters need native `<meter>` semantics or `role="meter"` with value/min/max and a readable band.

Dialogs and sheets have labelled headings, visible close controls, focus traps, Escape behavior, and focus restoration. Protected content must not exist in the safe DOM, accessible tree, URL, metadata, analytics, logs, cache key, or image alternative text.

## Reranking and feedback

Changing disclosure or budget may reorder the plan. Preserve the selected event, focused control, and scroll anchor. Animate positional changes with transform/opacity over 180–220 ms; never count scores upward or use market-style movement arrows.

Show a sighted status for approximately two seconds, such as `Plan reordered for Guidance`, and announce the same update through a polite live region. Under reduced motion, reorder immediately but retain the text confirmation. Stable event IDs must key cards so focus can be restored after movement.

Queue state is also keyed by event ID. A Queue action changes to `Queued`, updates the navigation count when available, and emits a non-blocking confirmation with Undo. Queue is distinct from Watched and from viewing availability. Never show `Watch now` without a verified legal destination.

## Tokens, themes, and route integration

Use repository-wide semantic tokens instead of component-local OS media queries:

| Token | Purpose |
|---|---|
| `--color-canvas` | Page background |
| `--color-surface` | Cards, controls, inspector |
| `--color-surface-subtle` | Grouped controls and inset regions |
| `--color-ink` / `--color-ink-muted` | Primary and secondary text |
| `--color-border` | Rules and card boundaries |
| `--color-action` / `--color-focus` | Interaction and focus |
| `--color-status-safe/guidance/revealed` | Disclosure accents |

Map these tokens into Tailwind and DaisyUI light/dark themes. Explicit app theme selection must override operating-system preference. Avoid component-level `:global(main)` overrides; the route/layout owns full-bleed geometry. The application layout supplies one `<main>` landmark, and the route uses sections or divs. The route alone owns page title and metadata.

Typography uses the existing legible sans for controls and body. A restrained serif may identify editorial headings, provided it is bundled or uses a robust system fallback. Minimum metadata is 12 px; mode explanations are at least 14 px. Touch targets are 44×44 px where practical.

## Accessibility and state coverage

Target WCAG 2.2 AA, 320 px reflow, 200% zoom, keyboard completion, visible ≥3:1 focus indicators, and System/Light/Dark/reduced-motion review. Radio segments retain native radio semantics and full-label hit areas. Never encode tier, sport, confidence, or disclosure by color alone.

Prototype fixtures must cover:

- loading and retained-content updating;
- no exact budget fit;
- provisional/low-confidence score;
- postponed/cancelled event;
- unavailable viewing source;
- long participant/competition names;
- partial provider failure and cached offline state;
- empty result after filtering.

When nothing fits, offer closest alternatives with an explicit explanation. Do not present an unexplained zero-result state.

## Implementation order

1. Correct route/layout/theme ownership.
2. Implement disclosure confirmation and safe projections.
3. Make time-budget behavior truthful in every mode.
4. Add functional inspector/sheet and move dimensions into it.
5. Add visible, focus-safe reranking feedback.
6. Refine 375/1280 typography and card geometry.
7. Add queue feedback and exceptional-state fixtures.
