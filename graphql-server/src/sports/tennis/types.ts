/**
 * Tennis - Sport-Level Types
 *
 * TypeScript types that apply to tennis universally.
 */

import type { TennisSurfaces } from './surfaces.js';
import type { TennisQualities } from './qualities.js';

// Surface types
export type Surface = keyof typeof TennisSurfaces;

// Match format
export type MatchFormat = 'best_of_three' | 'best_of_five';

// Point representation
export type GamePoint = '0' | '15' | '30' | '40' | 'AD';

// Emotional tags
export type TensionTag = typeof TennisQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof TennisQualities.emotionalTags.excitement[number];
export type EnduranceTag = typeof TennisQualities.emotionalTags.endurance[number];
export type DramaTag = typeof TennisQualities.emotionalTags.drama[number];
export type SkillTag = typeof TennisQualities.emotionalTags.skill[number];

export type EmotionalTag = TensionTag | ExcitementTag | EnduranceTag | DramaTag | SkillTag;

// Set score
export interface SetScore {
  player1: number;
  player2: number;
  tiebreak?: { player1: number; player2: number };
}

// Match representation
export interface TennisMatch {
  id: string;
  player1: string;
  player2: string;
  date: Date;
  surface: Surface;
  tournament: string;
  round: string;
  format: MatchFormat;
  score: {
    sets: SetScore[];
    winner: 'player1' | 'player2';
    retired?: boolean;
  };
  stats?: TennisMatchStats;
  watchability?: TennisWatchabilityScore;
}

// Match statistics
export interface TennisMatchStats {
  aces: [number, number];
  doubleFaults: [number, number];
  firstServePercentage: [number, number];
  breakPointsConverted: [string, string]; // "3/7" format
  winners: [number, number];
  unforcedErrors: [number, number];
  totalPointsWon: [number, number];
  matchDuration: number; // minutes
}

// Watchability assessment
export interface TennisWatchabilityScore {
  overall: number;
  factors: {
    rankingProximity: number;
    headToHeadHistory: number;
    surfaceSpecialist: number;
    tournamentStage: number;
    matchTightness: number;
    comebackPotential: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'tennis_enthusiast' | 'neutral_viewer')[];
}
