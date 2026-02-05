<script lang="ts">
  import { onMount } from 'svelte';
  import { SPORTS } from '../../../components/Sports';
  import { RaceCard, DriverStandingsTable, SessionList } from '../../../components/Formula1';
  import {
    fetchCalendar,
    fetchNextRace,
    fetchUpcomingSessions,
    fetchDriverStandings,
    type F1GrandPrix,
    type F1Session,
    type F1DriverStanding,
  } from '../../../api/formula1API.js';

  const sport = SPORTS.find((s) => s.id === 'formula1');

  let nextRace: F1GrandPrix | null = null;
  let upcomingSessions: F1Session[] = [];
  let driverStandings: F1DriverStanding[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const [next, sessions, standings] = await Promise.all([
        fetchNextRace(),
        fetchUpcomingSessions(5),
        fetchDriverStandings(),
      ]);
      nextRace = next;
      upcomingSessions = sessions;
      driverStandings = standings.slice(0, 5);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load data';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Formula 1 | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <div class="text-5xl mb-4">{sport?.icon ?? '🏎️'}</div>
    <h1 class="text-2xl font-medium text-base-content mb-1">Formula 1</h1>
    <p class="text-base-content/60">{sport?.tagline ?? 'The pinnacle of motorsport'}</p>
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
        href="/sports/formula1/calendar"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">📅</div>
        <div class="font-medium text-base-content">Calendar</div>
      </a>
      <a
        href="/sports/formula1/standings"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-medium text-base-content">Standings</div>
      </a>
      <a
        href="/sports/formula1/schedule"
        class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
      >
        <div class="text-2xl mb-2">⏱️</div>
        <div class="font-medium text-base-content">Sessions</div>
      </a>
    </div>

    <!-- Next Race -->
    {#if nextRace}
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
            Next Race
          </h2>
          <a href="/sports/formula1/calendar" class="text-sm text-primary hover:underline">
            Full calendar
          </a>
        </div>
        <RaceCard race={nextRace} />
      </section>
    {/if}

    <!-- Upcoming Sessions -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          Upcoming Sessions
        </h2>
        <a href="/sports/formula1/schedule" class="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <SessionList sessions={upcomingSessions} {loading} />
    </section>

    <!-- Driver Standings Preview -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
          Driver Standings
        </h2>
        <a href="/sports/formula1/standings" class="text-sm text-primary hover:underline">
          Full standings
        </a>
      </div>
      <div class="border border-base-200 rounded-xl p-4">
        <DriverStandingsTable standings={driverStandings} {loading} limit={5} />
      </div>
    </section>
  {/if}
</div>
