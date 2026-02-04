<script lang="ts">
  import type { TennisRanking } from '../../api/tennisAPI.js';
  import { getMovementIndicator, getCountryFlag } from '../../api/tennisAPI.js';

  export let rankings: TennisRanking[] = [];
  export let loading = false;
  export let limit = 10;

  $: displayedRankings = rankings.slice(0, limit);
</script>

{#if loading}
  <div class="space-y-2">
    {#each Array(5) as _, i (i)}
      <div class="h-12 bg-base-200/50 rounded-lg animate-pulse"></div>
    {/each}
  </div>
{:else if displayedRankings.length === 0}
  <div class="text-center py-8 border border-base-200 rounded-xl">
    <p class="text-base-content/50">No rankings available</p>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-left text-sm text-base-content/60 border-b border-base-200">
          <th class="py-3 px-2 w-16">Rank</th>
          <th class="py-3 px-2">Player</th>
          <th class="py-3 px-2 text-right hidden sm:table-cell">Points</th>
          <th class="py-3 px-2 text-right hidden md:table-cell">Tournaments</th>
        </tr>
      </thead>
      <tbody>
        {#each displayedRankings as ranking (ranking.playerId)}
          {@const movement = getMovementIndicator(ranking.movement)}
          <tr class="border-b border-base-200/50 hover:bg-base-200/30 transition-colors">
            <td class="py-3 px-2">
              <div class="flex items-center gap-2">
                <span class="font-medium">{ranking.rank}</span>
                <span class={`text-xs ${movement.color}`}>
                  {movement.icon}
                </span>
              </div>
            </td>
            <td class="py-3 px-2">
              <a
                href="/sports/tennis/player/{ranking.playerId}"
                class="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span class="text-lg" title={ranking.country}>
                  {getCountryFlag(ranking.countryCode)}
                </span>
                <span class="font-medium">{ranking.playerName}</span>
              </a>
            </td>
            <td class="py-3 px-2 text-right hidden sm:table-cell">
              <span class="font-mono text-sm">{ranking.points.toLocaleString()}</span>
            </td>
            <td class="py-3 px-2 text-right hidden md:table-cell text-base-content/60">
              {ranking.tournamentsPlayed}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if rankings.length > limit}
    <div class="mt-4 text-center">
      <button
        class="text-sm text-primary hover:underline"
        on:click={() => limit = Math.min(limit + 10, rankings.length)}
      >
        Show more ({rankings.length - limit} remaining)
      </button>
    </div>
  {/if}
{/if}
