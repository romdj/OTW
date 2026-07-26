# Tennis Data Integration

OTW exposes provider-neutral ATP, WTA, and Davis Cup records. BALLDONTLIE is
the configured ATP/WTA provider and requires `BALLDONTLIE_API_KEY`.

## Coverage

- ATP men's singles: `/atp/v1/tournaments` and `/atp/v1/matches`.
- WTA women's singles: `/wta/v1/tournaments` and `/wta/v1/matches`.
- Davis Cup: canonical event/tie/rubber schema only. No licensed results
  provider is configured, so `davisCupEvent` reports `UNAVAILABLE` and
  `davisCupTies` fails explicitly.

BALLDONTLIE matches require its ALL-STAR tier. Doubles, mixed doubles, ITF
World Tennis Tour, and reliable match start timestamps are unsupported. Data
use remains subject to BALLDONTLIE's plan, attribution, retention, and
redistribution terms; confirm production rights before persisting or
commercially redistributing records.

## GraphQL examples

```graphql
query {
  tennisEventsV2(tour: WTA, season: 2026) {
    otwId name category surface startsAt
    provenance { provider fetchedAt isStale }
  }
}
```

```graphql
query {
  tennisMatchesV2(tour: ATP, season: 2026, playerId: "15", limit: 20) {
    otwId round status scoreText winnerId
    competitors { otwId name countryCode }
    sets { setNumber player1Games player2Games }
  }
}
```

```graphql
query {
  davisCupEvent(season: 2026) {
    name status availabilityMessage
    provenance { provider isStale }
  }
}
```

Provider/authentication/network errors are never replaced by sample results.
Contract tests run only when credentials exist and otherwise skip.
