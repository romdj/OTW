/**
 * IIHF (International Ice Hockey Federation) - Module Index
 */

export { IIHFSportAdapter, iihfSportAdapter } from './IIHFSportAdapter.js';
export { iihfTournamentService } from './services/tournamentService.js';
export {
  IIHF_TOP_NATIONS,
  IIHF_NATION_CODES,
  IIHF_EVENTS,
  IIHF_TOURNAMENT_PHASES,
  IIHF_POINT_SYSTEM,
  IIHF_WC_MEDAL_HISTORY,
} from './constants/index.js';
export type {
  IIHFTournament,
  IIHFTeamStanding,
  IIHFGame,
  IIHFPlayer,
  IIHFTournamentStats,
  TournamentType,
  TournamentPhase,
} from './types/iihf-api.types.js';
