<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);
</script>

<svelte:head>
  <title>Unmissable Moments | {sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="flex flex-col items-center space-y-8" in:fade={{ duration: 300 }}>
  <div class="text-center max-w-2xl">
    <div class="text-5xl mb-4">🏛️</div>
    <h1 class="text-3xl font-bold text-base-content mb-2">
      Unmissable Moments
    </h1>
    <p class="text-base-content/70">
      Historic {sportConfig?.name ?? ''} games that defined the sport
    </p>
  </div>

  <!-- Coming Soon State -->
  <div class="bg-base-200 rounded-lg p-8 max-w-lg text-center">
    <div class="text-4xl mb-4">🚧</div>
    <h2 class="text-xl font-semibold mb-2">Coming Soon</h2>
    <p class="text-base-content/60 mb-4">
      Explore the greatest games in {sportConfig?.name ?? 'sport'} history.
      Community-curated lists of legendary matchups, comebacks, and moments
      that defined eras.
    </p>
    <a href="/sports/{sportId}" class="btn btn-primary btn-sm">
      Back to {sportConfig?.name ?? 'Sport'}
    </a>
  </div>

  <!-- Preview of Features -->
  <div class="w-full max-w-4xl">
    <h3 class="text-lg font-semibold text-base-content/60 mb-4 text-center">
      What You'll Find
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🏆</span>
          <span class="font-medium">Greatest Games</span>
        </div>
        <p class="text-sm text-base-content/50">
          Championship deciders, Game 7s, and title-clinching moments
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🔥</span>
          <span class="font-medium">Epic Rivalries</span>
        </div>
        <p class="text-sm text-base-content/50">
          The fiercest matchups and their most memorable clashes
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">⚡</span>
          <span class="font-medium">Comeback Kings</span>
        </div>
        <p class="text-sm text-base-content/50">
          Games where the impossible became reality
        </p>
      </div>
    </div>
  </div>
</div>
