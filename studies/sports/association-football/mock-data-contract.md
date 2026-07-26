# Mock Data Contract

`mock-events.json` contains fictional lifecycle fixtures only. Every event is
`source: "MOCK"`; names and results do not describe real clubs or matches.

## Required concepts

- Identity: schema/source/event/competition/season/stage/team IDs.
- Format: `ruleProfile` defines league/group/knockout, leg, points, tiebreak,
  extra time, penalties and away-goals behavior.
- Lifecycle: `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_PROTECTED`, `REVEALED`, or
  `ABANDONED_PENDING`.
- Disclosure: `safe` may reach protected clients; `sealedOutcome` represents
  server-only outcome data; `reveal` appears only after explicit reveal.
- Model: importance/watchability, confidence, coverage and format. Protected
  post-match metrics remain null.
- Qualitative model: revealed fixtures may carry a `qualitativeProfile` with
  `dataGrade`, descriptive dimensions, per-dimension confidence, evidence codes
  and caveats. This is distinct from the summary watchability score.
- Standings: official and hypothetical are separate; hypothetical requires
  model/version/as-of metadata.

## Invariants

1. PRE_EVENT contains only pre-kickoff facts.
2. LIVE_SAFE hides score, minute/period, cards, probability and event shape unless
   the user opted into live spoilers.
3. COMPLETED_PROTECTED can state completion but hides result, aggregate-after,
   extra time/penalties, duration, rating and outcome-derived format.
4. REVEALED may expose the ordered timeline and derived metrics.
5. ABANDONED_PENDING has no invented final result or standings effect.
6. Analytics/accessibility/cache labels contain IDs, not sealed text.
7. Qualitative dimensions and viewing-format recommendations are outcome-derived;
   seal them in LIVE_SAFE and COMPLETED_PROTECTED states.

Validate with:
`node -e "JSON.parse(require('fs').readFileSync('studies/sports/association-football/mock-events.json','utf8'))"`.
