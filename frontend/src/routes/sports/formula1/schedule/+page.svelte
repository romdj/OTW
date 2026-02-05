<script lang="ts">
  import { onMount } from 'svelte';
  import { SessionList } from '../../../../components/Formula1';
  import { fetchUpcomingSessions, type F1Session } from '../../../../api/formula1API.js';

  let sessions: F1Session[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      sessions = await fetchUpcomingSessions(30);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load sessions';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Schedule | Formula 1 | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">F1 Session Schedule</h1>
    <p class="text-base-content/60">Upcoming practice, qualifying, and race sessions</p>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={() => location.reload()}>
        Try again
      </button>
    </div>
  {:else}
    <SessionList {sessions} {loading} />

    <!-- Session Types Legend -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-3">Session Types</h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <span class="font-medium">FP1/FP2/FP3</span>
          <p class="text-base-content/60">Free Practice</p>
        </div>
        <div>
          <span class="font-medium">Quali</span>
          <p class="text-base-content/60">Qualifying (Q1/Q2/Q3)</p>
        </div>
        <div>
          <span class="font-medium">Sprint</span>
          <p class="text-base-content/60">Sprint Race (100km)</p>
        </div>
        <div>
          <span class="font-medium">Race</span>
          <p class="text-base-content/60">Grand Prix (305km)</p>
        </div>
      </div>
    </div>

    <!-- Watchability Tips -->
    <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
      <h3 class="text-sm font-medium text-base-content/80 mb-2">Which sessions to watch?</h3>
      <ul class="text-sm text-base-content/60 space-y-1">
        <li><strong class="text-base-content/80">Race:</strong> The main event - always worth watching live</li>
        <li><strong class="text-base-content/80">Qualifying:</strong> Determines grid positions, often dramatic</li>
        <li><strong class="text-base-content/80">Sprint:</strong> Shorter race format, points-paying action</li>
        <li><strong class="text-base-content/80">Practice:</strong> Best for technical analysis and setup comparisons</li>
      </ul>
    </div>
  {/if}
</div>
