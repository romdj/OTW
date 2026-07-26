# American Football Mock Contract

## Boundary

Fixtures are fictional UX inputs, never forecasts or provider data. The document and each event carry `source: "MOCK"` and `isSynthetic: true`. Never ingest them into production, provider tests, or model evaluation.

One event separates:

- `safe`: schedule, matchup, pre-game context/importance and blind recommendation.
- `liveSafe`: only an in-progress label for strict UI.
- `protected`: live/outcome/structure fields; clients must not preload or serialize these in protected views.
- `revealed`: explicit result, drives, stats and post-game model.

```ts
type MockFootballEvent = {
  id: string;
  source: 'MOCK';
  isSynthetic: true;
  variant: 'PRE_GAME'|'LIVE_SAFE'|'COMPLETED_HIDDEN'|'REVEALED'|'NCAA_POSTSEASON';
  safe: {
    competition: 'NFL'|'NCAA_FBS'; season: number; week: string;
    seasonType: string; ruleset: string; teams: Team[]; kickoff: string;
    context: object; importance: Band; recommendation: Recommendation;
  };
  liveSafe?: { stateLabel: 'In progress'; protectedFieldsAvailable: true };
  protected?: object;
  revealed?: object;
  provenance: MockProvenance;
};
```

## Acceptance criteria

- Protected cards contain no score, period, clock, possession, overtime, result, game duration, WP, comeback/upset copy, or outcome-derived ordering.
- Reveal is deliberate and scoped to one event; only then may the client request/read protected content.
- URLs, accessible labels, images, notifications and analytics obey the same boundary.
- NFL and NCAA ruleset labels remain available to detail/explanation views.
- Low-confidence scoring-summary fixtures say “limited play detail”; they never invent leverage.
- A condensed recommendation denotes format, not confirmed platform availability.

Variants exercise pre-game planning, live strict mode, completed blind selection, fully revealed analytics, and NCAA ranking/playoff context.
