<script lang="ts">
  import type { EventPriority, PriorityTier } from '../../domain/prioritization';
  import { PRIORITY_TIER_CONFIG } from '../../domain/prioritization';
  import EventCard from './EventCard.svelte';
  import { createEventDispatcher } from 'svelte';

  export let tier: PriorityTier;
  export let events: EventPriority[];
  export let expanded = true;
  export let showEmotionalProfiles = false;

  const dispatch = createEventDispatcher<{
    toggle: { tier: PriorityTier };
    selectEvent: { eventId: string };
    watchEvent: { eventId: string };
  }>();

  $: config = PRIORITY_TIER_CONFIG[tier];
  $: hasEvents = events.length > 0;

  function handleToggle() {
    dispatch('toggle', { tier });
  }

  function handleSelectEvent(e: CustomEvent<{ eventId: string }>) {
    dispatch('selectEvent', e.detail);
  }

  function handleWatchEvent(e: CustomEvent<{ eventId: string }>) {
    dispatch('watchEvent', e.detail);
  }
</script>

<section class="tier-section" class:expanded class:empty={!hasEvents}>
  <button
    class="tier-header"
    on:click={handleToggle}
    disabled={!hasEvents}
    aria-expanded={expanded}
  >
    <div class="tier-info">
      <span class="tier-icon">{config.icon}</span>
      <h2 class="tier-title">{config.label}</h2>
      <span class="event-count badge badge-sm">
        {events.length} {events.length === 1 ? 'event' : 'events'}
      </span>
    </div>

    {#if hasEvents}
      <span class="expand-icon" class:rotated={expanded}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    {/if}
  </button>

  {#if expanded && hasEvents}
    <div class="tier-description">
      {config.description}
    </div>

    <div class="events-grid">
      {#each events as event (event.eventId)}
        <EventCard
          {event}
          showEmotionalProfile={showEmotionalProfiles}
          compact={tier === 'skip'}
          on:select={handleSelectEvent}
          on:watch={handleWatchEvent}
        />
      {/each}
    </div>
  {:else if !hasEvents}
    <p class="no-events">No events in this tier</p>
  {/if}
</section>

<style>
  .tier-section {
    margin-bottom: 1.5rem;
  }

  .tier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem;
    background-color: var(--fallback-b2, oklch(var(--b2)));
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .tier-header:hover:not(:disabled) {
    background-color: var(--fallback-b3, oklch(var(--b3)));
  }

  .tier-header:disabled {
    cursor: default;
    opacity: 0.7;
  }

  .tier-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .tier-icon {
    font-size: 1.5rem;
  }

  .tier-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--fallback-bc, oklch(var(--bc)));
  }

  .event-count {
    background-color: var(--fallback-b1, oklch(var(--b1)));
  }

  .expand-icon {
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
    transition: transform 0.2s ease;
  }

  .expand-icon.rotated {
    transform: rotate(180deg);
  }

  .tier-description {
    font-size: 0.875rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
    padding: 0.5rem 1rem;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    padding: 0.5rem;
  }

  .no-events {
    font-size: 0.875rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.5));
    text-align: center;
    padding: 1rem;
  }

  @media (max-width: 640px) {
    .events-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
