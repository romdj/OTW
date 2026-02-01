<script lang="ts">
  import { authStore, isAuthenticated, currentUser, isLoading } from '../../stores/authStore';

  let menuOpen = false;

  function handleLogin() {
    authStore.login();
  }

  function handleLogout() {
    menuOpen = false;
    // For now, just clear local state without redirect (no backend yet)
    authStore.logout(false);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  // Get initials from name
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<svelte:window on:click={closeMenu} />

<div class="relative">
  {#if $isLoading}
    <!-- Loading state -->
    <div class="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
  {:else if $isAuthenticated && $currentUser}
    <!-- Authenticated: Show user menu -->
    <button
      class="flex items-center gap-2 rounded-full transition-colors hover:bg-base-content/5 p-1 pr-3"
      on:click|stopPropagation={toggleMenu}
      aria-label="User menu"
      aria-expanded={menuOpen}
    >
      <!-- Avatar -->
      {#if $currentUser.picture}
        <img
          src={$currentUser.picture}
          alt={$currentUser.name}
          class="w-8 h-8 rounded-full object-cover"
        />
      {:else}
        <div
          class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-medium"
        >
          {getInitials($currentUser.name)}
        </div>
      {/if}

      <!-- Name (hidden on mobile) -->
      <span class="hidden sm:inline text-sm font-medium text-base-content">
        {$currentUser.name.split(' ')[0]}
      </span>

      <!-- Dropdown arrow -->
      <svg
        class="w-4 h-4 text-base-content/60 transition-transform duration-200 {menuOpen ? 'rotate-180' : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    {#if menuOpen}
      <div
        class="absolute right-0 mt-2 w-56 bg-base-100 rounded-lg shadow-elevation-4 py-2 z-50"
        on:click|stopPropagation
        role="menu"
      >
        <!-- User info header -->
        <div class="px-4 py-3 border-b border-base-200">
          <p class="text-sm font-medium text-base-content">{$currentUser.name}</p>
          <p class="text-xs text-base-content/60 truncate">{$currentUser.email}</p>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <a
            href="/profile"
            class="flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-content/5 transition-colors"
            role="menuitem"
          >
            <svg class="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </a>

          <a
            href="/watchlist"
            class="flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-content/5 transition-colors"
            role="menuitem"
          >
            <svg class="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            My Watchlist
          </a>

          <a
            href="/settings"
            class="flex items-center gap-3 px-4 py-2 text-sm text-base-content hover:bg-base-content/5 transition-colors"
            role="menuitem"
          >
            <svg class="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>
        </div>

        <!-- Logout -->
        <div class="border-t border-base-200 pt-1">
          <button
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
            on:click={handleLogout}
            role="menuitem"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Unauthenticated: Show login button -->
    <button
      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-content
             text-sm font-medium transition-all duration-200
             hover:shadow-elevation-3 active:scale-98"
      on:click={handleLogin}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span class="hidden sm:inline">Sign in</span>
    </button>
  {/if}
</div>
