/**
 * Prioritization API
 *
 * GraphQL queries and mutations for the Event Prioritization Engine.
 */

import { client } from './graphqlClient';
import { gql } from '@urql/svelte';
import { AppErrorHandler } from '../utils/errorHandler';
import { logger, PerformanceLogger } from '../utils/logger';
import type {
  PrioritizedEventList,
  EventPriority,
  PriorityListSummary,
  UserPreferences,
  EventTag,
  PriorityFilters,
  ViewingContext,
  UserFollow,
  EmotionalPreferences,
  SportFamiliarity,
  TagCount,
} from '../domain/prioritization';

// ============================================
// Queries
// ============================================

const PRIORITIZED_EVENTS_QUERY = gql`
  query GetPrioritizedEvents(
    $userId: String!
    $filters: PriorityFiltersInput
    $viewingContext: ViewingContextInput
  ) {
    prioritizedEvents(userId: $userId, filters: $filters, viewingContext: $viewingContext) {
      userId
      tiers {
        mustWatch {
          eventId
          priorityScore
          priorityTier
          priorityReasons {
            reason
            type
            contribution
          }
          emotionalProfile {
            suspense
            stakes
            volatility
            underdog
            transcendence
          }
          tags {
            tag
            category
            source
            confidence
            userCount
            curatorVerified
          }
          spoilerLevel
          spoilerFreeSummary
        }
        worthTime {
          eventId
          priorityScore
          priorityTier
          priorityReasons {
            reason
            type
            contribution
          }
          emotionalProfile {
            suspense
            stakes
            volatility
            underdog
            transcendence
          }
          tags {
            tag
            category
            source
            confidence
            userCount
            curatorVerified
          }
          spoilerLevel
          spoilerFreeSummary
        }
        highlights {
          eventId
          priorityScore
          priorityTier
          priorityReasons {
            reason
            type
            contribution
          }
          emotionalProfile {
            suspense
            stakes
            volatility
            underdog
            transcendence
          }
          tags {
            tag
            category
            source
            confidence
            userCount
            curatorVerified
          }
          spoilerLevel
          spoilerFreeSummary
        }
        skip {
          eventId
          priorityScore
          priorityTier
          spoilerFreeSummary
        }
      }
      totalEvents
      generatedAt
      startDate
      endDate
    }
  }
`;

const EVENT_PRIORITY_QUERY = gql`
  query GetEventPriority($eventId: String!, $userId: String!) {
    eventPriority(eventId: $eventId, userId: $userId) {
      eventId
      priorityScore
      priorityTier
      priorityReasons {
        reason
        type
        contribution
      }
      emotionalProfile {
        suspense
        stakes
        volatility
        underdog
        transcendence
      }
      tags {
        tag
        category
        source
        confidence
        userCount
        curatorVerified
      }
      spoilerLevel
      spoilerFreeSummary
      fullSummary
    }
  }
`;

const PRIORITY_SUMMARY_QUERY = gql`
  query GetPrioritySummary($userId: String!, $filters: PriorityFiltersInput) {
    prioritySummary(userId: $userId, filters: $filters) {
      totalEvents
      mustWatchCount
      worthTimeCount
      highlightsCount
      skipCount
      topTags {
        tag
        count
      }
      sportBreakdown {
        sport
        count
        avgPriority
      }
    }
  }
`;

const USER_PREFERENCES_QUERY = gql`
  query GetUserPreferences($userId: String!) {
    userPreferences(userId: $userId) {
      userId
      follows {
        id
        type
        name
        sport
        league
        followStrength
      }
      sportFamiliarity {
        sport
        comprehensionLevel
        watchFrequency
        preferredLeagues
      }
      emotionalPreferences {
        nailBiters
        dominance
        upsets
        historicMoments
        skillDisplay
        intensity
        drama
      }
      lastUpdated
    }
  }
`;

const EVENT_TAGS_QUERY = gql`
  query GetEventTags($eventId: String!) {
    eventTags(eventId: $eventId) {
      tag
      category
      source
      confidence
      userCount
      curatorVerified
    }
  }
`;

const POPULAR_TAGS_QUERY = gql`
  query GetPopularTags($limit: Int) {
    popularTags(limit: $limit) {
      tag
      count
    }
  }
`;

// ============================================
// Mutations
// ============================================

