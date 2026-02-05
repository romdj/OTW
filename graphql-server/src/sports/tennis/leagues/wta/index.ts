/**
 * WTA (Women's Tennis Association) - Module Index
 */

export { WTASportAdapter, wtaSportAdapter } from './WTASportAdapter.js';
export { wtaRankingsService } from './services/rankingsService.js';
export { wtaTournamentsService } from './services/tournamentsService.js';
export { WTA_RANKING_POINTS, WTA_TOURNAMENT_CATEGORIES, WTA_SURFACES } from './constants/index.js';
export type {
  WTARankingEntry,
  WTAPlayerProfile,
  WTATournamentEntry,
  WTAMatchEntry,
} from './types/wta-api.types.js';
