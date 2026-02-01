<script lang="ts">
  import { fade } from 'svelte/transition';
  import { SportCard, SPORTS } from '../../components/Sports';

  const availableSports = SPORTS.filter((s) => s.available);
  const comingSoonSports = SPORTS.filter((s) => !s.available);
</script>

<svelte:head>
  <title>Discover Unmissable Moments | OTW.sport</title>
  <meta
    name="description"
    content="The IMDb of sporting events. Find drama, tension, and passion - not just statistics."
  />
</svelte:head>

<div class="flex flex-col items-center space-y-8" in:fade={{ duration: 300 }}>
  <!-- Hero Section -->
  <div class="text-center max-w-2xl">
    <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-4">
      Find Your Next <span class="text-primary">Unmissable</span> Moment
    </h1>
    <p class="text-base-content/70 text-lg mb-2">
      The IMDb of sporting events. We capture the intangibles: drama, tension, passion, and skill.
    </p>
    <p class="text-base-content/50 text-sm">
      Choose a sport to discover what's worth watching right now.
    </p>
  </div>

  <!-- Available Sports -->
  {#if availableSports.length > 0}
    <div class="w-full max-w-4xl">
      <h2 class="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-success rounded-full"></span>
        Live Now
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {#each availableSports as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Coming Soon Sports -->
  {#if comingSoonSports.length > 0}
    <div class="w-full max-w-4xl">
      <h2 class="text-lg font-semibold text-base-content/60 mb-4">Coming Soon</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {#each comingSoonSports as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    </div>
  {/if}

  <!-- What We Do Section -->
  <div class="w-full max-w-4xl bg-base-200 rounded-lg p-6 mt-4">
    <h3 class="text-lg font-semibold text-base-content mb-4 text-center">
      How OTW.sport Works
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">🎯</span>
        <span class="font-medium">Watchability Scores</span>
        <span class="text-sm text-base-content/60">
          We analyze matchups for drama potential, not just stats
        </span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">🔥</span>
        <span class="font-medium">Emotional Tags</span>
        <span class="text-sm text-base-content/60">
          "Nail-biters", "historic moments", "explosive finishes"
        </span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">📋</span>
        <span class="font-medium">Curated Lists</span>
        <span class="text-sm text-base-content/60">
          Community-driven recommendations for what to watch
        </span>
      </div>
    </div>
  </div>
</div>
