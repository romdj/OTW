<script lang="ts">
  import { onMount } from 'svelte';
  import { StageCard } from '../../../../components/Cycling';
  import {
    fetchUpcomingStages,
    type CyclingStage,
    type StageType,
  } from '../../../../api/cyclingAPI.js';

  let stages: CyclingStage[] = [];
  let loading = true;
  let error: string | null = null;

  let selectedType: StageType | 'ALL' = 'ALL';
  let minExcitement = 0;

  async function loadStages() {
    loading = true;
    error = null;
    try {
      const args: { limit: number; stageType?: StageType; minExcitement?: number } = { limit: 30 };
      if (selectedType !== 'ALL') args.stageType = selectedType;
      if (minExcitement > 0) args.minExcitement = minExcitement;

      stages = await fetchUpcomingStages(args);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load stages';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadStages();
  });
</script>

<svelte:head>
  <title>Upcoming Stages | Cycling | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">Upcoming Stages</h1>
    <p class="text-base-content/60">Grand Tour and stage race stages</p>
  </div>

  <!-- Filters -->
  <div class="flex flex-wrap items-center gap-3">
    <select
      bind:value={selectedType}
      on:change={loadStages}
      class="px-4 py-2 text-sm font-medium border border-base-200 rounded-lg bg-base-100 focus:outline-none focus:border-primary"
    >
      <option value="ALL">All Stage Types</option>
      <option value="FLAT">Flat</option>
      <option value="HILLY">Hilly</option>
      <option value="MOUNTAIN">Mountain</option>
      <option value="ITT">Individual TT</option>
      <option value="TTT">Team TT</option>
    </select>

    <label class="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={minExcitement > 0}
        on:change={(e) => { minExcitement = e.currentTarget.checked ? 60 : 0; loadStages(); }}
        class="checkbox checkbox-sm"
      />
      High excitement only
    </label>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={loadStages}>
        Try again
      </button>
    </div>
  {:else if loading}
    <div class="space-y-3">
      {#each Array(6) as _, i (i)}
        <div class="h-32 bg-base-200/50 rounded-xl animate-pulse"></div>
      {/each}
    </div>
  {:else if stages.length === 0}
    <div class="text-center border border-base-200 rounded-xl p-8">
      <p class="text-base-content/50 mb-2">No upcoming stages</p>
      <p class="text-sm text-base-content/40">Check back during race season</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each stages as stage (stage.id)}
        <StageCard {stage} />
      {/each}
    </div>
  {/if}

  <!-- Stage Types Guide -->
  <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
    <h3 class="text-sm font-medium text-base-content/80 mb-3">Stage Types</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
      <div>
        <span class="font-medium">⛰️ Mountain</span>
        <p class="text-base-content/60">Summit finishes, GC battles</p>
      </div>
      <div>
        <span class="font-medium">〰️ Hilly</span>
        <p class="text-base-content/60">Punchy climbs, attacks</p>
      </div>
      <div>
        <span class="font-medium">➡️ Flat</span>
        <p class="text-base-content/60">Sprint finishes</p>
      </div>
      <div>
        <span class="font-medium">⏱️ ITT</span>
        <p class="text-base-content/60">Individual time trial</p>
      </div>
      <div>
        <span class="font-medium">👥 TTT</span>
        <p class="text-base-content/60">Team time trial</p>
      </div>
      <div>
        <span class="font-medium">🏁 Prologue</span>
        <p class="text-base-content/60">Short opening TT</p>
      </div>
    </div>
  </div>

  <!-- Watchability Tips -->
  <div class="border border-base-200 rounded-xl p-4 bg-base-200/20">
    <h3 class="text-sm font-medium text-base-content/80 mb-2">What makes a stage exciting?</h3>
    <ul class="text-sm text-base-content/60 space-y-1">
      <li><strong class="text-base-content/80">Mountain stages:</strong> Summit finishes create natural selection and GC drama</li>
      <li><strong class="text-base-content/80">Final week:</strong> Accumulated fatigue leads to cracks and attacks</li>
      <li><strong class="text-base-content/80">Historic climbs:</strong> Alpe d'Huez, Mont Ventoux, and other legendary finishes</li>
      <li><strong class="text-base-content/80">Close GC:</strong> Small time gaps mean every second matters</li>
    </ul>
  </div>
</div>
