<script lang="ts">
  import { X } from 'lucide-svelte';
  import type { FullStoryEvent, PlanEvent } from './planTypes';
  export let event: PlanEvent;
  export let revealedEvent: FullStoryEvent | null = null;
  export let onClose: () => void;
  export let onReveal: (_id: string) => void;
  $: shown = revealedEvent ?? event;
</script>

<div class="backdrop" role="presentation" on:click|self={onClose}>
  <div class="inspector" role="dialog" aria-modal="true" aria-labelledby="inspector-title">
    <button class="close" on:click={onClose} aria-label="Close event details"><X size={20} /></button>
    <p class="kicker">{shown.sport} · {shown.context}</p>
    <h2 id="inspector-title">{shown.title}</h2>
    <p><strong>{shown.format}</strong> · about {shown.estimatedMinutes} minutes</p>
    {#if shown.projection !== 'no-hints'}
      <div class="score"><strong>{shown.scoreBand}</strong><span>OTW {shown.score}</span></div>
      <p>{shown.safeReasons.join(' · ')} · {shown.confidence} confidence</p>
    {:else}<p>{shown.preEventReason}</p>{/if}

    {#if shown.projection === 'full-story'}
      <div class="story"><h3>Full story</h3><p><strong>{shown.result}</strong></p><p>{shown.analysis}</p></div>
      <div class="dimensions">
        {#each shown.dimensions as dimension (dimension.label)}
          <div><span>{dimension.label}</span><strong>{dimension.value} · {dimension.band}</strong><progress max="100" value={dimension.value}></progress></div>
        {/each}
      </div>
    {:else}
      <div class="reveal"><p>Reveal the result and complete OTW Score breakdown for this event only.</p><button on:click={() => onReveal(event.id)}>Reveal this event</button></div>
    {/if}
  </div>
</div>
