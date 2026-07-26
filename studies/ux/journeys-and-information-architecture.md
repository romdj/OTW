# Journeys and Information Architecture

## Recommended information architecture

```text
Today / Catch up
├── Time budget + spoiler shield
├── Your plan
│   ├── Full replay
│   ├── Highlights
│   └── Not in your plan (collapsed)
└── Event detail (still protected)
    ├── Why this recommendation
    ├── Format and verified availability
    └── Explicit result reveal
Weekend
├── Upcoming plan
└── Completed catch-up
Following
History
Preferences
├── Sports and follows
├── Recommendation controls
├── Spoiler protection
└── Notifications
How OTW works
```

Make **Catch up** the default authenticated destination. “Sports” and standings are supporting navigation, not the primary journey. Replace tier-first grouping (“Must Watch”) with an executable plan ordered within the user’s time budget. Keep excluded events collapsed because “Skip” can feel judgmental to loyal fans.

## Journey 1: morning catch-up (P0)

1. User opens OTW in protected mode; no results, standings deltas, revealing imagery, durations, or notification badges appear.
2. OTW asks “How much time do you have?” with 10, 30, 60, 120+ and custom options.
3. User optionally changes sports and protection level for this session.
4. OTW returns a plan: recommended format, approximate/verified duration, short neutral reason, provider status.
5. User opens “Why?” or goes to a verified replay/highlight destination.
6. User marks watched or answers one-tap feedback: Right choice / Too long / Not for me / Spoiled.

**Success:** useful decision within 60 seconds and no critical spoiler exposure.

## Journey 2: weekend queue (P1)

1. Before the weekend, user sees followed and contextually significant upcoming events.
2. User selects availability windows and providers they can access.
3. OTW creates a watch plan without predicting “excitement” as certainty.
4. Completed events silently transition into protected recommendations.
5. Notifications say “Your catch-up plan is ready,” never the score or “unbelievable comeback.”

Upcoming and completed recommendations must be visually and semantically distinct: anticipated relevance is not post-event watchability.

## Journey 3: cross-sport discovery (P1)

1. A protected card says why the event fits the user (“Championship context” or “Good introduction to clay-court tennis”).
2. A “Context for newcomers” panel explains format and stakes using only pre-event-known facts.
3. User chooses highlights or replay.
4. Feedback distinguishes “not my sport” from “bad recommendation.”

## Event card content contract

In default **No hints** mode:

- Event identity and scheduled start.
- Competition and pre-event-known round/session.
- Recommended format and time cost only if duration does not leak.
- Personal reason based on follows/preferences.
- Data freshness and availability status.

Do not show a 0–100 score, emotional bars, outcome-shaped tags, final duration, number of sets/periods, overtime, finishing status, post-event hero images, or community reactions. The current `EventCard` score badge, tags, and spoiler-free summary therefore require a content audit before production.

## Key edge cases and recovery

| Edge case | Required behavior |
|---|---|
| Event postponed/abandoned | Say “Status uncertain”; remove watch recommendation; retain follow context |
| Replay unavailable or geo-blocked | Do not show “Watch now”; offer provider search or save-for-later |
| Data incomplete | Label confidence and freshness; prefer “Not enough data” over a guessed tier |
| User already knows result | Local “Results allowed for this event” control |
| Accidental reveal | Hide further spoilers, offer immediate report, log exact leaked field |
| Two devices out of sync | Default to stricter protection until watched/revealed state syncs |
| Shared screen | Quick “Shield all results” control without exposing current state |
| Tennis doubles/retirement | Use participant and completion semantics without implying winner |
| F1 sprint weekend | Keep sessions nested under one race weekend |
| Hockey playoff series | Freeze series context at pre-game state in protected mode |
| No recommendations | Explain coverage/availability limits and show followed upcoming events |

## Accessibility requirements

Target WCAG 2.2 AA ([W3C Recommendation](https://www.w3.org/TR/WCAG22/)). Priority tiers and sports must never rely on color alone; focus indicators, keyboard order, names/roles, zoom/reflow, text contrast, and minimum target spacing need acceptance tests. Honor `prefers-reduced-motion` ([W3C technique C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)). Announce plan updates with a non-interruptive live region. Reveal controls must state scope (“Reveal result for X”) and require confirmation in strict mode.

## Anti-patterns

- A feed that resembles a scoreboard.
- “84/100” presented as objective truth.
- Result reveal on card tap or hover.
- Using red/green alone for watch/skip.
- Spoiler protection buried in profile settings.
- Dead-end “Watch now” links.
- Auto-playing highlight thumbnails.
- Mixing future predictions with completed-event analysis.
- Optimizing engagement by sending urgency-heavy notifications.
