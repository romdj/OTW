/**
 * Prioritization GraphQL Resolvers
 *
 * Handles all prioritization-related queries and mutations.
 */

import { priorityCalculator } from '../services/PriorityCalculator.js';
import { tagService } from '../services/TagService.js';
import type {
  UserPreferences,
  UserFollow,
  SportFamiliarity,
  EmotionalPreferences,
  PriorityFilters,
  EventPriority,
  PrioritizedEventList,
  PriorityCalculationInput,
  EventTag,
} from '../types/index.js';

// In-memory user preferences store (would be a database in production)
const userPreferencesStore = new Map<string, UserPreferences>();

/**
 * Helper to get or create user preferences
 */
function getUserPreferences(userId: string): UserPreferences {
  if (!userPreferencesStore.has(userId)) {
    userPreferencesStore.set(userId, {
      userId,
      follows: [],
      sportFamiliarity: [],
      emotionalPreferences: {
        nailBiters: 3,
        dominance: 2,
        upsets: 3,
        historicMoments: 4,
        skillDisplay: 3,
        intensity: 2,
        drama: 3,
      },
      lastUpdated: new Date(),
    });
  }
  return userPreferencesStore.get(userId)!;
}

/**
 * Convert GraphQL enum to internal type
 */
function mapPriorityTier(tier: string): 'must_watch' | 'worth_time' | 'highlights' | 'skip' {
  switch (tier) {
    case 'MUST_WATCH': return 'must_watch';
    case 'WORTH_TIME': return 'worth_time';
    case 'HIGHLIGHTS': return 'highlights';
    case 'SKIP': return 'skip';
    default: return 'skip';
  }
}

/**
 * Convert internal tier to GraphQL enum
 */
function mapTierToEnum(tier: string): string {
  switch (tier) {
    case 'must_watch': return 'MUST_WATCH';
    case 'worth_time': return 'WORTH_TIME';
    case 'highlights': return 'HIGHLIGHTS';
    case 'skip': return 'SKIP';
    default: return 'SKIP';
  }
}

/**
 * Generate mock events for demonstration
 * In production, this would fetch real events from the sports services
 */
function getMockEvents(): PriorityCalculationInput[] {
  return [
    {
      eventId: 'nhl-2025-01-25-bos-tor',
      emotionalProfile: {
        suspense: 85,
        stakes: 90,
        volatility: 75,
        underdog: 45,
        transcendence: 70,
      },
      participants: ['BOS', 'TOR'],
      sport: 'ice-hockey',
      league: 'NHL',
      tags: [
        { tag: 'rivalry', category: 'context', source: 'algorithm', confidence: 95 },
        { tag: 'playoff-atmosphere', category: 'context', source: 'algorithm', confidence: 88 },
      ],
      communityEngagement: 82,
      duration: 165,
    },
    {
      eventId: 'nhl-2025-01-25-edm-cgy',
      emotionalProfile: {
        suspense: 92,
        stakes: 85,
        volatility: 88,
        underdog: 55,
        transcendence: 85,
      },
      participants: ['EDM', 'CGY'],
      sport: 'ice-hockey',
      league: 'NHL',
      tags: [
        { tag: 'nail-biter', category: 'emotional', source: 'algorithm', confidence: 92 },
        { tag: 'battle-of-alberta', category: 'context', source: 'curator', curatorVerified: true },
      ],
      communityEngagement: 95,
      duration: 180,
    },
    {
      eventId: 'nhl-2025-01-25-col-min',
      emotionalProfile: {
        suspense: 65,
        stakes: 70,
        volatility: 55,
        underdog: 30,
        transcendence: 40,
      },
      participants: ['COL', 'MIN'],
      sport: 'ice-hockey',
      league: 'NHL',
      tags: [
        { tag: 'solid-game', category: 'quality', source: 'algorithm', confidence: 75 },
      ],
      communityEngagement: 55,
      duration: 150,
    },
    {
      eventId: 'atp-2025-01-25-aus-open-sf',
      emotionalProfile: {
        suspense: 95,
        stakes: 95,
        volatility: 80,
        underdog: 75,
        transcendence: 90,
      },
      participants: ['sinner', 'djokovic'],
      sport: 'tennis',
      league: 'ATP',
      tags: [
        { tag: 'instant-classic', category: 'quality', source: 'algorithm', confidence: 95 },
        { tag: 'grand-slam', category: 'context', source: 'algorithm', confidence: 100 },
        { tag: 'upset', category: 'outcome', source: 'user', userCount: 234 },
      ],
      communityEngagement: 98,
      duration: 240,
    },
    {
      eventId: 'nhl-2025-01-25-det-chi',
      emotionalProfile: {
        suspense: 45,
        stakes: 40,
        volatility: 35,
        underdog: 25,
        transcendence: 20,
      },
      participants: ['DET', 'CHI'],
      sport: 'ice-hockey',
      league: 'NHL',
      tags: [],
      communityEngagement: 30,
      duration: 145,
    },
  ];
}

