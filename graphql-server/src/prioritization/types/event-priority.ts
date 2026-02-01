/**
 * Event Priority - Personalized Prioritization Model
 *
 * Combines emotional analysis with user preferences to calculate
 * personalized priority scores for sporting events.
 */

import type { EmotionalProfile } from './emotional-factors.js';

/**
 * Priority tiers for categorizing events
 */
export type PriorityTier =
  | 'must_watch'   // Don't miss this - top tier events
  | 'worth_time'   // Worth your time - solid entertainment
  | 'highlights'   // Catch the highlights - skip full event
  | 'skip';        // Skip unless you're a dedicated fan

/**
 * Threshold scores for each priority tier
 */
export const PRIORITY_TIER_THRESHOLDS = {
  must_watch: 80,    // Score >= 80
  worth_time: 60,    // Score >= 60
  highlights: 40,    // Score >= 40
  skip: 0,           // Score < 40
} as const;

/**
 * Convert a priority score to a tier
 */
export function getPriorityTier(score: number): PriorityTier {
  if (score >= PRIORITY_TIER_THRESHOLDS.must_watch) return 'must_watch';
  if (score >= PRIORITY_TIER_THRESHOLDS.worth_time) return 'worth_time';
  if (score >= PRIORITY_TIER_THRESHOLDS.highlights) return 'highlights';
  return 'skip';
}

/**
 * Spoiler safety levels for event information
 */
export type SpoilerLevel =
  | 'safe'   // No outcome hints at all
  | 'mild'   // May hint at excitement level but not outcome
  | 'full';  // Full spoilers including result

/**
 * An event tag with metadata
 */
export interface EventTag {
  /** The tag text (e.g., "nail-biter", "upset", "rivalry") */
  tag: string;
  /** Category of tag */
  category: TagCategory;
  /** Source of the tag */
  source: TagSource;
  /** Confidence in the tag (for algo-generated) */
  confidence?: number;
  /** Number of users who applied this tag */
  userCount?: number;
  /** Is this tag verified by a curator */
  curatorVerified?: boolean;
}

/**
 * Categories of event tags
 */
export type TagCategory =
  | 'emotional'    // How the event felt (nail-biter, thriller)
  | 'context'      // Event context (rivalry, playoff)
  | 'outcome'      // What happened (upset, comeback)
  | 'quality'      // Quality of play (masterclass, sloppy)
  | 'moment';      // Specific moments (buzzer-beater, photo-finish)

/**
 * Source of an event tag
 */
export type TagSource =
  | 'algorithm'    // Auto-generated from event data
  | 'user'         // Added by community members
  | 'curator';     // Added by verified curators

/**
 * Why an event has a particular priority for a user
 */
export interface PriorityReason {
  /** The reason text */
  reason: string;
  /** Type of reason */
  type: PriorityReasonType;
  /** How much this reason contributed to the score */
  contribution: number;
}

/**
 * Types of priority reasons
 */
export type PriorityReasonType =
  | 'follow'           // Your team/player involved
  | 'preference_match' // Matches your emotional preferences
  | 'universal'        // High quality event regardless of preferences
  | 'trending'         // Everyone's talking about it
  | 'historic'         // Historic significance
  | 'rivalry';         // Important rivalry game

/**
 * The complete priority assessment for an event for a specific user
 */
export interface EventPriority {
  /** Event identifier */
  eventId: string;

  /** Personalized priority score (0-100) */
  priorityScore: number;

  /** Priority tier based on score */
  priorityTier: PriorityTier;

  /** Why this priority for THIS user */
  priorityReasons: PriorityReason[];

  /** Universal emotional factors (spoiler-safe) */
  emotionalProfile: EmotionalProfile;

  /** Tags (hybrid: algo + user + curator) */
  tags: EventTag[];

  /** Current spoiler level of this data */
  spoilerLevel: SpoilerLevel;

  /** Spoiler-safe summary for event cards */
  spoilerFreeSummary?: string;

  /** Full summary (with spoilers) */
  fullSummary?: string;
}

/**
 * Breakdown of how the priority score was calculated
 */
export interface PriorityScoreBreakdown {
  /** Base score from emotional profile */
  emotionalBase: number;
  /** Bonus from user follows */
  followBonus: number;
  /** Bonus from preference matching */
  preferenceBonus: number;
  /** Bonus from trending/social buzz */
  trendingBonus: number;
  /** Penalty for low comprehension */
  comprehensionPenalty: number;
  /** Final calculated score */
  finalScore: number;
}

/**
 * Input for calculating priority
 */
export interface PriorityCalculationInput {
  /** The event to calculate priority for */
  eventId: string;
  /** Emotional profile of the event */
  emotionalProfile: EmotionalProfile;
  /** Teams/players involved (for follow matching) */
  participants: string[];
  /** Sport of the event */
  sport: string;
  /** League of the event */
  league: string;
  /** Tags associated with the event */
  tags: EventTag[];
  /** Community engagement level */
  communityEngagement: number;
  /** Duration of the event in minutes */
  duration?: number;
}

/**
 * A prioritized list of events
 */
export interface PrioritizedEventList {
  /** User ID these priorities are for */
  userId: string;
  /** Events grouped by tier */
  tiers: {
    must_watch: EventPriority[];
    worth_time: EventPriority[];
    highlights: EventPriority[];
    skip: EventPriority[];
  };
  /** Total number of events */
  totalEvents: number;
  /** When this list was generated */
  generatedAt: Date;
  /** Time range of events */
  timeRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Filters for retrieving prioritized events
 */
export interface PriorityFilters {
  /** Filter by sports */
  sports?: string[];
  /** Filter by leagues */
  leagues?: string[];
  /** Minimum priority tier */
  minTier?: PriorityTier;
  /** Filter by tags */
  tags?: string[];
  /** Only events involving followed teams */
  followedOnly?: boolean;
  /** Time range */
  startDate?: Date;
  /** End date */
  endDate?: Date;
  /** Maximum duration in minutes */
  maxDuration?: number;
}

/**
 * Summary statistics for a prioritized event list
 */
export interface PriorityListSummary {
  /** Total events analyzed */
  totalEvents: number;
  /** Breakdown by tier */
  tierCounts: Record<PriorityTier, number>;
  /** Top emotional factors across must-watch events */
  topEmotionalFactors: Array<{ factor: keyof EmotionalProfile; avgScore: number }>;
  /** Most common tags */
  topTags: Array<{ tag: string; count: number }>;
  /** Sports breakdown */
  sportBreakdown: Array<{ sport: string; count: number; avgPriority: number }>;
}

/**
 * Helper to create a default priority for an event with minimal data
 */
export function createDefaultPriority(
  eventId: string,
  emotionalProfile: EmotionalProfile
): EventPriority {
  const avgScore =
    (emotionalProfile.suspense +
      emotionalProfile.stakes +
      emotionalProfile.volatility +
      emotionalProfile.underdog +
      emotionalProfile.transcendence) /
    5;

  return {
    eventId,
    priorityScore: avgScore,
    priorityTier: getPriorityTier(avgScore),
    priorityReasons: [],
    emotionalProfile,
    tags: [],
    spoilerLevel: 'safe',
  };
}
