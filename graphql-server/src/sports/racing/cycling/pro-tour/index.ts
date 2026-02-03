/**
 * Pro Cycling (UCI WorldTour) - Discipline Module
 *
 * Exports all professional road cycling definitions.
 */

// Attributes (sport characteristics)
export { ProCyclingAttributes } from './attributes.js';

// Types
export type {
  CyclingRace,
  CyclingStage,
  RaceCategory,
  StageType,
  Gender,
  GCStanding,
  GCMovement,
  CommunityRating,
  RaceFilters,
  StageFilters,
  ExcitementFactors,
} from './types.js';

export { calculateExcitementScore, isExcitingGCMovement } from './types.js';

// Adapters
export { UCIAdapter, uciAdapter } from './adapters/UCIAdapter.js';
export type { CyclingDataAdapter, UCIRaceData, UCIStageData } from './adapters/types.js';
export { UCIClassifications, mapUCIStageType } from './adapters/types.js';

// Services
export { ScheduleService, scheduleService } from './services/ScheduleService.js';

// GraphQL Resolvers
export { cyclingResolvers } from './resolvers/cyclingResolvers.js';

// TODO: Export Pro Cycling qualities when implemented
// export { ProCyclingQualities } from './qualities.js';

// TODO: Export additional data adapters when implemented
// export { FirstCyclingAdapter } from './adapters/firstcycling.js';
// export { ProCyclingStatsAdapter } from './adapters/procyclingstats.js';

// TODO: Export women's cycling module
// export { WomensWorldTourAttributes } from './womens/attributes.js';
