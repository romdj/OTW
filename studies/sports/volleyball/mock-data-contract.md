# Mock Data Contract

`mock-events.json` is fictional and every event has `source: "MOCK"`.

Required concepts: stable identity; indoor team or beach pair participants;
competition/stage; lifecycle state; explicit rule profile; `safe`, `reveal` and
server-only `sealedOutcome`; input coverage/confidence/model; official versus
hypothetical standings.

States are `PRE_EVENT`, `LIVE_SAFE`, `COMPLETED_PROTECTED`, `REVEALED`, and
`FORFEIT_FINAL`. PRE_EVENT has no outcome. LIVE_SAFE hides set/rally state unless
opted in. COMPLETED_PROTECTED reveals finality but not winner, set count, deciding/
Golden Set, duration, rating or format. REVEALED may expose all. FORFEIT_FINAL
must identify official disposition after reveal but never invent rallies.

Rallies require monotonic `sequence`, set, score before/after, point winner and
server where known. Set summaries alone live separately and never masquerade as
rallies. Protected clients must not receive `sealedOutcome`; hidden DOM is not
protection.

Validate with `node -e "JSON.parse(require('fs').readFileSync('studies/sports/volleyball/mock-events.json','utf8'))"`.
