<script lang="ts">
  import { WeekendRecap } from '../../components/Discovery';

  // In a real app, this would come from auth context
  const userId = 'demo-user';
</script>

<svelte:head>
  <title>Discover Events | OTW Sport</title>
  <meta name="description" content="Discover the most exciting sporting events personalized for you. Never miss a must-watch game again." />
</svelte:head>

<main class="discover-page">
  <WeekendRecap {userId} />
</main>

<style>
  .discover-page {
    min-height: 100vh;
    background-color: var(--fallback-b1, oklch(var(--b1)));
  }
</style>
