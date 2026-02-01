<script lang="ts">
  import type { EmotionalProfile } from '../../domain/prioritization';

  export let profile: EmotionalProfile;
  export let showLabels = true;
  export let compact = false;

  const factors = [
    { key: 'suspense', label: 'Suspense', icon: '😰', color: 'bg-warning' },
    { key: 'stakes', label: 'Stakes', icon: '🏆', color: 'bg-error' },
    { key: 'volatility', label: 'Drama', icon: '🎭', color: 'bg-secondary' },
    { key: 'underdog', label: 'Underdog', icon: '💪', color: 'bg-accent' },
    { key: 'transcendence', label: 'Historic', icon: '⭐', color: 'bg-primary' },
  ] as const;

  function getBarWidth(value: number): string {
    return `${Math.min(100, Math.max(0, value))}%`;
  }

  function getIntensity(value: number): string {
    if (value >= 80) return 'Extreme';
    if (value >= 60) return 'High';
    if (value >= 40) return 'Moderate';
    return 'Low';
  }
</script>

<div class="emotional-profile" class:compact>
  {#each factors as factor}
    <div class="factor-row">
      {#if showLabels}
        <div class="factor-label">
          <span class="icon">{factor.icon}</span>
          <span class="text">{factor.label}</span>
        </div>
      {:else}
        <span class="icon-only" title={factor.label}>{factor.icon}</span>
      {/if}

      <div class="bar-container">
        <div
          class="bar {factor.color}"
          style="width: {getBarWidth(profile[factor.key])}"
        ></div>
      </div>

      {#if showLabels && !compact}
        <span class="value">{profile[factor.key]}%</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .emotional-profile {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .emotional-profile.compact {
    gap: 0.25rem;
  }

  .factor-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .factor-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 100px;
    font-size: 0.875rem;
  }

  .icon {
    font-size: 1rem;
  }

  .icon-only {
    font-size: 0.875rem;
    cursor: help;
  }

  .text {
    color: var(--fallback-bc, oklch(var(--bc) / 0.7));
  }

  .bar-container {
    flex: 1;
    height: 8px;
    background-color: var(--fallback-b3, oklch(var(--b3)));
    border-radius: 4px;
    overflow: hidden;
  }

  .compact .bar-container {
    height: 6px;
  }

  .bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .value {
    min-width: 3rem;
    text-align: right;
    font-size: 0.75rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  }
</style>
