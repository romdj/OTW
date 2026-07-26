<script lang="ts">
  import PlanPrototype from '../../components/Discovery/PlanPrototype.svelte';
</script>

<svelte:head>
  <title>Your sports edit | OTW</title>
  <meta name="description" content="A personal, spoiler-aware plan for sporting events worth your time." />
</svelte:head>

<div class="discover-page">
  <PlanPrototype />
</div>

<style>
  .discover-page {
    min-height: 100vh;
    background-color: var(--fallback-b1, oklch(var(--b1)));
  }
</style>
