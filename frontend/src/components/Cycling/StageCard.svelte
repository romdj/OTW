<script lang="ts">
  import type { CyclingStage } from '../../api/cyclingAPI.js';
  import {
    getStageTypeDisplay,
    getStageTypeIcon,
    getExcitementLevel,
  } from '../../api/cyclingAPI.js';

  export let stage: CyclingStage;
  export let showRace = true;

  $: isLive = stage.status === 'LIVE';
  $: isRestDay = stage.status === 'REST_DAY';
  $: excitement = stage.predictedExcitement ? getExcitementLevel(stage.predictedExcitement.score) : null;

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<div
  class="p-4 border rounded-xl transition-colors {isLive ? 'border-red-200 bg-red-50' : isRestDay ? 'border-yellow-200 bg-yellow-50/30' : 'border-base-200 hover:border-base-300'}"
>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <!-- Stage number and type -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-lg">{getStageTypeIcon(stage.stageType)}</span>
        <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full">
          Stage {stage.stageNumber}
        </span>
        <span class="text-xs text-base-content/60">
          {getStageTypeDisplay(stage.stageType)}
        </span>
        {#if isLive}
          <span class="flex items-center gap-1 text-xs text-red-600">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Live
          </span>
        {/if}
      </div>

      <!-- Route -->
      <h3 class="font-medium text-base-content">
        {stage.startLocation} → {stage.finishLocation}
      </h3>

      <!-- Climbs preview -->
      {#if stage.climbs && stage.climbs.length > 0}
        <div class="flex flex-wrap gap-1 mt-2">
          {#each stage.climbs.slice(0, 3) as climb}
            <span class="text-xs px-2 py-0.5 bg-base-200/50 rounded-full text-base-content/60">
              {climb.category === 'HC' ? 'HC' : `Cat ${climb.category}`} {climb.name}
            </span>
          {/each}
          {#if stage.climbs.length > 3}
            <span class="text-xs text-base-content/40">+{stage.climbs.length - 3} more</span>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Date and excitement -->
    <div class="text-right shrink-0">
      <div class="text-sm text-base-content/60">
        {formatDate(stage.date)}
      </div>
      {#if excitement}
        <div class="text-xs mt-1 {excitement.color}">
          {excitement.label}
        </div>
      {/if}
    </div>
  </div>

  <!-- Stage stats -->
  <div class="mt-3 pt-3 border-t border-base-200/50 flex items-center justify-between text-xs text-base-content/50">
    <div class="flex items-center gap-3">
      <span>{stage.distance} km</span>
      {#if stage.elevationGain}
        <span>{stage.elevationGain.toLocaleString()} m+</span>
      {/if}
    </div>
    {#if stage.winner}
      <span class="text-base-content/70">
        Winner: {stage.winner.riderName}
      </span>
    {/if}
  </div>
</div>
