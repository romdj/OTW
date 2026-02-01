/**
 * TagService - Hybrid Tagging System
 *
 * Manages event tags from three sources:
 * 1. Algorithm - Auto-generated from emotional profile
 * 2. User - Added by community members
 * 3. Curator - Added by verified/trusted users
 */

import type {
  EventTag,
  TagCategory,
  TagSource,
  EmotionalProfile,
} from '../types/index.js';

/**
 * Predefined tag definitions with thresholds
 */
interface TagDefinition {
  tag: string;
  category: TagCategory;
  conditions: TagConditions;
}

interface TagConditions {
  minSuspense?: number;
  minStakes?: number;
  minVolatility?: number;
  minUnderdog?: number;
  minTranscendence?: number;
  maxSuspense?: number;
  maxVolatility?: number;
  requiresOvertime?: boolean;
  requiresUpset?: boolean;
}

/**
 * Predefined algorithm-generated tags
 */
const ALGO_TAG_DEFINITIONS: TagDefinition[] = [
  // Suspense-based tags
  {
    tag: 'nail-biter',
    category: 'emotional',
    conditions: { minSuspense: 80 },
  },
  {
    tag: 'close-finish',
    category: 'emotional',
    conditions: { minSuspense: 65 },
  },
  {
    tag: 'thriller',
    category: 'emotional',
    conditions: { minSuspense: 75, minVolatility: 60 },
  },

  // Stakes-based tags
  {
    tag: 'high-stakes',
    category: 'context',
    conditions: { minStakes: 80 },
  },
  {
    tag: 'playoff-atmosphere',
    category: 'context',
    conditions: { minStakes: 70 },
  },
  {
    tag: 'must-win',
    category: 'context',
    conditions: { minStakes: 85 },
  },

  // Volatility-based tags
  {
    tag: 'rollercoaster',
    category: 'emotional',
    conditions: { minVolatility: 80 },
  },
  {
    tag: 'momentum-swings',
    category: 'emotional',
    conditions: { minVolatility: 65 },
  },
  {
    tag: 'wild-game',
    category: 'emotional',
    conditions: { minVolatility: 75, minSuspense: 60 },
  },

  // Underdog-based tags
  {
    tag: 'upset',
    category: 'outcome',
    conditions: { minUnderdog: 80 },
  },
  {
    tag: 'cinderella-story',
    category: 'outcome',
    conditions: { minUnderdog: 85, minStakes: 70 },
  },
  {
    tag: 'david-vs-goliath',
    category: 'context',
    conditions: { minUnderdog: 60 },
  },

  // Transcendence-based tags
  {
    tag: 'instant-classic',
    category: 'quality',
    conditions: { minTranscendence: 85 },
  },
  {
    tag: 'historic',
    category: 'moment',
    conditions: { minTranscendence: 80 },
  },
  {
    tag: 'legendary',
    category: 'quality',
    conditions: { minTranscendence: 90, minSuspense: 70 },
  },
  {
    tag: 'all-timer',
    category: 'quality',
    conditions: { minTranscendence: 95 },
  },

  // Combined condition tags
  {
    tag: 'comeback',
    category: 'outcome',
    conditions: { minVolatility: 70, minSuspense: 65 },
  },
  {
    tag: 'dominant-performance',
    category: 'quality',
    conditions: { maxVolatility: 30, minStakes: 50 },
  },
  {
    tag: 'masterclass',
    category: 'quality',
    conditions: { maxVolatility: 25, minTranscendence: 60 },
  },
  {
    tag: 'heart-stopper',
    category: 'emotional',
    conditions: { minSuspense: 85, minStakes: 70 },
  },
  {
    tag: 'barnburner',
    category: 'emotional',
    conditions: { minVolatility: 75, minSuspense: 70 },
  },
];

/**
 * User tag submission input
 */
export interface UserTagInput {
  eventId: string;
  userId: string;
  tag: string;
  category?: TagCategory;
}

/**
 * Curator verification input
 */
export interface CuratorVerificationInput {
  eventId: string;
  curatorId: string;
  tagToVerify: string;
  verified: boolean;
}

/**
 * Tag aggregation result
 */
export interface AggregatedTags {
  eventId: string;
  tags: EventTag[];
  totalUserTags: number;
  curatorVerifiedCount: number;
}

/**
 * TagService - Singleton service for managing event tags
 */
export class TagService {
  private static instance: TagService;
  private userTags: Map<string, Map<string, number>>; // eventId -> tag -> count
  private curatorTags: Map<string, Set<string>>; // eventId -> verified tags

  private constructor() {
    this.userTags = new Map();
    this.curatorTags = new Map();
  }

