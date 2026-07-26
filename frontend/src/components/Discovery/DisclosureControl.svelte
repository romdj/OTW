<script lang="ts">
  import type { DisclosureMode } from './planTypes';
  export let value: DisclosureMode;
  export let onSelect: (_mode: DisclosureMode) => void;
  const modes: Array<{ value: DisclosureMode; label: string; description: string }> = [
    { value: 'no-hints', label: 'No hints', description: 'Pre-event context only' },
    { value: 'guidance', label: 'Guidance', description: 'Opt in to quality hints' },
    { value: 'full-story', label: 'Full story', description: 'Results and analysis' }
  ];
</script>

<fieldset>
  <legend>What may we reveal?</legend>
  <div class="segments modes">
    {#each modes as mode (mode.value)}
      <label class:active={value === mode.value}>
        <input type="radio" name="disclosure" checked={value === mode.value} on:change={() => onSelect(mode.value)} />
        <span>{mode.label}<small>{mode.description}</small></span>
      </label>
    {/each}
  </div>
</fieldset>
