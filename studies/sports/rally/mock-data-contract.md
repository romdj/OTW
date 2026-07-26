# Mock Data Contract

`mock-events.json` is fictional; every rally/stage record is `source: "MOCK"`.

Hierarchy requires championship, rally, leg and stage IDs. Stage timing stores
measured time, penalty and notional time separately. Rule profile versions overall,
Sunday and Power Stage points. Lifecycle states: `PRE_EVENT`, `LIVE_SAFE`,
`STAGE_REVEALED`, `COMPLETED_PROTECTED`, `REVEALED`, `CANCELLED_STAGE`, and
`PROVISIONAL_CORRECTION`.

`safe` may reach protected clients. `sealedOutcome` is server-only and must not be
serialized. `reveal` appears after consent. Protected completion hides classification,
stage count/status, incidents, penalties, retirement and bonus points. Cancelled
stage disposition is shown only after reveal. Provisional corrections retain prior
value, new value, authority, decision time and classification version.

No mock incident implies real safety behavior. Never fabricate splits for notional
times or retired crews. Validate with
`node -e "JSON.parse(require('fs').readFileSync('studies/sports/rally/mock-events.json','utf8'))"`.
