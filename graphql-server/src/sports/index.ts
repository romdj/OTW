/**
 * Sports module entry point - registers all sports and provides unified access
 */

import { sportRegistry } from './shared/utils/SportRegistry.js';
import { NHLSportAdapter } from './ice-hockey/leagues/nhl/NHLSportAdapter.js';
import { nhlStandingsResolvers } from './ice-hockey/leagues/nhl/resolvers/standingsResolvers.js';
import { TennisSportAdapter } from './tennis/leagues/atp/TennisSportAdapter.js';
import { tennisResolvers } from './tennis/leagues/atp/resolvers/tennisResolvers.js';
import { WTASportAdapter } from './tennis/leagues/wta/WTASportAdapter.js';
import { ITFSportAdapter } from './tennis/leagues/itf/ITFSportAdapter.js';

// Register NHL
const nhlAdapter = new NHLSportAdapter();
const nhlConfig = {
  name: 'NHL',
  sport: 'Ice Hockey',
  country: 'North America',
  defaultSeason: '20242025'
};

sportRegistry.registerSport('nhl', nhlAdapter, nhlStandingsResolvers, nhlConfig);

// Register Tennis (ATP)
const tennisAdapter = new TennisSportAdapter();
const tennisConfig = {
  name: 'ATP',
  sport: 'Tennis',
  country: 'International',
  defaultSeason: '2025'
};

sportRegistry.registerSport('atp', tennisAdapter, tennisResolvers, tennisConfig);

sportRegistry.registerSport('wta', new WTASportAdapter(), { Query: {} }, {
  name: 'WTA',
  sport: 'Tennis',
  country: 'International',
  defaultSeason: String(new Date().getUTCFullYear()),
});

sportRegistry.registerSport('itf', new ITFSportAdapter(), { Query: {} }, {
  name: 'ITF',
  sport: 'Tennis',
  country: 'International',
  defaultSeason: String(new Date().getUTCFullYear()),
});

// Export unified access
export { sportRegistry };
export { NHLSportAdapter };
export { TennisSportAdapter };

// Export types for external use
export type { SportsService, TeamStanding, StandingsQuery } from './shared/interfaces/SportsService.js';
