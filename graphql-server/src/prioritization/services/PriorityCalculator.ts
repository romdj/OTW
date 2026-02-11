/**
 * PriorityCalculator Service
 *
 * Combines user preferences with emotional factors to calculate
 * personalized priority scores for sporting events.
 */

import type {
  EmotionalProfile,
  UserPreferences,
  EmotionalPreferences,
  EventPriority,
  PriorityReason,
  PriorityScoreBreakdown,
  PriorityCalculationInput,
  PrioritizedEventList,
  PriorityFilters,
} from '../types/index.js';

import {
  getPriorityTier,
  calculateFollowRelevance,
  getSportComprehension,
  DEFAULT_EMOTIONAL_PREFERENCES,
} from '../types/index.js';

/**
 * Weights for combining different priority components
 */
interface PriorityWeights {
  emotionalBase: number;
  followBonus: number;
  preferenceMatch: number;
  trendingBonus: number;
  comprehensionPenalty: number;
}

const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  emotionalBase: 0.50,      // 50% from emotional profile
  followBonus: 0.25,        // 25% from following relevant teams
  preferenceMatch: 0.15,    // 15% from matching emotional preferences
  trendingBonus: 0.10,      // 10% from trending/community buzz
  comprehensionPenalty: 0.8, // 80% retention for unfamiliar sports
};

/**
 * PriorityCalculator - Singleton service for calculating personalized priorities
 */
export class PriorityCalculator {
  private static instance: PriorityCalculator;
  private weights: PriorityWeights;

  private constructor(weights?: Partial<PriorityWeights>) {
    this.weights = { ...DEFAULT_PRIORITY_WEIGHTS, ...weights };
  }

  /**
   * Get the singleton instance
   */
  static getInstance(weights?: Partial<PriorityWeights>): PriorityCalculator {
    if (!PriorityCalculator.instance) {
      PriorityCalculator.instance = new PriorityCalculator(weights);
    }
    return PriorityCalculator.instance;
  }

  /**
   * Calculate priority for a single event for a specific user
   */
  calculatePriority(
    input: PriorityCalculationInput,
    userPrefs: UserPreferences
  ): EventPriority {
    const breakdown = this.calculateScoreBreakdown(input, userPrefs);
    const reasons = this.generateReasons(input, userPrefs, breakdown);
    const spoilerFreeSummary = this.generateSpoilerFreeSummary(input, reasons);

    return {
      eventId: input.eventId,
      priorityScore: breakdown.finalScore,
      priorityTier: getPriorityTier(breakdown.finalScore),
      priorityReasons: reasons,
      emotionalProfile: input.emotionalProfile,
      tags: input.tags,
      spoilerLevel: 'safe',
      spoilerFreeSummary,
    };
  }

  /**
   * Calculate priorities for multiple events
   */
  calculatePriorities(
    inputs: PriorityCalculationInput[],
    userPrefs: UserPreferences,
    filters?: PriorityFilters
  ): PrioritizedEventList {
    let events = inputs;

    // Apply filters
    if (filters) {
      events = this.applyFilters(events, filters, userPrefs);
    }

    // Calculate priority for each event
    const priorities = events.map(input => this.calculatePriority(input, userPrefs));

    // Sort by priority score (highest first)
    priorities.sort((a, b) => b.priorityScore - a.priorityScore);

    // Group by tier
    const tiers = {
      must_watch: priorities.filter(p => p.priorityTier === 'must_watch'),
      worth_time: priorities.filter(p => p.priorityTier === 'worth_time'),
      highlights: priorities.filter(p => p.priorityTier === 'highlights'),
      skip: priorities.filter(p => p.priorityTier === 'skip'),
    };

    return {
      userId: userPrefs.userId,
      tiers,
      totalEvents: priorities.length,
      generatedAt: new Date(),
      timeRange: this.getTimeRange(inputs),
    };
  }

  /**
   * Calculate the breakdown of how the score was computed
   */
  calculateScoreBreakdown(
    input: PriorityCalculationInput,
    userPrefs: UserPreferences
  ): PriorityScoreBreakdown {
    // 1. Calculate emotional base score (average of emotional factors)
    const emotionalBase = this.calculateEmotionalBase(input.emotionalProfile);

    // 2. Calculate follow bonus
    const followBonus = this.calculateFollowBonus(input, userPrefs);

    // 3. Calculate preference match bonus
    const preferenceBonus = this.calculatePreferenceBonus(
      input.emotionalProfile,
      userPrefs.emotionalPreferences
    );

    // 4. Calculate trending bonus
    const trendingBonus = this.calculateTrendingBonus(input.communityEngagement);

    // 5. Calculate comprehension penalty
    const comprehensionPenalty = this.calculateComprehensionPenalty(input.sport, userPrefs);

    // Combine with weights
    const rawScore =
      emotionalBase * this.weights.emotionalBase +
      followBonus * this.weights.followBonus +
      preferenceBonus * this.weights.preferenceMatch +
      trendingBonus * this.weights.trendingBonus;

    // Apply comprehension penalty (novice viewers get slightly lower scores for complex sports)
    const finalScore = Math.round(rawScore * comprehensionPenalty);

    return {
      emotionalBase,
      followBonus,
      preferenceBonus,
      trendingBonus,
      comprehensionPenalty: Math.round((1 - comprehensionPenalty) * 100),
      finalScore: Math.min(100, Math.max(0, finalScore)),
    };
  }

