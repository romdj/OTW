/**
 * PrioritizationService
 *
 * Business service for managing event prioritization.
 * Handles fetching, caching, and organizing prioritized events.
 */

import type {
  PrioritizedEventList,
  EventPriority,
  PriorityListSummary,
  UserPreferences,
  PriorityFilters,
  ViewingContext,
  UserFollow,
  EmotionalPreferences,
  SportFamiliarity,
} from '../../../domain/prioritization';

import {
  fetchPrioritizedEvents,
  fetchEventPriority,
  fetchPrioritySummary,
  fetchUserPreferences,
  updateUserPreferences as updatePrefsAPI,
  addUserFollow as addFollowAPI,
  removeUserFollow as removeFollowAPI,
} from '../../../api/prioritizationAPI';

import { logger } from '../../../utils/logger';

export interface PrioritizationQuery {
  userId: string;
  filters?: PriorityFilters;
  viewingContext?: ViewingContext;
}

/**
 * PrioritizationService - Singleton service for event prioritization
 */
export class PrioritizationService {
  private static instance: PrioritizationService;
  private cachedPrioritizedEvents: PrioritizedEventList | null = null;
  private cachedUserPreferences: UserPreferences | null = null;
  private cacheTimestamp: number = 0;
  private userCacheTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): PrioritizationService {
    if (!PrioritizationService.instance) {
      PrioritizationService.instance = new PrioritizationService();
    }
    return PrioritizationService.instance;
  }

  /**
   * Get prioritized events for a user
   */
  public async getPrioritizedEvents(
    query: PrioritizationQuery,
    forceRefresh = false
  ): Promise<PrioritizedEventList | null> {
    const now = Date.now();
    const cacheExpired = now - this.cacheTimestamp > this.CACHE_TTL_MS;

    // Check if we can use cached data (same user, no filters change)
    if (
      !forceRefresh &&
      this.cachedPrioritizedEvents &&
      !cacheExpired &&
      this.cachedPrioritizedEvents.userId === query.userId
    ) {
      logger.debug(
        'Returning cached prioritized events',
        { cacheAge: now - this.cacheTimestamp },
        'PrioritizationService',
        'getPrioritizedEvents'
      );
      return this.cachedPrioritizedEvents;
    }

    logger.info(
      'Fetching fresh prioritized events',
      { forceRefresh, cacheExpired, userId: query.userId },
      'PrioritizationService',
      'getPrioritizedEvents'
    );

    try {
      const result = await fetchPrioritizedEvents(
        query.userId,
        query.filters,
        query.viewingContext
      );

      if (result) {
        this.cachedPrioritizedEvents = result;
        this.cacheTimestamp = now;
      }

      return result;
    } catch (error) {
      logger.error(
        'Failed to fetch prioritized events',
        { error },
        'PrioritizationService',
        'getPrioritizedEvents'
      );

      // Return cached data if available
      if (this.cachedPrioritizedEvents) {
        logger.warn(
          'Returning stale cached data due to fetch error',
          {},
          'PrioritizationService',
          'getPrioritizedEvents'
        );
        return this.cachedPrioritizedEvents;
      }

      throw error;
    }
  }

  /**
   * Get priority for a single event
   */
  public async getEventPriority(
    eventId: string,
    userId: string
  ): Promise<EventPriority | null> {
    // Check if event is in cache first
    if (this.cachedPrioritizedEvents?.userId === userId) {
      const allEvents = [
        ...this.cachedPrioritizedEvents.tiers.mustWatch,
        ...this.cachedPrioritizedEvents.tiers.worthTime,
        ...this.cachedPrioritizedEvents.tiers.highlights,
        ...this.cachedPrioritizedEvents.tiers.skip,
      ];

      const cachedEvent = allEvents.find(e => e.eventId === eventId);
      if (cachedEvent) {
        logger.debug(
          'Returning event priority from cache',
          { eventId },
          'PrioritizationService',
          'getEventPriority'
        );
        return cachedEvent;
      }
    }

    return fetchEventPriority(eventId, userId);
  }

  /**
   * Get priority summary statistics
   */
  public async getPrioritySummary(
    userId: string,
    filters?: PriorityFilters
  ): Promise<PriorityListSummary | null> {
    return fetchPrioritySummary(userId, filters);
  }

  /**
   * Get user preferences
   */
  public async getUserPreferences(
    userId: string,
    forceRefresh = false
  ): Promise<UserPreferences | null> {
    const now = Date.now();
    const cacheExpired = now - this.userCacheTimestamp > this.CACHE_TTL_MS;

    if (
      !forceRefresh &&
      this.cachedUserPreferences &&
      !cacheExpired &&
      this.cachedUserPreferences.userId === userId
    ) {
      return this.cachedUserPreferences;
    }

    try {
      const result = await fetchUserPreferences(userId);

      if (result) {
        this.cachedUserPreferences = result;
        this.userCacheTimestamp = now;
      }

      return result;
    } catch (error) {
      logger.error(
        'Failed to fetch user preferences',
        { error },
        'PrioritizationService',
        'getUserPreferences'
      );

      if (this.cachedUserPreferences?.userId === userId) {
        return this.cachedUserPreferences;
      }

      throw error;
    }
  }

  /**
   * Update user preferences
   */
  public async updateUserPreferences(
    userId: string,
    updates: {
      follows?: UserFollow[];
      sportFamiliarity?: SportFamiliarity[];
      emotionalPreferences?: Partial<EmotionalPreferences>;
    }
  ): Promise<UserPreferences | null> {
    const result = await updatePrefsAPI(userId, updates);

    if (result) {
      this.cachedUserPreferences = result;
      this.userCacheTimestamp = Date.now();
      // Invalidate prioritized events cache since preferences changed
      this.cachedPrioritizedEvents = null;
      this.cacheTimestamp = 0;
    }

    return result;
  }

  /**
   * Add a follow
   */
  public async addFollow(userId: string, follow: UserFollow): Promise<UserPreferences | null> {
    const result = await addFollowAPI(userId, follow);

    if (result) {
      this.cachedUserPreferences = result;
      this.userCacheTimestamp = Date.now();
      // Invalidate prioritized events cache
      this.cachedPrioritizedEvents = null;
      this.cacheTimestamp = 0;
    }

    return result;
  }

  /**
   * Remove a follow
   */
  public async removeFollow(userId: string, followId: string): Promise<UserPreferences | null> {
    const result = await removeFollowAPI(userId, followId);

    if (result) {
      this.cachedUserPreferences = result;
      this.userCacheTimestamp = Date.now();
      // Invalidate prioritized events cache
      this.cachedPrioritizedEvents = null;
      this.cacheTimestamp = 0;
    }

    return result;
  }

  /**
   * Get events by tier
   */
  public getEventsByTier(
    prioritizedEvents: PrioritizedEventList,
    tier: 'must_watch' | 'worth_time' | 'highlights' | 'skip'
  ): EventPriority[] {
    switch (tier) {
      case 'must_watch':
        return prioritizedEvents.tiers.mustWatch;
      case 'worth_time':
        return prioritizedEvents.tiers.worthTime;
      case 'highlights':
        return prioritizedEvents.tiers.highlights;
      case 'skip':
        return prioritizedEvents.tiers.skip;
      default:
        return [];
    }
  }

  /**
   * Get all events sorted by priority score
   */
  public getAllEventsSorted(prioritizedEvents: PrioritizedEventList): EventPriority[] {
    return [
      ...prioritizedEvents.tiers.mustWatch,
      ...prioritizedEvents.tiers.worthTime,
      ...prioritizedEvents.tiers.highlights,
      ...prioritizedEvents.tiers.skip,
    ].sort((a, b) => b.priorityScore - a.priorityScore);
  }

  /**
   * Filter events by tags
   */
  public filterByTags(events: EventPriority[], tags: string[]): EventPriority[] {
    const normalizedTags = tags.map(t => t.toLowerCase());
    return events.filter(event =>
      event.tags.some(tag => normalizedTags.includes(tag.tag.toLowerCase()))
    );
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.cachedPrioritizedEvents = null;
    this.cacheTimestamp = 0;
    this.cachedUserPreferences = null;
    this.userCacheTimestamp = 0;
    logger.info('Prioritization cache cleared', {}, 'PrioritizationService', 'clearCache');
  }

  /**
   * Get cache status
   */
  public getCacheStatus(): {
    eventsCached: boolean;
    eventsAge: number;
    eventsExpired: boolean;
    preferencesCached: boolean;
    preferencesAge: number;
    preferencesExpired: boolean;
  } {
    const now = Date.now();

    return {
      eventsCached: this.cachedPrioritizedEvents !== null,
      eventsAge: this.cacheTimestamp === 0 ? 0 : now - this.cacheTimestamp,
      eventsExpired: this.cacheTimestamp === 0 || now - this.cacheTimestamp > this.CACHE_TTL_MS,
      preferencesCached: this.cachedUserPreferences !== null,
      preferencesAge: this.userCacheTimestamp === 0 ? 0 : now - this.userCacheTimestamp,
      preferencesExpired:
        this.userCacheTimestamp === 0 || now - this.userCacheTimestamp > this.CACHE_TTL_MS,
    };
  }
}

// Export singleton instance
export const prioritizationService = PrioritizationService.getInstance();
