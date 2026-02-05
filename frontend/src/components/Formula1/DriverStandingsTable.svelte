<script lang="ts">
  import type { F1DriverStanding } from '../../api/formula1API.js';
  import { getCountryFlag } from '../../api/formula1API.js';

  export let standings: F1DriverStanding[] = [];
  export let loading = false;
  export let limit = 10;

  $: displayedStandings = standings.slice(0, limit);
</script>

{#if loading}
  <div class="space-y-2">
    {#each Array(5) as _, i (i)}
      <div class="h-12 bg-base-200/50 rounded-lg animate-pulse"></div>
    {/each}
  </div>
{:else if displayedStandings.length === 0}
  <div class="text-center py-8 border border-base-200 rounded-xl">
    <p class="text-base-content/50">No standings available</p>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-left text-sm text-base-content/60 border-b border-base-200">
          <th class="py-3 px-2 w-12">Pos</th>
          <th class="py-3 px-2">Driver</th>
          <th class="py-3 px-2 text-right">Pts</th>
          <th class="py-3 px-2 text-right hidden sm:table-cell">Wins</th>
          <th class="py-3 px-2 text-right hidden md:table-cell">Gap</th>
        </tr>
      </thead>
      <tbody>
        {#each displayedStandings as standing (standing.driver.id)}
          <tr class="border-b border-base-200/50 hover:bg-base-200/30 transition-colors">
            <td class="py-3 px-2">
              <span class="font-medium">{standing.position}</span>
            </td>
            <td class="py-3 px-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">{getCountryFlag(standing.driver.nationalityCode)}</span>
                <div>
                  <span class="font-medium">{standing.driver.code}</span>
                  <span class="text-base-content/50 ml-1 hidden sm:inline">
                    {standing.driver.fullName}
                  </span>
                </div>
              </div>
              <div class="text-xs text-base-content/40 mt-0.5">
                {standing.driver.constructorName}
              </div>
            </td>
            <td class="py-3 px-2 text-right">
              <span class="font-mono font-medium">{standing.points}</span>
            </td>
            <td class="py-3 px-2 text-right hidden sm:table-cell">
              {standing.wins}
            </td>
            <td class="py-3 px-2 text-right hidden md:table-cell text-base-content/60">
              {#if standing.position === 1}
                —
              {:else}
                -{standing.pointsToLeader}
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if standings.length > limit}
    <div class="mt-4 text-center">
      <button
        class="text-sm text-primary hover:underline"
        on:click={() => limit = Math.min(limit + 10, standings.length)}
      >
        Show more ({standings.length - limit} remaining)
      </button>
    </div>
  {/if}
{/if}
