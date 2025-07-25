# 🏒⚽🏀 Sports Module Architecture

This directory contains the multi-sport architecture for otw.sport GraphQL server, enabling support for various sports leagues with a unified interface.

## 📁 Directory Structure

```
sports/
├── shared/
│   ├── interfaces/        # Common interfaces for all sports
│   ├── types/            # Shared TypeScript types
│   └── utils/            # SportRegistry and utilities
├── ice-hockey/
│   ├── leagues/
│   │   └── nhl/          # NHL-specific implementation
│   │       ├── constants/    # NHL API endpoints, point systems
│   │       ├── types/        # NHL API types and interfaces
│   │       ├── services/     # NHL data services
│   │       ├── resolvers/    # NHL GraphQL resolvers
│   │       └── utils/        # NHL utility functions
│   └── international/    # International ice hockey competitions
│       ├── iihf/         # IIHF tournaments and competitions
│       └── olympics/     # Olympic ice hockey
└── index.ts              # Sports module entry point
```

## 🏗️ Architecture Principles

### 1. **Sport-Agnostic Interface**
All sports implement the `SportsService` interface, ensuring consistent API across different leagues:

```typescript
interface SportsService {
  getStandings(query?: StandingsQuery): Promise<TeamStanding[]>;
  getTeamDetails(teamId: string): Promise<any>;
  getTeamStats(teamId: string, season?: string): Promise<any>;
  isValidTeam(teamId: string): boolean;
  getLeagueInfo(): LeagueInfo;
}
```

### 2. **Centralized Registry**
The `SportRegistry` manages all registered sports and provides unified access:

```typescript
// Register a sport
sportRegistry.registerSport('nhl', nhlAdapter, nhlResolvers, nhlConfig);

// Get service for specific sport
const nhlService = sportRegistry.getService('nhl');

// Get merged resolvers for GraphQL
const resolvers = sportRegistry.getMergedResolvers();
```

### 3. **Standardized Data Models**
Common data structures across all sports with sport-specific extensions:

```typescript
interface TeamStanding {
  teamName: string;
  teamAbbrev: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  sport: string;
  league: string;
  // Sport-specific fields can be added
}
```

## 🏒 Current Implementation: NHL

### NHL Module Structure:
- **Constants**: API endpoints, point systems, error messages
- **Types**: NHL API response types and data transformation interfaces
- **Services**: 
  - `standingsService`: Fetches and transforms NHL standings
  - `powerplayService`: Retrieves powerplay statistics
- **Resolvers**: GraphQL resolvers for NHL queries
- **Utils**: Team mappings and utility functions

### NHL-Specific Features:
- Traditional vs International (3-point) point system comparison
- Powerplay statistics integration
- Division/Conference organizational structure
- Team abbreviation to full name mapping

## 🔧 Adding New Sports

To add a new sport (e.g., NBA basketball):

### 1. Create Directory Structure
```bash
mkdir -p sports/basketball/leagues/nba/{constants,types,services,resolvers,utils}
```

### 2. Implement Sport Adapter
```typescript
// sports/basketball/leagues/nba/NBASportAdapter.ts
export class NBASportAdapter implements SportsService {
  async getStandings(query?: StandingsQuery): Promise<TeamStanding[]> {
    // NBA-specific implementation
  }
  // ... implement other interface methods
}
```

### 3. Create Sport-Specific Services
```typescript
// sports/basketball/leagues/nba/services/standingsService.ts
export class NBAStandingsService {
  async getStandings(date?: string): Promise<NBATeam[]> {
    // Fetch from NBA API
  }
}
```

### 4. Define GraphQL Resolvers
```typescript
// sports/basketball/leagues/nba/resolvers/standingsResolvers.ts
export const nbaStandingsResolvers = {
  Query: {
    nbaStandings: async (_, { date }) => {
      // NBA standings resolver
    }
  }
};
```

### 5. Register in Sports Index
```typescript
// sports/index.ts
import { NBASportAdapter } from './basketball/leagues/nba/NBASportAdapter.js';
import { nbaStandingsResolvers } from './basketball/leagues/nba/resolvers/standingsResolvers.js';

const nbaAdapter = new NBASportAdapter();
const nbaConfig = { name: 'NBA', sport: 'Basketball', country: 'USA' };

sportRegistry.registerSport('nba', nbaAdapter, nbaStandingsResolvers, nbaConfig);
```

## 🔍 GraphQL Schema Integration

The sports module automatically merges resolvers from all registered sports:

```graphql
type Query {
  # NHL resolvers
  standings(date: String): [Team]
  
  # Future NBA resolvers (when added)
  nbaStandings(date: String): [NBATeam]
  
  # Future NFL resolvers (when added)
  nflStandings(week: Int): [NFLTeam]
}
```

## 🎯 Benefits of This Architecture

### **1. Scalability**
- Easy to add new sports without modifying existing code
- Each sport module is completely independent
- No coupling between different sports implementations

### **2. Maintainability**
- Clear separation of concerns
- Sport-specific code is isolated
- Shared utilities reduce code duplication

### **3. Consistency**
- Unified interface across all sports
- Standardized error handling and logging
- Common data transformation patterns

### **4. Flexibility**
- Each sport can have unique features while maintaining common interface
- GraphQL schema can be extended per sport
- Easy to enable/disable sports dynamically

## 🚀 Usage Examples

### Get All Sports Standings
```typescript
const allStandings = await sportRegistry.getAllStandings('2024-01-15');
// Returns: [{ sport: 'Ice Hockey', league: 'NHL', standings: [...] }]
```

### Get Specific Sport Service
```typescript
const nhlService = sportRegistry.getService('nhl');
const nhlStandings = await nhlService.getStandings({ date: '2024-01-15' });
```

### Health Check All Sports
```typescript
const health = await sportRegistry.healthCheck();
// Returns: { nhl: true, nba: false, ... }
```

## 🔄 Migration Notes

The restructuring moved NHL-specific code from:
- `src/services/powerplayService.ts` → `src/sports/ice-hockey/leagues/nhl/services/powerplayService.ts`
- `src/types/nhl-api.types.ts` → `src/sports/ice-hockey/leagues/nhl/types/nhl-api.types.ts`
- `src/utils/teamMappings.ts` → `src/sports/ice-hockey/leagues/nhl/utils/teamMappings.ts`
- NHL constants moved from `src/constants/index.ts` → `src/sports/ice-hockey/leagues/nhl/constants/index.ts`

The main GraphQL resolvers now delegate to the sports registry, making the system truly multi-sport ready! 🎉