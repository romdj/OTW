# Mock Data Contract

`mock-events.json` is a lifecycle fixture, not provider evidence. All names,
IDs, scores and events are fictional and every object has `source: "MOCK"`.

## Contract

- `schemaVersion`, `source`, `eventId`, `league`, `competition`, `season`,
  `stage`, `state`, `ruleProfile`, `scheduledStartUtc`, teams and provenance are
  required.
- `state` is `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_PROTECTED`, or `REVEALED`.
- `safe` contains fields permitted for the selected protection state.
- `reveal` is `null` until revealed. A completed protected fixture keeps the
  outcome only in `sealedOutcome`, representing server-side storage that must
  not be serialized to protected clients.
- `model` records input coverage, confidence, importance/watchability and
  format. Postgame values are `null` where exposing them is disallowed.
- `ruleProfile` is explicit because NHL, PWHL and IIHF stage semantics differ.
- `officialStandings` and `hypotheticalStandings` are distinct; hypothetical
  records require model/version/as-of metadata.

## Lifecycle invariants

1. PRE_EVENT contains no result-derived data.
2. LIVE_SAFE may expose clock/status only to users who opted into live state;
   its protected view never exposes score, scorer or win probability.
3. COMPLETED_PROTECTED exposes finality but not winner, score, OT/SO, duration,
   derived excitement, format rationale or result-shaped imagery.
4. REVEALED may expose score timeline and derived model.
5. Analytics, URLs, cache keys and accessibility text use `eventId`, never
   hidden outcome text.

Validation command: `node -e "JSON.parse(require('fs').readFileSync('studies/sports/ice-hockey/mock-events.json','utf8'))"`.
