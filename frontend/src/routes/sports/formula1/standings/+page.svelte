<script lang="ts">
  import { onMount } from 'svelte';
  import { DriverStandingsTable } from '../../../../components/Formula1';
  import {
    fetchDriverStandings,
    fetchConstructorStandings,
    fetchChampionshipBattle,
    type F1DriverStanding,
    type F1ConstructorStanding,
    type F1ChampionshipBattle,
    getCountryFlag,
  } from '../../../../api/formula1API.js';

  let driverStandings: F1DriverStanding[] = [];
  let constructorStandings: F1ConstructorStanding[] = [];
  let battle: F1ChampionshipBattle | null = null;
  let loading = true;
  let error: string | null = null;

  let activeTab: 'drivers' | 'constructors' = 'drivers';

  onMount(async () => {
    try {
      const [drivers, constructors, championshipBattle] = await Promise.all([
        fetchDriverStandings(),
        fetchConstructorStandings(),
        fetchChampionshipBattle(),
      ]);
      driverStandings = drivers;
      constructorStandings = constructors;
      battle = championshipBattle;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load standings';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Standings | Formula 1 | OTW.sport</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-2xl font-medium text-base-content mb-1">F1 Championship Standings</h1>
    <p class="text-base-content/60">2025 World Championship</p>
  </div>

  {#if error}
    <div class="text-center border border-red-200 bg-red-50/30 rounded-xl p-8">
      <p class="text-red-600 mb-4">{error}</p>
      <button class="text-sm text-primary hover:underline" on:click={() => location.reload()}>
        Try again
      </button>
    </div>
  {:else}
    <!-- Championship Battle Summary -->
    {#if battle && battle.isOpen}
      <div class="border border-base-200 rounded-xl p-4 bg-gradient-to-r from-base-200/30 to-transparent">
        <h2 class="text-sm font-medium text-base-content/60 uppercase tracking-wide mb-3">
          Championship Battle
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <!-- Drivers Battle -->
          <div>
            <div class="text-xs text-base-content/50 mb-2">Drivers Championship</div>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium">{battle.drivers.leader.driver.code}</span>
                <span class="text-sm text-base-content/60 ml-1">{battle.drivers.leader.points} pts</span>
              </div>
              <div class="text-sm">
                <span class="text-green-600">+{battle.drivers.gap}</span> gap
              </div>
            </div>
            {#if battle.drivers.challengers.length > 0}
              <div class="text-sm text-base-content/60 mt-1">
                {battle.drivers.challengers.length} driver{battle.drivers.challengers.length > 1 ? 's' : ''} still in contention
              </div>
            {/if}
          </div>

          <!-- Constructors Battle -->
          <div>
            <div class="text-xs text-base-content/50 mb-2">Constructors Championship</div>
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium">{battle.constructors.leader.constructor.name}</span>
                <span class="text-sm text-base-content/60 ml-1">{battle.constructors.leader.points} pts</span>
              </div>
              <div class="text-sm">
                <span class="text-green-600">+{battle.constructors.gap}</span> gap
              </div>
            </div>
          </div>
        </div>

        {#if battle.narratives.length > 0}
          <div class="mt-3 pt-3 border-t border-base-200/50">
            <div class="flex flex-wrap gap-2">
              {#each battle.narratives.slice(0, 3) as narrative}
                <span class="text-xs px-2 py-1 bg-base-200/50 rounded-full text-base-content/60">
                  {narrative}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <div class="text-xs text-base-content/40 mt-3">
          {battle.racesRemaining} races remaining · {battle.maxPointsAvailable} max points available
        </div>
      </div>
    {/if}

    <!-- Tabs -->
    <div class="flex border-b border-base-200">
      <button
        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {activeTab === 'drivers' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'}"
        on:click={() => activeTab = 'drivers'}
      >
        Drivers
      </button>
      <button
        class="px-4 py-2 text-sm font-medium border-b-2 transition-colors {activeTab === 'constructors' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'}"
        on:click={() => activeTab = 'constructors'}
      >
        Constructors
      </button>
    </div>

    <!-- Standings Tables -->
    {#if activeTab === 'drivers'}
      <div class="border border-base-200 rounded-xl p-4">
        <DriverStandingsTable standings={driverStandings} {loading} limit={20} />
      </div>
    {:else}
      <div class="border border-base-200 rounded-xl p-4">
        {#if loading}
          <div class="space-y-2">
            {#each Array(5) as _, i (i)}
              <div class="h-12 bg-base-200/50 rounded-lg animate-pulse"></div>
            {/each}
          </div>
        {:else}
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-base-content/60 border-b border-base-200">
                  <th class="py-3 px-2 w-12">Pos</th>
                  <th class="py-3 px-2">Constructor</th>
                  <th class="py-3 px-2 text-right">Pts</th>
                  <th class="py-3 px-2 text-right hidden sm:table-cell">Wins</th>
                  <th class="py-3 px-2 text-right hidden md:table-cell">Gap</th>
                </tr>
              </thead>
              <tbody>
                {#each constructorStandings as standing (standing.constructor.id)}
                  <tr class="border-b border-base-200/50 hover:bg-base-200/30 transition-colors">
                    <td class="py-3 px-2">
                      <span class="font-medium">{standing.position}</span>
                    </td>
                    <td class="py-3 px-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">{getCountryFlag(standing.constructor.nationalityCode)}</span>
                        <span class="font-medium">{standing.constructor.name}</span>
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
        {/if}
      </div>
    {/if}
  {/if}
</div>
