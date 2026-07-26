# Validation Plan

## Learning sequence

### Phase 0: terminology and leakage audit (1 week)

Recruit 5–6 participants per initial sport, including strict and flexible spoiler preferences. Show isolated metadata snippets—not full designs—and ask whether each reveals outcome, event shape, or importance. Produce a versioned spoiler taxonomy and regression corpus.

**Gate:** at least 95% agreement that P0 No-hints fields are safe; any disputed high-severity field is hidden.

### Phase 1: problem interviews (2 weeks)

Recruit 24–30 behaviorally qualified people: watched at least two events on delay in the last month, had replay access, and made a full-versus-highlights choice. Include F1, tennis, ice hockey, cross-sport, and accessibility needs.

Interview script:

1. “Walk me through the last event you intended to watch after it finished.”
2. “What did you open first, and what information did you avoid?”
3. “How did you decide full replay, highlights, or neither?”
4. “Show me the apps or settings you used.”
5. “Where did a spoiler nearly happen or happen?”
6. “What made the final choice good or regrettable?”
7. “How often did this happen in the last four weeks?”
8. Only then show the proposition and ask what would replace an existing step.

Do not ask “Would you use this?” Code observed behaviors, triggers, alternatives, severity, frequency, and replay availability.

**PMF problem gate:** ≥40% report the job monthly, ≥20% weekly in season, and ≥50% name a recent unsatisfactory workaround.

### Phase 2: concierge catch-up pilot (4 weeks)

Give 30–50 qualified users a manually reviewed morning plan via protected web page or email. Randomize explanation style (personal reason versus generic score) and capture whether they followed the recommendation.

Track:

- Plan open and decision rate.
- Time to first confident choice.
- Recommended format selected and actually watched.
- Replay-link success.
- Recommendation satisfaction.
- Spoiler incidents and near misses.
- Week-4 retained use and voluntary referrals.

**Gate:** ≥50% of activated users return in week 4; ≥30% follow one recommendation weekly; median decision time ≤60 seconds; ≥70% of followed recommendations are rated “right choice”; zero unresolved critical spoiler patterns.

### Phase 3: moderated prototype usability (iterative)

Use 5–8 participants per round; repeat until severe issues stabilize. Tasks:

1. “It is morning; you have 30 minutes and want no hints. Decide what to watch.”
2. “Understand why this was recommended without learning the result.”
3. “Find a playable option.”
4. “Change only this event to results allowed.”
5. “Correct a recommendation.”
6. “Schedule a protected morning notification.”

Measure completion without help, time, wrong turns, confidence (1–5), perceived spoiler exposure, and Single Ease Question after each task. Test keyboard-only, 200% zoom/reflow, screen reader names/order, reduced motion, and high-contrast conditions against [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

**Usability gate:** ≥90% complete the core choice unaided; ≥80% correctly predict what “Reveal” exposes; no critical accessibility blocker; median confidence ≥4/5.

### Phase 4: instrumented MVP (6–8 weeks)

North-star outcome: **qualified catch-up sessions that lead to a satisfactorily watched recommendation**, not feed engagement.

Event schema should record protection mode, recommendation format, confidence band, explanation opened, outbound provider status, watched confirmation, feedback reason, and spoiler report. Never put spoiler content in analytics labels.

PMF indicators:

- Activation: preferences saved + first plan decision.
- Weekly qualified retention by sport and replay availability.
- Plan-to-watch conversion and format accuracy.
- “Very disappointed if unavailable” survey among retained users; treat 40% as a useful directional benchmark, not proof.
- Organic invitation and notification retention.
- Comparison against a non-personalized ranking.

**Expansion gate:** week-4 qualified retention ≥50%, personalized plans outperform universal ranking by ≥10 percentage points in “right choice,” ≥10% invite another user, and at least 5–10% accept a real paid offer or a partner accepts a pilot.

## Research safeguards

- Separate users who seek recommendations from loyal fans who always watch.
- Segment by sport, strictness, provider access, and available time.
- Ask about actual behavior before attitudes.
- Do not expose real unwatched events during tests without explicit consent.
- Pre-screen test stimuli for URL, image, duration, accessibility-name, and notification leakage.
- Store a participant’s spoiler tolerance with each session, not as an analyst assumption.

## Priority research backlog

1. Define No-hints leakage corpus for F1, tennis, and hockey.
2. Validate the action taxonomy and time-budget interaction.
3. Prove recommendations change viewing behavior.
4. Test personal explanations against score-only and no-explanation controls.
5. Quantify value lost when replay links are unavailable.
6. Test blind-plan demand among strict users.
7. Validate notification timing and protected copy.
8. Explore weekend queue and newcomer context only after morning retention.

## Kill criteria

Pause expansion if users admire rankings but do not change viewing choices; strict protection removes too much value; replay access cannot be verified; personalization does not beat a universal list; usage is confined to rare marquee events; or spoiler incidents remain above 5 per 1,000 protected impressions after two remediation cycles.
