<script lang="ts">
  import { page } from '$app/stores';
  import { SPORTS } from '../../../components/Sports';
  import { findRoute, getNavItems } from '../../../config/sitemap';

  $: sportId = $page.params.sport;
  $: sport = SPORTS.find((s) => s.id === sportId);
  $: routes = getNavItems(`/sports/${sportId}`);
</script>

<svelte:head>
  <title>{sport?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="space-y-8">
  {#if sport}
    <!-- Header -->
    <div class="text-center">
      <div class="text-5xl mb-4">{sport.icon}</div>
      <h1 class="text-2xl font-medium text-base-content mb-1">{sport.name}</h1>
      <p class="text-base-content/60">{sport.tagline}</p>
    </div>

    {#if sport.available}
      <!-- Navigation Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
        {#each routes as route (route.path)}
          <a
            href={route.path}
            class="p-4 rounded-xl border border-base-200 hover:border-base-300 transition-colors text-center"
          >
            <div class="text-2xl mb-2">{route.icon}</div>
            <div class="font-medium text-base-content">{route.title}</div>
          </a>
        {/each}
      </div>
    {:else}
      <!-- Coming Soon -->
      <div class="text-center border border-base-200 rounded-xl p-8 max-w-md mx-auto">
        <p class="text-base-content/60 mb-4">
          We're working on bringing {sport.name} to OTW.sport.
        </p>
        <a href="/sports" class="text-primary hover:underline">
          ← Back to sports
        </a>
      </div>
    {/if}
  {:else}
    <!-- Not Found -->
    <div class="text-center py-12">
      <p class="text-base-content/60 mb-4">Sport not found</p>
      <a href="/sports" class="text-primary hover:underline">
        ← Back to sports
      </a>
    </div>
  {/if}
</div>
