<script lang="ts">
  import type { PriorityFilters, PriorityTier } from '../../domain/prioritization';
  import { createEventDispatcher } from 'svelte';

  export let filters: PriorityFilters = {};

  const dispatch = createEventDispatcher<{
    change: { filters: PriorityFilters };
  }>();

  const sportOptions = [
    { value: 'ice-hockey', label: 'Hockey' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'american-football', label: 'Football' },
    { value: 'association-football', label: 'Soccer' },
  ];

  const tierOptions: { value: PriorityTier; label: string }[] = [
    { value: 'must_watch', label: 'Must Watch' },
    { value: 'worth_time', label: 'Worth Time' },
    { value: 'highlights', label: 'Highlights' },
  ];

  let selectedSports: string[] = filters.sports || [];
  let minTier: PriorityTier | undefined = filters.minTier;
  let followedOnly = filters.followedOnly || false;
  let selectedTags: string[] = filters.tags || [];

  function handleFilterChange() {
    const newFilters: PriorityFilters = {
      ...filters,
      sports: selectedSports.length > 0 ? selectedSports : undefined,
      minTier: minTier,
      followedOnly: followedOnly || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };
    dispatch('change', { filters: newFilters });
  }

  function toggleSport(sport: string) {
    if (selectedSports.includes(sport)) {
      selectedSports = selectedSports.filter(s => s !== sport);
    } else {
      selectedSports = [...selectedSports, sport];
    }
    handleFilterChange();
  }

  function clearFilters() {
    selectedSports = [];
    minTier = undefined;
    followedOnly = false;
    selectedTags = [];
    dispatch('change', { filters: {} });
  }

  $: hasActiveFilters =
    selectedSports.length > 0 || minTier || followedOnly || selectedTags.length > 0;
</script>

<div class="filter-bar">
  <div class="filter-section">
    <span class="filter-label">Sports:</span>
    <div class="filter-options">
      {#each sportOptions as sport}
        <button
          class="filter-chip"
          class:active={selectedSports.includes(sport.value)}
          on:click={() => toggleSport(sport.value)}
        >
          {sport.label}
        </button>
      {/each}
    </div>
  </div>

  <div class="filter-section">
    <span class="filter-label">Min Tier:</span>
    <select
      class="select select-bordered select-sm"
      bind:value={minTier}
      on:change={handleFilterChange}
    >
      <option value={undefined}>Any</option>
      {#each tierOptions as tier}
        <option value={tier.value}>{tier.label}</option>
      {/each}
    </select>
  </div>

  <div class="filter-section">
    <label class="cursor-pointer label">
      <span class="filter-label">My Teams Only:</span>
      <input
        type="checkbox"
        class="checkbox checkbox-sm"
        bind:checked={followedOnly}
        on:change={handleFilterChange}
      />
    </label>
  </div>

  {#if hasActiveFilters}
    <button class="btn btn-ghost btn-xs" on:click={clearFilters}>
      Clear All
    </button>
  {/if}
</div>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background-color: var(--fallback-b2, oklch(var(--b2)));
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .filter-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-label {
    font-size: 0.875rem;
    color: var(--fallback-bc, oklch(var(--bc) / 0.7));
    white-space: nowrap;
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .filter-chip {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border: 1px solid var(--fallback-b3, oklch(var(--b3)));
    border-radius: 9999px;
    background-color: transparent;
    color: var(--fallback-bc, oklch(var(--bc) / 0.7));
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    border-color: var(--fallback-p, oklch(var(--p)));
  }

  .filter-chip.active {
    background-color: var(--fallback-p, oklch(var(--p)));
    border-color: var(--fallback-p, oklch(var(--p)));
    color: var(--fallback-pc, oklch(var(--pc)));
  }

  .label {
    padding: 0;
    gap: 0.5rem;
  }

  @media (max-width: 640px) {
    .filter-bar {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
