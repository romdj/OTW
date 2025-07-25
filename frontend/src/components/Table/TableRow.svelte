<script lang="ts">
  import type { Standing, StandingTableColumn } from '../../domain/standing';
  import PlayoffStatusIndicator from './PlayoffStatusIndicator.svelte';
  import PositionChangeIndicator from './PositionChangeIndicator.svelte';

  export let standing: Standing;
  export let index: number;
  export let columns: StandingTableColumn[];
  export let playoffStatus: 'division-leader' | 'wildcard' | 'race' | 'non-playoff' = 'non-playoff';
  export let previousStandings: Record<string, number> = {};
  export let allStandings: Standing[] = []; // For percentile calculations

  // Get team row background color based on status
  function getRowBackground(status: string): string {
    switch (status) {
      case 'division-leader': return 'bg-primary/10 hover:bg-primary/20';
      case 'wildcard': return 'bg-success/10 hover:bg-success/20';
      case 'race': return 'bg-warning/10 hover:bg-warning/20';
      default: return 'hover:bg-base-200';
    }
  }

  // Get text color based on status
  function getTextColor(status: string, isTeamName: boolean): string {
    if (!isTeamName) return 'text-base-content';
    
    switch (status) {
      case 'division-leader': return 'text-primary font-semibold';
      case 'wildcard': return 'text-success font-semibold';
      case 'race': return 'text-warning font-semibold';
      default: return 'text-base-content';
    }
  }

  // Get value for column
  function getColumnValue(standing: Standing, key: keyof Standing): string | number | null {
    return standing[key] as string | number | null;
  }

  // Format powerplay values for display
  function formatPowerplayValue(key: string, value: string | number | null): string {
    if (value === null || value === undefined) return 'N/A';
    
    switch (key) {
      case 'minutesPerPowerplayGoal':
        return typeof value === 'number' ? value.toFixed(1) : 'N/A';
      case 'powerplayPercentage':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
      default:
        return String(value);
    }
  }

  // Calculate percentile for a value within a dataset
  function calculatePercentile(value: number, values: number[]): number {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = sortedValues.findIndex(v => v >= value);
    return index === -1 ? 100 : (index / sortedValues.length) * 100;
  }

  // Get efficiency color for powerplay stats based on percentiles
  function getPowerplayEfficiencyColor(key: string, value: string | number | null): string {
    if (value === null || value === undefined || typeof value !== 'number') {
      return 'text-gray-400';
    }
    
    switch (key) {
      case 'minutesPerPowerplayGoal': {
        // Get valid values for percentile calculation
        const validValues = allStandings
          .map(s => s.minutesPerPowerplayGoal)
          .filter((v): v is number => v !== null && v !== undefined);
        
        if (validValues.length === 0) return 'text-base-content';
        
        const percentile = calculatePercentile(value, validValues);
        // For min/PPG: lower is better, so green for bottom 25%, red for top 25%
        if (percentile <= 25) return 'text-green-600'; // Top performers (efficient)
        if (percentile >= 75) return 'text-red-600';   // Bottom performers (inefficient)
        return 'text-base-content';
      }
      case 'powerplayPercentage': {
        // Get valid values for percentile calculation
        const validValues = allStandings
          .map(s => s.powerplayPercentage)
          .filter((v): v is number => v !== null && v !== undefined);
        
        if (validValues.length === 0) return 'text-base-content';
        
        const percentile = calculatePercentile(value, validValues);
        // For PP%: higher is better, so green for top 25%, red for bottom 25%
        if (percentile >= 75) return 'text-green-600'; // Top performers (high PP%)
        if (percentile <= 25) return 'text-red-600';   // Bottom performers (low PP%)
        return 'text-base-content';
      }
      default:
        return 'text-base-content';
    }
  }
</script>

<tr class="transition-all duration-150 {getRowBackground(playoffStatus)}">
  <td class="px-3 py-3 text-sm font-medium text-base-content">
    <div class="flex items-center space-x-2">
      <span class="mr-1">{Number(index) + 1}</span>
      <PositionChangeIndicator 
        teamName={standing.teamName} 
        currentPosition={Number(index)} 
        {previousStandings} 
      />
      <PlayoffStatusIndicator status={playoffStatus} />
    </div>
  </td>
  {#each columns as column}
    <td class="text-sm {column.key === 'teamName' ? 'font-medium' : 'text-center'} {getTextColor(playoffStatus, column.key === 'teamName')}">
      {#if column.key === 'teamName'}
        <div class="flex items-center gap-3">
          {#if standing.teamLogo}
            <img 
              src={standing.teamLogo} 
              alt="{standing.teamName} logo"
              class="w-6 h-6"
              loading="lazy"
            />
          {/if}
          <span>{standing[column.key]}</span>
        </div>
      {:else if column.key === 'minutesPerPowerplayGoal' || column.key === 'powerplayPercentage'}
        {@const value = getColumnValue(standing, column.key)}
        <span 
          class="font-medium {getPowerplayEfficiencyColor(column.key, value)}"
          title={column.tooltip || ''}
        >
          {formatPowerplayValue(column.key, value)}
        </span>
      {:else}
        {getColumnValue(standing, column.key)}
      {/if}
    </td>
  {/each}
</tr>

<style>
  /* Subtle hover effect for table rows */
  tr:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  /* Smooth transitions */
  tr, td {
    transition: all 0.2s ease;
  }
</style>