<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { themeStore } from '../stores/themeStore';
  import { authStore } from '../stores/authStore';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import { UserMenu } from '../components/Auth';
  import { Trophy, Menu, X } from 'lucide-svelte';
  import '../app.css';

  let mobileMenuOpen = false;

  onMount(() => {
    themeStore.initializeTheme();
    authStore.initialize();
  });

  const navItems = [
    { href: '/discover', label: 'Discover' },
    { href: '/sports', label: 'Sports' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  $: currentPath = $page.url.pathname;

  function isActive(href: string): boolean {
    return currentPath === href || currentPath.startsWith(href + '/');
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<div class="min-h-screen bg-base-100 flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-200/60">
    <nav class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2 text-base-content hover:text-primary" on:click={closeMobileMenu}>
        <Trophy size={20} strokeWidth={2} />
        <span class="font-semibold tracking-tight">OTW</span>
      </a>

      <!-- Desktop Nav Links -->
      <div class="hidden sm:flex items-center gap-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-3 py-1.5 rounded-lg text-sm
                   {isActive(item.href)
                     ? 'text-primary bg-primary/5'
                     : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50'}"
          >
            {item.label}
          </a>
        {/each}
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
        <!-- Mobile menu toggle -->
        <button
          class="sm:hidden p-1.5 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200/50"
          on:click={() => mobileMenuOpen = !mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {#if mobileMenuOpen}
            <X size={20} />
          {:else}
            <Menu size={20} />
          {/if}
        </button>
      </div>
    </nav>

    <!-- Mobile Nav -->
    {#if mobileMenuOpen}
      <div class="sm:hidden border-t border-base-200/60 bg-base-100">
        <div class="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="px-3 py-2 rounded-lg text-sm
                     {isActive(item.href)
                       ? 'text-primary bg-primary/5'
                       : 'text-base-content/70 hover:text-base-content hover:bg-base-200/50'}"
              on:click={closeMobileMenu}
            >
              {item.label}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </header>

  <!-- Main -->
  <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="border-t border-base-200/60 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/50">
        <a href="/" class="flex items-center gap-1.5 hover:text-base-content">
          <Trophy size={14} strokeWidth={2} />
          <span>OTW.sport</span>
        </a>
        <div class="flex items-center gap-4">
          <a href="/about" class="hover:text-base-content">About</a>
          <a href="/how-it-works" class="hover:text-base-content">How It Works</a>
        </div>
      </div>
    </div>
  </footer>
</div>
