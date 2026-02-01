# OTW.Sport Codebase Architecture - Prioritization Engine Context

> This document provides context for implementing the Event Prioritization Engine, based on a thorough exploration of the existing codebase patterns.

## 1. GraphQL Server Structure (graphql-server/src/)

### Architecture Pattern
- **Registry Pattern**: Central `SportRegistry` class manages all sports services
- **Adapter Pattern**: Each sport implements the `SportsService` interface
- **Separation of Concerns**: Clear division between adapters, services, resolvers, and types

### Key Components

**Base Interfaces** (`sports/shared/interfaces/SportsService.ts`):
```typescript
- SportsService: Core interface with methods for getStandings(), getTeamDetails(), getTeamStats(), isValidTeam(), getLeagueInfo()
- TeamStanding: Standard domain model with: teamName, teamAbbrev, teamLogo, gamesPlayed, wins, losses, points, winPercentage, sport, league, division, conference, date
- StandingsQuery: Query parameters for filtering by date, league, division, conference
- SportResolver: GraphQL resolver interface
- SportConfig: Configuration metadata for each sport
```

**SportRegistry** (`sports/shared/utils/SportRegistry.ts`):
- Singleton pattern managing multiple sports
- Methods: `registerSport()`, `getService()`, `getResolvers()`, `getRegisteredSports()`, `getMergedResolvers()`
- Automatically merges resolvers from all registered sports
- Supports health checks and cross-sport operations

### Sport Implementation Pattern

```
sports/
  [sport-name]/
    attributes.ts (team attributes/features)
    qualities.ts (qualitative aspects)
    scoring.ts (point systems)
    types.ts (sport-specific types)
    index.ts (public exports)
    leagues/
      [league-name]/
        [SportAdapter].ts (implements SportsService)
        resolvers/
          [sport]Resolvers.ts (GraphQL resolvers)
        services/
          [service].ts (business logic)
        types/
          [api]-api.types.ts
        constants/
          index.ts
```

## 2. Currently Implemented Sports

### Ice Hockey (NHL)
- **Adapter**: `NHLSportAdapter` - Fetches standings from NHL API
- **Services**:
  - `NHLStandingsService`: Fetches and transforms NHL data, calculates international (3-point) system
  - `PowerplayService`: Handles powerplay statistics
- **Features**: Two point systems (traditional 2-point and international 3-point)
- Type transformations and constants

### Tennis (ATP)
- **Adapter**: `TennisSportAdapter` - Adapts individual player rankings to team-like interface
- **Services**:
  - `ATPRankingsService`: Mock data currently (production APIs planned)
  - `ATPTournamentsService`: Tournament and match data
- Extends beyond simple standings with tournaments and live matches
- Demonstrates how individual sports are adapted to the TeamStanding interface

### Planned Sports (directory structure exists)
- American Football (NFL, NCAA)
- Association Football (Premier League)
- Basketball (NBA)
- Volleyball
- Racing (Formula 1, MotoGP, Cycling, etc.)

## 3. Existing Scoring/Prioritization Logic

### Backend Scoring Patterns

**NHL Standings Service** (`standingsService.ts`, line 108-116):
```typescript
calculateInternationalPoints(team: NHLApiTeam): number {
  const { REGULATION_WIN, OT_WIN, OT_LOSS } = NHL_POINT_SYSTEMS.INTERNATIONAL;
  return (
    team.otLosses * OT_LOSS +
    (team.wins - team.regulationWins) * OT_WIN +
    team.regulationWins * REGULATION_WIN
  );
}
```

**Constants** (`ice-hockey/leagues/nhl/constants/index.ts`):
```typescript
NHL_POINT_SYSTEMS = {
  TRADITIONAL: { WIN: 2, OT_WIN: 2, OT_LOSS: 1, REGULATION_LOSS: 0 },
  INTERNATIONAL: { REGULATION_WIN: 3, OT_WIN: 2, OT_LOSS: 1, REGULATION_LOSS: 0 }
}
```

## 4. Frontend Service Architecture

**Location**: `frontend/src/business/`

### Layered Architecture

1. **Domain** (`domain/standing.ts`):
   - `Standing` interface with all team properties
   - `PowerplayStats` interface
   - Column definitions and constants

2. **Services** (`business/services/`):
   - **StandingsService**: Singleton managing data fetching and caching (5-minute TTL)
   - **StandingsSortingService**: Sorting with NHL tiebreaker rules
     - Primary: International system points
     - Tiebreaker 1: Regulation + OT wins
     - Tiebreaker 2: Games played
     - Tiebreaker 3: Head-to-head (not implemented)
   - **StandingsGroupingService**: Grouping by conference/division/wildcard
     - Wildcard logic: 3 division leaders + 2 wild cards per conference
     - Playoff race: Teams within 7 points of final wild card spot

