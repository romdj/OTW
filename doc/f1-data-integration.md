# Formula 1 Data Integration

OTW uses BALLDONTLIE F1 as the operational source for the current vertical
slice. Set `BALLDONTLIE_API_KEY`; the client uses
`BALLDONTLIE_API_BASE_URL` (default `https://api.balldontlie.io`) plus
`/f1/v1`.

## Coverage and ownership

- `GET /events?season=YYYY`: race weekends, UTC bounds, venue and live status.
- `GET /sessions`: practice, qualifying, sprint and race instants/status.
- `GET /driver_standings?season=YYYY`: current driver table.
- `GET /team_standings?season=YYYY`: current constructor table.

Every cursor page is consumed. Normalized records carry `source`, `fetchedAt`
and `isStale`; provider failures are errors, never disguised seed data.
BALLDONTLIE does not expose round snapshots, so supplying `round` fails
explicitly. Session timestamps are UTC. Circuit-local wall time is not
currently supplied and must not be inferred from country alone.

OpenF1 is the preferred candidate for a later telemetry slice (laps, position,
weather and race control): it covers 2023 onward, historical access is free,
and live access is paid. Its public plans are described as personal use, so
commercial licensing requires written confirmation. Jolpica is useful for
history before BALLDONTLIE coverage, but public data is CC BY-NC-SA; commercial
use requires a separate agreement. Neither is an automatic fallback.

BALLDONTLIE access, retention, display and commercial rights depend on the
subscribed plan and current terms. Sessions and standings require a paid tier.

## GraphQL examples

```graphql
query F1Weekend {
  f1Calendar(season: 2026) {
    id round name format status source fetchedAt isStale
    circuit { id name country countryCode }
    sessions { id type date startTimeUTC status }
  }
}
```

```graphql
query F1Standings {
  f1DriverStandings(season: 2026) {
    position points driver { id fullName constructorName }
  }
  f1ConstructorStandings(season: 2026) {
    position points constructor { id name }
  }
}
```

Results, classifications, laps, incidents, weather, corrections and actual
post-race watchability remain outside this slice.