const UPDATE_USER_PREFERENCES_MUTATION = gql`
  mutation UpdateUserPreferences($userId: String!, $input: UserPreferencesInput!) {
    updateUserPreferences(userId: $userId, input: $input) {
      userId
      follows {
        id
        type
        name
        sport
        league
        followStrength
      }
      sportFamiliarity {
        sport
        comprehensionLevel
        watchFrequency
        preferredLeagues
      }
      emotionalPreferences {
        nailBiters
        dominance
        upsets
        historicMoments
        skillDisplay
        intensity
        drama
      }
      lastUpdated
    }
  }
`;

const ADD_USER_FOLLOW_MUTATION = gql`
  mutation AddUserFollow($userId: String!, $follow: UserFollowInput!) {
    addUserFollow(userId: $userId, follow: $follow) {
      userId
      follows {
        id
        type
        name
        sport
        league
        followStrength
      }
      lastUpdated
    }
  }
`;

const REMOVE_USER_FOLLOW_MUTATION = gql`
  mutation RemoveUserFollow($userId: String!, $followId: String!) {
    removeUserFollow(userId: $userId, followId: $followId) {
      userId
      follows {
        id
        type
        name
        sport
        league
        followStrength
      }
      lastUpdated
    }
  }
`;

const ADD_EVENT_TAG_MUTATION = gql`
  mutation AddEventTag($userId: String!, $input: UserTagInput!) {
    addEventTag(userId: $userId, input: $input) {
      tag
      category
      source
      userCount
      curatorVerified
    }
  }
`;

// ============================================
// API Functions
// ============================================

/**
 * Fetch prioritized events for a user
 */
export async function fetchPrioritizedEvents(
  userId: string,
  filters?: PriorityFilters,
  viewingContext?: ViewingContext
): Promise<PrioritizedEventList | null> {
  logger.info('Fetching prioritized events', { userId, filters }, 'PrioritizationAPI', 'fetchPrioritizedEvents');

  const result = await PerformanceLogger.measureAsync('fetchPrioritizedEvents', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        const queryResult = await client.query(PRIORITIZED_EVENTS_QUERY, {
          userId,
          filters: filters ? mapFiltersToInput(filters) : null,
          viewingContext: viewingContext ? mapViewingContextToInput(viewingContext) : null,
        });

        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }

        if (!queryResult.data?.prioritizedEvents) {
          logger.warn('No prioritized events data', { userId }, 'PrioritizationAPI', 'fetchPrioritizedEvents');
          return null;
        }

        logger.info(
          `Successfully fetched prioritized events`,
          { userId, totalEvents: queryResult.data.prioritizedEvents.totalEvents },
          'PrioritizationAPI',
          'fetchPrioritizedEvents'
        );

        return transformPrioritizedEventList(queryResult.data.prioritizedEvents);
      },
      'api',
      { operation: 'fetchPrioritizedEvents', userId }
    );
  }, 'PrioritizationAPI');

  return result || null;
}

/**
 * Fetch priority for a single event
 */
export async function fetchEventPriority(
  eventId: string,
  userId: string
): Promise<EventPriority | null> {
  logger.info('Fetching event priority', { eventId, userId }, 'PrioritizationAPI', 'fetchEventPriority');

  const result = await PerformanceLogger.measureAsync('fetchEventPriority', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        const queryResult = await client.query(EVENT_PRIORITY_QUERY, { eventId, userId });

        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }

        return queryResult.data?.eventPriority
          ? transformEventPriority(queryResult.data.eventPriority)
          : null;
      },
      'api',
      { operation: 'fetchEventPriority', eventId, userId }
    );
  }, 'PrioritizationAPI');

  return result || null;
}

/**
 * Fetch priority summary statistics
 */
export async function fetchPrioritySummary(
  userId: string,
  filters?: PriorityFilters
): Promise<PriorityListSummary | null> {
  logger.info('Fetching priority summary', { userId }, 'PrioritizationAPI', 'fetchPrioritySummary');

  const result = await PerformanceLogger.measureAsync('fetchPrioritySummary', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        const queryResult = await client.query(PRIORITY_SUMMARY_QUERY, {
          userId,
          filters: filters ? mapFiltersToInput(filters) : null,
        });

        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }

        return queryResult.data?.prioritySummary || null;
      },
      'api',
      { operation: 'fetchPrioritySummary', userId }
    );
  }, 'PrioritizationAPI');

  return result || null;
}

/**
 * Fetch user preferences
 */
