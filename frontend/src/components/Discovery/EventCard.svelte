<script lang="ts">
  import type { EventPriority } from '../../domain/prioritization';
  import { PRIORITY_TIER_CONFIG } from '../../domain/prioritization';
  import EmotionalProfileBar from './EmotionalProfileBar.svelte';
  import { prioritizationStore } from '../../stores/prioritizationStore';
  import { createEventDispatcher } from 'svelte';

  export let event: EventPriority;
  export let showEmotionalProfile = false;
  export let compact = false;

  const dispatch = createEventDispatcher<{
    select: { eventId: string };
    watch: { eventId: string };
    revealSpoiler: { eventId: string };
  }>();

  let spoilerRevealed = false;

  // Subscribe to spoiler state
  prioritizationStore.subscribe(state => {
    spoilerRevealed = state.spoilerRevealed.has(event.eventId);
  });

  function handleSelect() {
    dispatch('select', { eventId: event.eventId });
  }

  function handleWatch() {
    dispatch('watch', { eventId: event.eventId });
  }

  function handleRevealSpoiler() {
    prioritizationStore.revealSpoiler(event.eventId);
    dispatch('revealSpoiler', { eventId: event.eventId });
  }

  function getTierConfig(tier: string) {
    return PRIORITY_TIER_CONFIG[tier as keyof typeof PRIORITY_TIER_CONFIG] || PRIORITY_TIER_CONFIG.skip;
  }

  function formatEventId(eventId: string): { teams: string; context: string } {
    // Parse event ID format: "sport-date-team1-team2"
    const parts = eventId.split('-');
    if (parts.length >= 4) {
      const team1 = parts[parts.length - 2].toUpperCase();
      const team2 = parts[parts.length - 1].toUpperCase();
      const sport = parts[0];
      return {
        teams: `${team1} vs ${team2}`,
        context: sport.charAt(0).toUpperCase() + sport.slice(1).replace(/-/g, ' '),
      };
    }
    return { teams: eventId, context: '' };
  }

  $: tierConfig = getTierConfig(event.priorityTier);
  $: eventInfo = formatEventId(event.eventId);
  $: topTags = event.tags.slice(0, 3);
</script>

<div
  class="event-card"
  class:compact
  class:must-watch={event.priorityTier === 'must_watch'}
  class:worth-time={event.priorityTier === 'worth_time'}
  on:click={handleSelect}
  on:keypress={(e) => e.key === 'Enter' && handleSelect()}
  role="button"
  tabindex="0"
>
  <div class="card-header">
    <div class="event-info">
      <h3 class="teams">{eventInfo.teams}</h3>
      <span class="context">{eventInfo.context}</span>
    </div>

    <div class="score-badge">
      <span class="score">{event.priorityScore}</span>
    </div>
  </div>

  {#if event.spoilerFreeSummary && !compact}
    <p class="summary">{event.spoilerFreeSummary}</p>
  {/if}

  {#if topTags.length > 0}
    <div class="tags">
      {#each topTags as tag}
        <span
          class="tag"
          class:verified={tag.curatorVerified}
        >
          #{tag.tag}
        </span>
      {/each}
    </div>
  {/if}

  {#if showEmotionalProfile && !compact}
    <div class="emotional-section">
      <EmotionalProfileBar profile={event.emotionalProfile} showLabels={false} compact />
    </div>
  {/if}

  {#if event.priorityReasons.length > 0 && !compact}
    <div class="reasons">
      {#each event.priorityReasons.slice(0, 2) as reason}
        <span class="reason">
          {reason.reason}
        </span>
      {/each}
    </div>
  {/if}

  <div class="card-actions">
    {#if event.spoilerLevel !== 'safe' && !spoilerRevealed}
      <button class="btn btn-ghost btn-xs" on:click|stopPropagation={handleRevealSpoiler}>
        Reveal Result
      </button>
    {/if}

    <button class="btn btn-primary btn-sm" on:click|stopPropagation={handleWatch}>
      Watch Now
    </button>
  </div>
</div>

<style>
  .event-card {
    background-color: var(--fallback-b1, oklch(var(--b1)));
    border: 1px solid var(--fallback-b3, oklch(var(--b3)));
    border-radius: 0.75rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .event-card:hover {
    border-color: var(--fallback-bc, oklch(var(--bc) / 0.3));
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .event-card.must-watch {
    border-left: 4px solid var(--fallback-warning, oklch(var(--wa)));
  }

  .event-card.worth-time {
    border-left: 4px solid var(--fallback-info, oklch(var(--in)));
  }

  .event-card.compact {
    padding: 0.75rem;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .event-info {
    flex: 1;
  }

  .teams {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--fallback-bc, oklch(var(--bc)));
  }

  .context {
    font-size: 0.75rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  }

  .score-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--fallback-p, oklch(var(--p))), var(--fallback-s, oklch(var(--s))));
  }

  .score {
    font-size: 0.875rem;
    font-weight: 700;
    color: white;
  }

  .summary {
    font-size: 0.875rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.8));
    margin: 0.5rem 0;
    line-height: 1.4;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin: 0.5rem 0;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--fallback-b2, oklch(var(--b2)));
    border-radius: 9999px;
    color: var(--fallback-bc, oklch(var(--bc) / 0.7));
  }

  .tag.verified {
    background-color: var(--fallback-su, oklch(var(--su) / 0.2));
    color: var(--fallback-su, oklch(var(--suc)));
  }

  .emotional-section {
    margin: 0.75rem 0;
    padding: 0.5rem;
    background-color: var(--fallback-b2, oklch(var(--b2)));
    border-radius: 0.5rem;
  }

  .reasons {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0.5rem 0;
  }

  .reason {
    font-size: 0.75rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  }

  .reason::before {
    content: '• ';
    color: var(--fallback-p, oklch(var(--p)));
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
</style>
