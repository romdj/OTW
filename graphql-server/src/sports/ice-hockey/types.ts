/**
 * Ice Hockey - Sport-Level Types
 *
 * TypeScript types that apply to ice hockey universally,
 * regardless of which league (NHL, KHL, etc.)
 */

import type { IceHockeyAttributes } from './attributes.js';
import type { IceHockeyScoring } from './scoring.js';
import type { IceHockeyPositions } from './positions.js';
import type { IceHockeyQualities } from './qualities.js';

// Position types
export type ForwardPosition = keyof typeof IceHockeyPositions.forwards;
export type DefensePosition = keyof typeof IceHockeyPositions.defensemen;
export type GoaliePosition = keyof typeof IceHockeyPositions.goaltender;
export type HockeyPosition = ForwardPosition | DefensePosition | GoaliePosition;

// Penalty types
export type PenaltyType = typeof IceHockeyAttributes.penaltyTypes[number];

// Special teams situations
export type SpecialTeamsSituation = typeof IceHockeyAttributes.specialTeams[number];

// Emotional tags
export type TensionTag = typeof IceHockeyQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof IceHockeyQualities.emotionalTags.excitement[number];
export type PhysicalityTag = typeof IceHockeyQualities.emotionalTags.physicality[number];
export type DramaTag = typeof IceHockeyQualities.emotionalTags.drama[number];
export type SkillTag = typeof IceHockeyQualities.emotionalTags.skill[number];

export type EmotionalTag = TensionTag | ExcitementTag | PhysicalityTag | DramaTag | SkillTag;

// Game event for tracking excitement
export interface HockeyGameEvent {
  type: 'goal' | 'penalty' | 'fight' | 'save' | 'hit' | 'block';
  period: 1 | 2 | 3 | 'OT' | 'SO';
  time: string;
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
}

// Watchability assessment
export interface HockeyWatchabilityScore {
  overall: number;           // 0-100
  factors: {
    closeScore: number;
    overtime: number;
    eventCount: number;
    rivalry: number;
    stakes: number;
    starPower: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'hockey_enthusiast' | 'neutral_viewer')[];
}

// Generic hockey game representation
export interface HockeyGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  score: {
    home: number;
    away: number;
    periods: { home: number; away: number }[];
  };
  overtime: boolean;
  shootout: boolean;
  events: HockeyGameEvent[];
  watchability?: HockeyWatchabilityScore;
}
