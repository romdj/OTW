<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);

  // Placeholder data structure for events
  interface GameEvent {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    startTime: Date;
    status: 'upcoming' | 'live' | 'finished';
    watchabilityScore: number;
    tags: string[];
  }

  // Mock data for UI demonstration
  const mockLiveGames: GameEvent[] = [];
  const mockUpcomingGames: GameEvent[] = [];
  const mockRecentGames: GameEvent[] = [];
</script>

<svelte:head>
  <title>Games | {sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="flex flex-col space-y-8" in:fade={{ duration: 300 }}>
  <!-- Page Header -->
  <div class="text-center">
    <h1 class="text-3xl font-bold text-base-content mb-2">
      {sportConfig?.name ?? 'Sport'} Games
    </h1>
    <p class="text-base-content/70">
      Find the most watchable games - live, upcoming, and recent
    </p>
  </div>

  <!-- Live Now Section -->
  <section class="w-full">
    <div class="flex items-center gap-2 mb-4">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
      </span>
      <h2 class="text-xl font-semibold">Live Now</h2>
    </div>

    {#if mockLiveGames.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each mockLiveGames as game (game.id)}
          <div class="card bg-base-200 border-2 border-error/30">
            <div class="card-body p-4">
              <div class="flex justify-between items-center">
                <span class="font-semibold">{game.homeTeam}</span>
                <span class="text-2xl font-bold">{game.homeScore}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-semibold">{game.awayTeam}</span>
                <span class="text-2xl font-bold">{game.awayScore}</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                {#each game.tags as tag}
                  <span class="badge badge-sm badge-error">{tag}</span>
                {/each}
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-base-content/60">Watchability</span>
                <div class="badge badge-primary">{game.watchabilityScore}/100</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bg-base-200 rounded-lg p-6 text-center">
        <p class="text-base-content/60">No live games right now</p>
        <p class="text-sm text-base-content/40 mt-1">Check back during game time</p>
      </div>
    {/if}
  </section>

  <!-- Coming Up Section -->
  <section class="w-full">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl">📅</span>
      <h2 class="text-xl font-semibold">Coming Up</h2>
    </div>

    {#if mockUpcomingGames.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each mockUpcomingGames as game (game.id)}
          <div class="card bg-base-200 hover:bg-base-300 transition-colors">
            <div class="card-body p-4">
              <div class="flex justify-between items-center">
                <span class="font-semibold">{game.homeTeam}</span>
                <span class="text-sm text-base-content/60">vs</span>
                <span class="font-semibold">{game.awayTeam}</span>
              </div>
              <div class="text-sm text-base-content/60 mt-2">
                {game.startTime.toLocaleDateString()} at {game.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                {#each game.tags as tag}
                  <span class="badge badge-sm badge-outline">{tag}</span>
                {/each}
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-base-content/60">Watchability</span>
                <div class="badge badge-primary badge-outline">{game.watchabilityScore}/100</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bg-base-200 rounded-lg p-6 text-center">
        <div class="text-4xl mb-3">🚧</div>
        <p class="text-base-content/70 font-medium">Schedule Coming Soon</p>
        <p class="text-sm text-base-content/50 mt-1 max-w-md mx-auto">
          We're building the event prioritization engine. Soon you'll see upcoming
          games ranked by watchability with tags like "Rivalry Game" and "Playoff Implications".
        </p>
        <div class="flex flex-wrap gap-2 justify-center mt-4">
          {#each sportConfig?.watchabilityHints ?? [] as hint}
            <span class="badge badge-outline badge-sm">{hint}</span>
          {/each}
        </div>
      </div>
    {/if}
  </section>

  <!-- Just Finished Section -->
  <section class="w-full">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl">🏁</span>
      <h2 class="text-xl font-semibold">Just Finished</h2>
    </div>

    {#if mockRecentGames.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each mockRecentGames as game (game.id)}
          <div class="card bg-base-200 opacity-80">
            <div class="card-body p-4">
              <div class="flex justify-between items-center">
                <span class="font-semibold">{game.homeTeam}</span>
                <span class="text-2xl font-bold">{game.homeScore}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-semibold">{game.awayTeam}</span>
                <span class="text-2xl font-bold">{game.awayScore}</span>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                {#each game.tags as tag}
                  <span class="badge badge-sm badge-ghost">{tag}</span>
                {/each}
              </div>
              <div class="text-xs text-base-content/50 mt-2">
                Final • Worth rewatching?
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="bg-base-200 rounded-lg p-6 text-center">
        <p class="text-base-content/60">No recent games to show</p>
        <p class="text-sm text-base-content/40 mt-1">
          Recently finished games will appear here with spoiler-free watchability info
        </p>
      </div>
    {/if}
  </section>

  <!-- What You'll See -->
  <section class="w-full bg-base-200 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-base-content mb-4 text-center">
      What's Coming
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">🎯</span>
        <span class="font-medium">Watchability Scores</span>
        <span class="text-sm text-base-content/60">
          Every game rated on drama potential
        </span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">🏷️</span>
        <span class="font-medium">Smart Tags</span>
        <span class="text-sm text-base-content/60">
          "Rivalry", "Must-Win", "Upset Alert"
        </span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <span class="text-2xl">🔕</span>
        <span class="font-medium">Spoiler-Free Mode</span>
        <span class="text-sm text-base-content/60">
          Know if it's worth watching without spoilers
        </span>
      </div>
    </div>
  </section>
</div>