  /**
   * Get the singleton instance
   */
  static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  /**
   * Generate algorithm-based tags from emotional profile
   */
  generateAlgorithmTags(
    emotionalProfile: EmotionalProfile,
    additionalContext?: { overtime?: boolean; upset?: boolean }
  ): EventTag[] {
    const tags: EventTag[] = [];

    for (const definition of ALGO_TAG_DEFINITIONS) {
      if (this.matchesConditions(emotionalProfile, definition.conditions, additionalContext)) {
        const confidence = this.calculateTagConfidence(emotionalProfile, definition.conditions);
        tags.push({
          tag: definition.tag,
          category: definition.category,
          source: 'algorithm',
          confidence,
        });
      }
    }

    // Sort by confidence (highest first)
    return tags.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }

  /**
   * Add a user-submitted tag
   */
  addUserTag(input: UserTagInput): EventTag {
    const { eventId, tag } = input;
    const normalizedTag = this.normalizeTag(tag);

    // Get or create tag map for this event
    if (!this.userTags.has(eventId)) {
      this.userTags.set(eventId, new Map());
    }

    const eventTags = this.userTags.get(eventId)!;
    const currentCount = eventTags.get(normalizedTag) || 0;
    eventTags.set(normalizedTag, currentCount + 1);

    return {
      tag: normalizedTag,
      category: input.category || this.inferCategory(normalizedTag),
      source: 'user',
      userCount: currentCount + 1,
      curatorVerified: this.curatorTags.get(eventId)?.has(normalizedTag) || false,
    };
  }

  /**
   * Verify a tag as a curator
   */
  verifyCuratorTag(input: CuratorVerificationInput): EventTag | null {
    const { eventId, tagToVerify, verified } = input;
    const normalizedTag = this.normalizeTag(tagToVerify);

    if (!this.curatorTags.has(eventId)) {
      this.curatorTags.set(eventId, new Set());
    }

    const curatorSet = this.curatorTags.get(eventId)!;

    if (verified) {
      curatorSet.add(normalizedTag);
    } else {
      curatorSet.delete(normalizedTag);
    }

    const userCount = this.userTags.get(eventId)?.get(normalizedTag) || 0;

    return {
      tag: normalizedTag,
      category: this.inferCategory(normalizedTag),
      source: 'curator',
      userCount,
      curatorVerified: verified,
    };
  }

