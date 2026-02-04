<script lang="ts">
  import type { TennisMatch } from '../../api/tennisAPI.js';
  import { getCountryFlag, getSurfaceDisplayName, getSurfaceColor } from '../../api/tennisAPI.js';

  export let match: TennisMatch;
  export let showTournament = true;

  function formatTime(timeStr?: string): string {
    if (!timeStr) return '';
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function formatDuration(minutes?: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  $: isLive = match.status === 'LIVE';
  $: isCompleted = match.status === 'COMPLETED';
  $: isScheduled = match.status === 'SCHEDULED';
  $: winner = match.score?.winner;
</script>

<div
  class="p-4 border rounded-xl hover:border-base-300 transition-colors {isLive ? 'border-red-200 bg-red-50' : 'border-base-200'}"
>
  <!-- Header: Tournament and round -->
  {#if showTournament}
    <div class="flex items-center justify-between gap-2 mb-3 text-sm">
      <div class="flex items-center gap-2 text-base-content/60 min-w-0">
        <span class={getSurfaceColor(match.surface)}>
          {getSurfaceDisplayName(match.surface)}
        </span>
        <span class="text-base-content/30">|</span>
        <span class="truncate">{match.tournamentName}</span>
      </div>
      <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full shrink-0">
        {match.round}
      </span>
    </div>
  {:else}
    <div class="flex items-center justify-end mb-3">
      <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full">
        {match.round}
      </span>
    </div>
  {/if}

  <!-- Players and score -->
  <div class="space-y-2">
    <!-- Player 1 -->
    <div
      class="flex items-center justify-between gap-2 {winner === match.player1.id ? 'font-semibold' : ''} {winner && winner !== match.player1.id ? 'opacity-50' : ''}"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-lg shrink-0">{getCountryFlag(match.player1.countryCode)}</span>
        <span class="truncate">{match.player1.name}</span>
        {#if match.player1.seed}
          <span class="text-xs text-base-content/40">({match.player1.seed})</span>
        {/if}
        {#if winner === match.player1.id}
          <span class="text-green-600 text-xs">W</span>
        {/if}
      </div>
      {#if match.score?.sets}
        <div class="flex items-center gap-2 font-mono text-sm shrink-0">
          {#each match.score.sets as set, i (i)}
            <span
              class="w-5 text-center"
              class:text-green-600={set.player1 > set.player2}
              class:text-red-600={set.player1 < set.player2}
            >
              {set.player1}{#if set.tiebreak}<sup class="text-xs">{set.tiebreak.player1}</sup>{/if}
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Player 2 -->
    <div
      class="flex items-center justify-between gap-2 {winner === match.player2.id ? 'font-semibold' : ''} {winner && winner !== match.player2.id ? 'opacity-50' : ''}"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-lg shrink-0">{getCountryFlag(match.player2.countryCode)}</span>
        <span class="truncate">{match.player2.name}</span>
        {#if match.player2.seed}
          <span class="text-xs text-base-content/40">({match.player2.seed})</span>
        {/if}
        {#if winner === match.player2.id}
          <span class="text-green-600 text-xs">W</span>
        {/if}
      </div>
      {#if match.score?.sets}
        <div class="flex items-center gap-2 font-mono text-sm shrink-0">
          {#each match.score.sets as set, i (i)}
            <span
              class="w-5 text-center"
              class:text-green-600={set.player2 > set.player1}
              class:text-red-600={set.player2 < set.player1}
            >
              {set.player2}{#if set.tiebreak}<sup class="text-xs">{set.tiebreak.player2}</sup>{/if}
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Footer: Status and time -->
  <div class="mt-3 pt-3 border-t border-base-200/50 flex items-center justify-between text-sm">
    {#if isLive}
      <div class="flex items-center gap-2 text-red-600">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span class="font-medium">Live</span>
        {#if match.court}
          <span class="text-base-content/40">| {match.court}</span>
        {/if}
      </div>
    {:else if isScheduled}
      <div class="text-base-content/60">
        {formatTime(match.scheduledTime)}
        {#if match.court}
          <span class="text-base-content/40">| {match.court}</span>
        {/if}
      </div>
    {:else if isCompleted}
      <div class="text-base-content/50">
        {#if match.score?.retired}
          <span class="text-orange-600">Retired</span>
        {:else if match.score?.walkover}
          <span class="text-orange-600">Walkover</span>
        {:else}
          Final
        {/if}
      </div>
    {:else}
      <div></div>
    {/if}

    {#if match.duration}
      <div class="text-base-content/40 text-xs">
        {formatDuration(match.duration)}
      </div>
    {/if}
  </div>
</div>
