# Tennis Data Points

## Match ontology and authoritative facts

**Evidence.** Standard tennis is point → game → set → match; a tie-break can decide a set, while approved alternative formats include match tie-breaks. The exact competition rule must be recorded rather than inferred ([ITF Rules of Tennis](https://www.itftennis.com/en/about-us/governance/rules-and-regulations/)). ATP tournament levels include 250, 500, Masters 1000 and Finals; Grand Slams are independently governed and award 2,000 ranking points to champions ([ATP explanation](https://www.atptour.com/en/news/tennis-explained-atp-)). WTA uses WTA 125/250/500/1000 categories ([WTA category explanation](https://www.wtatennis.com/news/1922290/wta-unveils-comprehensive-rebrand)).

**Evidence.** Davis Cup is a team competition. A nation-versus-nation `tie` contains matches (historically “rubbers”). Current formats differ: centralized ties normally contain two singles and one doubles match, while home-and-away ties can contain five matches over two days; a match after the tie is decided has no live tie leverage ([Davis Cup format](https://www.daviscup.com/en/about/format)).

## Field taxonomy

### Raw facts

| Group | Fields | Notes |
|---|---|---|
| Identity | stable event/match/player/team IDs, tour, organizer, season | Never join players by display name. |
| Context | tournament, category, round, draw size, surface, indoor/outdoor, location, timezone | Round must distinguish qualifying and round robin. |
| Format | singles/doubles, best-of, advantage/no-ad, final-set rule, match-tiebreak target | Required to interpret closeness and duration. |
| Competitor | players/team, country, seed, ranking and ranking points **as of match start**, handedness | Doubles rankings are per player; team history is separate. |
| State | scheduled time, actual start/end, status, delay reason | `WALKOVER` has no played match; retirement/default is incomplete. |
| Score | ordered sets, games, tiebreak points, server by point | Protected after play begins. |
| Point stream | point index, server, point winner, game/set score before point, break-point flag | Preserve corrections and source timestamps. |
| Box score | aces, double faults, serve-in, first/second-serve points won, break points saved/faced, return points, total points | Store counts and denominators, not rounded percentages only. |
| Viewing | replay/condensed/highlight availability and measured duration | Availability is not the same as recommendation. |
| Provenance | source, source record ID, fetched/effective time, completeness, corrections | Mock records always say `MOCK`. |

### Derived metrics

- Ranking strength: transform ranking to a bounded strength estimate; retain unranked/protected-ranking flags.
- Expected win probability: cohort-calibrated model using pre-match information only.
- Point leverage: absolute change in match-win probability if receiver versus server wins the next point.
- Leverage-weighted tension: aggregate closeness at consequential points, not raw breakpoint count.
- Set/match deciding exposure: points played in deciding sets and at high game/set leverage.
- Serve dominance: service points won relative to tour × surface baseline; return resistance analogously.
- Balance: closeness of expected-versus-actual points/games, normalized for format.
- Tiebreak intensity: leverage-weighted tiebreak points; a tiebreak alone is structural spoiler data.
- Comeback depth: minimum in-match win probability of eventual winner, calculated only in revealed analysis.
- Upset magnitude: difference between pre-match expectation and outcome—not raw rank difference.
- Competitive duration: played minutes relative to cohort distribution; never shown protected.
- Davis Cup tie leverage: change in nation tie-win probability around a match or point.

**Recommendation.** Do not call short-term runs “momentum” causally. Expose only a descriptive `runPressure` feature (consecutive games/points weighted by leverage) because points are not independent, and runs can reflect serve order.

### Contextual features

- Tournament category and round; title/qualification/elimination consequences.
- Ranking points at stake and points defended, only when rules/data are reliable.
- Head-to-head sample with recency, surface, and retirement exclusions.
- Surface-adjusted form and workload/rest; never mix career grass data naïvely with current clay form.
- Rivalry/national context as editorial metadata, not inferred from social sentiment.
- Davis Cup stage, tie format, home/away/neutral venue, current tie score, match order, and whether live/dead.

### Personalization features

- Followed player, nation, tournament, tour, and doubles team.
- Familiarity: newcomer / regular / expert; preference for tactics, serving, rallies, underdogs, national-team play.
- Time budget and acceptable format: full, condensed, highlights, recap.
- Preferred spoiler strictness and tolerance for post-match evaluative hints.
- Language, timezone, replay subscriptions/territory, watched/known-result state.

## Forbidden fields by protected state

| State | Must not enter DOM, labels, URL, logs, analytics, or imagery |
|---|---|
| Pre-event | Future-only; no restriction beyond private/personal data. |
| Live-safe | Current score/server, elapsed duration, set count, injury/medical timeout, live win probability, “upset brewing”. |
| Completed, hidden | Winner, scoreline, set count, duration, retirement/default, deciding set/tiebreak, comeback/upset, match score/tier derived from play, next opponent, ranking movement, celebration image. |
| Revealed | Outcome fields allowed after explicit per-event reveal. |

Even a “classic” badge or full-replay recommendation can leak that something notable happened. Strict mode should use pre-event priority only.

## Minimum MVP fields

**Recommendation.** Require: IDs, tour/organizer, tournament/category/round, discipline, surface, format, scheduled time/status, competitors, rankings-at-start, seed, country, pre-match model probability/confidence, followed affinity, spoiler state, availability, provenance. For completed hidden events, keep result payload physically separate. Point data is optional.

Extended: point stream, score snapshots, complete box score counts, serve order, match duration, weather/court speed, workload, surface Elo, draw implications, historical H2H, editorial rivalry, and Davis Cup tie probabilities.

## Edge cases and quality gates

- Walkover: exclude from watchability; it contains no played contest.
- Retirement/default: label revealed-only; score watchability only with `incompleteMatch=true` and low comparability.
- Missing point stream: use set/game aggregates, lower confidence, and suppress leverage/comeback claims.
- Doubles: model a team of two; no-ad and match-tiebreak formats need their own cohort.
- Unknown final-set rule or best-of: block structural metrics, do not guess from tour.
- Ranking unavailable: use surface/form estimates when available; otherwise widen uncertainty.
- Compare percentile within `tour × discipline × bestOf × scoringFormat × surface/era` before cross-tour display.
- Validate totals: points won sum, break-point numerators ≤ denominators, sequential set numbering, winner consistent with sets, timestamps monotonic.
