# Volleyball Data Points

## Raw facts

**Recommendation — MVP:** provider/event/participant IDs; discipline (`INDOOR`
or `BEACH`), gender/category, competition, season, pool/stage/round, scheduled
UTC and status; explicit best-of/target/win-by rule profile; indoor club/nation
teams versus beach pair identities; pre-match table/pool/bracket snapshot;
two-leg prior match and qualification rule; ordered set scores; ideally every
rally with set, sequence, score before/after, serving participant and point
winner; timeout/challenge; forfeit/injury status and correction timestamp.

**Recommendation — extended:** rally start/end/video time, rally contacts and
duration, attack attempts/kills/errors, serve attempts/aces/errors/velocity,
reception grades, sideout/breakpoint, blocks/touches, digs, setter/rotation,
substitution/libero, challenge decisions, beach side changes, weather/wind,
medical timeout and player-level attribution.

Provider definitions for kill, dig, reception grade, block and error differ.
Store provider/stat manual/version. A rally point and an attributed player
action are not interchangeable. Missing action attribution is not zero impact.

## Derived metrics

- Rally margin path per set and match; time/sequence tied, within one/two points.
- Lead changes: A leads -> tie -> B leads. Track ties reached and go-ahead points
  separately; exclude 0-0.
- Runs: consecutive points by one side. Record length, start/end score, server
  continuity and whether opponent timeout interrupted it.
- Deuce pressure: rallies after both reach `target-1` and every alternating set/
  match point under win-by-two rules; count set points saved/converted.
- Set competitiveness: area under a normalized margin curve, late closeness and
  deuce; avoid judging only final margin.
- Match suspense: uncertainty of match-win probability across rallies.
- Volatility: bounded sum of probability changes; include set-boundary reset.
- Comeback depth: maximum set deficit erased, sets-down recovery, match-point
  saves; all are protected spoilers.
- Serve impact: ace/error plus serve-conditioned opponent sideout versus
  competition baseline, only with serve sequence.
- Block impact: direct block points plus compatible touch/transition value;
  with box score, report block points only.
- Sideout/breakpoint quality by rotation (indoor) or pair/server (beach).

## Context and stakes

Pool standings, matches/sets/points ratios and official tiebreak order; knockout
round, elimination/medal status; best-of length; prior leg, match wins/ranking
points and Golden Set trigger; official qualification scenarios; opponent
strength/ranking; rivalry/rematch; roster/pair continuity; injuries; rest/travel;
home/neutral venue; beach weather known pre-match. “Must win” must be official
or reproducibly simulated.

## Personalization

Followed team, nation, club, pair or athlete; indoor/beach familiarity;
preference for long rallies, defence, serving, blocking, tactical rotations,
comebacks, stars, upsets or stakes; tolerance for error-heavy play; available
minutes; replay availability; spoiler strictness; known result/already watched.

## Spoiler policy

| Field | Blind/pre-match | Completed protected | Revealed |
|---|---|---|---|
| Participants, schedule, pre-match stakes/rules | allow | allow | allow |
| Set/match score and winner | forbid | forbid | allow |
| Sets played, deciding/Golden Set occurred, duration | forbid | forbid | allow |
| Rally path, runs, lead/deuce/comeback/match points | forbid | forbid | allow |
| Qualification/table after match, forfeit detail | forbid | forbid | allow |
| “Five-set thriller”, rating/rank, recommended format | forbid | forbid by default | allow |
| Thumbnail, alt text, URLs, analytics | audit | audit/forbid leaks | allow |

Protected copy uses pre-match facts only: “pool match with qualification at
stake.” A completed protected payload must not expose number of set-score rows.

## Missing data

Schedule/table supports only importance. Set scores allow set closeness and sets-
down recovery but not rally runs/leads/deuce sequence. Final match score alone
cannot establish competitiveness. Rally scores without action types support path
metrics, not serve/block claims. Emit available/missing inputs, coverage,
confidence, source and corrections.
