/**
 * Association Football (Soccer) - Sport Module
 *
 * Exports all football-related definitions.
 */

export { AssociationFootballAttributes } from './attributes.js';
export { AssociationFootballScoring } from './scoring.js';
export { AssociationFootballPositions } from './positions.js';
export { AssociationFootballQualities } from './qualities.js';

export type {
  FootballPosition,
  DefenderPosition,
  MidfielderPosition,
  ForwardPosition,
  CardType,
  EmotionalTag,
  GoalType,
  FootballMatchEvent,
  FootballWatchabilityScore,
  FootballMatch,
  FootballMatchStats,
  FootballStanding,
} from './types.js';

// TODO: Export league adapters when implemented
// export { PremierLeagueAdapter } from './leagues/premier-league/index.js';
// export { LaLigaAdapter } from './leagues/la-liga/index.js';
// export { BundesligaAdapter } from './leagues/bundesliga/index.js';
// export { SerieAAdapter } from './leagues/serie-a/index.js';
// export { Ligue1Adapter } from './leagues/ligue-1/index.js';
// export { MLSAdapter } from './leagues/mls/index.js';
// export { ChampionsLeagueAdapter } from './leagues/champions-league/index.js';
