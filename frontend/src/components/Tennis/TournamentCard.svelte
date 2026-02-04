<script lang="ts">
  import type { TennisTournament } from '../../api/tennisAPI.js';
  import {
    getCategoryDisplayName,
    getSurfaceDisplayName,
    getSurfaceColor,
    formatPrizeMoney,
  } from '../../api/tennisAPI.js';

  export let tournament: TennisTournament;

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  function getTournamentStatus(start: string, end: string): 'upcoming' | 'live' | 'completed' {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'live';
  }

  $: status = getTournamentStatus(tournament.startDate, tournament.endDate);
  $: surfaceColor = getSurfaceColor(tournament.surface);
</script>

<a
  href="/sports/tennis/tournament/{tournament.id}"
  class="block p-4 border border-base-200 rounded-xl hover:border-base-300 transition-colors"
>
  <div class="flex items-start justify-between gap-4">
    <div class="flex-1 min-w-0">
      <!-- Category badge -->
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs font-medium px-2 py-0.5 bg-base-200 rounded-full">
          {getCategoryDisplayName(tournament.category)}
        </span>
        {#if status === 'live'}
          <span class="flex items-center gap-1 text-xs text-red-600">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Live
          </span>
        {/if}
      </div>

      <!-- Tournament name -->
      <h3 class="font-medium text-base-content truncate">
        {tournament.name}
      </h3>

      <!-- Location -->
      <p class="text-sm text-base-content/60 mt-1">
        {tournament.location}, {tournament.country}
      </p>
    </div>

    <!-- Surface indicator -->
    <div class={`text-right ${surfaceColor}`}>
      <div class="text-sm font-medium">
        {getSurfaceDisplayName(tournament.surface)}
      </div>
    </div>
  </div>

  <!-- Date and prize info -->
  <div class="mt-4 pt-3 border-t border-base-200/50 flex items-center justify-between text-sm">
    <div class="text-base-content/60">
      {formatDate(tournament.startDate)} — {formatDate(tournament.endDate)}
    </div>
    <div class="font-medium">
      {formatPrizeMoney(tournament.prizeMoney, tournament.currency)}
    </div>
  </div>

  <!-- Points info -->
  <div class="mt-3 flex items-center gap-4 text-xs text-base-content/50">
    <span>Winner: {tournament.points.winner} pts</span>
    <span>Draw: {tournament.drawSize}</span>
  </div>
</a>
