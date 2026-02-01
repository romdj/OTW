<script lang="ts">
  import { onMount } from 'svelte';
  import type { PriorityTier, PriorityFilters } from '../../domain/prioritization';
  import { prioritizationStore, tierCounts } from '../../stores/prioritizationStore';
  import { prioritizationService } from '../../business/services/prioritization';
  import PriorityTierSection from './PriorityTierSection.svelte';
  import FilterBar from './FilterBar.svelte';
  import LoadingSpinner from '../UI/LoadingSpinner.svelte';

  export let userId: string = 'demo-user';

  let isLoading = false;
  let error: Error | null = null;

  const tiers: PriorityTier[] = ['must_watch', 'worth_time', 'highlights', 'skip'];

  // Subscribe to store
  let prioritizedEvents: typeof $prioritizationStore.prioritizedEvents;
  let expandedTiers: Set<PriorityTier>;
  let activeFilters: PriorityFilters;

  prioritizationStore.subscribe(state => {
    prioritizedEvents = state.prioritizedEvents;
    expandedTiers = state.expandedTiers;
    activeFilters = state.activeFilters;
    isLoading = state.isLoadingEvents;
    error = state.eventsError;
  });

  onMount(async () => {
    await loadEvents();
  });

  async function loadEvents(forceRefresh = false) {
    prioritizationStore.setLoadingEvents(true);
    try {
      const events = await prioritizationService.getPrioritizedEvents(
        {
          userId,
          filters: activeFilters,
        },
        forceRefresh
      );
      prioritizationStore.setPrioritizedEvents(events);
    } catch (e) {
      prioritizationStore.setEventsError(e as Error);
    } finally {
      prioritizationStore.setLoadingEvents(false);
    }
  }

  function handleToggleTier(e: CustomEvent<{ tier: PriorityTier }>) {
    prioritizationStore.toggleTierExpanded(e.detail.tier);
  }

  function handleSelectEvent(e: CustomEvent<{ eventId: string }>) {
    prioritizationStore.setSelectedEvent(e.detail.eventId);
  }

  function handleWatchEvent(e: CustomEvent<{ eventId: string }>) {
    prioritizationStore.markAsWatched(e.detail.eventId);
    // In a real app, this would open a streaming link
    console.log('Watch event:', e.detail.eventId);
  }

  function handleFilterChange(e: CustomEvent<{ filters: PriorityFilters }>) {
    prioritizationStore.setFilters(e.detail.filters);
    loadEvents(true);
  }

  function handleRefresh() {
    loadEvents(true);
  }

  function getEventsForTier(tier: PriorityTier) {
    if (!prioritizedEvents) return [];
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

  function formatDateRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }
</script>

<div class="weekend-recap">
  <header class="recap-header">
    <div class="header-content">
      <h1 class="title">Your Weekend Recap</h1>
      {#if prioritizedEvents}
        <span class="date-range">
          {formatDateRange(prioritizedEvents.startDate, prioritizedEvents.endDate)}
        </span>
      {/if}
    </div>

    <div class="header-actions">
      <span class="spoiler-badge badge badge-outline">
        Spoiler-Free
      </span>
      <button class="btn btn-ghost btn-sm" on:click={handleRefresh} disabled={isLoading}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class:spinning={isLoading}
        >
          <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
        Refresh
      </button>
    </div>
  </header>

  <FilterBar filters={activeFilters} on:change={handleFilterChange} />

  {#if isLoading && !prioritizedEvents}
    <div class="loading-container">
      <LoadingSpinner />
      <p>Finding the best events for you...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <p class="error-message">Failed to load events: {error.message}</p>
      <button class="btn btn-primary btn-sm" on:click={() => loadEvents(true)}>
        Try Again
      </button>
    </div>
  {:else if prioritizedEvents}
    <div class="summary-stats">
      <div class="stat">
        <span class="stat-value">{prioritizedEvents.totalEvents}</span>
        <span class="stat-label">Total Events</span>
      </div>
      <div class="stat highlight">
        <span class="stat-value">{$tierCounts.must_watch}</span>
        <span class="stat-label">Must Watch</span>
      </div>
      <div class="stat">
        <span class="stat-value">{$tierCounts.worth_time}</span>
        <span class="stat-label">Worth Time</span>
      </div>
    </div>

    <div class="tiers-container">
      {#each tiers as tier}
        <PriorityTierSection
          {tier}
          events={getEventsForTier(tier)}
          expanded={expandedTiers.has(tier)}
          showEmotionalProfiles={tier === 'must_watch'}
          on:toggle={handleToggleTier}
          on:selectEvent={handleSelectEvent}
          on:watchEvent={handleWatchEvent}
        />
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>No events to show. Try adjusting your filters.</p>
    </div>
  {/if}
</div>

<style>
  .weekend-recap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .recap-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: var(--fallback-bc, oklch(var(--bc)));
  }

  .date-range {
    font-size: 0.875rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .spoiler-badge {
    border-color: var(--fallback-su, oklch(var(--su)));
    color: var(--fallback-su, oklch(var(--suc)));
  }

  .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .summary-stats {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background-color: var(--fallback-b2, oklch(var(--b2)));
    border-radius: 0.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .stat.highlight {
    color: var(--fallback-wa, oklch(var(--wa)));
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  }

  .stat.highlight .stat-label {
    color: inherit;
    opacity: 0.8;
  }

  .tiers-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .loading-container,
  .error-container,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  .loading-container p,
  .empty-state p {
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
    margin-top: 1rem;
  }

  .error-message {
    color: var(--fallback-er, oklch(var(--er)));
    margin-bottom: 1rem;
  }

  @media (max-width: 640px) {
    .weekend-recap {
      padding: 1rem;
    }

    .recap-header {
      flex-direction: column;
    }

    .summary-stats {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
