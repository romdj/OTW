/**
 * Handball - Sport-Level Types
 *
 * TypeScript types that apply to handball universally.
 */

import type { HandballPositions } from './positions.js';
import type { HandballQualities } from './qualities.js';
import type { HandballScoring } from './scoring.js';

// Position types
export type FieldPosition = keyof typeof HandballPositions.fieldPlayers;
export type AllPosition = 'GK' | FieldPosition;

// Emotional tags
export type TensionTag = typeof HandballQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof HandballQualities.emotionalTags.excitement[number];
export type DramaTag = typeof HandballQualities.emotionalTags.drama[number];
export type SkillTag = typeof HandballQualities.emotionalTags.skill[number];
export type PhysicalityTag = typeof HandballQualities.emotionalTags.physicality[number];

export type EmotionalTag = TensionTag | ExcitementTag | DramaTag | SkillTag | PhysicalityTag;

// Goal types
export type GoalType = typeof HandballScoring.goalTypes[number];

// Match event
export interface HandballMatchEvent {
  type:
    | 'goal'
    | 'save'
    | 'seven_meter'
    | 'two_minute_suspension'
    | 'red_card'
    | 'timeout'
    | 'turnover'
    | 'fast_break'
    | 'block';
  minute: number;
  half: 1 | 2 | 'OT1' | 'OT2';
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
  playerId?: string;
  teamId?: string;
  goalType?: GoalType;
}

// Watchability assessment
export interface HandballWatchabilityScore {
  overall: number; // 0-100
  factors: {
    closeScore: number;
    overtime: number;
    momentumSwings: number;
    stakesLevel: number;
    rivalryFactor: number;
    goalkeeperDuel: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'handball_enthusiast' | 'neutral_viewer')[];
}

// Match representation
export interface HandballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: Date;
  score: {
    home: number;
    away: number;
    halftime: { home: number; away: number };
    overtime?: { home: number; away: number }[];
    penalties?: { home: number; away: number };
  };
  events: HandballMatchEvent[];
  stats?: HandballMatchStats;
  watchability?: HandballWatchabilityScore;
}

// Match statistics
export interface HandballMatchStats {
  goals: { home: number; away: number };
  shots: { home: number; away: number };
  shootingPercentage: { home: number; away: number };
  saves: { home: number; away: number };
  savePercentage: { home: number; away: number };
  sevenMeters: { home: { scored: number; attempted: number }; away: { scored: number; attempted: number } };
  fastBreaks: { home: number; away: number };
  turnovers: { home: number; away: number };
  suspensions: { home: number; away: number };
}

// Standing entry
export interface HandballStanding {
  position: number;
  team: string;
  teamId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

// TODO: Add player statistics types
// TODO: Add goalkeeper statistics types
// TODO: Add tournament bracket types
// TODO: Add beach handball types

export type HandballAttributesType = typeof import('./attributes.js').HandballAttributes;
export type HandballScoringType = typeof HandballScoring;
export type HandballPositionsType = typeof HandballPositions;
export type HandballQualitiesType = typeof HandballQualities;
