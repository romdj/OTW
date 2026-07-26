# UI Experiment Plan

## Goal

Determine whether one card shell can make mixed-sport viewing decisions fast while native detail modules preserve comprehension and trust. Use [mock-catalog.json](mock-catalog.json) for the first mixed feed and source-study fixtures for revealed/detail states.

## Shared card mapping

| UI slot | Contract field | Rule |
|---|---|---|
| Sport/competition eyebrow | `sport`, `identity.competition` | Text plus icon; never color only |
| Context | `identity.contextLabel` | “Race,” “Quarter-final,” “Stage 2,” etc. |
| Title | `identity.title` | Pre-event-safe names only |
| Time/status | scheduled time + lifecycle | Live/complete state stays structurally neutral |
| Priority | importance/watchability band | Strict mode uses pre-event importance only |
| Action | recommendation format/minutes | Omit minutes when structurally unsafe |
| Reasons | `safeReasons` | Maximum two; localized from reason codes |
| Confidence | confidence band/missing inputs | Surface only when material; not a score |
| Affinity | `affinity` | “Follows…” without outcome |

Filters converge on sport, competition, scheduled date, lifecycle, viewing format, time budget, followed entities, and confidence. Route terrain, surface, session type, league, discipline, round, and category are sport-specific secondary filters.

The detail shell converges on identity, spoiler control, recommendation, provenance/confidence, availability, and feedback. A discriminated module owns scoreboard/timeline, route, session, classification, tie, or set structures.

For qualitative profiles, cards should show no more than three salient labeled dimensions. Test plain text/chips before radar charts. Detail views should visually separate Competitiveness, Eventfulness, Aesthetic quality, and Importance, then explain personal fit independently. This prevents “high action” from masquerading as “high quality” and makes dominant masterclasses legible without claiming suspense.

## Experiment 1: universal versus adapted card

**Hypothesis.** A universal card shell with one sport-native context row is as fast to scan as separate sport cards and produces fewer inconsistent controls.

- A: identical shared shell; sport details appear only after opening.
- B: shared shell plus one native metadata row (e.g. tennis surface/round, F1 session/circuit, cycling stage/terrain).
- C: fully sport-specific card layouts.
- Tasks: choose three events for 60 minutes, identify competition context, explain why each was recommended.
- Measures: decision time, correct context, confidence, misclicks, System Usability Scale item subset, preference.
- Segment by sport familiarity and mixed- versus single-sport followers.

## Experiment 2: hierarchy comprehension

**Hypothesis.** Explicit container breadcrumbs prevent users confusing a session/stage/rubber result with the weekend/race/tie outcome.

Test flat titles against hierarchy chips/breadcrumbs for Formula 1, MotoGP, Superbike, cycling, rally, tennis Davis Cup, and two-leg football/volleyball. Ask users what unit they are about to watch and what larger contest it affects. Gate success at 90% correct identification before implementation.

## Experiment 3: strict spoiler planning

**Hypothesis.** Pre-event importance plus affinity is enough to construct a useful blind plan without outcome-derived ranking.

- Compare No Hints (pre-event ordering), Light Context (post-event band/generic taste reason), and Results Allowed.
- Measure selection usefulness after viewing, perceived leakage, trust, regret, and critical spoiler incidents.
- Explicitly test whether rank, format, duration, “final phase,” overtime, stage chapter, or thumbnail is considered a spoiler by sport.

## Experiment 4: viewing-format vocabulary

**Hypothesis.** `Full`, `Condensed`, `Highlights`, `Recap`, `Skip` works for match sports, but endurance/stage sports need `Final phase`.

Test labels with cycling/rally and motorsport viewers. Ask what content and runtime each implies. Separate recommendation from actual availability. Do not show a disabled Watch button when no product exists.

## Experiment 5: confidence and missing data

Compare:

- no indicator;
- qualitative “limited data” note;
- confidence band plus missing-input disclosure.

Use low-detail rally, motorsport, and college fixtures. Measure over-trust, understanding, and willingness to follow a recap recommendation. Numeric confidence is diagnostic, not default UI.

## Experiment 6: mixed-sport filters

Test one global filter bar against progressive disclosure of sport-native filters. Tasks should include “find a completed tennis match,” “find an upcoming racing session,” and “make a 30-minute plan.” Measure completion, abandoned filters, and accidental hidden-outcome sorting.

## Experiment 7: qualitative profile comprehension

Use the four fictional archetypes in [qualitative watchability](qualitative-watchability.md). Compare:

- one overall “worth watching” band;
- four separated composites;
- three salient dimension chips plus a format recommendation.

Ask users to distinguish a close contest, an eventful contest, an aesthetically excellent performance, and an important event. Success requires at least 85% correct interpretation and no systematic preference for high-volume fixtures when the task asks for tactical or expressive quality. Capture individual taste rankings to test whether different recommendations can coexist with one shared event profile.

## Prototype sequence

1. Build static mobile cards from the normalized catalog at 320/375 px and a desktop list at 1024/1280 px.
2. Add spoiler-state switching with separate fixture fetches; inspect DOM, accessibility tree, network, URLs, logs, and analytics.
3. Add discriminated details for four hierarchy extremes: basketball game, tennis tie/rubber, cycling stage, rally special stage.
4. Run five formative sessions, correct terminology/layout, then a counterbalanced 18–24 participant comparison across familiarity segments.
5. Only after comprehension succeeds, explore visual expression and recommendation-score display.

## Decision criteria

- At least 90% correctly identify the recommendable unit and parent context.
- Median plan completion under 90 seconds for six mixed cards.
- At least 80% correctly distinguish recommendation format from availability.
- No protected outcome fields in safe payload/DOM audits.
- Fewer than 5% critical perceived spoiler incidents; investigate every incident.
- Adapted card B must improve context comprehension materially to justify its extra density; otherwise keep the universal shell.

## Traceability

Test copy and detail modules must trace via each catalog record's `sourceStudy` and `sourceMockId`. Sport-specific trait labels come from that sport's `data-points.md`/`watchability-model.md`, never from a global synonym table without analyst review.
