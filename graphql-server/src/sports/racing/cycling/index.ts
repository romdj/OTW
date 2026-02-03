/**
 * Cycling - Sport Module
 *
 * Exports all cycling-related definitions.
 */

// Pro Tour (UCI WorldTour road racing)
export { ProCyclingAttributes } from './pro-tour/attributes.js';

// Pro Tour Types
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
} from './pro-tour/types.js';

export { calculateExcitementScore, isExcitingGCMovement } from './pro-tour/types.js';

// Pro Tour Services
export { ScheduleService, scheduleService } from './pro-tour/services/ScheduleService.js';

// Pro Tour Adapters
export { UCIAdapter, uciAdapter } from './pro-tour/adapters/UCIAdapter.js';

// Pro Tour GraphQL Resolvers
export { cyclingResolvers } from './pro-tour/resolvers/cyclingResolvers.js';

// Cyclocross
export { CyclocrossAttributes } from './cyclocross/attributes.js';

// TODO: Export track cycling module
// export { TrackCyclingAttributes } from './track/attributes.js';

// TODO: Export mountain biking module
// export { MountainBikeAttributes } from './mtb/attributes.js';

// TODO: Export BMX racing module
// export { BMXAttributes } from './bmx/attributes.js';

// TODO: Export gravel racing module
// export { GravelAttributes } from './gravel/attributes.js';

// TODO: Export women's specific modules
// export { WomensWorldTourAttributes } from './pro-tour/womens/attributes.js';
