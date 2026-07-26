# Catch-up Prototype Acceptance Specification

## Purpose and MVP boundary

The `/discover` prototype must prove one journey:

> A time-constrained fan chooses how much OTW may reveal, sets a time budget, receives a composed viewing plan, and can queue, inspect, reveal, watch, and correct recommendations without crossing the selected spoiler boundary.

This is a catch-up planner, not yet the broader IMDb/community product. Public reviews, ratings, comments, profiles, achievements, social feeds, standings-led discovery, AI chat, and historical list-building are deferred.

## Product model

Keep three concepts distinct in copy and data:

- **OTW Score:** OTW’s historical assessment of event watchability.
- **Personal Fit:** how the event qualities match confirmed tastes and follows.
- **Viewing recommendation:** Full replay, Condensed, Highlights, Recap, or Skip for now, considering fit, time, availability, watched state, and disclosure mode.

Required explanation:

> **One event score, a recommendation made for you.** The OTW Score assesses the event. Personal Fit reflects your tastes and follows. Your plan also considers available time, format, and replay availability.

Available time must not be described as part of Personal Fit.

## Disclosure contract

The global mode selector remains persistently visible and has three states. Mode changes update content and ordering immediately without moving keyboard focus.

### No hints

Promise: pre-event-known context only; post-event quality and outcomes remain hidden.

Allowed fields:

- Event identity, competition, scheduled date, and pre-event-known round/session.
- Follow relevance and pre-event stakes frozen before the event.
- Replay availability status, but not unsafe provider metadata.
- Generic format availability without post-event runtime.
- Explanation that ordering excludes post-event quality.

Prohibited fields:

- OTW Score, score band, percentile, and post-event rank.
- Result, winner, standings/bracket changes, or participant prominence.
- Event-shape clues: final duration, set count, overtime, shootout, retirement, comeback, collapse, momentum shifts, weather reversal, or “strong finish.”
- Dimensions, post-event hero images, reactions, tags, and community signals.

Ordering uses only pre-event relevance, follows, and disclosure-safe availability. It must not use hidden score as a ranking signal.

Card copy pattern:

> **Aurora Grand Prix**
> Relevant to you · Championship context
> Replay available
> Ordered without post-event quality signals

### Guidance

Promise: the exact OTW Score is intentionally shown as a quality hint; results and event-shape details remain hidden.

Allowed fields:

- All No hints fields.
- Exact OTW Score and qualitative band.
- Personal Fit.
- Recommended viewing format.
- Broad, symmetric qualitative reasons such as “Strategic tension,” “Sustained competitive pressure,” or “Strong technical display.”
- Confidence, coverage, data freshness, and verified provider-asset runtime where the runtime does not reveal event structure.

Prohibited fields:

- Result or participant-specific post-event performance.
- Exact percentile unless separately validated as an acceptable additional quality hint.
- Structural and trajectory copy such as “went the distance,” “overtime thriller,” “from 11th,” “late reversal,” “unexpected momentum,” “strong finish,” or “three-set epic.”
- Completed-event duration when it implies set, period, retirement, or race shape.

Because the exact score is an explicit hint, Guidance must never be called “spoiler free.” Use:

> **Guidance enabled. Exact OTW Scores are visible; results and event-shape details remain hidden.**

Ordering may use OTW Score and Personal Fit. The live announcement states that quality guidance changed the order.

Card copy pattern:

> **Aurora Grand Prix**
> Exceptional · OTW 94
> Great fit for you · Condensed replay available
> Strategic tension · High-stakes context

### Full story

Allowed fields include exact score, percentile, result, complete explanation, participant-specific performance, dimensions, historical context, score status/version, and community information when later available.

Moving globally into Full story requires confirmation:

> **Reveal all results and complete analysis?** This will reveal outcomes for 4 events. Switching back can hide them, but cannot undo what you have seen.
> Cancel · Reveal all

Per-event reveal is available in any mode without changing the global mode. Its control names the event and scope. Revealed state persists for the session.

## First-run and returning behavior

First run begins with context before any assessment renders:

> **Choose without seeing what happened**
> OTW builds a viewing plan for the time you have. You control how much event quality and result information appears.

Require a mode selection and recommend No hints. Returning users restore their last mode and announce it. Notifications and nuanced taste sliders are not part of first-run setup.

## Composed-plan journey

1. User selects disclosure mode.
2. User selects 15, 30, 60, 120+, or later a custom time budget.
3. OTW composes a combination of viewing formats whose known total fits the budget.
4. The primary section shows ordered plan items and total planned time.
5. Remaining events appear collapsed under **Not in this plan**.
6. User may accept the plan, customize the queue, inspect protected details, or change budget/mode.

Required heading and summary:

> **Your 60-minute plan**
> 2 events · About 56 minutes · One duration estimated

