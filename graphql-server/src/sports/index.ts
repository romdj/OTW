/**
 * Sports module entry point - registers all sports and provides unified access
 */

import { sportRegistry } from './shared/utils/SportRegistry.js';
import { NHLSportAdapter } from './ice-hockey/leagues/nhl/NHLSportAdapter.js';
import { nhlStandingsResolvers } from './ice-hockey/leagues/nhl/resolvers/standingsResolvers.js';

// Register NHL
const nhlAdapter = new NHLSportAdapter();
const nhlConfig = {
  name: 'NHL',
  sport: 'Ice Hockey',
  country: 'North America',
  defaultSeason: '20242025'
};

sportRegistry.registerSport('nhl', nhlAdapter, nhlStandingsResolvers, nhlConfig);

// Export unified access
export { sportRegistry };
export { NHLSportAdapter };

// Export types for external use
export type { SportsService, TeamStanding, StandingsQuery } from './shared/interfaces/SportsService.js';