  /**
   * Get all tags for an event (combined from all sources)
   */
  getEventTags(eventId: string, emotionalProfile: EmotionalProfile): AggregatedTags {
    const algoTags = this.generateAlgorithmTags(emotionalProfile);
    const userTagMap = this.userTags.get(eventId) || new Map();
    const curatorVerified = this.curatorTags.get(eventId) || new Set();

    // Start with algorithm tags
    const tagMap = new Map<string, EventTag>();

    for (const tag of algoTags) {
      tagMap.set(tag.tag, tag);
    }

    // Merge user tags
    let totalUserTags = 0;
    Array.from(userTagMap.entries()).forEach(([tag, count]) => {
      totalUserTags += count;

      if (tagMap.has(tag)) {
        // Enhance existing algo tag with user data
        const existing = tagMap.get(tag)!;
        existing.userCount = count;
        existing.curatorVerified = curatorVerified.has(tag);
      } else {
        // Add user-only tag
        tagMap.set(tag, {
          tag,
          category: this.inferCategory(tag),
          source: 'user',
          userCount: count,
          curatorVerified: curatorVerified.has(tag),
        });
      }
    });

    // Add curator-only tags
    Array.from(curatorVerified).forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, {
          tag,
          category: this.inferCategory(tag),
          source: 'curator',
          curatorVerified: true,
        });
      }
    });

    // Convert to array and sort by relevance
    const tags = Array.from(tagMap.values()).sort((a, b) => {
      // Curator verified first
      if (a.curatorVerified && !b.curatorVerified) return -1;
      if (!a.curatorVerified && b.curatorVerified) return 1;

      // Then by user count
      const countA = a.userCount || 0;
      const countB = b.userCount || 0;
      if (countA !== countB) return countB - countA;

      // Then by confidence
      return (b.confidence || 50) - (a.confidence || 50);
    });

    return {
      eventId,
      tags,
      totalUserTags,
      curatorVerifiedCount: curatorVerified.size,
    };
  }

  /**
   * Get popular tags across all events
   */
  getPopularTags(limit: number = 20): Array<{ tag: string; count: number }> {
    const tagCounts = new Map<string, number>();

    Array.from(this.userTags.values()).forEach(eventTags => {
      Array.from(eventTags.entries()).forEach(([tag, count]) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + count);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Search for events by tag
   */
  findEventsByTag(tag: string): string[] {
    const normalizedTag = this.normalizeTag(tag);
    const eventIds: string[] = [];

    Array.from(this.userTags.entries()).forEach(([eventId, tags]) => {
      if (tags.has(normalizedTag)) {
        eventIds.push(eventId);
      }
    });

    return eventIds;
  }

  /**
   * Check if emotional profile matches tag conditions
   */
  private matchesConditions(
    profile: EmotionalProfile,
    conditions: TagConditions,
    context?: { overtime?: boolean; upset?: boolean }
  ): boolean {
    if (conditions.minSuspense && profile.suspense < conditions.minSuspense) return false;
    if (conditions.minStakes && profile.stakes < conditions.minStakes) return false;
    if (conditions.minVolatility && profile.volatility < conditions.minVolatility) return false;
    if (conditions.minUnderdog && profile.underdog < conditions.minUnderdog) return false;
    if (conditions.minTranscendence && profile.transcendence < conditions.minTranscendence) return false;

    if (conditions.maxSuspense && profile.suspense > conditions.maxSuspense) return false;
    if (conditions.maxVolatility && profile.volatility > conditions.maxVolatility) return false;

    if (conditions.requiresOvertime && !context?.overtime) return false;
    if (conditions.requiresUpset && !context?.upset) return false;

    return true;
  }

  /**
   * Calculate confidence score for a tag based on how well profile matches
   */
  private calculateTagConfidence(profile: EmotionalProfile, conditions: TagConditions): number {
    let totalExcess = 0;
    let conditionCount = 0;

    if (conditions.minSuspense) {
      totalExcess += Math.max(0, profile.suspense - conditions.minSuspense);
      conditionCount++;
    }
    if (conditions.minStakes) {
      totalExcess += Math.max(0, profile.stakes - conditions.minStakes);
      conditionCount++;
    }
    if (conditions.minVolatility) {
      totalExcess += Math.max(0, profile.volatility - conditions.minVolatility);
      conditionCount++;
    }
    if (conditions.minUnderdog) {
      totalExcess += Math.max(0, profile.underdog - conditions.minUnderdog);
      conditionCount++;
    }
    if (conditions.minTranscendence) {
      totalExcess += Math.max(0, profile.transcendence - conditions.minTranscendence);
      conditionCount++;
    }

    if (conditionCount === 0) return 70; // Default confidence

    // Base confidence is 70, add up to 30 based on how much profile exceeds thresholds
    const avgExcess = totalExcess / conditionCount;
    return Math.min(100, Math.round(70 + avgExcess));
  }

  /**
   * Normalize a tag for consistent storage
   */
  private normalizeTag(tag: string): string {
    return tag
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Infer category from tag text
   */
  private inferCategory(tag: string): TagCategory {
    const normalizedTag = tag.toLowerCase();

    // Emotional tags
    const emotionalKeywords = [
      'nail-biter', 'thriller', 'heart', 'rollercoaster', 'wild', 'intense',
      'dramatic', 'exciting', 'tense', 'edge-of-seat',
    ];
    if (emotionalKeywords.some(kw => normalizedTag.includes(kw))) {
      return 'emotional';
    }

    // Outcome tags
    const outcomeKeywords = [
      'upset', 'comeback', 'blowout', 'sweep', 'shutout', 'overtime', 'winner',
    ];
    if (outcomeKeywords.some(kw => normalizedTag.includes(kw))) {
      return 'outcome';
    }

    // Context tags
    const contextKeywords = [
      'rivalry', 'playoff', 'final', 'championship', 'derby', 'classic-matchup',
      'rematch', 'david', 'stakes',
    ];
    if (contextKeywords.some(kw => normalizedTag.includes(kw))) {
      return 'context';
    }

    // Quality tags
    const qualityKeywords = [
      'masterclass', 'dominant', 'legendary', 'instant-classic', 'all-timer',
      'sloppy', 'boring', 'forgettable',
    ];
    if (qualityKeywords.some(kw => normalizedTag.includes(kw))) {
      return 'quality';
    }

    // Moment tags
    const momentKeywords = [
      'buzzer', 'walk-off', 'photo-finish', 'hole-in-one', 'hat-trick',
      'record', 'milestone',
    ];
    if (momentKeywords.some(kw => normalizedTag.includes(kw))) {
      return 'moment';
    }

    // Default to emotional
    return 'emotional';
  }

  /**
   * Clear all tags (for testing)
   */
  clearAll(): void {
    this.userTags.clear();
    this.curatorTags.clear();
  }
}

// Export singleton instance
export const tagService = TagService.getInstance();
