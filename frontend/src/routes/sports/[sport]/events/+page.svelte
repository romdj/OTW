<script lang="ts">
  import { page } from '$app/stores';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sport = SPORTS.find((s) => s.id === sportId);
</script>

<svelte:head>
  <title>Games | {sport?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">
      {sport?.name ?? 'Sport'} Games
    </h1>
    <p class="text-base-content/60">
      Live, upcoming, and recent games
    </p>
  </div>

  <!-- Live -->
  <section>
    <div class="flex items-center gap-2 mb-4">
      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">Live</h2>
    </div>
    <div class="border border-base-200 rounded-xl p-8 text-center">
      <p class="text-base-content/50">No live games right now</p>
    </div>
  </section>

  <!-- Coming Up -->
  <section>
    <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide mb-4">
      Coming Up
    </h2>
    <div class="border border-base-200 rounded-xl p-8 text-center">
      <p class="text-base-content/50 mb-2">Schedule coming soon</p>
      <p class="text-sm text-base-content/40">
        Games will be ranked by watchability score
      </p>
    </div>
  </section>

  <!-- Just Finished -->
  <section>
    <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide mb-4">
      Just Finished
    </h2>
    <div class="border border-base-200 rounded-xl p-8 text-center">
      <p class="text-base-content/50">No recent games</p>
    </div>
  </section>
</div>
