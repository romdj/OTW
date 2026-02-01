<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { findRoute, getNavItems } from '../../../config/sitemap';
  import { SPORTS } from '../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);
  $: sitemapRoute = findRoute(`/sports/${sportId}`);
  $: childRoutes = getNavItems(`/sports/${sportId}`);

  $: isImplemented = sportConfig?.available ?? false;
</script>

<svelte:head>
  <title>{sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

<div class="flex flex-col items-center space-y-8" in:fade={{ duration: 300 }}>
  {#if sportConfig}
    <!-- Sport Header -->
    <div class="text-center max-w-2xl">
      <div class="text-6xl mb-4">{sportConfig.icon}</div>
      <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-2">
        {sportConfig.name}
      </h1>
      <p class="text-base-content/70 text-lg">
        {sportConfig.tagline}
      </p>
    </div>

    {#if isImplemented}
      <!-- Navigation Cards for Implemented Sports -->
      {#if childRoutes.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {#each childRoutes as route (route.path)}
            <a
              href={route.path}
              class="card bg-base-200 hover:bg-base-300 transition-all duration-200
                     {route.implemented ? 'hover:scale-105 hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}"
              class:pointer-events-none={!route.implemented}
            >
              <div class="card-body items-center text-center p-6">
                <span class="text-3xl mb-2">{route.icon}</span>
                <h3 class="card-title text-lg">{route.title}</h3>
                <p class="text-sm text-base-content/60">{route.description}</p>
                {#if !route.implemented}
                  <span class="badge badge-ghost badge-sm mt-2">Coming Soon</span>
                {/if}
              </div>
            </a>
          {/each}
        </div>
      {/if}

      <!-- Watchability Preview -->
      <div class="w-full max-w-4xl bg-base-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-base-content mb-4">
          What Makes {sportConfig.name} Worth Watching
        </h3>
        <div class="flex flex-wrap gap-2">
          {#each sportConfig.watchabilityHints as hint}
            <span class="badge badge-primary badge-outline">{hint}</span>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Coming Soon State -->
      <div class="text-center bg-base-200 rounded-lg p-8 max-w-lg">
        <div class="text-4xl mb-4">🚧</div>
        <h2 class="text-xl font-semibold mb-2">Coming Soon</h2>
        <p class="text-base-content/60 mb-4">
          We're working on bringing {sportConfig.name} to OTW.sport.
          Check back soon for watchability scores and unmissable moments.
        </p>
        <a href="/sports" class="btn btn-primary btn-sm">
          Back to Sports
        </a>
      </div>

      <!-- Preview of What's Coming -->
      <div class="w-full max-w-4xl">
        <h3 class="text-lg font-semibold text-base-content/60 mb-4">
          What to Expect
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-base-200/50 rounded-lg p-4 text-center">
            <span class="text-2xl">📊</span>
            <p class="text-sm text-base-content/50 mt-2">Live Standings & Rankings</p>
          </div>
          <div class="bg-base-200/50 rounded-lg p-4 text-center">
            <span class="text-2xl">🎯</span>
            <p class="text-sm text-base-content/50 mt-2">Watchability Scores</p>
          </div>
          <div class="bg-base-200/50 rounded-lg p-4 text-center">
            <span class="text-2xl">⭐</span>
            <p class="text-sm text-base-content/50 mt-2">Personal Watchlists</p>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Sport Not Found -->
    <div class="text-center">
      <div class="text-6xl mb-4">❓</div>
      <h1 class="text-2xl font-bold mb-2">Sport Not Found</h1>
      <p class="text-base-content/60 mb-4">
        We couldn't find the sport you're looking for.
      </p>
      <a href="/sports" class="btn btn-primary">
        Browse All Sports
      </a>
    </div>
  {/if}
</div>
