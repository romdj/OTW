<script lang="ts">
  import { onMount } from 'svelte';
  import { RankingsTable } from '../../../../components/Tennis';
  import { fetchRankings, type TennisRanking } from '../../../../api/tennisAPI.js';

  let rankings: TennisRanking[] = [];
  let loading = true;
  let error: string | null = null;

  // Filters
  let tour: 'ATP' | 'WTA' = 'ATP';
  let rankingType: 'SINGLES' | 'DOUBLES' = 'SINGLES';

  async function loadRankings() {
    loading = true;
    error = null;
    try {
      rankings = await fetchRankings({ tour, type: rankingType, limit: 100 });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load rankings';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadRankings();
  });

  // Reload when filters change
  $: if (tour || rankingType) {
    loadRankings();
  }
</script>

<svelte:head>
  <title>ATP Rankings | Tennis | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">ATP Rankings</h1>
    <p class="text-base-content/60">Current ATP Tour singles rankings</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3">
    <div class="flex rounded-lg border border-base-200 overflow-hidden">
      <button
        class="px-4 py-2 text-sm font-medium transition-colors"
        class:bg-primary={tour === 'ATP'}
        class:text-white={tour === 'ATP'}
        class:hover:bg-base-200={tour !== 'ATP'}
        on:click={() => (tour = 'ATP')}
      >
        ATP
      </button>
      <button
        class="px-4 py-2 text-sm font-medium transition-colors border-l border-base-200"
        class:bg-primary={tour === 'WTA'}
        class:text-white={tour === 'WTA'}
        class:hover:bg-base-200={tour !== 'WTA'}
        disabled
        title="WTA rankings coming soon"
        on:click={() => (tour = 'WTA')}
      >
        WTA
      </button>
    </div>

    <div class="flex rounded-lg border border-base-200 overflow-hidden">
      <button
        class="px-4 py-2 text-sm font-medium transition-colors"
        class:bg-primary={rankingType === 'SINGLES'}
        class:text-white={rankingType === 'SINGLES'}
        class:hover:bg-base-200={rankingType !== 'SINGLES'}
        on:click={() => (rankingType = 'SINGLES')}
      >
        Singles
      </button>
      <button
        class="px-4 py-2 text-sm font-medium transition-colors border-l border-base-200"
        class:bg-primary={rankingType === 'DOUBLES'}
        class:text-white={rankingType === 'DOUBLES'}
        class:hover:bg-base-200={rankingType !== 'DOUBLES'}
        disabled
        title="Doubles rankings coming soon"
        on:click={() => (rankingType = 'DOUBLES')}
      >
        Doubles
      </button>
    </div>
  </div>

  <!-- Error State -->
  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadRankings}>
        Try again
      </button>
    </div>
  {:else}
    <!-- Rankings Table -->
    <div class="border border-base-200 rounded-xl p-4">
      <RankingsTable {rankings} {loading} limit={50} />
    </div>

    <!-- Watchability Context -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-2">
        How rankings affect watchability
      </h3>
      <p class="text-sm text-base-content/60">
        Matches between closely ranked players or top-10 clashes tend to be more competitive.
        When a lower-ranked player faces a top seed, underdog potential increases the drama.
        Check out the <a href="/how-it-works" class="text-primary hover:underline">How It Works</a>
        page to learn more about watchability scoring.
      </p>
    </div>
  {/if}
</div>
