<script lang="ts">
  import { onMount } from 'svelte';
  import { SPORTS } from '../../../components/Sports';
  import { RankingsTable, TournamentCard, MatchCard } from '../../../components/Tennis';
  import {
    fetchRankings,
    fetchTournaments,
    fetchLiveMatches,
    type TennisRanking,
    type TennisTournament,
    type TennisMatch,
  } from '../../../api/tennisAPI.js';

  const sport = SPORTS.find((s) => s.id === 'tennis');

  let rankings: TennisRanking[] = [];
  let tournaments: TennisTournament[] = [];
  let liveMatches: TennisMatch[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const [rankingsData, tournamentsData, liveData] = await Promise.all([
        fetchRankings({ tour: 'ATP', limit: 5 }),
        fetchTournaments({ tour: 'ATP' }),
        fetchLiveMatches(),
      ]);
      rankings = rankingsData;
      tournaments = tournamentsData.slice(0, 3);
      liveMatches = liveData;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Tennis | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <div class="text-5xl mb-4">{sport?.icon ?? '🎾'}</div>
    <h1 class="text-2xl font-medium text-base-content mb-1">ATP Tennis</h1>
    <p class="text-base-content/60">{sport?.tagline ?? 'Individual brilliance on court'}</p>
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
        href="/sports/tennis/rankings"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">📊</div>
        <div class="font-medium text-base-content">Rankings</div>
      </a>
      <a
        href="/sports/tennis/tournaments"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-medium text-base-content">Tournaments</div>
      </a>
      <a
        href="/sports/tennis/events"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">📅</div>
        <div class="font-medium text-base-content">Matches</div>
      </a>
    </div>

    <!-- Live Matches -->
    {#if liveMatches.length > 0}
      <section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
              Live Now
            </h2>
          </div>
          <a href="/sports/tennis/events" class="text-sm text-primary hover:underline">
            View all
          </a>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each liveMatches.slice(0, 2) as match (match.id)}
            <MatchCard {match} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Top Rankings Preview -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          ATP Rankings
        </h2>
        <a href="/sports/tennis/rankings" class="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div class="border border-base-200 rounded-xl p-4">
        <RankingsTable {rankings} {loading} limit={5} />
      </div>
    </section>

    <!-- Upcoming Tournaments Preview -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          Tournaments
        </h2>
        <a href="/sports/tennis/tournaments" class="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      {#if loading}
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(3) as _, i (i)}
            <div class="h-40 bg-base-200/50 rounded-xl animate-pulse"></div>
          {/each}
        </div>
      {:else if tournaments.length === 0}
        <div class="text-center border border-base-200 rounded-xl p-8">
          <p class="text-base-content/50">No tournaments available</p>
        </div>
      {:else}
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each tournaments as tournament (tournament.id)}
            <TournamentCard {tournament} />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>
