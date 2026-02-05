<script lang="ts">
  import { SportCard, SPORTS } from '../components/Sports';

  const available = SPORTS.filter((s) => s.available);
  const coming = SPORTS.filter((s) => !s.available);
</script>

<svelte:head>
  <title>OTW.sport - Find Something Worth Watching</title>
  <meta name="description" content="The IMDb of Sporting Events. Discover games with the most drama, tension, and excitement across tennis, Formula 1, cycling, and more." />
</svelte:head>

<div class="space-y-12">
  <!-- Header -->
  <div class="text-center max-w-lg mx-auto">
    <h1 class="text-2xl font-medium text-base-content mb-2">
      Find something worth watching
    </h1>
    <p class="text-base-content/60">
      We help you discover the games with the most drama, tension, and excitement.
    </p>
  </div>

  <!-- Available -->
  {#if available.length > 0}
    <section>
      <h2 class="text-sm font-medium text-base-content/40 uppercase tracking-wide mb-4">
        Available
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each available as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Coming Soon -->
  {#if coming.length > 0}
    <section>
      <h2 class="text-sm font-medium text-base-content/40 uppercase tracking-wide mb-4">
        Coming Soon
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each coming as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    </section>
  {/if}
</div>
