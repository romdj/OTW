<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<svelte:head>
  <title>About | OTW.sport</title>
  <meta name="description" content="Learn about OTW.sport - The IMDb of Sporting Events" />
</svelte:head>

<div class="flex flex-col items-center space-y-8 max-w-3xl mx-auto" in:fade={{ duration: 300 }}>
  <!-- Hero -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-base-content mb-4">
      About OTW.sport
    </h1>
    <p class="text-xl text-base-content/70">
      The IMDb of Sporting Events
    </p>
  </div>

  <!-- Mission -->
  <div class="bg-base-200 rounded-lg p-6 w-full">
    <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
    <p class="text-base-content/80 leading-relaxed">
      We believe sports are more than statistics. They're about the moments that
      make you hold your breath, the comebacks that defy logic, and the rivalries
      that define generations. OTW.sport helps you find those <strong>unmissable moments</strong>.
    </p>
  </div>

  <!-- What We Do -->
  <div class="w-full">
    <h2 class="text-2xl font-semibold mb-4">What We Do</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">🎯</span>
          <h3 class="font-semibold">Watchability Scores</h3>
        </div>
        <p class="text-sm text-base-content/70">
          We analyze matchups for drama potential, not just win probabilities.
          Our algorithms consider rivalry history, playoff implications, and
          the intangibles that make games worth watching.
        </p>
      </div>
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">🔥</span>
          <h3 class="font-semibold">Emotional Tags</h3>
        </div>
        <p class="text-sm text-base-content/70">
          Quick descriptors like "nail-biter", "historic moment", or "explosive
          finish" help you know what kind of experience to expect.
        </p>
      </div>
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">📋</span>
          <h3 class="font-semibold">Curated Lists</h3>
        </div>
        <p class="text-sm text-base-content/70">
          Community-driven recommendations for what to watch. From "Greatest
          Game 7s" to "Best Underdog Stories", find exactly what you're looking for.
        </p>
      </div>
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">⭐</span>
          <h3 class="font-semibold">Personal Watchlists</h3>
        </div>
        <p class="text-sm text-base-content/70">
          Save games you want to watch, get reminders, and never miss an important
          matchup again.
        </p>
      </div>
    </div>
  </div>

  <!-- Current Status -->
  <div class="w-full">
    <h2 class="text-2xl font-semibold mb-4">Where We Are</h2>
    <div class="bg-base-200 rounded-lg p-6">
      <p class="text-base-content/80 mb-4">
        OTW.sport is currently in active development. We're starting with
        <strong>NHL Ice Hockey</strong>, showcasing how the IIHF 3-point system
        would change standings and playoff races.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="badge badge-success gap-2">
          <span class="w-2 h-2 bg-success-content rounded-full"></span>
          Ice Hockey - Live
        </span>
        <span class="badge badge-ghost">Tennis - Coming Soon</span>
        <span class="badge badge-ghost">Football - Coming Soon</span>
        <span class="badge badge-ghost">More Sports - Planned</span>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="text-center">
    <a href="/sports" class="btn btn-primary">
      Explore Sports
    </a>
  </div>
</div>
