<script lang="ts">
  import type { SportConfig } from './sportsConfig';

  export let sport: SportConfig;

  function handleClick() {
    if (sport.available) {
      window.location.href = `/sports/${sport.id}`;
    }
  }
</script>

<button
  class="group text-left w-full p-5 rounded-xl border transition-all duration-150
         {sport.available
           ? 'border-base-200 hover:border-base-300 hover:bg-base-50 cursor-pointer'
           : 'border-base-200/50 opacity-50 cursor-not-allowed'}"
  on:click={handleClick}
  disabled={!sport.available}
>
  <div class="text-4xl mb-3">{sport.icon}</div>

  <h3 class="text-base font-medium text-base-content mb-1">
    {sport.name}
  </h3>

  {#if sport.available}
    <p class="text-sm text-base-content/50">{sport.tagline}</p>
  {:else}
    <p class="text-sm text-base-content/40">Coming soon</p>
  {/if}
</button>
