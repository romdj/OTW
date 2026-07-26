# Formula 1 Data Points

## Domain and rules baseline

**Evidence.** A standard weekend normally contains three one-hour practices, qualifying, and the Grand Prix. A Sprint weekend replaces two practices with Sprint Qualifying and the Sprint; Sprint points are awarded to the top eight. Formula 1's [official Sprint guide](https://www.formula1.com/en/latest/article/the-beginners-guide-to-the-f1-print.55yJBEiF7vYkZEwSV9lZJ9) documents the format. The FIA's versioned [sporting regulations](https://www.fia.com/regulations/sporting-regulations/formula-1) are authoritative for session procedures, classification, points, safety car, suspension, and parc fermé.

**Recommendation.** Persist the source ruleset, not only `season`. At minimum distinguish `pre_2010_points`, `2010_2018`, `2019_2021_fastest_lap`, `2022_2024_sprint_and_reduced_distance`, `2025`, and `2026_plus`. Do not hard-code fastest-lap bonuses, Sprint formats, field size, qualifying elimination count, power/overtake terminology, or reduced-distance points across eras.

## Field taxonomy

### Raw facts

These should retain provider provenance, observation time, and correction state.

| Group | Fields | Why it matters |
|---|---|---|
| Identity | season, round, weekend/session IDs, official name, session type, format, ruleset revision | Stable joining and correct rules |
| Schedule | scheduled/actual UTC start/end, status, delay, suspension periods | Lifecycle and honest duration |
| Circuit | circuit/layout ID, lap length, scheduled laps/distance, street/permanent, altitude | Context; never a deterministic excitement proxy |
| Entrants | driver, constructor, car number, reserve/substitution flag | Personal relevance and comparisons |
| Pre-session | standings snapshot, points, remaining maximum under that ruleset, penalties known before start, forecast | Stakes and expected uncertainty |
| Timing | lap/sector times, speed-trap, position and interval at timestamp/lap, personal/session best | Pace, closeness, lead evolution |
| Race operations | grid/pit-lane start, pit in/out, tyre compound/age, SC/VSC/red flag, race-control messages | Strategy and interruption structure |
| Classification | provisional/final position, laps, gap, points, DNS/DNF/DSQ/NC and reason | Protected outcome; corrections matter |
| Conditions | air/track temperature, rainfall, wetness, wind by timestamp | Changing conditions, not merely “rain=true” |

Tyre labels are weekend-relative: Formula 1 explains that three dry compounds are selected and called soft/medium/hard, alongside intermediate and wet tyres ([official tyre guide](https://www.formula1.com/en/latest/article/the-beginners-guide-to-f1-tyres.61SvF0Kfg29UR2SPhakDqd)). Preserve both displayed compound and underlying specification where available.

### Derived metrics

- `championshipLeverage`: how much plausible session outcomes can change title probability or standings order.
- `competitiveDensity`: closeness among relevant cars after controlling for session phase.
- `leadContest`: time/laps with a credible challenge for first, not simply number of leader changes.
- `positionVolatility`: meaningful position movement, excluding pit-cycle noise where possible.
- `strategyDivergence`: simultaneous viable tyre/stop approaches and uncertainty around their convergence.
- `incidentImpact`: magnitude of SC/VSC/red-flag/weather/reliability events on competitive state.
- `qualifyingJeopardy`: cut-line closeness, late improvements, deleted laps, and upset versus prior pace.
- `practiceInformationGain`: how much a practice changes uncertainty about pace, reliability, or conditions.
- `narrativeResolution`: whether an established title, rivalry, comeback, debut, or team battle materially advances.

Each metric needs `value`, `confidence`, `coverage`, `modelVersion`, and contributing observations. Counts alone are unsafe: many passes can be routine; one strategic convergence can be compelling.

### Contextual features

Persist championship round, races/Sprints remaining, mathematical title eligibility, battle for other standings positions, circuit history, format, regulation change recency, teammate/rival baselines, home associations, debuts/returns, and prior-session context. Prestige and home status affect relevance, not observed quality.

### Personalization features

- Followed drivers, constructors, circuits, home nations, and rivalries.
- Experience level and appetite for technical/strategic explanation.
- Preferences for close combat, strategy, wet weather, qualifying jeopardy, recovery drives, or pure pace.
- Available minutes and access to full/condensed/highlight products.
- Already-watched sessions and knowledge state.
- Spoiler sensitivity, including whether “highly rated” itself is disallowed.

Do not infer sensitive traits or equate nationality with allegiance. Let users inspect and correct preferences.

## Session-specific meaning

### Practice

Practice has low championship consequence but can be valuable to technical viewers. Relevant signals are representative running, long-run pace uncertainty, qualifying simulations, tyre degradation, setup changes, rookie participation, reliability interruptions, changing weather, and the scarcity of running on Sprint weekends. Raw lap rank is misleading because fuel, modes, programmes, and tyres differ.

### Qualifying and Sprint Qualifying

Measure cut-line margins by segment, late-lap jeopardy, track evolution, aborted/deleted laps, yellow/red interruptions, teammate deltas, surprise relative to practice-informed expectation, and grid penalties known before or imposed after. Qualifying classification is provisional until steward processes settle; the FIA publishes event decisions and final classifications in its [decision-document system](https://www.fia.com/documents/championships/championships/fia-formula-one-world-championship-14).

### Sprint

Treat as a short race with points and lower recovery time. Use lead/battle proximity, pass quality, position volatility, incidents, tyre choice, and championship leverage. Do not assume every Sprint is inherently important. The Sprint result and Grand Prix grid are separate concepts in current formats.

### Grand Prix

Measure sustained competitive tension, strategy convergence, undercut/overcut attempts, pit execution, tyre-life uncertainty, meaningful passes, recovery relative to grid/pace, changing conditions, neutralizations, reliability, penalties, and championship effect. Formula 1 defines an undercut as pitting early to exploit fresh-tyre pace ([official glossary](https://www.formula1.com/en/latest/article/a-beginners-guide-to-f1slang.1Pg6tvGZ2y7u4KAnc8WXGl)); OTW should only label one when timing evidence supports it.

## Spoiler field policy

| Class | Examples | Strict mode |
|---|---|---|
| Pre-event safe | identity, schedule, rules, circuit, pre-start standings, forecast, followed-driver relevance | Allowed |
| Weak/evaluative spoiler | rank, watchability band, “chaotic”, “classic”, recommendation based on completed quality | Hidden in No hints |
| Structural spoiler | actual duration/laps, red flags, SC count, rain occurrence, pit count, DNF count, overtime-like extensions | Hidden |
| Outcome spoiler | winner, podium, classification, points change, title clinched, penalties that alter result | Forbidden until reveal |
| Indirect spoiler | changed standings, next-event champion label, celebratory imagery, URLs/analytics containing result | Forbidden until reveal |

Completed safe cards may use a generic reason such as “strong match for your saved F1 preferences” only if its ranking leakage is accepted by the selected mode. Outcome data must not exist in the safe DOM, accessible tree, URL, logs, notification payload, image metadata, or prefetched response.

## Data limitations and edge cases

- Timing gaps, clock corrections, duplicated laps, pit-cycle positions, lapped cars, and timing-line versus on-track order.
- Wet sessions where lap comparisons are non-stationary; practice programmes and fuel loads are unknown.
- Red-flag resets, standing/rolling restarts, shortened or abandoned races, formation-lap changes, and pit-lane starts.
- DNS, DNF, NC, DSQ, withdrawn entries, substitute drivers, shared historical drives, and post-session penalties/appeals.
- Countback title ties and rule-specific maximum points. “Can clinch” must be computed from the applicable rules, not a constant.
- Sprint formats and nomenclature have changed; 2026 introduces a major technical/rules era and revised terminology ([F1 terminology notice](https://corp.formula1.com/f1-2026-regulations-terminology-update/)).
- Broadcast availability and duration are territory-specific and independent of sporting data.

Missingness is information: publish coverage/confidence and suppress unsupported labels rather than filling with zero.
