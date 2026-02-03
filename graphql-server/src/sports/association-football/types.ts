/**
 * Association Football (Soccer) - Sport-Level Types
 *
 * TypeScript types that apply to football universally,
 * regardless of which league (Premier League, La Liga, etc.)
 */

import type { AssociationFootballAttributes } from './attributes.js';
import type { AssociationFootballScoring } from './scoring.js';
import type { AssociationFootballPositions } from './positions.js';
import type { AssociationFootballQualities } from './qualities.js';

// Position types
export type DefenderPosition = keyof typeof AssociationFootballPositions.defenders;
export type MidfielderPosition = keyof typeof AssociationFootballPositions.midfielders;
export type ForwardPosition = keyof typeof AssociationFootballPositions.forwards;
export type FootballPosition = 'GK' | DefenderPosition | MidfielderPosition | ForwardPosition;

// Card types
export type CardType = typeof AssociationFootballAttributes.cards[number];

// Emotional tags
export type TensionTag = typeof AssociationFootballQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof AssociationFootballQualities.emotionalTags.excitement[number];
export type DramaTag = typeof AssociationFootballQualities.emotionalTags.drama[number];
export type SkillTag = typeof AssociationFootballQualities.emotionalTags.skill[number];
export type AtmosphereTag = typeof AssociationFootballQualities.emotionalTags.atmosphere[number];
export type ControversyTag = typeof AssociationFootballQualities.emotionalTags.controversy[number];

export type EmotionalTag =
  | TensionTag
  | ExcitementTag
  | DramaTag
  | SkillTag
  | AtmosphereTag
  | ControversyTag;

// Goal type
export type GoalType = typeof AssociationFootballScoring.goalTypes[number];

// Match event for tracking excitement
export interface FootballMatchEvent {
  type:
    | 'goal'
    | 'own_goal'
    | 'penalty_scored'
    | 'penalty_missed'
    | 'penalty_saved'
    | 'yellow_card'
    | 'red_card'
    | 'substitution'
    | 'var_review'
    | 'injury'
    | 'chance'
    | 'save';
  minute: number;
  addedTime?: number;
  half: 1 | 2 | 'ET1' | 'ET2';
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
  playerId?: string;
  teamId?: string;
  goalType?: GoalType;
}

// Watchability assessment
export interface FootballWatchabilityScore {
  overall: number; // 0-100
  factors: {
    closeScore: number;
    lateGoals: number;
    eventCount: number;
    rivalry: number;
    stakes: number;
    starPower: number;
    atmosphere: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'football_enthusiast' | 'neutral_viewer' | 'tactics_nerd')[];
}

// Generic football match representation
export interface FootballMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: Date;
  kickoffTime: string;
  venue: string;
  score: {
    home: number;
    away: number;
    halftime: { home: number; away: number };
    extraTime?: { home: number; away: number };
    penalties?: { home: number; away: number };
  };
  events: FootballMatchEvent[];
  stats?: FootballMatchStats;
  watchability?: FootballWatchabilityScore;
}

// Match statistics
export interface FootballMatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
  saves: { home: number; away: number };
  xG?: { home: number; away: number };
}

// League table entry
export interface FootballStanding {
  position: number;
  team: string;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  xG?: number;
  xGA?: number;
}

// TODO: Add player type definitions
// TODO: Add transfer type definitions
// TODO: Add formation type definitions
// TODO: Add tactical analysis types
// TODO: Add referee statistics types
// TODO: Add injury report types
// TODO: Add youth/academy types
// TODO: Add historical comparison types
// TODO: Add prediction model types

export type AssociationFootballAttributesType = typeof AssociationFootballAttributes;
export type AssociationFootballScoringType = typeof AssociationFootballScoring;
export type AssociationFootballPositionsType = typeof AssociationFootballPositions;
export type AssociationFootballQualitiesType = typeof AssociationFootballQualities;
