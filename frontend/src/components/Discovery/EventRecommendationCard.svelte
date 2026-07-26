<script lang="ts">
  import { Bookmark, Check, ChevronRight, CircleAlert } from 'lucide-svelte';
  import type { PlanEvent } from './planTypes';
  export let event: PlanEvent;
  export let prominent = false;
  export let queued = false;
  export let onQueue: (_event: PlanEvent) => void;
  export let onDetails: (_event: PlanEvent) => void;
</script>

<article class:prominent class="event-card accent-{event.accent}">
  <div class="event-main">
    <p class="context">{event.sport} · {event.context} · {event.dateLabel}</p>
    <h3>{event.title}</h3>
    {#if event.projection !== 'no-hints'}
      <div class="assessment"><strong>{event.scoreBand}</strong><span>OTW {event.score}</span>{#if event.percentile}<small>{event.percentile}</small>{/if}</div>
      <p class="fit"><strong>{event.fit} for you</strong> · {event.format} · ~{event.estimatedMinutes} min</p>
      <p class="reason">{event.safeReasons.join(' · ')}</p>
    {:else}
      <p class="fit"><strong>Relevant to you</strong> · {event.format} · ~{event.estimatedMinutes} min</p>
      <p class="reason">{event.preEventReason}</p>
    {/if}
    <p class:warning={event.availability !== 'available'} class="availability">
      {#if event.availability !== 'available'}<CircleAlert size={14} aria-hidden="true" />{/if}{event.availabilityLabel}
    </p>
    {#if event.projection === 'full-story'}<p class="result"><strong>Result:</strong> {event.result}</p>{/if}
  </div>
  <div class="actions">
    <button class:queued on:click={() => onQueue(event)} aria-label={queued ? `Remove ${event.title} from queue` : `Add ${event.title} to queue`}>
      {#if queued}<Check size={17} aria-hidden="true" /> Queued{:else}<Bookmark size={17} aria-hidden="true" /> Queue{/if}
    </button>
    <button class="details" on:click={() => onDetails(event)}>Details <ChevronRight size={17} aria-hidden="true" /></button>
  </div>
</article>
