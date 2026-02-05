<script lang="ts">
  import { onMount } from 'svelte';
  import { SPORTS } from '../../../components/Sports';
  import { RaceCard, StageCard } from '../../../components/Cycling';
  import {
    fetchGrandTours,
    fetchMonuments,
    fetchUpcomingStages,
    type CyclingRace,
    type CyclingStage,
  } from '../../../api/cyclingAPI.js';

  const sport = SPORTS.find((s) => s.id === 'cycling');

  let grandTours: CyclingRace[] = [];
  let monuments: CyclingRace[] = [];
  let upcomingStages: CyclingStage[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const [tours, mons, stages] = await Promise.all([
        fetchGrandTours(),
        fetchMonuments(),
        fetchUpcomingStages({ limit: 5 }),
      ]);
      grandTours = tours;
      monuments = mons;
      upcomingStages = stages;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Pro Cycling | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <div class="text-5xl mb-4">{sport?.icon ?? '🚴'}</div>
    <h1 class="text-2xl font-medium text-base-content mb-1">Pro Cycling</h1>
    <p class="text-base-content/60">{sport?.tagline ?? 'Grand Tours and Monuments'}</p>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600">{error}</p>
      <button class="mt-4 text-sm text-primary hover:underline" on:click={() => location.reload()}>
        Try again
      </button>
    </div>
  {:else}
    <!-- Quick Navigation -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
      <a
        href="/sports/cycling/races"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">📅</div>
        <div class="font-medium text-base-content">Race Calendar</div>
      </a>
      <a
        href="/sports/cycling/stages"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">⛰️</div>
        <div class="font-medium text-base-content">Upcoming Stages</div>
      </a>
      <a
        href="/sports/cycling/grand-tours"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-medium text-base-content">Grand Tours</div>
      </a>
    </div>

    <!-- Upcoming Stages -->
    {#if upcomingStages.length > 0}
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
            Upcoming Stages
          </h2>
          <a href="/sports/cycling/stages" class="text-sm text-primary hover:underline">
            View all
          </a>
        </div>
        <div class="space-y-3">
          {#each upcomingStages.slice(0, 3) as stage (stage.id)}
            <StageCard {stage} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Grand Tours -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          Grand Tours
        </h2>
        <a href="/sports/cycling/grand-tours" class="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      {#if loading}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(3) as _, i (i)}
            <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if grandTours.length === 0}
        <div class="text-center border border-base-200 rounded-xl p-8">
          <p class="text-base-content/50">No grand tours scheduled</p>
        </div>
      {:else}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each grandTours as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Monuments -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          Monuments
        </h2>
      </div>
      {#if loading}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(5) as _, i (i)}
            <div class="h-32 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if monuments.length === 0}
        <div class="text-center border border-base-200 rounded-xl p-8">
          <p class="text-base-content/50">No monuments scheduled</p>
        </div>
      {:else}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each monuments as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>
