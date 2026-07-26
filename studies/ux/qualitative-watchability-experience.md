# Qualitative Watchability Experience

## Recommendation

OTW should not claim that an event has one objective “watchability.” It should describe a **match between an event’s viewing qualities, the user’s tastes, their time budget, and data confidence**. The primary output is an action—Full replay, Highlights, or Skip for now—supported by short, faithful reasons. A 0–100 number can remain an internal ranking feature, but should not be the main consumer-facing truth.

This document distinguishes evidence from design hypotheses. Explainable-recommendation research finds that explanations can support transparency, satisfaction, effectiveness, and trust, while also warning that an explanation may be persuasive without faithfully representing the model ([Zhang & Chen review](https://arxiv.org/abs/1804.11192); [Balog & Radlinski on faithful explanations and scrutability](https://doi.org/10.1145/3605357)). Research on progressive disclosure in intelligent systems supports testing layered transparency rather than showing every technical detail at once ([Eslami et al.](https://arxiv.org/abs/1811.02164)). These findings support the direction, but do not prove that OTW’s proposed dimensions or wording will match a fan’s felt experience.

## A plural model of watchability

**Hypothesis:** users make better choices from a small qualitative profile than from one precise score. Represent these independent, sport-translatable dimensions:

| Dimension | User meaning | Spoiler-safe expression | Leakage risk |
|---|---|---|---|
| Uncertainty | Outcome feels open | “Sustained competitive tension” | “Late uncertainty” reveals shape |
| Tempo/pressure | Frequency of meaningful pressure | “Regular pressure phases” | Counts or timing reveal events |
| Tactical tension | Interesting adaptation or constraint | “Contrasting approaches create tactical tension” | Naming the successful adjustment reveals outcome |
| Skill display | Exceptional execution | “Strong technical display” | Naming the performer can imply winner |
| Stakes/context | Why it matters | “High-stakes tournament context” | Post-event bracket/series state leaks |
| Volatility | Shifts in control or threat | “Momentum is less settled than usual” | “Comeback,” “collapse,” or “lead changes” leaks |
| Personal relevance | Fit to follows/taste | “Fits your preference for tactical contests” | “Your driver stars” reveals performance |

Dimensions describe *qualities*, not quality. “Controlled,” “chaotic,” “tactical,” and “relentless” are not ordered from bad to good. Avoid combining them into a radar-area score: area implies more is always better and is difficult to compare accessibly.

### Sport-specific translation

The common dimensions need sport-aware evidence and copy:

- **F1:** “Varied strategic options” and “Sustained race-management pressure” are safer than “undercut battle,” “safety-car twist,” or “charge through the field.” Do not expose pit-stop timing, retirements, finishing status, or a featured driver based on post-race prominence.
- **Tennis:** “Contrasting patterns of play” and “Sustained competitive tension” are safer than “five-set epic,” “saved match points,” “deciding-set swings,” or match duration. “Attacking intent” may be based on style signals, but must not imply that attack succeeded.
- **Ice hockey:** “High transition threat,” “Sustained territorial pressure,” and “Contrasting special-teams approaches” may work if they do not identify who controlled play. Avoid “overtime thriller,” “empty-net drama,” “goalie stole it,” period-by-period shape, and series state after the game.

Copy must describe symmetric event-level conditions unless the user explicitly permits participant-level performance hints. Every generated phrase needs a mapping to auditable inputs and a spoiler classification.

## Progressive disclosure contract

### Layer 1: decision card

Show only what is needed to choose:

> **Full replay fits your 90 minutes**
> Strong match for your preference for tactical tension.
> Confidence: Good · Event data checked 08:12
> [Why this fits] [Find replay]

Alternative, with insufficient evidence:

> **Highlights may be the safer choice**
> You follow this competition; event-quality data is incomplete.
> Confidence: Limited
> [What we know] [Correct this]

Do not show a numeric event score, dimension chart, superlative, participant hero image, or an unexplained “AI pick” on the card.

### Layer 2: “Why this fits”

Expose two groups and keep their provenance distinct:

- **About you:** “You prefer controlled, tactical contests” and “You follow this competition.”
- **About this event:** “Tactical tension: pronounced” and “Uncertainty: moderate,” subject to the current spoiler mode.

Add “Not used: final result or winner preference.” If a factor genuinely affected ranking, do not claim otherwise. Let users select “This doesn’t sound like me” or “This event didn’t feel this way.”

### Layer 3: method and evidence

Show plain-language definitions, source freshness, coverage gaps, model/version date, and which factors were unavailable. Technical detail should be optional, but uncertainty must never be hidden behind disclosure.

## Preference onboarding without a universal taste

Use four **independent continuums**, not personality types:

- Predictable control ↔ chaotic shifts.
- Tactical chess ↔ continuous action.
- Dominant mastery ↔ uncertain contest.
- Familiar loyalties ↔ discovery and neutral skill display.

Ask with paired event-neutral scenarios: “Tonight, would you rather watch a controlled strategic contest or frequent momentum shifts?” Include “Both,” “No preference,” and “Not sure.” Never force endpoints. Ask at most two choices during initial onboarding; learn the rest from explicit post-watch corrections, not clicks alone. A click may reflect provider availability, time, or loyalty rather than taste.

Preferences must be editable per sport. A user may seek tactical control in F1, attacking play in tennis, and transition chaos in hockey. Display inferred preferences as proposals: “We’re learning that you may prefer…” with Confirm, Change, and Don’t use this controls.

## Confidence and data grades

Separate three concepts that a single confidence badge would blur:

1. **Data coverage:** Complete / Partial / Minimal—were the expected event inputs received?
2. **Recommendation confidence:** Good / Developing / Limited—does OTW have enough preference and event evidence for this person?
3. **Availability verification:** Verified at time / Unverified / Unavailable—can the recommended format actually be accessed?

Avoid “92% confident,” which implies calibration that OTW has not demonstrated. “Data grade A” is also too opaque unless its rubric is adjacent. Use text and an icon, never color alone. Say what uncertainty changes: “Full-replay recommendation may change when complete event data arrives.”

## Cultural and style bias

What data systems call “action” often privileges scoring frequency, pace, overt transitions, English-language commentary, popular leagues, and familiar tactical norms. That can systematically underrate defensive craft, slow strategic pressure, lower-data competitions, women’s sport, non-Western styles, and styles enjoyed by experts.

Mitigations:

- Maintain dimension definitions per sport with reviewers from different fan cultures and expertise levels.
- Audit recommendation and “unknown data” rates by competition, gender category, geography, language, and style—not merely sport.
- Do not treat social buzz, broadcast volume, or highlight count as neutral quality evidence.
- Localize concepts, not just words; test whether “tactical chess,” “dominance,” and “chaos” carry the intended valence.
- Preserve “Not enough evidence” rather than assigning low watchability to sparse data.
- Publish dimension-level error and correction patterns; give communities a route to dispute definitions.

These are risk controls, not proof of fairness. Coverage parity and felt-experience parity require ongoing measurement.

## Correction and learning loop

After a confirmed watch, ask one low-friction question:

> **Did this match the experience we described?**
> Yes · Partly · No

On Partly/No, show selectable causes:

- Less/more tactical than described.
- Less/more action than described.
- Too predictable/too chaotic for me.
- Recommended format was wrong.
- Description gave something away.
- Data or availability was wrong.

Offer optional free text after categories. Never convert one correction into a permanent preference. Show the resulting proposal before applying it: “Use this to reduce action-heavy recommendations in tennis?” Corrections should update the event-quality model separately from personal taste; otherwise OTW may mislearn “the event was mislabeled” as “the user dislikes tactics.”

## Accessible presentation

Prefer labeled text scales or short horizontal bars to radar charts. Every visual must have an equivalent text summary and programmatic name. Meet WCAG 2.2 requirements for text alternatives, information and relationships, use of color, contrast, reflow, focus, and target size ([W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/); [Understanding Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)).

Example:

> Tactical tension — Pronounced
> Uncertainty — Moderate
> Tempo — Measured

Do not animate bars as if they were live measurements. Keep dimension order stable. Use familiar words first and define terms inline. Screen-reader text must not contain hidden spoiler detail. At 200% zoom, the card should become a single column without truncating qualifiers such as “Limited confidence.”

## Prohibited copy and leakage patterns

| Prohibited | Why | Safer alternative |
|---|---|---|
| “Instant classic” / “unmissable” | Universal claim and event-shape hint | “Strong match for your selected preferences” |
| “Comeback,” “collapse,” “upset” | Reveals trajectory/outcome | “Momentum is less settled than usual” in Light context only |
| “Went the distance,” “five-set epic” | Reveals tennis structure/duration | Omit structure; show provider runtime only after consent |
| “Overtime/shootout thriller” | Reveals hockey state | “Sustained competitive tension” |
| “Chaotic race with multiple DNFs” | Reveals F1 incidents | “Frequent changes in race conditions” only if user permits event-shape hints |
| “Driver/player/team X put on a masterclass” | Implies performance/outcome | “Strong technical display” without actor |
| “Objectively 87/100” | False precision and universal taste | “Full replay fits your preferences” |
| “Fans loved it” | Popularity bias, social proof | “Community signal available” only after methodology is disclosed |
| “Because you clicked…” | May misstate causality | “Influenced by: your confirmed preference…” |

## Validation protocol

### Study A: explanation-to-experience correspondence

Recruit 12–18 people per sport across expertise, preferred styles, cultures/languages, and accessibility needs. Have each watch the same legally available event or controlled excerpts without seeing OTW copy first. Collect independent dimension ratings and a spoken account of the felt experience. Then show three randomized conditions: score only, dimension profile, and action plus two-factor explanation.

Measure:

- Semantic agreement between spontaneous descriptions and OTW dimensions.
- Participant-rated faithfulness, usefulness, and spoiler leakage.
- Correct interpretation of each dimension and confidence label.
- Decision quality for Full replay / Highlights / Skip.
- Differences by sport, expertise, language, and preferred style.

### Study B: spoiler boundary testing

For unwatched real events, expose phrases one at a time. Ask: “What do you now infer about result, trajectory, duration, or key participant?” Record inference and confidence before asking acceptability. A phrase fails if users infer a protected fact, even when they say they personally do not mind.

### Study C: preference elicitation

Compare continuum choices, example-event pairings, and seven-dimension sliders. Test completion time, comprehension, felt self-representation, one-week stability, and whether choices improve held-out recommendations over a popularity baseline.

### Study D: correction integrity

Give users intentionally mismatched descriptions. Test whether they can distinguish “wrong about the event,” “wrong about me,” “wrong format,” and “spoiler.” Verify that they understand what will change before confirming.

## Success, failure, and kill criteria

Proceed when:

- ≥80% correctly paraphrase the qualitative dimensions without prompting.
- ≥75% prefer action-plus-reasons to score-only for making the viewing decision.
- ≥70% say the description matches their independently reported experience.
- Personal explanations improve correct format choice by ≥10 percentage points over a universal score.
- <5% of No-hints phrase exposures produce a high-confidence protected inference; any direct outcome leak is a release blocker.
- ≥90% distinguish data coverage from recommendation confidence.
- ≥85% correctly route a correction to event label, personal taste, format, or spoiler.
- No material faithfulness gap greater than 10 percentage points persists between major tested sport, expertise, language, or accessibility segments.

Rework or stop the qualitative layer if dimensions cannot be understood consistently; explanations mainly persuade rather than predict felt experience; preferences perform no better than a popularity list; strict spoiler-safe language becomes meaningless; numeric scores consistently support faster, better-calibrated choices without added harm; or sparse-data competitions are repeatedly presented as less worthy rather than less known.

## Delivery sequence

1. Create the spoiler-classified phrase dictionary and prohibited-copy lint corpus.
2. Validate four preference continuums with all three sports.
3. Prototype card, “Why this fits,” and method layers in No-hints mode.
4. Run correspondence and leakage studies before connecting generated explanations.
5. Launch with qualitative bands and explicit uncertainty; withhold public numeric scores.
6. Add correction learning only after event-label and preference feedback can be separated operationally.
