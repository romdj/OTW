<script lang="ts">
  import type { SportConfig } from './sportsConfig';
  import { SportIcon } from '../Icons';

  export let sport: SportConfig;
  export let eventCount: number | undefined = undefined;
</script>

{#if sport.available}
  <a
    href="/sports/{sport.id}"
    class="group block w-full p-5 rounded-xl border border-base-200
           hover:border-base-300 hover:bg-base-200/30 border-l-transparent
           hover:border-l-primary/60"
  >
    <div class="mb-3 text-base-content/70 group-hover:text-primary">
      <SportIcon sportId={sport.id} size={28} />
    </div>

    <h3 class="text-base font-medium text-base-content mb-1">
      {sport.name}
    </h3>

    {#if eventCount !== undefined && eventCount > 0}
      <p class="text-sm text-primary font-medium">{eventCount} must-watch this week</p>
    {:else}
      <p class="text-sm text-base-content/50">{sport.tagline}</p>
    {/if}
  </a>
{:else}
  <div
    class="w-full p-5 rounded-xl border border-base-200/50 opacity-50 cursor-not-allowed"
  >
    <div class="mb-3 text-base-content/40">
      <SportIcon sportId={sport.id} size={28} />
    </div>

    <h3 class="text-base font-medium text-base-content mb-1">
      {sport.name}
    </h3>

    <p class="text-sm text-base-content/40">Coming soon</p>
  </div>
{/if}
