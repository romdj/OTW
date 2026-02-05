<script lang="ts">
  import type { F1GrandPrix } from '../../api/formula1API.js';
  import {
    formatRaceDate,
    getCountryFlag,
    getExcitementLevel,
    getCircuitTypeDisplay,
  } from '../../api/formula1API.js';

  export let race: F1GrandPrix;

  $: isUpcoming = race.status === 'UPCOMING';
  $: isLive = race.status === 'IN_PROGRESS';
  $: isSprint = race.format === 'SPRINT';
  $: excitement = race.predictedExcitement ? getExcitementLevel(race.predictedExcitement.score) : null;
</script>

<a
  href="/sports/formula1/race/{race.slug}"
  class="block p-4 border rounded-xl hover:border-base-300 transition-colors {isLive ? 'border-red-200 bg-red-50' : 'border-base-200'}"
>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <!-- Round and format badges -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full">
          Round {race.round}
        </span>
        {#if isSprint}
          <span class="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
            Sprint
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

      <!-- Circuit and location -->
      <p class="text-sm text-base-content/60 mt-1 flex items-center gap-1">
        <span>{getCountryFlag(race.circuit.countryCode)}</span>
        <span>{race.circuit.name}</span>
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

  <!-- Circuit info -->
  <div class="mt-3 pt-3 border-t border-base-200/50 flex items-center justify-between text-xs text-base-content/50">
    <div class="flex items-center gap-3">
      <span>{race.circuit.length.toFixed(3)} km</span>
      <span>{race.circuit.turns} turns</span>
      <span>{race.circuit.drsZones} DRS</span>
    </div>
    <span>{getCircuitTypeDisplay(race.circuit.type)}</span>
  </div>

  <!-- Excitement tags -->
  {#if race.predictedExcitement?.tags && race.predictedExcitement.tags.length > 0}
    <div class="mt-2 flex flex-wrap gap-1">
      {#each race.predictedExcitement.tags.slice(0, 3) as tag}
        <span class="text-xs px-2 py-0.5 bg-base-200/50 rounded-full text-base-content/60">
          {tag}
        </span>
      {/each}
    </div>
  {/if}
</a>