export async function fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
  logger.info('Fetching user preferences', { userId }, 'PrioritizationAPI', 'fetchUserPreferences');

  const result = await PerformanceLogger.measureAsync('fetchUserPreferences', async () => {
    return await AppErrorHandler.withErrorHandling(
      async () => {
        const queryResult = await client.query(USER_PREFERENCES_QUERY, { userId });

        if (queryResult.error) {
          throw new Error(`GraphQL Error: ${queryResult.error.message}`);
        }

        return queryResult.data?.userPreferences
          ? transformUserPreferences(queryResult.data.userPreferences)
          : null;
      },
      'api',
      { operation: 'fetchUserPreferences', userId }
    );
  }, 'PrioritizationAPI');

  return result || null;
}

/**
 * Fetch tags for an event
 */
export async function fetchEventTags(eventId: string): Promise<EventTag[]> {
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const queryResult = await client.query(EVENT_TAGS_QUERY, { eventId });

      if (queryResult.error) {
        throw new Error(`GraphQL Error: ${queryResult.error.message}`);
      }

      return (queryResult.data?.eventTags || []).map(transformEventTag);
    },
    'api',
    { operation: 'fetchEventTags', eventId }
  );

  return result || [];
}

/**
 * Fetch popular tags
 */
export async function fetchPopularTags(limit?: number): Promise<TagCount[]> {
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const queryResult = await client.query(POPULAR_TAGS_QUERY, { limit });

      if (queryResult.error) {
        throw new Error(`GraphQL Error: ${queryResult.error.message}`);
      }

      return queryResult.data?.popularTags || [];
    },
    'api',
    { operation: 'fetchPopularTags', limit }
  );

  return result || [];
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  input: {
    follows?: UserFollow[];
    sportFamiliarity?: SportFamiliarity[];
    emotionalPreferences?: Partial<EmotionalPreferences>;
  }
): Promise<UserPreferences | null> {
  logger.info('Updating user preferences', { userId }, 'PrioritizationAPI', 'updateUserPreferences');

  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const mutationResult = await client.mutation(UPDATE_USER_PREFERENCES_MUTATION, {
        userId,
        input: mapUserPreferencesInput(input),
      });

      if (mutationResult.error) {
        throw new Error(`GraphQL Error: ${mutationResult.error.message}`);
      }

      return mutationResult.data?.updateUserPreferences
        ? transformUserPreferences(mutationResult.data.updateUserPreferences)
        : null;
    },
    'api',
    { operation: 'updateUserPreferences', userId }
  );

  return result || null;
}

/**
 * Add a follow
 */
export async function addUserFollow(userId: string, follow: UserFollow): Promise<UserPreferences | null> {
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const mutationResult = await client.mutation(ADD_USER_FOLLOW_MUTATION, {
        userId,
        follow: mapFollowToInput(follow),
      });

      if (mutationResult.error) {
        throw new Error(`GraphQL Error: ${mutationResult.error.message}`);
      }

      return mutationResult.data?.addUserFollow
        ? transformUserPreferences(mutationResult.data.addUserFollow)
        : null;
    },
    'api',
    { operation: 'addUserFollow', userId, followId: follow.id }
  );

  return result || null;
}

/**
 * Remove a follow
 */
export async function removeUserFollow(userId: string, followId: string): Promise<UserPreferences | null> {
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const mutationResult = await client.mutation(REMOVE_USER_FOLLOW_MUTATION, {
        userId,
        followId,
      });

      if (mutationResult.error) {
        throw new Error(`GraphQL Error: ${mutationResult.error.message}`);
      }

      return mutationResult.data?.removeUserFollow
        ? transformUserPreferences(mutationResult.data.removeUserFollow)
        : null;
    },
    'api',
    { operation: 'removeUserFollow', userId, followId }
  );

  return result || null;
}

/**
 * Add a tag to an event
 */
export async function addEventTag(
  userId: string,
  eventId: string,
  tag: string,
  category?: string
): Promise<EventTag | null> {
  const result = await AppErrorHandler.withErrorHandling(
    async () => {
      const mutationResult = await client.mutation(ADD_EVENT_TAG_MUTATION, {
        userId,
        input: { eventId, tag, category },
      });

      if (mutationResult.error) {
        throw new Error(`GraphQL Error: ${mutationResult.error.message}`);
      }

      return mutationResult.data?.addEventTag
        ? transformEventTag(mutationResult.data.addEventTag)
        : null;
    },
    'api',
    { operation: 'addEventTag', userId, eventId, tag }
  );

  return result || null;
}

// ============================================
// Transformers
// ============================================