/**
 * Priority resolvers
 */
export const priorityResolvers = {
  Query: {
    prioritizedEvents: (
      _: unknown,
      args: {
        userId: string;
        filters?: {
          sports?: string[];
          leagues?: string[];
          minTier?: string;
          tags?: string[];
          followedOnly?: boolean;
          startDate?: string;
          endDate?: string;
          maxDuration?: number;
        };
        viewingContext?: {
          availableTime?: number;
          currentMood?: string;
          spoilerTolerance?: string;
          alreadyWatched?: string[];
        };
      }
    ): PrioritizedEventList => {
      const userPrefs = getUserPreferences(args.userId);

      // Map GraphQL filters to internal format
      const filters: PriorityFilters | undefined = args.filters
        ? {
            sports: args.filters.sports,
            leagues: args.filters.leagues,
            minTier: args.filters.minTier
              ? mapPriorityTier(args.filters.minTier)
              : undefined,
            tags: args.filters.tags,
            followedOnly: args.filters.followedOnly,
            startDate: args.filters.startDate ? new Date(args.filters.startDate) : undefined,
            endDate: args.filters.endDate ? new Date(args.filters.endDate) : undefined,
            maxDuration: args.filters.maxDuration,
          }
        : undefined;

      // Get events (mock for now, would be from sports services)
      const events = getMockEvents();

      // Filter out already watched
      const filteredEvents = args.viewingContext?.alreadyWatched
        ? events.filter(e => !args.viewingContext!.alreadyWatched!.includes(e.eventId))
        : events;

      // Calculate priorities
      const result = priorityCalculator.calculatePriorities(
        filteredEvents,
        userPrefs,
        filters
      );

      // Convert to GraphQL format
      return {
        userId: result.userId,
        tiers: result.tiers,
        totalEvents: result.totalEvents,
        generatedAt: result.generatedAt,
        timeRange: result.timeRange,
      };
    },

    eventPriority: (
      _: unknown,
      args: { eventId: string; userId: string }
    ): EventPriority | null => {
      const userPrefs = getUserPreferences(args.userId);
      const events = getMockEvents();
      const event = events.find(e => e.eventId === args.eventId);

      if (!event) {
        return null;
      }

      return priorityCalculator.calculatePriority(event, userPrefs);
    },

    prioritySummary: (
      _: unknown,
      args: {
        userId: string;
        filters?: {
          sports?: string[];
          leagues?: string[];
          minTier?: string;
          tags?: string[];
          followedOnly?: boolean;
        };
      }
    ) => {
      const userPrefs = getUserPreferences(args.userId);
      const events = getMockEvents();

      const filters: PriorityFilters | undefined = args.filters
        ? {
            sports: args.filters.sports,
            leagues: args.filters.leagues,
            minTier: args.filters.minTier
              ? mapPriorityTier(args.filters.minTier)
              : undefined,
            tags: args.filters.tags,
            followedOnly: args.filters.followedOnly,
          }
        : undefined;

      const result = priorityCalculator.calculatePriorities(events, userPrefs, filters);

      // Calculate summary
      const tagCounts = new Map<string, number>();
      const sportStats = new Map<string, { count: number; totalPriority: number }>();

      const allPriorities = [
        ...result.tiers.must_watch,
        ...result.tiers.worth_time,
        ...result.tiers.highlights,
        ...result.tiers.skip,
      ];

      for (const priority of allPriorities) {
        // Count tags
        for (const tag of priority.tags) {
          tagCounts.set(tag.tag, (tagCounts.get(tag.tag) || 0) + 1);
        }

        // Get sport from event
        const event = events.find(e => e.eventId === priority.eventId);
        if (event) {
          const stats = sportStats.get(event.sport) || { count: 0, totalPriority: 0 };
          stats.count++;
          stats.totalPriority += priority.priorityScore;
          sportStats.set(event.sport, stats);
        }
      }

      return {
        totalEvents: result.totalEvents,
        mustWatchCount: result.tiers.must_watch.length,
        worthTimeCount: result.tiers.worth_time.length,
        highlightsCount: result.tiers.highlights.length,
        skipCount: result.tiers.skip.length,
        topTags: Array.from(tagCounts.entries())
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        sportBreakdown: Array.from(sportStats.entries())
          .map(([sport, stats]) => ({
            sport,
            count: stats.count,
            avgPriority: stats.totalPriority / stats.count,
          }))
          .sort((a, b) => b.avgPriority - a.avgPriority),
      };
    },

    userPreferences: (_: unknown, args: { userId: string }): UserPreferences => {
      return getUserPreferences(args.userId);
    },

    eventTags: (_: unknown, args: { eventId: string }): EventTag[] => {
      // For now, generate based on a default emotional profile
      // In production, would look up the actual event
      const events = getMockEvents();
      const event = events.find(e => e.eventId === args.eventId);

      if (!event) {
        return [];
      }

      const aggregated = tagService.getEventTags(args.eventId, event.emotionalProfile);
      return aggregated.tags;
    },

    popularTags: (_: unknown, args: { limit?: number }): Array<{ tag: string; count: number }> => {
      return tagService.getPopularTags(args.limit || 20);
    },

    eventsByTag: (_: unknown, args: { tag: string }): string[] => {
      return tagService.findEventsByTag(args.tag);
    },
  },

  Mutation: {
    updateUserPreferences: (
      _: unknown,
      args: {
        userId: string;
        input: {
          follows?: UserFollow[];
          sportFamiliarity?: SportFamiliarity[];
          emotionalPreferences?: Partial<EmotionalPreferences>;
        };
      }
    ): UserPreferences => {
      const prefs = getUserPreferences(args.userId);

      if (args.input.follows) {
        prefs.follows = args.input.follows;
      }
      if (args.input.sportFamiliarity) {
        prefs.sportFamiliarity = args.input.sportFamiliarity;
      }
      if (args.input.emotionalPreferences) {
        prefs.emotionalPreferences = {
          ...prefs.emotionalPreferences,
          ...args.input.emotionalPreferences,
        };
      }

      prefs.lastUpdated = new Date();
      userPreferencesStore.set(args.userId, prefs);

      return prefs;
    },

    addUserFollow: (
      _: unknown,
      args: { userId: string; follow: UserFollow }
    ): UserPreferences => {
      const prefs = getUserPreferences(args.userId);

      // Check if already following
      if (!prefs.follows.some(f => f.id === args.follow.id)) {
        prefs.follows.push(args.follow);
        prefs.lastUpdated = new Date();
        userPreferencesStore.set(args.userId, prefs);
      }

      return prefs;
    },

    removeUserFollow: (
      _: unknown,
      args: { userId: string; followId: string }
    ): UserPreferences => {
      const prefs = getUserPreferences(args.userId);
      prefs.follows = prefs.follows.filter(f => f.id !== args.followId);
      prefs.lastUpdated = new Date();
      userPreferencesStore.set(args.userId, prefs);

      return prefs;
    },

    addEventTag: (
      _: unknown,
      args: {
        userId: string;
        input: { eventId: string; tag: string; category?: string };
      }
    ): EventTag => {
      return tagService.addUserTag({
        eventId: args.input.eventId,
        userId: args.userId,
        tag: args.input.tag,
        category: args.input.category as 'emotional' | 'context' | 'outcome' | 'quality' | 'moment' | undefined,
      });
    },

    verifyCuratorTag: (
      _: unknown,
      args: {
        curatorId: string;
        eventId: string;
        tag: string;
        verified: boolean;
      }
    ): EventTag | null => {
      // In production, would verify curator permissions here
      return tagService.verifyCuratorTag({
        eventId: args.eventId,
        curatorId: args.curatorId,
        tagToVerify: args.tag,
        verified: args.verified,
      });
    },
  },

  // Field resolvers for complex types
  PrioritizedEventList: {
    generatedAt: (parent: PrioritizedEventList) => parent.generatedAt.toISOString(),
    startDate: (parent: PrioritizedEventList) => parent.timeRange.start.toISOString(),
    endDate: (parent: PrioritizedEventList) => parent.timeRange.end.toISOString(),
  },

  EventPriority: {
    priorityTier: (parent: EventPriority) => mapTierToEnum(parent.priorityTier),
    spoilerLevel: (parent: EventPriority) => parent.spoilerLevel.toUpperCase(),
  },

  EventTag: {
    category: (parent: EventTag) => parent.category.toUpperCase(),
    source: (parent: EventTag) => parent.source.toUpperCase(),
  },

  UserPreferences: {
    lastUpdated: (parent: UserPreferences) => parent.lastUpdated.toISOString(),
  },

  PriorityReason: {
    type: (parent: { type: string }) => parent.type.toUpperCase(),
  },
};
