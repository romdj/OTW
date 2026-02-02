<script lang="ts">
  import { authStore, isAuthenticated, currentUser, isLoading } from '../../stores/authStore';

  let menuOpen = false;

  function handleLogin() {
    authStore.login();
  }

  function handleLogout() {
    menuOpen = false;
    authStore.logout(false);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function getInitials(name: string): string {
    return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  }
</script>

<svelte:window on:click={closeMenu} />

<div class="relative">
  {#if $isLoading}
    <div class="w-8 h-8 rounded-full bg-base-200 animate-pulse" />
  {:else if $isAuthenticated && $currentUser}
    <!-- User Button -->
    <button
      class="flex items-center gap-2 p-1 rounded-lg hover:bg-base-200/50 transition-colors"
      on:click|stopPropagation={toggleMenu}
    >
      {#if $currentUser.picture}
        <img src={$currentUser.picture} alt="" class="w-7 h-7 rounded-full" />
      {:else}
        <div class="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
          {getInitials($currentUser.name)}
        </div>
      {/if}
    </button>

    <!-- Dropdown -->
    {#if menuOpen}
      <div
        class="absolute right-0 mt-2 w-48 bg-base-100 border border-base-200 rounded-lg py-1 z-50"
        on:click|stopPropagation
      >
        <div class="px-3 py-2 border-b border-base-200">
          <p class="text-sm font-medium text-base-content truncate">{$currentUser.name}</p>
          <p class="text-xs text-base-content/50 truncate">{$currentUser.email}</p>
        </div>

        <a href="/profile" class="block px-3 py-2 text-sm text-base-content hover:bg-base-200/50">
          Profile
        </a>
        <a href="/settings" class="block px-3 py-2 text-sm text-base-content hover:bg-base-200/50">
          Settings
        </a>

        <div class="border-t border-base-200 mt-1 pt-1">
          <button
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            on:click={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Login Button -->
    <button
      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
      on:click={handleLogin}
    >
      Sign in
    </button>
  {/if}
</div>
