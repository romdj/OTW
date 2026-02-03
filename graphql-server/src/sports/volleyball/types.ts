/**
 * Volleyball - Sport-Level Types
 *
 * TypeScript types that apply to volleyball universally.
 */

import type { VolleyballPositions } from './positions.js';
import type { VolleyballQualities } from './qualities.js';
import type { VolleyballScoring } from './scoring.js';

// Position types
export type IndoorPosition = keyof typeof VolleyballPositions.indoor;
export type CourtPosition = 1 | 2 | 3 | 4 | 5 | 6;

// Emotional tags
export type TensionTag = typeof VolleyballQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof VolleyballQualities.emotionalTags.excitement[number];
export type DramaTag = typeof VolleyballQualities.emotionalTags.drama[number];
export type SkillTag = typeof VolleyballQualities.emotionalTags.skill[number];
export type AthleticismTag = typeof VolleyballQualities.emotionalTags.athleticism[number];

export type EmotionalTag = TensionTag | ExcitementTag | DramaTag | SkillTag | AthleticismTag;

// Rally event
export interface VolleyballRallyEvent {
  type:
    | 'serve'
    | 'reception'
    | 'set'
    | 'attack'
    | 'block'
    | 'dig'
    | 'ace'
    | 'error'
    | 'timeout'
    | 'substitution'
    | 'challenge';
  set: number;
  score: { home: number; away: number };
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
  playerId?: string;
  teamId?: string;
  outcome?: 'point' | 'continuation' | 'error';
}

// Watchability assessment
export interface VolleyballWatchabilityScore {
  overall: number; // 0-100
  factors: {
    closeScore: number;
    fifthSet: number;
    momentumSwings: number;
    stakesLevel: number;
    rivalryFactor: number;
    starPower: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'volleyball_enthusiast' | 'neutral_viewer')[];
}

// Match representation
export interface VolleyballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: Date;
  type: 'indoor' | 'beach';
  score: {
    home: number; // Sets won
    away: number;
    sets: Array<{ home: number; away: number }>;
  };
  events: VolleyballRallyEvent[];
  stats?: VolleyballMatchStats;
  watchability?: VolleyballWatchabilityScore;
}

// Match statistics
export interface VolleyballMatchStats {
  kills: { home: number; away: number };
  attackEfficiency: { home: number; away: number };
  serviceAces: { home: number; away: number };
  serviceErrors: { home: number; away: number };
  blocks: { home: number; away: number };
  digs: { home: number; away: number };
  receptionEfficiency: { home: number; away: number };
  sideoutPercentage: { home: number; away: number };
}

// Standing entry
export interface VolleyballStanding {
  position: number;
  team: string;
  teamId: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsWon: number;
  setsLost: number;
  setRatio: number;
  pointsWon: number;
  pointsLost: number;
  pointRatio: number;
  points: number; // League points
}

// TODO: Add player statistics types
// TODO: Add rotation tracking types
// TODO: Add beach volleyball specific types
// TODO: Add tournament bracket types
// TODO: Add pool play types

export type VolleyballAttributesType = typeof import('./attributes.js').VolleyballAttributes;
export type VolleyballScoringType = typeof VolleyballScoring;
export type VolleyballPositionsType = typeof VolleyballPositions;
export type VolleyballQualitiesType = typeof VolleyballQualities;
