# Football Data Points

## Raw facts

**Recommendation — MVP:** stable provider/match/team/competition IDs; season,
stage, round/group, leg number, neutral-site flag, scheduled UTC, status and
provider correction time; explicit rule profile; pre-match table/group snapshot;
first-leg score and aggregate entering the match; pre-match series/qualification
state; ordered goals, own goals, cards, substitutions, penalties, VAR decisions
where supplied; minute, added-time component, half/extra-time segment and event
ordering; halftime/fulltime/extra-time/shoot-out score; shots and shots on target
with provider definition; lineups/formations when authoritative.

Represent `90+7` as `{period: 2, minute: 90, added: 7, sequence}` rather than
flattening it to minute 97. **Evidence:** IFAB says displayed added time is a
minimum and may increase; elapsed broadcast time is not reliably reconstructible
from the display alone ([Law 7](https://www.theifab.com/laws/latest/the-duration-of-the-match/)).

**Recommendation — extended:** shot coordinates/body part/assist type; provider-
versioned xG and post-shot xG; blocked shots, big chances, possession sequences,
field tilt, final-third entries, progressive actions, PPDA/pressing events,
keeper actions, set-piece phases, injury/stoppage/VAR durations, crowd/audio,
video timestamps and win/qualification probability.

### Definition safeguards

Shots, shots on target, chances, possession and assists vary by provider.
Expected goals is a model output, not an observed universal fact: store provider,
model/version, included shot types, penalty value and update time. Never sum or
benchmark xG across incompatible models. Missing xG is not zero.

## Derived metrics

- Score-state seconds: tied, one-goal, two-plus; calculate separately for match
  and aggregate/tie state.
- Equalizers: goals changing a deficit to a tie. Go-ahead goals change tie to
  lead. Lead change requires Team A lead -> tie -> Team B lead; track separately.
- Comeback depth: greatest match/aggregate deficit later erased; whether completed
  is an outcome spoiler.
- Late leverage: state change in final regulation phase or added time, based on
  actual sequence—not simply `minute >= 75`.
- Suspense: uncertainty integral over match-win probability for league games and
  qualification probability for knockout ties.
- Volatility: bounded sum of absolute probability changes.
- Pressure: rolling xG/shot-quality/territory imbalance. With only shots, call it
  a low-confidence shot-pressure proxy.
- Tactical quality: progression under pressure, compactness/shot suppression,
  transition control, set-piece execution and opponent-adjusted possession;
  never infer a “masterclass” from 0-0 alone.
- Card impact: probability/state change after a red card; do not add a fixed drama
  bonus. Separate second-yellow and direct red; distinguish player vs staff.
- Upset: pre-match strength probability versus result, competition-calibrated.
- Stakes delta: qualification/title/relegation probability change from official
  scenarios or clearly labelled simulation.

## Contextual fields

Format (`LEAGUE`, `GROUP`, `SINGLE_KNOCKOUT`, `TWO_LEG`, `FINAL`); points and
tiebreak order; replay/extra-time/penalties rules; first/second leg; aggregate
before kickoff; bracket and next round; table games played/points/GD; official
clinch/elimination/title/relegation scenarios; derby evidence/reason; team
strength/form, rest/travel, lineup availability, rotation incentives, fixture
congestion, neutral venue and historical milestone known before kickoff.

Derby/rivalry is curated, time-bounded metadata—not deduced from geography or
social volume. “Must win” requires an official scenario or a reproducible model.

## Personalization

Followed club/player/nation; rival/derby interest; competition familiarity;
preference for tactics, goals, goalkeeping, pressing, upsets, stars, atmosphere
or stakes; tolerance for controversy/penalties; available minutes; replay access;
spoiler strictness; known result/already watched; preferred commentary language.
Personal relevance changes priority and format, never objective watchability.

## Spoiler policy

| Field | Blind/pre-match | Completed protected | Revealed |
|---|---|---|---|
| Teams, kickoff, pre-match table/stakes | allow | allow | allow |
| Score, winner, scorers, cards, shoot-out | forbid | forbid | allow |
| Aggregate after match, qualifier, table after | forbid | forbid | allow |
| Extra time/penalties occurred, duration | forbid | forbid | allow |
| Equalizers/leads/comeback/late drama, xG | forbid | forbid | allow |
| “Classic”, upset, tactical masterclass, rating/rank | forbid | forbid by default | allow |
| Full/condensed/highlights recommendation | optional | weak spoiler; hide in Blind mode | allow |
| Thumbnail, alt text, provider URL, analytics | audit | audit/forbid leaks | allow |

Protected explanations use only pre-match facts: “second leg with the tie level
before kickoff.” Result payloads must be server-separated, not CSS-hidden.

## Missingness

Schedule/table only supports importance. Goals without event times support result
but not suspense. Timeline without shots supports score-state/volatility proxy.
Box score without timeline cannot produce lead changes or late drama. No compatible
xG means omit xG-based quality. Emit `availableInputs`, `missingInputs`, coverage,
confidence, source and correction state.