  /**
   * Calculate base score from emotional profile
   */
  private calculateEmotionalBase(profile: EmotionalProfile): number {
    // Weighted average of emotional factors
    // Suspense and stakes are weighted higher as they're most universal
    return Math.round(
      profile.suspense * 0.30 +
      profile.stakes * 0.25 +
      profile.volatility * 0.20 +
      profile.underdog * 0.15 +
      profile.transcendence * 0.10
    );
  }

  /**
   * Calculate bonus for following relevant teams
   */
  private calculateFollowBonus(
    input: PriorityCalculationInput,
    userPrefs: UserPreferences
  ): number {
    const relevance = calculateFollowRelevance(
      userPrefs.follows,
      input.participants,
      input.league,
      input.sport
    );

    // Scale to 0-100 range
    return relevance;
  }

  /**
   * Calculate bonus for matching emotional preferences
   */
  private calculatePreferenceBonus(
    profile: EmotionalProfile,
    prefs: EmotionalPreferences = DEFAULT_EMOTIONAL_PREFERENCES
  ): number {
    let matchScore = 0;
    let maxPossible = 0;

    // High suspense matches nail-biter preference
    if (profile.suspense >= 70) {
      matchScore += prefs.nailBiters * 4; // Max 20 points
      maxPossible += 20;
    }

    // High underdog matches upset preference
    if (profile.underdog >= 70) {
      matchScore += prefs.upsets * 4;
      maxPossible += 20;
    }

    // High transcendence matches historic moments preference
    if (profile.transcendence >= 70) {
      matchScore += prefs.historicMoments * 4;
      maxPossible += 20;
    }

    // High volatility matches drama preference
    if (profile.volatility >= 70) {
      matchScore += prefs.drama * 4;
      maxPossible += 20;
    }

    // Low volatility + high profile factor = dominance (inverse)
    const avgScore = (profile.suspense + profile.stakes + profile.transcendence) / 3;
    if (profile.volatility < 40 && avgScore >= 70) {
      matchScore += prefs.dominance * 4;
      maxPossible += 20;
    }

    // Normalize to 0-100
    return maxPossible > 0 ? Math.round((matchScore / maxPossible) * 100) : 50;
  }

  /**
   * Calculate bonus from trending/community engagement
   */
  private calculateTrendingBonus(communityEngagement: number): number {
    // Community engagement is already 0-100
    return communityEngagement;
  }

  /**
   * Calculate penalty for unfamiliar sports
   */
  private calculateComprehensionPenalty(sport: string, userPrefs: UserPreferences): number {
    const comprehension = getSportComprehension(userPrefs.sportFamiliarity, sport);

    switch (comprehension) {
      case 'expert':
        return 1.0; // No penalty
      case 'informed':
        return 0.95; // 5% penalty
      case 'casual':
        return 0.90; // 10% penalty
      case 'novice':
        return this.weights.comprehensionPenalty; // Default 20% penalty
      default:
        return this.weights.comprehensionPenalty;
    }
  }

