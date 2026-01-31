/**
 * American Football - Sport-Level Types
 */

import type { AmericanFootballQualities } from './qualities.js';

// Emotional tags
export type TensionTag = typeof AmericanFootballQualities.emotionalTags.tension[number];
export type ExcitementTag = typeof AmericanFootballQualities.emotionalTags.excitement[number];
export type PhysicalityTag = typeof AmericanFootballQualities.emotionalTags.physicality[number];
export type DramaTag = typeof AmericanFootballQualities.emotionalTags.drama[number];
export type SkillTag = typeof AmericanFootballQualities.emotionalTags.skill[number];

export type EmotionalTag = TensionTag | ExcitementTag | PhysicalityTag | DramaTag | SkillTag;

// Quarter score
export interface QuarterScore {
  home: number;
  away: number;
}

// Game representation
export interface FootballGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  venue: string;
  score: {
    home: number;
    away: number;
    quarters: QuarterScore[];
    overtime?: QuarterScore;
  };
  stats?: FootballGameStats;
  watchability?: FootballWatchabilityScore;
}

// Game statistics
export interface FootballGameStats {
  totalYards: [number, number];
  passingYards: [number, number];
  rushingYards: [number, number];
  turnovers: [number, number];
  timeOfPossession: [string, string];
  thirdDownConversions: [string, string];
}

// Watchability assessment
export interface FootballWatchabilityScore {
  overall: number;
  factors: {
    closeScore: number;
    fourthQuarterDrama: number;
    bigPlays: number;
    rivalry: number;
    stakes: number;
    starPower: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'football_enthusiast' | 'neutral_viewer')[];
}
