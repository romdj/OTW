<script lang="ts">
  import { onMount } from 'svelte';
  import { SportCard, SPORTS } from '../components/Sports';
  import { EventCard } from '../components/Discovery';
  import { prioritizationService } from '../business/services/prioritization';
  import type { PrioritizedEventList } from '../domain/prioritization';
  import { Sparkles, ShieldCheck, Layers, ArrowRight } from 'lucide-svelte';

  const available = SPORTS.filter((s) => s.available);
  const coming = SPORTS.filter((s) => !s.available);

  let events: PrioritizedEventList | null = null;
  let loading = true;
  let error = false;

  onMount(async () => {
    try {
      events = await prioritizationService.getPrioritizedEvents({
        userId: 'anonymous',
      });
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  });

  $: mustWatch = events?.tiers.mustWatch.slice(0, 3) ?? [];
  $: worthTime = events?.tiers.worthTime.slice(0, 3) ?? [];
  $: hasEvents = mustWatch.length > 0 || worthTime.length > 0;
  $: tierSummary = (() => {
    const parts: string[] = [];
    if (mustWatch.length > 0) parts.push(`${events?.tiers.mustWatch.length} must-watch`);
    if (worthTime.length > 0) parts.push(`${events?.tiers.worthTime.length} worth your time`);
    return parts.join(', ');
  })();
</script>

<svelte:head>
  <title>OTW.sport - Find Something Worth Watching</title>
  <meta name="description" content="The IMDb of Sporting Events. Discover games with the most drama, tension, and excitement across tennis, Formula 1, cycling, and more." />
</svelte:head>

<div class="space-y-16">
  <!-- Hero -->
  <section class="text-center max-w-2xl mx-auto pt-8 sm:pt-12">
    <h1 class="text-display-sm sm:text-display text-base-content mb-4">
      Find something worth watching
    </h1>
    <p class="text-headline text-base-content/60 mb-8">
      We cut through the noise to surface the games with real drama, tension, and excitement — so you never waste time on a dull match again.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="/discover" class="btn btn-primary px-6">
        Explore This Week
      </a>
      <a href="/how-it-works" class="btn btn-ghost px-6 text-base-content/70">
        How It Works
      </a>
    </div>
  </section>

  <!-- This Week -->
  {#if loading}
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-section uppercase tracking-wide text-base-content/40">This Week</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each Array(3) as _, i (i)}
          <div class="animate-pulse rounded-xl border border-base-200 p-4 space-y-3">
            <div class="flex justify-between">
              <div class="space-y-2 flex-1">
                <div class="h-4 bg-base-300 rounded w-3/4"></div>
                <div class="h-3 bg-base-200 rounded w-1/2"></div>
              </div>
              <div class="h-10 w-10 bg-base-300 rounded-full"></div>
            </div>
            <div class="h-3 bg-base-200 rounded w-full"></div>
            <div class="flex gap-2">
              <div class="h-5 bg-base-200 rounded-full w-16"></div>
              <div class="h-5 bg-base-200 rounded-full w-20"></div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {:else if hasEvents && !error}
    <section>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-section uppercase tracking-wide text-base-content/40 mb-1">This Week</h2>
          {#if tierSummary}
            <p class="text-sm text-base-content/60">{tierSummary}</p>
          {/if}
        </div>
        <a href="/discover" class="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
          See all <ArrowRight size={14} />
        </a>
      </div>

      {#if mustWatch.length > 0}
        <div class="mb-6">
          <h3 class="text-xs font-medium text-tier-must uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-tier-must"></span>
            Don't Miss
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each mustWatch as event (event.eventId)}
              <EventCard {event} compact />
            {/each}
          </div>
        </div>
      {/if}

      {#if worthTime.length > 0}
        <div>
          <h3 class="text-xs font-medium text-tier-worth uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-tier-worth"></span>
            Worth Your Time
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each worthTime as event (event.eventId)}
              <EventCard {event} compact />
            {/each}
          </div>
        </div>
      {/if}
    </section>
  {/if}

  <!-- Browse by Sport -->
  <section>
    <h2 class="text-section uppercase tracking-wide text-base-content/40 mb-4">
      Browse by Sport
    </h2>
    {#if available.length > 0}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {#each available as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    {/if}

    {#if coming.length > 0}
      <h3 class="text-xs font-medium text-base-content/30 uppercase tracking-wide mb-3">Coming Soon</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each coming as sport (sport.id)}
          <SportCard {sport} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- Value Proposition -->
  <section class="pb-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="text-center sm:text-left p-6 rounded-xl bg-base-200/30">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
          <Sparkles size={20} />
        </div>
        <h3 class="font-medium text-base-content mb-1">Curated, not random</h3>
        <p class="text-sm text-base-content/60">
          Our engine scores events on drama, stakes, and volatility — not just popularity.
        </p>
      </div>

      <div class="text-center sm:text-left p-6 rounded-xl bg-base-200/30">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
          <ShieldCheck size={20} />
        </div>
        <h3 class="font-medium text-base-content mb-1">Spoiler-free by default</h3>
        <p class="text-sm text-base-content/60">
          Every recommendation is safe to read. Reveal results only when you're ready.
        </p>
      </div>

      <div class="text-center sm:text-left p-6 rounded-xl bg-base-200/30">
        <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
          <Layers size={20} />
        </div>
        <h3 class="font-medium text-base-content mb-1">Every sport, one place</h3>
        <p class="text-sm text-base-content/60">
          Tennis, F1, cycling, hockey — find the best events across all the sports you follow.
        </p>
      </div>
    </div>
  </section>
</div>
