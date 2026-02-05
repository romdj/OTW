<script lang="ts">
  import { onMount } from 'svelte';
  import { RaceCard } from '../../../../components/Cycling';
  import {
    fetchRaces,
    type CyclingRace,
    type RaceCategory,
    type CyclingGender,
  } from '../../../../api/cyclingAPI.js';

  let races: CyclingRace[] = [];
  let loading = true;
  let error: string | null = null;

  let selectedCategory: RaceCategory | 'ALL' = 'ALL';
  let selectedGender: CyclingGender | 'ALL' = 'ALL';

  async function loadRaces() {
    loading = true;
    error = null;
    try {
      const args: { category?: RaceCategory; gender?: CyclingGender } = {};
      if (selectedCategory !== 'ALL') args.category = selectedCategory;
      if (selectedGender !== 'ALL') args.gender = selectedGender;

      races = await fetchRaces(args);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load races';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadRaces();
  });

  $: upcomingRaces = races.filter(r => r.status === 'UPCOMING');
  $: inProgressRaces = races.filter(r => r.status === 'IN_PROGRESS');
  $: completedRaces = races.filter(r => r.status === 'COMPLETED');
</script>

<svelte:head>
  <title>Race Calendar | Cycling | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">Race Calendar</h1>
    <p class="text-base-content/60">UCI WorldTour and Pro Series races</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3">
    <select
      bind:value={selectedCategory}
      on:change={loadRaces}
      class="px-4 py-2 text-sm font-medium border border-base-200 rounded-lg bg-base-100 focus:outline-none focus:border-primary"
    >
      <option value="ALL">All Categories</option>
      <option value="GRAND_TOUR">Grand Tours</option>
      <option value="MONUMENT">Monuments</option>
      <option value="WORLD_TOUR">WorldTour</option>
      <option value="PRO_SERIES">Pro Series</option>
    </select>

    <select
      bind:value={selectedGender}
      on:change={loadRaces}
      class="px-4 py-2 text-sm font-medium border border-base-200 rounded-lg bg-base-100 focus:outline-none focus:border-primary"
    >
      <option value="ALL">All</option>
      <option value="MEN">Men</option>
      <option value="WOMEN">Women</option>
    </select>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadRaces}>
        Try again
      </button>
    </div>
  {:else if loading}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each Array(6) as _, i (i)}
        <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
      {/each}
    </div>
  {:else if races.length === 0}
    <div class="text-center border border-base-200 rounded-xl p-8">
      <p class="text-base-content/50 mb-2">No races found</p>
      <p class="text-sm text-base-content/40">Try adjusting your filters</p>
    </div>
  {:else}
    <!-- In Progress -->
    {#if inProgressRaces.length > 0}
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <h2 class="text-lg font-medium text-base-content">In Progress</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each inProgressRaces as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Upcoming -->
    {#if upcomingRaces.length > 0}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4">Upcoming</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each upcomingRaces as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Completed -->
    {#if completedRaces.length > 0}
      <section>
        <h2 class="text-lg font-medium text-base-content/60 mb-4">Completed</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each completedRaces as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      </section>
    {/if}
  {/if}
</div>
