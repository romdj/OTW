<script lang="ts">
  import type { FeedbackReason, PlanEvent } from './planTypes';
  export let events: PlanEvent[];
  export let watched: string[];
  export let feedback: Record<string, FeedbackReason>;
  export let onWatched: (_event: PlanEvent) => void;
  export let onFeedback: (_event: PlanEvent, _reason: FeedbackReason) => void;
  const reasons: FeedbackReason[] = ['Great pick', 'Wrong format', 'Not my taste', 'Too long', 'Spoiler issue'];
  $: total = events.reduce((sum, event) => sum + event.estimatedMinutes, 0);
</script>

<aside class="queue" aria-labelledby="queue-title">
  <div><p class="kicker">Saved for later</p><h2 id="queue-title">Your queue</h2></div>
  <strong>{events.length} {events.length === 1 ? 'event' : 'events'} · ~{total} min</strong>
  {#if events.length === 0}<p class="empty">Queue an event to keep your next watch close at hand.</p>{/if}
  {#each events as event (event.id)}
    <div class="queue-item">
      <div><small>{event.sport} · {event.format}</small><h3>{event.title}</h3></div>
      {#if watched.includes(event.id)}
        <div class="feedback"><span>Was it worth your time?</span>{#each reasons as reason (reason)}<button class:chosen={feedback[event.id] === reason} on:click={() => onFeedback(event, reason)}>{reason}</button>{/each}</div>
      {:else}<button on:click={() => onWatched(event)}>Mark watched</button>{/if}
    </div>
  {/each}
</aside>
