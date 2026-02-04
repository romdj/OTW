/**
 * Formula 1 - Discipline Module
 *
 * Exports all Formula 1 specific definitions.
 */

// Attributes (sport characteristics)
export { Formula1Attributes } from './attributes.js';

// Types
export type {
  GrandPrix,
  Session,
  Circuit,
  Driver,
  Constructor,
  DriverStanding,
  ConstructorStanding,
  ChampionshipBattle,
  SessionResult,
  RaceExcitement,
  GrandPrixFilters,
  StandingsFilters,
  SessionType,
  WeekendFormat,
  GrandPrixStatus,
} from './types.js';

export {
  getPointsForPosition,
  calculateMaxPoints,
  canStillWinChampionship,
  calculateClosenessScore,
} from './types.js';

// Adapters
export { F1Adapter, f1Adapter } from './adapters/F1Adapter.js';
export type { F1DataAdapter, F1RaceData, F1SessionData } from './adapters/types.js';

// Services
export { F1Service, f1Service } from './services/F1Service.js';

// GraphQL Resolvers
export { f1Resolvers } from './resolvers/f1Resolvers.js';

// TODO: Export F1 qualities when implemented
// export { Formula1Qualities } from './qualities.js';

// TODO: Export additional adapters when implemented
// export { ErgastAdapter } from './adapters/ergast.js';
// export { OpenF1Adapter } from './adapters/openf1.js';

// TODO: Export F1 fantasy integration
// TODO: Export F1 telemetry parser
// TODO: Export F1 timing data parser
