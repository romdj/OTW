<script lang="ts">
  import { onMount } from 'svelte';
  import { TournamentCard } from '../../../../components/Tennis';
  import {
    fetchTournaments,
    type TennisTournament,
    type TournamentCategory,
    type TennisSurface,
  } from '../../../../api/tennisAPI.js';

  let tournaments: TennisTournament[] = [];
  let loading = true;
  let error: string | null = null;

  // Filters
  let selectedSurface: TennisSurface | 'ALL' = 'ALL';
  let selectedCategory: TournamentCategory | 'ALL' = 'ALL';

  async function loadTournaments() {
    loading = true;
    error = null;
    try {
      const args: { tour: 'ATP'; surface?: TennisSurface; category?: TournamentCategory } = {
        tour: 'ATP',
      };
      if (selectedSurface !== 'ALL') args.surface = selectedSurface;
      if (selectedCategory !== 'ALL') args.category = selectedCategory;

      tournaments = await fetchTournaments(args);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load tournaments';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadTournaments();
  });

  // Categorize tournaments
  $: grandSlams = tournaments.filter((t) => t.category === 'GRAND_SLAM');
  $: masters = tournaments.filter((t) => t.category === 'MASTERS_1000');
  $: other = tournaments.filter(
    (t) => t.category !== 'GRAND_SLAM' && t.category !== 'MASTERS_1000'
  );

  // Surface filter options
  const surfaces: { value: TennisSurface | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All Surfaces' },
    { value: 'HARD', label: 'Hard' },
    { value: 'CLAY', label: 'Clay' },
    { value: 'GRASS', label: 'Grass' },
  ];
</script>

<svelte:head>
  <title>Tournaments | Tennis | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">ATP Tournaments</h1>
    <p class="text-base-content/60">Grand Slams, Masters 1000, and ATP Tour events</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3">
    <select
      bind:value={selectedSurface}
      on:change={loadTournaments}
      class="px-4 py-2 text-sm font-medium border border-base-200 rounded-lg bg-base-100 focus:outline-none focus:border-primary"
    >
      {#each surfaces as surface}
        <option value={surface.value}>{surface.label}</option>
      {/each}
    </select>
  </div>

  <!-- Error State -->
  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadTournaments}>
        Try again
      </button>
    </div>
  {:else if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _, i (i)}
        <div class="h-48 bg-base-200/50 rounded-xl animate-pulse"></div>
      {/each}
    </div>
  {:else if tournaments.length === 0}
    <div class="text-center border border-base-200 rounded-xl p-8">
      <p class="text-base-content/50 mb-2">No tournaments found</p>
      <p class="text-sm text-base-content/40">Try adjusting your filters</p>
    </div>
  {:else}
    <!-- Grand Slams -->
    {#if grandSlams.length > 0}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4 flex items-center gap-2">
          <span class="text-yellow-500">👑</span>
          Grand Slams
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each grandSlams as tournament (tournament.id)}
            <TournamentCard {tournament} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Masters 1000 -->
    {#if masters.length > 0}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4">Masters 1000</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each masters as tournament (tournament.id)}
            <TournamentCard {tournament} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Other ATP Events -->
    {#if other.length > 0}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4">ATP Tour</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each other as tournament (tournament.id)}
            <TournamentCard {tournament} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Watchability Context -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-2">
        How tournaments affect watchability
      </h3>
      <p class="text-sm text-base-content/60">
        Grand Slams offer five-set drama that creates more opportunities for comebacks and epic
        battles. Masters 1000 events bring together the best players and often feature high-stakes
        clashes. Surface specialists can cause upsets on their preferred court type.
      </p>
    </div>
  {/if}
</div>
