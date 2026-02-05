/**
 * ATP (Association of Tennis Professionals) - Module Index
 */

export { TennisSportAdapter, tennisSportAdapter } from './TennisSportAdapter.js';
export { ATPLeagueAdapter, atpAdapter } from './ATPLeagueAdapter.js';
export { atpRankingsService } from './services/rankingsService.js';
export { atpTournamentsService } from './services/tournamentsService.js';
export { ATP_RANKING_POINTS } from './constants/index.js';
export type {
  ATPRankingEntry,
  ATPPlayerProfile,
  ATPTournamentEntry,
  ATPMatchEntry,
} from './types/atp-api.types.js';
