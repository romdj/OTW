/**
 * Handball - Sport Module
 *
 * Exports all handball-related definitions.
 */

export { HandballAttributes } from './attributes.js';
export { HandballScoring } from './scoring.js';
export { HandballPositions } from './positions.js';
export { HandballQualities } from './qualities.js';

export type {
  FieldPosition,
  AllPosition,
  EmotionalTag,
  GoalType,
  HandballMatchEvent,
  HandballWatchabilityScore,
  HandballMatch,
  HandballMatchStats,
  HandballStanding,
} from './types.js';

// TODO: Export league adapters when implemented
// export { EHFChampionsLeagueAdapter } from './leagues/ehf-cl/index.js';
// export { BundesligaAdapter } from './leagues/bundesliga/index.js';
// export { LNHAdapter } from './leagues/lnh/index.js';
// export { LigaASOBALAdapter } from './leagues/asobal/index.js';
