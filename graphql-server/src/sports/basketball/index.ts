/**
 * Basketball - Sport Module
 *
 * Exports all basketball-related definitions.
 */

export { BasketballAttributes } from './attributes.js';
export { BasketballScoring } from './scoring.js';
export { BasketballPositions } from './positions.js';
export { BasketballQualities } from './qualities.js';

export type {
  TraditionalPosition,
  ModernPosition,
  EmotionalTag,
  ShotType,
  BasketballGameEvent,
  BasketballWatchabilityScore,
  BasketballGame,
  BasketballGameStats,
  BasketballStanding,
  BasketballPlayerBoxScore,
} from './types.js';

// TODO: Export league adapters when implemented
// export { NBAAdapter } from './leagues/nba/index.js';
// export { EuroLeagueAdapter } from './leagues/euroleague/index.js';
// export { NCAAAdapter } from './leagues/ncaa/index.js';
// export { WNBAAdapter } from './leagues/wnba/index.js';
