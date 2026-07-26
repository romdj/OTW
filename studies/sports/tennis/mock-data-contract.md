# Tennis Mock Data Contract

## Safety architecture

**Recommendation.** One mock event has three separately consumable envelopes:

1. `safe`: identity, pre-event context, affinity, and pre-event recommendation.
2. `protected`: live/result-derived data; clients must not request or render it until authorized.
3. `revealed`: outcome, structural facts, analysis, and explanatory copy.

The fixtures are fictional and are not forecasts. Every event and top-level document must carry `source: "MOCK"`, `isSynthetic: true`, and a mock provenance ID. Never mix these records into provider contract tests, ingestion, production analytics, or training evaluation.

## Required shape

```ts
type MockTennisEvent = {
  id: string;
  source: 'MOCK';
  isSynthetic: true;
  variant: 'PRE_EVENT'|'LIVE_SAFE'|'COMPLETED_HIDDEN'|'REVEALED'|'DAVIS_CUP';
  safe: {
    tour: 'ATP'|'WTA'|'ITF';
    tournament: string;
    category: string;
    round: string;
    discipline: 'SINGLES'|'DOUBLES';
    surface: 'HARD'|'CLAY'|'GRASS'|'CARPET';
    format: { bestOf: 3|5; advantage: boolean; finalSetRule: string };
    competitors: Array<{ id: string; displayName: string; ranking?: number }>;
    scheduledAt: string;
    importance: { band: string; confidence: string; reasons: string[] };
    recommendation: { format: string; estimatedMinutes?: number; blind: boolean };
  };
  liveSafe?: { stateLabel: 'In progress'; started: true; protectedFieldsAvailable: boolean };
  protected?: object;
  revealed?: object;
  davisCup?: { eventId: string; tieId: string; tieFormat: string; matchOrder: number; tieLeverageBand: string };
  provenance: { provider: 'MOCK'; providerId: string; generatedAt: string; completeness: string };
};
```

## Variant expectations

- `PRE_EVENT`: no `protected` or `revealed`; exercises round/surface/affinity and schedule UI.
- `LIVE_SAFE`: may say only “In progress” in strict mode. A nested protected payload exercises authorized live UI without leaking through card serialization.
- `COMPLETED_HIDDEN`: visible state says completed and gives a blind recommendation based only on pre-event context. Result-derived priority is protected.
- `REVEALED`: exercises complete score, stats, watchability factors, upset/comeback explanations, and format recommendation.
- `DAVIS_CUP`: includes event → tie → match hierarchy and tie leverage; its revealed payload may show tie score and whether the match was live/dead.

## UI acceptance cases

- Serialize/render only `safe` for protected cards; assert participant names can appear but winner, score, set count and duration cannot.
- Switching from hidden to revealed requires an explicit event-scoped action and then fetch/read of `revealed`.
- Accessible names, image alt text, notifications, analytics properties, routes, sort order, and next-match links undergo the same audit as visible copy.
- Low-confidence aggregate examples must render “limited match detail,” not invented tension explanations.
- Doubles cards must preserve both players per side without truncating the distinguishing surname.
- Davis Cup cards show nation tie context and individual match context without conflating a match win with the tie winner.
