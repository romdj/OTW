/**
 * ITF (International Tennis Federation) - Module Index
 */

export { ITFSportAdapter, itfSportAdapter } from './ITFSportAdapter.js';
export { itfEventService } from './services/eventService.js';
export {
  ITF_EVENTS,
  ITF_TOP_NATIONS,
  ITF_NATION_CODES,
  DAVIS_CUP_PHASES,
  OLYMPIC_DRAWS,
} from './constants/index.js';
export type {
  ITFEvent,
  ITFTeam,
  ITFPlayer,
  DavisCupTie,
  DavisCupRubber,
  OlympicMatch,
  ITFGroupStanding,
  EventType,
  DavisCupPhase,
  OlympicDraw,
} from './types/itf-api.types.js';
