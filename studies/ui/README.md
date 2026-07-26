# OTW.sport UI Research

## Decision summary

OTW should look like a calm, trustworthy viewing planner—not a scoreboard, betting product, or generic sports-news feed. Its first screen must answer, within seconds: **What should I watch, in what format, and why is it right for me?**

The recommended visual direction is **Editorial Utility**: a neutral, content-first shell; restrained sport accents; strong typographic hierarchy; and progressive disclosure around spoilers and analysis. The primary unit is a personalized event recommendation, not a raw score.

## Study scope

This study covers the initial Formula 1, tennis, and ice-hockey experience and the current SvelteKit/Tailwind/DaisyUI/Lucide implementation. It separates:

- **Evidence** — observed product behavior, repository facts, or standards.
- **Recommendation** — a design judgment to validate with users.

Files:

- [Competitive patterns](competitive-patterns.md): market patterns and transferable lessons.
- [Visual direction](visual-direction.md): hierarchy, responsive layouts, tokens, accessibility, motion, and states.
- [Component system](component-system.md): concrete Svelte component contracts and event-card anatomy.
- [Implementation roadmap](implementation-roadmap.md): sequenced delivery and validation.

## North-star screen

The signed-in home view is a “Your viewing plan” feed:

1. Spoiler-safety status and date range.
2. Available-time control: 10 / 30 / 60 / 120+ minutes.
3. One strongest recommendation with viewing format.
4. Remaining events grouped into Must watch, Worth your time, Highlights, and Skip.
5. Explanations and emotional profiles revealed on demand.

This hierarchy supports the core decision before secondary exploration.

## Non-negotiable principles

1. **Safe by default.** Outcome data never appears without a deliberate, reversible-safe reveal flow.
2. **Recommendation before rating.** “Watch full replay · 54 min” is more useful than “87.”
3. **One cross-sport grammar.** Sport affects vocabulary and accent—not page structure.
4. **Never encode meaning by color alone.** Every tier and state has text and/or icon support.
5. **Progressive density.** Mobile shows the decision; detail views carry statistics.
6. **Accessible at baseline.** Target WCAG 2.2 AA, keyboard completeness, reduced motion, and system theme.

## Existing implementation assessment

The repository already contains `EventCard`, `PriorityTierSection`, `EmotionalProfileBar`, and a four-tier color map. These are a useful foundation. Key corrections are:

- replace emoji with Lucide icons plus visible labels;
- stop parsing display names from `eventId`;
- make the whole-card interaction a semantic link, not a `div role="button"` containing buttons;
- unsubscribe or derive store state safely;
- remove result-oriented “Watch Now” when a legal destination is unknown;
- make spoiler protection a page-level policy inherited by every child;
- use score as supporting evidence, not the dominant circular badge.

## Research questions still requiring user evidence

- Does a numeric score itself feel like a spoiler?
- Do users understand “emotional profile,” or prefer “What kind of event is this?”
- Which viewing-format label changes behavior: full replay, condensed, highlights, recap?
- Should “Skip” be visible, collapsed, or omitted?
- Can a single cross-sport card serve F1 sessions, tennis matches, and hockey games without confusing terminology?

These should be tested before visual polish is treated as final.
