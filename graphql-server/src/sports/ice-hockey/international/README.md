# 🌍 International Ice Hockey

This directory contains implementations for international ice hockey competitions and organizations.

## 🏗️ Structure

```
international/
├── iihf/          # International Ice Hockey Federation
│   ├── tournaments/
│   │   ├── world-championship/
│   │   ├── u20-championship/
│   │   └── u18-championship/
│   └── leagues/
│       ├── champions-league/
│       └── continental-cup/
├── olympics/      # Olympic ice hockey competitions
│   ├── winter-games/
│   └── youth-games/
└── README.md      # This file
```

## 🎯 Future Implementations

### IIHF Tournaments
- **World Championship**: Annual senior men's tournament
- **U20 World Championship**: Junior ice hockey championship
- **U18 World Championship**: Under-18 tournament
- **Women's World Championship**: Women's international tournament

### Olympic Hockey
- **Winter Olympics**: Olympic ice hockey tournament
- **Youth Olympics**: Youth Olympic Games hockey

### Continental Leagues
- **Champions Hockey League**: European club competition
- **Continental Cup**: IIHF Continental Cup

## 🚀 Implementation Plan

Each international competition will follow the same pattern as NHL:

1. **Constants**: Tournament-specific endpoints and configurations
2. **Types**: API response types and data models
3. **Services**: Data fetching and transformation services
4. **Resolvers**: GraphQL resolvers for tournament data
5. **Utils**: Tournament-specific utility functions
6. **Adapter**: Implementation of `SportsService` interface

## 📊 Data Sources

- **IIHF API**: Official IIHF data feeds
- **Olympic Data**: IOC official data sources
- **Tournament Organizers**: Direct feeds from competition organizers

## 🔗 Integration

International ice hockey will integrate with the sports registry:

```typescript
// Future implementation
import { IIHFWorldChampionshipAdapter } from './iihf/tournaments/world-championship/IIHFAdapter.js';

const iihfAdapter = new IIHFWorldChampionshipAdapter();
const iihfConfig = {
  name: 'IIHF World Championship',
  sport: 'Ice Hockey',
  country: 'International'
};

sportRegistry.registerSport('iihf-worlds', iihfAdapter, iihfResolvers, iihfConfig);
```

This structure allows for clean separation between professional leagues (NHL, KHL, SHL) and international competitions (IIHF, Olympics) while maintaining the same unified interface.