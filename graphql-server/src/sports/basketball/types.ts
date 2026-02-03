/**
 * Basketball - Sport-Level Types
 *
 * TypeScript types that apply to basketball universally.
 */

import type { BasketballPositions } from './positions.js';
import type { BasketballQualities } from './qualities.js';
import type { BasketballScoring } from './scoring.js';

// Position types
export type TraditionalPosition = keyof typeof BasketballPositions.traditional;
export type ModernPosition = keyof typeof BasketballPositions.modern;

// Emotional tags
export type TensionTag = typeof BasketballQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof BasketballQualities.emotionalTags.excitement[number];
export type DramaTag = typeof BasketballQualities.emotionalTags.drama[number];
export type SkillTag = typeof BasketballQualities.emotionalTags.skill[number];
export type PhysicalityTag = typeof BasketballQualities.emotionalTags.physicality[number];

export type EmotionalTag = TensionTag | ExcitementTag | DramaTag | SkillTag | PhysicalityTag;

// Shot types
export type ShotType = typeof BasketballScoring.shotTypes[number];

// Game event for tracking excitement
export interface BasketballGameEvent {
  type:
    | 'field_goal'
    | 'three_pointer'
    | 'free_throw'
    | 'dunk'
    | 'block'
    | 'steal'
    | 'turnover'
    | 'foul'
    | 'timeout'
    | 'substitution';
  quarter: 1 | 2 | 3 | 4 | 'OT1' | 'OT2' | 'OT3';
  timeRemaining: string; // "MM:SS" format
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
  playerId?: string;
  teamId?: string;
  shotType?: ShotType;
  points?: number;
}

// Watchability assessment
export interface BasketballWatchabilityScore {
  overall: number; // 0-100
  factors: {
    closeScore: number;
    fourthQuarterDrama: number;
    eventCount: number;
    rivalryFactor: number;
    stakesLevel: number;
    starPower: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'basketball_enthusiast' | 'neutral_viewer' | 'stats_nerd')[];
}

// Generic basketball game representation
export interface BasketballGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: Date;
  score: {
    home: number;
    away: number;
    quarters: { home: number; away: number }[];
    overtime?: { home: number; away: number }[];
  };
  events: BasketballGameEvent[];
  stats?: BasketballGameStats;
  watchability?: BasketballWatchabilityScore;
}

// Game statistics
export interface BasketballGameStats {
  pace: number;
  possessions: { home: number; away: number };
  fieldGoals: { home: { made: number; attempted: number }; away: { made: number; attempted: number } };
  threePointers: { home: { made: number; attempted: number }; away: { made: number; attempted: number } };
  freeThrows: { home: { made: number; attempted: number }; away: { made: number; attempted: number } };
  rebounds: { home: number; away: number };
  assists: { home: number; away: number };
  steals: { home: number; away: number };
  blocks: { home: number; away: number };
  turnovers: { home: number; away: number };
  pointsInPaint: { home: number; away: number };
  fastBreakPoints: { home: number; away: number };
  secondChancePoints: { home: number; away: number };
}

// Standing entry
export interface BasketballStanding {
  position: number;
  team: string;
  teamId: string;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBehind: number;
  conference: string;
  division: string;
  homeRecord: { wins: number; losses: number };
  awayRecord: { wins: number; losses: number };
  last10: { wins: number; losses: number };
  streak: { type: 'W' | 'L'; count: number };
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
  netRating?: number;
}

// Player box score
export interface BasketballPlayerBoxScore {
  playerId: string;
  playerName: string;
  position: TraditionalPosition;
  minutes: string; // "MM:SS" format
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoals: { made: number; attempted: number };
  threePointers: { made: number; attempted: number };
  freeThrows: { made: number; attempted: number };
  plusMinus: number;
  personalFouls: number;
}

// TODO: Add player season stats type
// TODO: Add draft pick type
// TODO: Add salary cap type
// TODO: Add injury report type
// TODO: Add playoff bracket type
// TODO: Add March Madness specific types
// TODO: Add tracking data types (player movement, shot charts)

export type BasketballAttributesType = typeof import('./attributes.js').BasketballAttributes;
export type BasketballScoringType = typeof BasketballScoring;
export type BasketballPositionsType = typeof BasketballPositions;
export type BasketballQualitiesType = typeof BasketballQualities;
