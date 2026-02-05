<script lang="ts">
  import { onMount } from 'svelte';
  import { RaceCard } from '../../../../components/Formula1';
  import {
    fetchCalendar,
    type F1GrandPrix,
    type F1GrandPrixStatus,
  } from '../../../../api/formula1API.js';

  let races: F1GrandPrix[] = [];
  let loading = true;
  let error: string | null = null;

  let selectedStatus: F1GrandPrixStatus | 'ALL' = 'ALL';
  let showSprintOnly = false;

  async function loadCalendar() {
    loading = true;
    error = null;
    try {
      const args: { status?: F1GrandPrixStatus; format?: 'SPRINT' } = {};
      if (selectedStatus !== 'ALL') args.status = selectedStatus;
      if (showSprintOnly) args.format = 'SPRINT';

      races = await fetchCalendar(args);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load calendar';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadCalendar();
  });

  $: upcomingRaces = races.filter(r => r.status === 'UPCOMING');
  $: completedRaces = races.filter(r => r.status === 'COMPLETED');
</script>

<svelte:head>
  <title>Calendar | Formula 1 | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">F1 Calendar</h1>
    <p class="text-base-content/60">2025 Formula 1 World Championship</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3">
    <div class="flex rounded-lg border border-base-200 overflow-hidden">
      <button
        class="px-4 py-2 text-sm font-medium transition-colors"
        class:bg-primary={selectedStatus === 'ALL'}
        class:text-white={selectedStatus === 'ALL'}
        class:hover:bg-base-200={selectedStatus !== 'ALL'}
        on:click={() => { selectedStatus = 'ALL'; loadCalendar(); }}
      >
        All
      </button>
      <button
        class="px-4 py-2 text-sm font-medium transition-colors border-l border-base-200"
        class:bg-primary={selectedStatus === 'UPCOMING'}
        class:text-white={selectedStatus === 'UPCOMING'}
        class:hover:bg-base-200={selectedStatus !== 'UPCOMING'}
        on:click={() => { selectedStatus = 'UPCOMING'; loadCalendar(); }}
      >
        Upcoming
      </button>
      <button
        class="px-4 py-2 text-sm font-medium transition-colors border-l border-base-200"
        class:bg-primary={selectedStatus === 'COMPLETED'}
        class:text-white={selectedStatus === 'COMPLETED'}
        class:hover:bg-base-200={selectedStatus !== 'COMPLETED'}
        on:click={() => { selectedStatus = 'COMPLETED'; loadCalendar(); }}
      >
        Completed
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        bind:checked={showSprintOnly}
        on:change={loadCalendar}
        class="checkbox checkbox-sm"
      />
      Sprint weekends only
    </label>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadCalendar}>
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
    <!-- Upcoming Races -->
    {#if upcomingRaces.length > 0 && selectedStatus !== 'COMPLETED'}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4">
          Upcoming Races
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each upcomingRaces as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Completed Races -->
    {#if completedRaces.length > 0 && selectedStatus !== 'UPCOMING'}
      <section>
        <h2 class="text-lg font-medium text-base-content mb-4 text-base-content/60">
          Completed Races
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {#each completedRaces as race (race.id)}
            <RaceCard {race} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Watchability Context -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-2">
        What makes a Grand Prix exciting?
      </h3>
      <ul class="text-sm text-base-content/60 space-y-1">
        <li><strong class="text-base-content/80">Track characteristics:</strong> Street circuits and high overtaking tracks tend to produce drama</li>
        <li><strong class="text-base-content/80">Championship stakes:</strong> Title-deciding races bring out the best in drivers</li>
        <li><strong class="text-base-content/80">Weather variability:</strong> Rain can turn a procession into chaos</li>
        <li><strong class="text-base-content/80">Sprint weekends:</strong> More on-track action and points opportunities</li>
      </ul>
    </div>
  {/if}
</div>
