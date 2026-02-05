<script lang="ts">
  import type { CyclingRace } from '../../api/cyclingAPI.js';
  import {
    formatRaceDate,
    getCategoryDisplay,
    getCategoryColor,
    getExcitementLevel,
  } from '../../api/cyclingAPI.js';

  export let race: CyclingRace;

  $: isLive = race.status === 'IN_PROGRESS';
  $: excitement = race.overallExcitement ? getExcitementLevel(race.overallExcitement.averageStageExcitement) : null;
</script>

<a
  href="/sports/cycling/race/{race.slug}"
  class="block p-4 border rounded-xl hover:border-base-300 transition-colors {isLive ? 'border-red-200 bg-red-50' : 'border-base-200'}"
>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <!-- Category and status badges -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full {getCategoryColor(race.category)}">
          {getCategoryDisplay(race.category)}
        </span>
        {#if race.gender === 'WOMEN'}
          <span class="text-xs font-medium px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">
            Women
          </span>
        {/if}
        {#if isLive}
          <span class="flex items-center gap-1 text-xs text-red-600">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Live
          </span>
        {/if}
      </div>

      <!-- Race name -->
      <h3 class="font-medium text-base-content truncate">
        {race.name}
      </h3>

      <!-- Location -->
      <p class="text-sm text-base-content/60 mt-1">
        {race.country}{race.countries && race.countries.length > 1 ? ` + ${race.countries.length - 1} more` : ''}
      </p>
    </div>

    <!-- Date -->
    <div class="text-right shrink-0">
      <div class="text-sm font-medium text-base-content">
        {formatRaceDate(race.startDate, race.endDate)}
      </div>
      {#if excitement}
        <div class="text-xs mt-1 {excitement.color}">
          {excitement.label}
        </div>
      {/if}
    </div>
  </div>

  <!-- Race stats -->
  <div class="mt-3 pt-3 border-t border-base-200/50 flex items-center justify-between text-xs text-base-content/50">
    <div class="flex items-center gap-3">
      {#if race.totalStages}
        <span>{race.totalStages} stages</span>
      {/if}
      {#if race.totalDistance}
        <span>{race.totalDistance.toLocaleString()} km</span>
      {/if}
      {#if race.totalElevation}
        <span>{(race.totalElevation / 1000).toFixed(1)}k m+</span>
      {/if}
    </div>
    {#if race.overallExcitement?.totalLeaderChanges}
      <span>{race.overallExcitement.totalLeaderChanges} leader changes</span>
    {/if}
  </div>
</a>
