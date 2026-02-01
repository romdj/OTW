/**
 * Prioritization Store
 *
 * Svelte store for managing prioritization state.
 */

import { writable, derived } from 'svelte/store';
import type {
  PrioritizedEventList,
  UserPreferences,
  PriorityFilters,
  ViewingContext,
  PriorityTier,
  EventPriority,
} from '../domain/prioritization';
import {
  DEFAULT_EMOTIONAL_PREFERENCES,
  DEFAULT_VIEWING_CONTEXT,
} from '../domain/prioritization';

// ============================================
// State Types
// ============================================

export interface PrioritizationState {
  // Data
  prioritizedEvents: PrioritizedEventList | null;
  userPreferences: UserPreferences | null;

  // Loading states
  isLoadingEvents: boolean;
  isLoadingPreferences: boolean;
  isUpdating: boolean;

  // Errors
  eventsError: Error | null;
  preferencesError: Error | null;

  // Filters and context
  activeFilters: PriorityFilters;
  viewingContext: ViewingContext;

  // UI state
  expandedTiers: Set<PriorityTier>;
  selectedEventId: string | null;
  spoilerRevealed: Set<string>;
}

const initialState: PrioritizationState = {
  prioritizedEvents: null,
  userPreferences: null,
  isLoadingEvents: false,
  isLoadingPreferences: false,
  isUpdating: false,
  eventsError: null,
  preferencesError: null,
  activeFilters: {},
  viewingContext: DEFAULT_VIEWING_CONTEXT,
  expandedTiers: new Set(['must_watch', 'worth_time']),
  selectedEventId: null,
  spoilerRevealed: new Set(),
};

// ============================================
// Store Creation
// ============================================

function createPrioritizationStore() {
  const { subscribe, set, update } = writable<PrioritizationState>(initialState);

  return {
    subscribe,

    // Data setters
    setPrioritizedEvents: (events: PrioritizedEventList | null) =>
      update(state => ({ ...state, prioritizedEvents: events, eventsError: null })),

    setUserPreferences: (prefs: UserPreferences | null) =>
      update(state => ({ ...state, userPreferences: prefs, preferencesError: null })),

    // Loading state setters
    setLoadingEvents: (isLoading: boolean) =>
      update(state => ({ ...state, isLoadingEvents: isLoading })),

    setLoadingPreferences: (isLoading: boolean) =>
      update(state => ({ ...state, isLoadingPreferences: isLoading })),

    setUpdating: (isUpdating: boolean) =>
      update(state => ({ ...state, isUpdating })),

    // Error setters
    setEventsError: (error: Error | null) =>
      update(state => ({ ...state, eventsError: error, isLoadingEvents: false })),

    setPreferencesError: (error: Error | null) =>
      update(state => ({ ...state, preferencesError: error, isLoadingPreferences: false })),

    // Filter management
    setFilters: (filters: PriorityFilters) =>
      update(state => ({ ...state, activeFilters: filters })),

    updateFilter: <K extends keyof PriorityFilters>(key: K, value: PriorityFilters[K]) =>
      update(state => ({
        ...state,
        activeFilters: { ...state.activeFilters, [key]: value },
      })),

    clearFilters: () =>
      update(state => ({ ...state, activeFilters: {} })),

    // Viewing context management
    setViewingContext: (context: ViewingContext) =>
      update(state => ({ ...state, viewingContext: context })),

    updateViewingContext: <K extends keyof ViewingContext>(key: K, value: ViewingContext[K]) =>
      update(state => ({
        ...state,
        viewingContext: { ...state.viewingContext, [key]: value },
      })),

    markAsWatched: (eventId: string) =>
      update(state => ({
        ...state,
        viewingContext: {
          ...state.viewingContext,
          alreadyWatched: [...state.viewingContext.alreadyWatched, eventId],
        },
      })),

    // UI state management
    toggleTierExpanded: (tier: PriorityTier) =>
      update(state => {
        const newExpanded = new Set(state.expandedTiers);
        if (newExpanded.has(tier)) {
          newExpanded.delete(tier);
        } else {
          newExpanded.add(tier);
        }
        return { ...state, expandedTiers: newExpanded };
      }),

    setSelectedEvent: (eventId: string | null) =>
      update(state => ({ ...state, selectedEventId: eventId })),

    revealSpoiler: (eventId: string) =>
      update(state => {
        const newRevealed = new Set(state.spoilerRevealed);
        newRevealed.add(eventId);
        return { ...state, spoilerRevealed: newRevealed };
      }),

    hideSpoiler: (eventId: string) =>
      update(state => {
        const newRevealed = new Set(state.spoilerRevealed);
        newRevealed.delete(eventId);
        return { ...state, spoilerRevealed: newRevealed };
      }),

    // Reset
    reset: () => set(initialState),
  };
}

// Export the store
export const prioritizationStore = createPrioritizationStore();

// ============================================
// Derived Stores
// ============================================

/**
 * Get all events flattened and sorted by priority
 */
export const allEventsSorted = derived(prioritizationStore, $state => {
  if (!$state.prioritizedEvents) return [];

  return [
    ...$state.prioritizedEvents.tiers.mustWatch,
    ...$state.prioritizedEvents.tiers.worthTime,
    ...$state.prioritizedEvents.tiers.highlights,
    ...$state.prioritizedEvents.tiers.skip,
  ].sort((a, b) => b.priorityScore - a.priorityScore);
});

/**
 * Get counts by tier
 */
export const tierCounts = derived(prioritizationStore, $state => {
  if (!$state.prioritizedEvents) {
    return { must_watch: 0, worth_time: 0, highlights: 0, skip: 0 };
  }

  return {
    must_watch: $state.prioritizedEvents.tiers.mustWatch.length,
    worth_time: $state.prioritizedEvents.tiers.worthTime.length,
    highlights: $state.prioritizedEvents.tiers.highlights.length,
    skip: $state.prioritizedEvents.tiers.skip.length,
  };
});

/**
 * Get followed teams from preferences
 */
export const followedTeams = derived(prioritizationStore, $state => {
  if (!$state.userPreferences) return [];
  return $state.userPreferences.follows.filter(f => f.type === 'team');
});

/**
 * Get emotional preferences with defaults
 */
export const emotionalPreferences = derived(prioritizationStore, $state => {
  return $state.userPreferences?.emotionalPreferences ?? DEFAULT_EMOTIONAL_PREFERENCES;
});

/**
 * Check if an event's spoiler is revealed
 */
export function isSpoilerRevealed(eventId: string): boolean {
  let revealed = false;
  prioritizationStore.subscribe(state => {
    revealed = state.spoilerRevealed.has(eventId);
  })();
  return revealed;
}

/**
 * Get events for a specific tier
 */
export function getEventsForTier(tier: PriorityTier): EventPriority[] {
  let events: EventPriority[] = [];
  prioritizationStore.subscribe(state => {
    if (!state.prioritizedEvents) {
      events = [];
      return;
    }

    switch (tier) {
      case 'must_watch':
        events = state.prioritizedEvents.tiers.mustWatch;
        break;
      case 'worth_time':
        events = state.prioritizedEvents.tiers.worthTime;
        break;
      case 'highlights':
        events = state.prioritizedEvents.tiers.highlights;
        break;
      case 'skip':
        events = state.prioritizedEvents.tiers.skip;
        break;
    }
  })();
  return events;
}