3. **Use Cases** (`business/usecases/`):
   - **GetOrganizedStandingsUseCase**: Orchestrates fetching, sorting, and grouping
   - Includes validation and performance logging

4. **API Client** (`api/standingsAPI.ts`):
   - GraphQL queries via URQL client
   - Transformation of API responses
   - Comparison operations for historical data

5. **State Management** (`stores/standingsStore.ts`):
   - Simple Svelte writable store for standings data
   - No complex state management library (uses native Svelte stores)

## 5. Configuration & Constants

### Backend (`graphql-server/src/`)
- `config/env.ts`: Environment variables
- `constants/shared.ts`: CORS origins, HTTP headers, API timeouts, retry limits
- Sport-specific constants (point systems, team mappings, divisions)

### Frontend (`frontend/src/`)
- `config/AppConfig.ts`: Comprehensive singleton configuration
  - API endpoints and timeouts
  - UI animations and theme settings
  - NHL-specific rules (playoff thresholds, wildcard spots)
  - Point system definitions
  - Performance cache settings
  - Feature flags

## 6. Type System Patterns

### Backend Types
- API response types: `NHLApiStandingsResponse`, `ATPRankingEntry`
- Transformed types: `TransformedTeam`, `ATPPlayerProfile`
- Generic types: `SportsService`, `TeamStanding`, `StandingsQuery`

### Frontend Types
- `Standing`: Main domain model
- `GroupedStandings`: Dictionary groupings
- `ViewType`: `'conference' | 'division' | 'wildcard' | 'league' | 'comparison'`
- `SortKey`: `keyof Standing` (type-safe sorting)

## 7. GraphQL Schema Structure

### Base Schema (`graphql/schemas/schema.graphql`)
- `Team` type with standings fields
- `PowerplayStats` type
- `Query` type with standings query

### Tennis Schema (`graphql/schemas/tennis.graphql`)
- Extends Query type with tennis-specific operations
- `TennisRanking`, `TennisPlayer`, `TennisTournament`, `TennisMatch` types
- Enums for tours, surfaces, categories, match status

### Resolver Pattern
- Query resolvers handle fetching
- Type field resolvers handle nested data (e.g., `powerplayStats` resolver on `Team`)
- Sport registry merges all resolvers automatically

## 8. Key Architectural Decisions

1. **Adapter Pattern for Sports**: Each sport wraps its specific implementation in a SportsService adapter, allowing heterogeneous sports (team vs individual, different APIs) to work with unified interfaces

2. **Registry-Based Composition**: Central registry avoids tight coupling and allows dynamic sport registration

3. **Layered Services**: Separation between API fetching, business logic (sorting/grouping), and presentation layers

4. **Configuration Centralization**: AppConfig singleton provides type-safe, validated configuration

5. **Caching Strategy**: 5-minute TTL on frontend with fallback to stale cache on errors

6. **Clean GraphQL Schema**: Schema-first approach with manual resolver writing (not auto-generated from database)

## 9. Integration Points for Prioritization Engine

Based on the codebase analysis, here's where a prioritization engine fits:

### Backend Integration
1. Create `graphql-server/src/prioritization/` - core prioritization module
2. Create sport-specific emotional analyzers under each sport
3. Add prioritization types to GraphQL schema
4. Create resolvers for personalized priority queries

### Frontend Integration
1. Create `frontend/src/business/services/PrioritizationService.ts`
2. Create user preferences store
3. Add UI components for priority visualization
4. Add configuration options in `AppConfig` for weighting factors

### Test Structure
- Unit tests following existing patterns in `frontend/src/business/services/StandingsService.spec.ts`
- Integration tests for GraphQL resolvers

## 10. Code Quality Conventions

### Strengths to Follow
- Well-organized module structure with clear separation of concerns
- Comprehensive error handling with custom logger and error handler
- Type safety with TypeScript throughout
- Singleton patterns for services
- Configuration validation
- Performance logging capabilities

### Conventions to Apply
- Use `getInstance()` for singletons
- Namespace services by domain (e.g., NHL/ATP specific, then shared)
- Document interfaces with JSDoc comments
- Use constants for magic numbers
- Implement proper error messages with context
- Single responsibility per service/function

---

*This document was generated during the prioritization engine implementation to capture architectural context and integration patterns.*