function transformPrioritizedEventList(data: any): PrioritizedEventList {
  return {
    userId: data.userId,
    tiers: {
      mustWatch: (data.tiers.mustWatch || []).map(transformEventPriority),
      worthTime: (data.tiers.worthTime || []).map(transformEventPriority),
      highlights: (data.tiers.highlights || []).map(transformEventPriority),
      skip: (data.tiers.skip || []).map(transformEventPriority),
    },
    totalEvents: data.totalEvents,
    generatedAt: data.generatedAt,
    startDate: data.startDate,
    endDate: data.endDate,
  };
}

function transformEventPriority(data: any): EventPriority {
  return {
    eventId: data.eventId,
    priorityScore: data.priorityScore,
    priorityTier: data.priorityTier?.toLowerCase().replace('_', '_') as any,
    priorityReasons: (data.priorityReasons || []).map((r: any) => ({
      reason: r.reason,
      type: r.type?.toLowerCase() as any,
      contribution: r.contribution,
    })),
    emotionalProfile: data.emotionalProfile,
    tags: (data.tags || []).map(transformEventTag),
    spoilerLevel: data.spoilerLevel?.toLowerCase() as any,
    spoilerFreeSummary: data.spoilerFreeSummary,
    fullSummary: data.fullSummary,
  };
}

function transformEventTag(data: any): EventTag {
  return {
    tag: data.tag,
    category: data.category?.toLowerCase() as any,
    source: data.source?.toLowerCase() as any,
    confidence: data.confidence,
    userCount: data.userCount,
    curatorVerified: data.curatorVerified,
  };
}

function transformUserPreferences(data: any): UserPreferences {
  return {
    userId: data.userId,
    follows: (data.follows || []).map((f: any) => ({
      id: f.id,
      type: f.type,
      name: f.name,
      sport: f.sport,
      league: f.league,
      followStrength: mapFollowStrengthFromEnum(f.followStrength),
    })),
    sportFamiliarity: (data.sportFamiliarity || []).map((s: any) => ({
      sport: s.sport,
      comprehensionLevel: s.comprehensionLevel?.toLowerCase() as any,
      watchFrequency: s.watchFrequency?.toLowerCase() as any,
      preferredLeagues: s.preferredLeagues || [],
    })),
    emotionalPreferences: data.emotionalPreferences,
    lastUpdated: data.lastUpdated,
  };
}

// ============================================
// Input Mappers
// ============================================

function mapFiltersToInput(filters: PriorityFilters): any {
  return {
    sports: filters.sports,
    leagues: filters.leagues,
    minTier: filters.minTier?.toUpperCase().replace('_', '_'),
    tags: filters.tags,
    followedOnly: filters.followedOnly,
    startDate: filters.startDate,
    endDate: filters.endDate,
    maxDuration: filters.maxDuration,
  };
}

function mapViewingContextToInput(context: ViewingContext): any {
  return {
    availableTime: context.availableTime,
    currentMood: context.currentMood?.toUpperCase(),
    spoilerTolerance: context.spoilerTolerance?.toUpperCase(),
    alreadyWatched: context.alreadyWatched,
  };
}

function mapUserPreferencesInput(input: any): any {
  return {
    follows: input.follows?.map(mapFollowToInput),
    sportFamiliarity: input.sportFamiliarity?.map((s: any) => ({
      sport: s.sport,
      comprehensionLevel: s.comprehensionLevel?.toUpperCase(),
      watchFrequency: s.watchFrequency?.toUpperCase(),
      preferredLeagues: s.preferredLeagues,
    })),
    emotionalPreferences: input.emotionalPreferences,
  };
}

function mapFollowToInput(follow: UserFollow): any {
  return {
    id: follow.id,
    type: follow.type,
    name: follow.name,
    sport: follow.sport,
    league: follow.league,
    followStrength: mapFollowStrengthToEnum(follow.followStrength),
  };
}

function mapFollowStrengthToEnum(strength: number): string {
  switch (strength) {
    case 1: return 'CASUAL';
    case 2: return 'REGULAR';
    case 3: return 'DEDICATED';
    case 4: return 'DIEHARD';
    case 5: return 'OBSESSED';
    default: return 'REGULAR';
  }
}

function mapFollowStrengthFromEnum(strength: string): number {
  switch (strength) {
    case 'CASUAL': return 1;
    case 'REGULAR': return 2;
    case 'DEDICATED': return 3;
    case 'DIEHARD': return 4;
    case 'OBSESSED': return 5;
    default: return 2;
  }
}