  /**
   * Generate human-readable reasons for the priority
   */
  private generateReasons(
    input: PriorityCalculationInput,
    userPrefs: UserPreferences,
    breakdown: PriorityScoreBreakdown
  ): PriorityReason[] {
    const reasons: PriorityReason[] = [];

    // Follow-based reasons
    if (breakdown.followBonus >= 50) {
      const followedTeams = userPrefs.follows
        .filter(f => f.type === 'team' && input.participants.includes(f.id))
        .map(f => f.name);

      if (followedTeams.length > 0) {
        reasons.push({
          reason: `Your team${followedTeams.length > 1 ? 's' : ''}: ${followedTeams.join(', ')}`,
          type: 'follow',
          contribution: breakdown.followBonus,
        });
      }
    }

    // Preference match reasons
    const profile = input.emotionalProfile;

    if (profile.suspense >= 75 && userPrefs.emotionalPreferences?.nailBiters >= 3) {
      reasons.push({
        reason: 'Nail-biter you\'ll love',
        type: 'preference_match',
        contribution: 15,
      });
    }

    if (profile.underdog >= 75 && userPrefs.emotionalPreferences?.upsets >= 3) {
      reasons.push({
        reason: 'Underdog story',
        type: 'preference_match',
        contribution: 15,
      });
    }

    if (profile.transcendence >= 70) {
      reasons.push({
        reason: 'Potential instant classic',
        type: 'historic',
        contribution: 20,
      });
    }

    // Universal quality reasons
    if (breakdown.emotionalBase >= 80) {
      reasons.push({
        reason: 'Exceptional event quality',
        type: 'universal',
        contribution: breakdown.emotionalBase,
      });
    }

    // Trending reason
    if (breakdown.trendingBonus >= 70) {
      reasons.push({
        reason: 'Everyone\'s talking about it',
        type: 'trending',
        contribution: breakdown.trendingBonus,
      });
    }

    // Stakes-based reasons
    if (profile.stakes >= 80) {
      reasons.push({
        reason: 'High-stakes matchup',
        type: 'universal',
        contribution: 20,
      });
    }

    // Tag-based reasons
    const rivalryTag = input.tags.find(t => t.tag.toLowerCase().includes('rivalry'));
    if (rivalryTag) {
      reasons.push({
        reason: 'Rivalry game',
        type: 'rivalry',
        contribution: 15,
      });
    }

    return reasons;
  }

  /**
   * Generate a spoiler-free summary for event cards
   */
  private generateSpoilerFreeSummary(
    input: PriorityCalculationInput,
    reasons: PriorityReason[]
  ): string {
    const profile = input.emotionalProfile;
    const parts: string[] = [];

    // Lead with the strongest emotional factor
    if (profile.suspense >= 80) {
      parts.push('Edge-of-your-seat finish');
    } else if (profile.stakes >= 80) {
      parts.push('Everything on the line');
    } else if (profile.transcendence >= 70) {
      parts.push('One for the history books');
    } else if (profile.underdog >= 75) {
      parts.push('David vs Goliath matchup');
    } else if (profile.volatility >= 75) {
      parts.push('Wild ride from start to finish');
    }

    // Add preference match if relevant
    const prefReason = reasons.find(r => r.type === 'preference_match');
    if (prefReason && parts.length < 2) {
      parts.push(prefReason.reason);
    }

    // Add follow reason if relevant
    const followReason = reasons.find(r => r.type === 'follow');
    if (followReason) {
      parts.push(followReason.reason);
    }

    return parts.join(' • ') || 'Worth checking out';
  }

  /**
   * Apply filters to event list
   */
  private applyFilters(
    inputs: PriorityCalculationInput[],
    filters: PriorityFilters,
    userPrefs: UserPreferences
  ): PriorityCalculationInput[] {
    return inputs.filter(input => {
      // Sport filter
      if (filters.sports?.length && !filters.sports.includes(input.sport)) {
        return false;
      }

      // League filter
      if (filters.leagues?.length && !filters.leagues.includes(input.league)) {
        return false;
      }

      // Followed only filter
      if (filters.followedOnly) {
        const hasFollowed = userPrefs.follows.some(
          f => input.participants.includes(f.id) || f.id === input.league
        );
        if (!hasFollowed) return false;
      }

      // Tag filter
      if (filters.tags?.length) {
        const inputTags = input.tags.map(t => t.tag.toLowerCase());
        const hasTag = filters.tags.some(tag => inputTags.includes(tag.toLowerCase()));
        if (!hasTag) return false;
      }

      // Duration filter
      if (filters.maxDuration && input.duration && input.duration > filters.maxDuration) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get time range from inputs
   */
  private getTimeRange(_inputs: PriorityCalculationInput[]): { start: Date; end: Date } {
    // Default to current weekend if no date info
    // TODO: Extract date range from inputs when available
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay()); // Start of week
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // End of week

    return { start, end };
  }

  /**
   * Quick priority calculation without full user preferences
   */
  quickPriority(
    eventId: string,
    emotionalProfile: EmotionalProfile,
    isFollowedTeam: boolean = false
  ): EventPriority {
    const base = this.calculateEmotionalBase(emotionalProfile);
    const followBonus = isFollowedTeam ? 30 : 0;
    const score = Math.min(100, base + followBonus);

    return {
      eventId,
      priorityScore: score,
      priorityTier: getPriorityTier(score),
      priorityReasons: [],
      emotionalProfile,
      tags: [],
      spoilerLevel: 'safe',
    };
  }
}

// Export singleton instance
export const priorityCalculator = PriorityCalculator.getInstance();
