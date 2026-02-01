/**
 * Prioritization Domain Types
 *
 * TypeScript types for the Event Prioritization Engine frontend.
 */

// ============================================
// Enums
// ============================================

export type PriorityTier = 'must_watch' | 'worth_time' | 'highlights' | 'skip';
export type SpoilerLevel = 'safe' | 'mild' | 'full';
export type TagCategory = 'emotional' | 'context' | 'outcome' | 'quality' | 'moment';
export type TagSource = 'algorithm' | 'user' | 'curator';
export type FollowStrength = 1 | 2 | 3 | 4 | 5;
export type ComprehensionLevel = 'novice' | 'casual' | 'informed' | 'expert';
export type WatchFrequency = 'rarely' | 'occasionally' | 'regularly' | 'frequently';
export type ViewingMood = 'casual' | 'engaged' | 'intense' | 'discovery';
export type SpoilerTolerance = 'none' | 'mild' | 'moderate' | 'full';
export type PriorityReasonType = 'follow' | 'preference_match' | 'universal' | 'trending' | 'historic' | 'rivalry';

// ============================================
// Core Types
// ============================================

export interface EmotionalProfile {
  suspense: number;
  stakes: number;
  volatility: number;
  underdog: number;
  transcendence: number;
}

export interface EventTag {
  tag: string;
  category: TagCategory;
  source: TagSource;
  confidence?: number;
  userCount?: number;
  curatorVerified?: boolean;
}

export interface PriorityReason {
  reason: string;
  type: PriorityReasonType;
  contribution: number;
}

export interface EventPriority {
  eventId: string;
  priorityScore: number;
  priorityTier: PriorityTier;
  priorityReasons: PriorityReason[];
  emotionalProfile: EmotionalProfile;
  tags: EventTag[];
  spoilerLevel: SpoilerLevel;
  spoilerFreeSummary?: string;
  fullSummary?: string;
}

export interface PrioritizedTiers {
  mustWatch: EventPriority[];
  worthTime: EventPriority[];
  highlights: EventPriority[];
  skip: EventPriority[];
}

export interface PrioritizedEventList {
  userId: string;
  tiers: PrioritizedTiers;
  totalEvents: number;
  generatedAt: string;
  startDate: string;
  endDate: string;
}

export interface PriorityListSummary {
  totalEvents: number;
  mustWatchCount: number;
  worthTimeCount: number;
  highlightsCount: number;
  skipCount: number;
  topTags: TagCount[];
  sportBreakdown: SportSummary[];
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface SportSummary {
  sport: string;
  count: number;
  avgPriority: number;
}

// ============================================
// User Preferences Types
// ============================================

export interface UserFollow {
  id: string;
  type: 'team' | 'player' | 'league' | 'competition';
  name: string;
  sport: string;
  league?: string;
  followStrength: FollowStrength;
}

export interface SportFamiliarity {
  sport: string;
  comprehensionLevel: ComprehensionLevel;
  watchFrequency: WatchFrequency;
  preferredLeagues: string[];
}

export interface EmotionalPreferences {
  nailBiters: number;
  dominance: number;
  upsets: number;
  historicMoments: number;
  skillDisplay: number;
  intensity: number;
  drama: number;
}

export interface UserPreferences {
  userId: string;
  follows: UserFollow[];
  sportFamiliarity: SportFamiliarity[];
  emotionalPreferences: EmotionalPreferences;
  lastUpdated: string;
}

export interface ViewingContext {
  availableTime?: number;
  currentMood?: ViewingMood;
  spoilerTolerance: SpoilerTolerance;
  alreadyWatched: string[];
}

// ============================================
// Filter Types
// ============================================

export interface PriorityFilters {
  sports?: string[];
  leagues?: string[];
  minTier?: PriorityTier;
  tags?: string[];
  followedOnly?: boolean;
  startDate?: string;
  endDate?: string;
  maxDuration?: number;
}

// ============================================
// Helper Constants
// ============================================

export const PRIORITY_TIER_CONFIG = {
  must_watch: {
    label: "Don't Miss",
    icon: '🔥',
    description: 'Top tier events you should watch',
  },
  worth_time: {
    label: 'Worth Your Time',
    icon: '⚡',
    description: 'Solid entertainment',
  },
  highlights: {
    label: 'Catch the Highlights',
    icon: '📋',
    description: 'Skip the full event, watch the recap',
  },
  skip: {
    label: 'Skip Unless You\'re a Fan',
    icon: '⏭️',
    description: 'Only for dedicated followers',
  },
} as const;

export const DEFAULT_EMOTIONAL_PREFERENCES: EmotionalPreferences = {
  nailBiters: 3,
  dominance: 2,
  upsets: 3,
  historicMoments: 4,
  skillDisplay: 3,
  intensity: 2,
  drama: 3,
};

export const DEFAULT_VIEWING_CONTEXT: ViewingContext = {
  spoilerTolerance: 'none',
  alreadyWatched: [],
};
