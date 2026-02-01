<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<svelte:head>
  <title>How It Works | OTW.sport</title>
  <meta
    name="description"
    content="Learn how OTW.sport calculates watchability scores and recommends unmissable sporting events"
  />
</svelte:head>

<div class="flex flex-col items-center space-y-8 max-w-3xl mx-auto" in:fade={{ duration: 300 }}>
  <!-- Hero -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-base-content mb-4">
      How It Works
    </h1>
    <p class="text-xl text-base-content/70">
      Understanding watchability scores and recommendations
    </p>
  </div>

  <!-- The Problem -->
  <div class="bg-base-200 rounded-lg p-6 w-full">
    <h2 class="text-2xl font-semibold mb-4">The Problem</h2>
    <p class="text-base-content/80 leading-relaxed">
      With hundreds of games happening every week across different sports,
      how do you know which ones are worth watching? Traditional stats tell
      you who's likely to win, but they don't tell you if the game will be
      <em>exciting</em>.
    </p>
  </div>

  <!-- Watchability Score -->
  <div class="w-full">
    <h2 class="text-2xl font-semibold mb-4">Watchability Scores</h2>
    <p class="text-base-content/80 mb-4">
      Our watchability score considers multiple factors that contribute to
      an exciting game:
    </p>

    <div class="space-y-3">
      <div class="bg-base-200 rounded-lg p-4 flex items-start gap-4">
        <div class="text-2xl">⚔️</div>
        <div>
          <h3 class="font-semibold">Rivalry Intensity</h3>
          <p class="text-sm text-base-content/70">
            Historic rivalries bring extra passion and stakes. Games between
            longtime rivals tend to deliver more drama.
          </p>
        </div>
      </div>

      <div class="bg-base-200 rounded-lg p-4 flex items-start gap-4">
        <div class="text-2xl">🏆</div>
        <div>
          <h3 class="font-semibold">Stakes & Implications</h3>
          <p class="text-sm text-base-content/70">
            Playoff positioning, elimination scenarios, championship implications.
            Higher stakes mean more intensity.
          </p>
        </div>
      </div>

      <div class="bg-base-200 rounded-lg p-4 flex items-start gap-4">
        <div class="text-2xl">📊</div>
        <div>
          <h3 class="font-semibold">Competitive Balance</h3>
          <p class="text-sm text-base-content/70">
            Close matchups between evenly-matched teams tend to produce
            more exciting games than blowouts.
          </p>
        </div>
      </div>

      <div class="bg-base-200 rounded-lg p-4 flex items-start gap-4">
        <div class="text-2xl">📈</div>
        <div>
          <h3 class="font-semibold">Recent Form</h3>
          <p class="text-sm text-base-content/70">
            Teams on hot streaks or in crucial must-win situations often
            bring extra energy.
          </p>
        </div>
      </div>

      <div class="bg-base-200 rounded-lg p-4 flex items-start gap-4">
        <div class="text-2xl">⭐</div>
        <div>
          <h3 class="font-semibold">Star Power</h3>
          <p class="text-sm text-base-content/70">
            Matchups featuring top players or head-to-head battles between
            stars add extra appeal.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Sport-Specific Factors -->
  <div class="w-full">
    <h2 class="text-2xl font-semibold mb-4">Sport-Specific Factors</h2>
    <p class="text-base-content/80 mb-4">
      Each sport has unique elements that make games exciting:
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🏒</span>
          <h3 class="font-semibold">Ice Hockey</h3>
        </div>
        <ul class="text-sm text-base-content/70 space-y-1">
          <li>• Playoff race positioning</li>
          <li>• Overtime potential</li>
          <li>• Physical rivalry history</li>
          <li>• Goaltender matchups</li>
        </ul>
      </div>

      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🎾</span>
          <h3 class="font-semibold">Tennis</h3>
        </div>
        <ul class="text-sm text-base-content/70 space-y-1">
          <li>• Ranking proximity</li>
          <li>• Head-to-head history</li>
          <li>• Surface specialists</li>
          <li>• Tournament stage</li>
        </ul>
      </div>

      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">⚽</span>
          <h3 class="font-semibold">Football</h3>
        </div>
        <ul class="text-sm text-base-content/70 space-y-1">
          <li>• Derby significance</li>
          <li>• Title/relegation stakes</li>
          <li>• Cup competition rounds</li>
          <li>• Manager storylines</li>
        </ul>
      </div>

      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">🏀</span>
          <h3 class="font-semibold">Basketball</h3>
        </div>
        <ul class="text-sm text-base-content/70 space-y-1">
          <li>• Playoff seeding battles</li>
          <li>• Star player matchups</li>
          <li>• Revenge games</li>
          <li>• Clutch time potential</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Emotional Tags -->
  <div class="w-full">
    <h2 class="text-2xl font-semibold mb-4">Emotional Tags</h2>
    <p class="text-base-content/80 mb-4">
      Quick labels help you understand what kind of experience to expect:
    </p>
    <div class="flex flex-wrap gap-2">
      <span class="badge badge-primary">Nail-Biter</span>
      <span class="badge badge-secondary">Historic Moment</span>
      <span class="badge badge-accent">Explosive Finish</span>
      <span class="badge badge-info">Underdog Story</span>
      <span class="badge badge-success">Comeback Kings</span>
      <span class="badge badge-warning">Must-Win</span>
      <span class="badge badge-error">Rivalry Game</span>
      <span class="badge badge-ghost">Playoff Preview</span>
    </div>
  </div>

  <!-- CTA -->
  <div class="text-center pt-4">
    <a href="/sports" class="btn btn-primary">
      Find Unmissable Games
    </a>
  </div>
</div>
