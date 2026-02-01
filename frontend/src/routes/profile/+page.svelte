<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import { authStore, isAuthenticated, currentUser } from '../../stores/authStore';

  // Redirect if not authenticated
  $: if (!$isAuthenticated && typeof window !== 'undefined') {
    goto('/sports');
  }

  function handleLogout() {
    authStore.logout(false);
    goto('/sports');
  }
</script>

<svelte:head>
  <title>My Profile | OTW.sport</title>
</svelte:head>

{#if $isAuthenticated && $currentUser}
  <div class="max-w-2xl mx-auto" in:fade={{ duration: 300 }}>
    <!-- Profile Header -->
    <div class="bg-base-100 rounded-lg shadow-elevation-2 p-6 mb-6">
      <div class="flex items-center gap-6">
        <!-- Avatar -->
        {#if $currentUser.picture}
          <img
            src={$currentUser.picture}
            alt={$currentUser.name}
            class="w-20 h-20 rounded-full object-cover"
          />
        {:else}
          <div
            class="w-20 h-20 rounded-full bg-primary text-primary-content
                   flex items-center justify-center text-2xl font-medium"
          >
            {$currentUser.name
              .split(' ')
              .map((p) => p[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
        {/if}

        <!-- User Info -->
        <div class="flex-1">
          <h1 class="text-2xl font-medium text-base-content mb-1">
            {$currentUser.name}
          </h1>
          <p class="text-base-content/60">{$currentUser.email}</p>
          {#if $currentUser.emailVerified}
            <span class="inline-flex items-center gap-1 mt-2 text-xs text-success">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              Email verified
            </span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-4 text-center">
        <p class="text-2xl font-medium text-base-content">0</p>
        <p class="text-sm text-base-content/60">Watchlist</p>
      </div>
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-4 text-center">
        <p class="text-2xl font-medium text-base-content">0</p>
        <p class="text-sm text-base-content/60">Watched</p>
      </div>
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-4 text-center">
        <p class="text-2xl font-medium text-base-content">0</p>
        <p class="text-sm text-base-content/60">Reviews</p>
      </div>
    </div>

    <!-- Sections -->
    <div class="space-y-4">
      <!-- Favorite Sports -->
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-6">
        <h2 class="text-lg font-medium text-base-content mb-4">Favorite Sports</h2>
        <p class="text-base-content/60 text-sm">
          No favorite sports selected yet. Browse sports to add your favorites.
        </p>
        <a
          href="/sports"
          class="inline-block mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium
                 hover:bg-primary/20 transition-colors"
        >
          Browse Sports
        </a>
      </div>

      <!-- Preferences -->
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-6">
        <h2 class="text-lg font-medium text-base-content mb-4">Preferences</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base-content">Spoiler-free mode</p>
              <p class="text-sm text-base-content/60">Hide scores until you're ready</p>
            </div>
            <input type="checkbox" class="toggle toggle-primary" disabled />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-base-content">Email notifications</p>
              <p class="text-sm text-base-content/60">Get alerts for watchlist games</p>
            </div>
            <input type="checkbox" class="toggle toggle-primary" disabled />
          </div>
        </div>
        <p class="text-xs text-base-content/40 mt-4">
          Preferences coming soon
        </p>
      </div>

      <!-- Account Actions -->
      <div class="bg-base-100 rounded-lg shadow-elevation-1 p-6">
        <h2 class="text-lg font-medium text-base-content mb-4">Account</h2>
        <div class="space-y-3">
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 transition-colors
                   flex items-center justify-between text-base-content"
            disabled
          >
            <span>Change password</span>
            <span class="text-xs text-base-content/40">Coming soon</span>
          </button>
          <button
            class="w-full text-left px-4 py-3 rounded-lg hover:bg-error/10 transition-colors
                   flex items-center justify-between text-error"
            on:click={handleLogout}
          >
            <span>Sign out</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="text-center py-12">
    <p class="text-base-content/60">Redirecting...</p>
  </div>
{/if}
