<script lang="ts">
  import type { SportConfig } from './sportsConfig';

  export let sport: SportConfig;

  let isHovered = false;

  function handleClick() {
    if (sport.available) {
      window.location.href = `/sports/${sport.id}`;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }
</script>

<button
  class="card bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer group
         {sport.available ? 'hover:scale-105 hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}
         w-full flex items-center justify-center overflow-hidden"
  on:click={handleClick}
  on:keydown={handleKeydown}
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  disabled={!sport.available}
  aria-label="Select {sport.name}"
>
  <div class="card-body items-center text-center p-4">
    <!-- Icon -->
    <div
      class="text-5xl md:text-6xl mb-2 transition-transform duration-200
             {sport.available ? 'group-hover:scale-110' : ''}"
      style="filter: {sport.available ? 'none' : 'grayscale(100%)'}"
    >
      {sport.icon}
    </div>

    <!-- Name -->
    <h3 class="card-title text-base md:text-lg font-semibold text-base-content">
      {sport.name}
    </h3>

    <!-- Tagline (visible on hover for available sports) -->
    {#if sport.available}
      <p
        class="text-xs text-base-content/60 transition-opacity duration-200
               {isHovered ? 'opacity-100' : 'opacity-0'}"
      >
        {sport.tagline}
      </p>
    {:else}
      <span class="badge badge-ghost badge-sm">Coming Soon</span>
    {/if}

    <!-- Watchability hints (visible on hover) -->
    {#if sport.available && isHovered}
      <div class="flex flex-wrap gap-1 mt-2 justify-center">
        {#each sport.watchabilityHints.slice(0, 2) as hint}
          <span class="badge badge-outline badge-xs">{hint}</span>
        {/each}
      </div>
    {/if}
  </div>
</button>

<style>
  .card {
    min-height: 180px;
  }

  @media (min-width: 768px) {
    .card {
      min-height: 200px;
    }
  }
</style>
