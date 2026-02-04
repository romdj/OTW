<script lang="ts">
  import { onMount } from 'svelte';
  import { MatchCard } from '../../../../components/Tennis';
  import { fetchMatches, fetchLiveMatches, type TennisMatch } from '../../../../api/tennisAPI.js';

  let liveMatches: TennisMatch[] = [];
  let scheduledMatches: TennisMatch[] = [];
  let completedMatches: TennisMatch[] = [];
  let loading = true;
  let error: string | null = null;

  async function loadMatches() {
    loading = true;
    error = null;
    try {
      const [live, scheduled, completed] = await Promise.all([
        fetchLiveMatches(),
        fetchMatches({ status: 'SCHEDULED' }),
        fetchMatches({ status: 'COMPLETED' }),
      ]);
      liveMatches = live;
      scheduledMatches = scheduled;
      completedMatches = completed.slice(0, 10); // Limit recent results
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load matches';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadMatches();

    // Auto-refresh live matches every 30 seconds
    const interval = setInterval(async () => {
      try {
        liveMatches = await fetchLiveMatches();
      } catch {
        // Silently fail on refresh errors
      }
    }, 30000);

    return () => clearInterval(interval);
  });
</script>

<svelte:head>
  <title>Matches | Tennis | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">ATP Matches</h1>
    <p class="text-base-content/60">Live, upcoming, and recent matches</p>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadMatches}>
        Try again
      </button>
    </div>
  {:else}
    <!-- Live Matches -->
    <section>
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">Live</h2>
      </div>
      {#if loading}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each Array(2) as _, i (i)}
            <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if liveMatches.length === 0}
        <div class="border border-base-200 rounded-xl p-8 text-center">
          <p class="text-base-content/50">No live matches right now</p>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each liveMatches as match (match.id)}
            <MatchCard {match} />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Scheduled Matches -->
    <section>
      <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide mb-4">
        Coming Up
      </h2>
      {#if loading}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each Array(4) as _, i (i)}
            <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if scheduledMatches.length === 0}
        <div class="border border-base-200 rounded-xl p-8 text-center">
          <p class="text-base-content/50 mb-2">No upcoming matches scheduled</p>
          <p class="text-sm text-base-content/40">Check back during tournament weeks</p>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each scheduledMatches as match (match.id)}
            <MatchCard {match} />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Recently Completed -->
    <section>
      <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide mb-4">
        Recent Results
      </h2>
      {#if loading}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each Array(4) as _, i (i)}
            <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if completedMatches.length === 0}
        <div class="border border-base-200 rounded-xl p-8 text-center">
          <p class="text-base-content/50">No recent matches</p>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2">
          {#each completedMatches as match (match.id)}
            <MatchCard {match} />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Watchability Tips -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-2">What makes a match worth watching?</h3>
      <ul class="text-sm text-base-content/60 space-y-1">
        <li>
          <strong class="text-base-content/80">Close rankings:</strong> Matches between similarly ranked players
          tend to be more competitive
        </li>
        <li>
          <strong class="text-base-content/80">Five-set format:</strong> Grand Slam matches allow for epic
          comebacks and dramatic finishes
        </li>
        <li>
          <strong class="text-base-content/80">Tiebreaks:</strong> Multiple tiebreaks signal a close, high-quality
          match
        </li>
        <li>
          <strong class="text-base-content/80">Stakes:</strong> Late-round matches and title deciders bring
          out players' best performances
        </li>
      </ul>
    </div>
  {/if}
</div>
