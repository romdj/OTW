/**
 * NHL (National Hockey League) - Module Index
 */

export { NHLSportAdapter } from './NHLSportAdapter.js';
export { nhlStandingsService } from './services/standingsService.js';
export { nhlScheduleService } from './services/scheduleService.js';
export { nhlStandingsResolvers } from './resolvers/standingsResolvers.js';
export { NHL_CONFERENCES, NHL_DIVISIONS } from './constants/index.js';
export type { TransformedTeam, NHLApiTeam, StandingsQueryArgs, PowerplayStats } from './types/nhl-api.types.js';