The algorithm must compose a combination; promoting the first event that individually fits is insufficient. It must not knowingly exceed the budget. If no combination fits:

> **Nothing fits 15 minutes yet**
> Try a longer budget or choose an event to save for later.

Use **First in your plan**, not “Our first pick”; **Not in this plan**, not “Also worth considering”; and **Your catch-up plan**, not a generic “sports edit” or “weekend edit” unless the data is specifically weekend-scoped.

## Detail, availability, and reveal

Details open in a drawer, dialog, or dedicated state while preserving the current disclosure projection. Required sections:

1. Event and pre-event context.
2. Recommended format.
3. Why this fits the user.
4. Event assessment allowed in the current mode.
5. Confidence, coverage, freshness, and score status where allowed.
6. Provider availability.
7. Queue/watch action.
8. Per-event reveal.

“Watch now” is permitted only for a verified playable destination. Otherwise use **Find replay** or:

> **Replay availability not verified**
> OTW recommends this event but cannot confirm where it is currently available.

External destinations that may reveal results require a warning.

## Queue behavior

The queue is user-controlled; the plan is OTW-composed. Users can:

- Add and remove events.
- Reorder items.
- See format, total duration, and uncertainty.
- Mark watched.
- Open a verified destination.
- Retain the current disclosure protection.

Prototype queue state persists locally. Over-budget copy:

> **Your queue is about 18 minutes over today’s budget.**

An icon-only queue control requires an accessible name containing the event title. Adding/removing announces the change and updated duration.

## Feedback behavior

After an event is marked watched:

> **Was this the right viewing choice?**
> Yes · Partly · No

Partly/No reasons:

- Wrong format.
- Too long.
- Not for me.
- Description was inaccurate.
- Replay unavailable.
- Something was spoiled.

Then ask what should change: **This event**, **My preferences**, or **Replay information**. Do not infer a permanent taste from one action. Spoiler reports immediately suppress further event detail and capture the field/surface without asking the user to repeat the spoiler.

## Required prototype states

Fixtures must cover:

- First run/no follows.
- Loading and partial loading.
- Empty backlog and caught-up state.
- No event fits the budget.
- Replay verified, unavailable, and unknown.
- Known, estimated, and unknown duration.
- Good, Developing, and Limited recommendation confidence.
- Complete and incomplete event data.
- Recoverable error.
- Postponed/abandoned event.
- Already watched.
- Queue over budget.
- Per-event revealed and global Full story.
- Submitted feedback and spoiler report.

Error copy must preserve trust:

> **We couldn’t build your plan**
> Your disclosure setting is unchanged. Try again without revealing event results.

Empty copy:

> **You’re caught up**
> No completed events match your follows yet. Check upcoming events or adjust what you follow.

## Accessibility acceptance

- Mode/budget changes announce mode, disclosure consequence, plan count, duration, and reorder result through a polite live region.
- Reordering never moves focus.
- Confirmation and detail dialogs trap focus, close on Escape, and return focus to the invoking control.
- Protection status is exposed as status text, not color alone.
- Dimension visuals have adjacent text; no meaning depends on bar length or color.
- All controls work by keyboard and at 200% zoom/320 CSS px.
- Interactive targets are at least 44×44 CSS px.
- Reduced-motion preference disables reorder transitions.
- Unsafe content is absent from the DOM, accessibility tree, client projection, URL, image metadata, and analytics labels—not merely visually hidden.

## P0 versus deferred

P0 includes first-run mode selection, all three mode projections, exact score in Guidance, composed time plan, functional protected detail, deliberate reveal, local queue, provider states, watched feedback, required failure fixtures, and accessibility behavior.

P1 includes custom/reused budgets, provider preferences, persistent history, upcoming-versus-completed planning, notifications, per-sport taste controls, methodology/version detail, and cross-device state.

Community ratings, reviews, social features, standings-led discovery, achievements, public profiles, AI chat, native apps, and historical lists remain outside this prototype.

## Release gates

The prototype is ready for moderated testing only when a participant can:

1. Correctly explain what each mode reveals.
2. Understand that Guidance’s exact OTW Score is an intentional quality hint, not a result.
3. Distinguish OTW Score, Personal Fit, and viewing recommendation.
4. Set a budget and receive a multi-item composed plan that fits it.
5. Open details without crossing the active mode boundary.
6. Reveal one event deliberately and confirm global Full story.
7. Add, remove, reorder, and understand queue duration.
8. Recognize verified versus unknown replay availability.
9. Mark watched and route corrective feedback.
10. Complete the journey by keyboard without focus loss or hidden spoiler exposure.

Automated fixture tests must also prove that No hints ordering ignores all post-event fields, Guidance never renders outcome/shape fields, Full story requires confirmation, irrelevant hidden data is absent from the client projection, and the composed plan does not knowingly exceed its budget.
