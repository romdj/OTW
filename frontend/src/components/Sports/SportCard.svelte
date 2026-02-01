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
  class="group relative bg-base-100 rounded-lg p-6 text-left transition-all duration-200 w-full
         {sport.available
           ? 'hover:shadow-elevation-3 cursor-pointer'
           : 'opacity-60 cursor-not-allowed'}"
  class:shadow-elevation-2={sport.available}
  class:shadow-elevation-1={!sport.available}
  on:click={handleClick}
  on:keydown={handleKeydown}
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  disabled={!sport.available}
  aria-label="Select {sport.name}"
>
  <!-- Icon -->
  <div
    class="text-5xl mb-4 transition-transform duration-200
           {sport.available && isHovered ? 'scale-110' : ''}"
    style="filter: {sport.available ? 'none' : 'grayscale(80%)'}"
  >
    {sport.icon}
  </div>

  <!-- Name -->
  <h3 class="text-lg font-medium text-base-content mb-1">
    {sport.name}
  </h3>

  <!-- Tagline or Coming Soon -->
  {#if sport.available}
    <p
      class="text-sm text-base-content/60 transition-opacity duration-200
             {isHovered ? 'opacity-100' : 'opacity-70'}"
    >
      {sport.tagline}
    </p>

    <!-- Watchability hints on hover -->
    {#if isHovered}
      <div class="flex flex-wrap gap-1 mt-3">
        {#each sport.watchabilityHints.slice(0, 2) as hint}
          <span class="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            {hint}
          </span>
        {/each}
      </div>
    {/if}
  {:else}
    <p class="text-sm text-base-content/40">Coming soon</p>
  {/if}

  <!-- Hover indicator for available sports -->
  {#if sport.available}
    <div
      class="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-lg
             transition-transform duration-200 origin-left
             {isHovered ? 'scale-x-100' : 'scale-x-0'}"
    />
  {/if}
</button>
