<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);
</script>

<svelte:head>
  <title>Events | {sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="flex flex-col items-center space-y-8" in:fade={{ duration: 300 }}>
  <div class="text-center max-w-2xl">
    <div class="text-5xl mb-4">📅</div>
    <h1 class="text-3xl font-bold text-base-content mb-2">
      Upcoming Events
    </h1>
    <p class="text-base-content/70">
      {sportConfig?.name ?? 'Sport'} games worth watching
    </p>
  </div>

  <!-- Coming Soon State -->
  <div class="bg-base-200 rounded-lg p-8 max-w-lg text-center">
    <div class="text-4xl mb-4">🚧</div>
    <h2 class="text-xl font-semibold mb-2">Coming Soon</h2>
    <p class="text-base-content/60 mb-4">
      We're building the event prioritization engine to help you find the most
      watchable games. Check back soon for watchability scores and recommendations.
    </p>
    <div class="flex flex-wrap gap-2 justify-center mb-4">
      {#each sportConfig?.watchabilityHints ?? [] as hint}
        <span class="badge badge-outline">{hint}</span>
      {/each}
    </div>
    <a href="/sports/{sportId}" class="btn btn-primary btn-sm">
      Back to {sportConfig?.name ?? 'Sport'}
    </a>
  </div>

  <!-- Preview of Features -->
  <div class="w-full max-w-4xl">
    <h3 class="text-lg font-semibold text-base-content/60 mb-4 text-center">
      What You'll See Here
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🎯</span>
          <span class="font-medium">Watchability Scores</span>
        </div>
        <p class="text-sm text-base-content/50">
          Each game rated on drama potential, rivalry intensity, and stakes
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🏷️</span>
          <span class="font-medium">Emotional Tags</span>
        </div>
        <p class="text-sm text-base-content/50">
          Quick labels like "Playoff Implications", "Revenge Game", "Must-Win"
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">📊</span>
          <span class="font-medium">Smart Sorting</span>
        </div>
        <p class="text-sm text-base-content/50">
          Filter by time, watchability, or your favorite teams
        </p>
      </div>
    </div>
  </div>
</div>
