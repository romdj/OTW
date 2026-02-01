<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);
</script>

<svelte:head>
  <title>Watchlist | {sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="flex flex-col items-center space-y-8" in:fade={{ duration: 300 }}>
  <div class="text-center max-w-2xl">
    <div class="text-5xl mb-4">⭐</div>
    <h1 class="text-3xl font-bold text-base-content mb-2">
      My Watchlist
    </h1>
    <p class="text-base-content/70">
      Your personal list of {sportConfig?.name ?? ''} games to watch
    </p>
  </div>

  <!-- Coming Soon State -->
  <div class="bg-base-200 rounded-lg p-8 max-w-lg text-center">
    <div class="text-4xl mb-4">🚧</div>
    <h2 class="text-xl font-semibold mb-2">Coming Soon</h2>
    <p class="text-base-content/60 mb-4">
      Build your personal watchlist to never miss a game. We'll remind you
      when your saved events are about to start.
    </p>
    <a href="/sports/{sportId}" class="btn btn-primary btn-sm">
      Back to {sportConfig?.name ?? 'Sport'}
    </a>
  </div>

  <!-- Preview of Features -->
  <div class="w-full max-w-4xl">
    <h3 class="text-lg font-semibold text-base-content/60 mb-4 text-center">
      Watchlist Features
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🔔</span>
          <span class="font-medium">Reminders</span>
        </div>
        <p class="text-sm text-base-content/50">
          Get notified before games you've saved start
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">📱</span>
          <span class="font-medium">Sync Across Devices</span>
        </div>
        <p class="text-sm text-base-content/50">
          Your watchlist follows you everywhere
        </p>
      </div>
      <div class="bg-base-200/50 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🤝</span>
          <span class="font-medium">Share Lists</span>
        </div>
        <p class="text-sm text-base-content/50">
          Create shared watchlists with friends
        </p>
      </div>
    </div>
  </div>
</div>
