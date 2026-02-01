<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { themeStore } from '../stores/themeStore';
  import { authStore } from '../stores/authStore';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import { UserMenu } from '../components/Auth';
  import '../app.css';

  onMount(() => {
    themeStore.initializeTheme();
    authStore.initialize();
  });

  // Navigation items
  const navItems = [
    { href: '/sports', label: 'Sports', icon: '🏆' },
    { href: '/sports/ice-hockey/events', label: 'NHL Games', icon: '🏒' },
    { href: '/how-it-works', label: 'How It Works', icon: '❓' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  $: currentPath = $page.url.pathname;

  function isActive(href: string): boolean {
    return currentPath === href || currentPath.startsWith(href + '/');
  }
</script>

<div class="min-h-screen bg-base-100 flex flex-col">
  <!-- App Bar -->
  <header class="sticky top-0 z-50 bg-base-100">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo / Brand -->
      <a
        href="/sports"
        class="flex items-center gap-2 text-xl font-medium text-primary hover:opacity-80 transition-opacity"
      >
        <span class="text-2xl">🏆</span>
        <span class="hidden sm:inline">OTW.sport</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                   {isActive(item.href)
                     ? 'bg-primary/10 text-primary'
                     : 'text-base-content/70 hover:bg-base-content/5 hover:text-base-content'}"
          >
            {item.label}
          </a>
        {/each}
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />

        <!-- Mobile Menu Button -->
        <div class="dropdown dropdown-end md:hidden">
          <label tabindex="0" class="btn btn-ghost btn-sm px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-lg w-52 p-2 mt-2"
          >
            {#each navItems as item}
              <li>
                <a
                  href={item.href}
                  class="flex items-center gap-3 {isActive(item.href) ? 'active' : ''}"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="flex-1 container mx-auto px-4 py-6">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-base-200/50 border-t border-base-300/50">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">🏆</span>
            <span class="font-semibold text-lg">OTW.sport</span>
          </div>
          <p class="text-sm text-base-content/60 leading-relaxed">
            The IMDb of sporting events. Find drama, tension, and passion - not just statistics.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="font-medium text-sm text-base-content/40 uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <ul class="space-y-2">
            {#each navItems as item}
              <li>
                <a
                  href={item.href}
                  class="text-sm text-base-content/70 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Built With -->
        <div>
          <h3 class="font-medium text-sm text-base-content/40 uppercase tracking-wider mb-3">
            Built With
          </h3>
          <div class="flex flex-wrap gap-2">
            <a
              href="https://svelte.dev"
              class="text-xs px-3 py-1 rounded-full bg-base-300/50 text-base-content/60 hover:text-primary transition-colors"
            >
              Svelte
            </a>
            <a
              href="https://graphql.org"
              class="text-xs px-3 py-1 rounded-full bg-base-300/50 text-base-content/60 hover:text-primary transition-colors"
            >
              GraphQL
            </a>
            <a
              href="https://tailwindcss.com"
              class="text-xs px-3 py-1 rounded-full bg-base-300/50 text-base-content/60 hover:text-primary transition-colors"
            >
              Tailwind
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-base-300/30 text-center">
        <p class="text-xs text-base-content/40">
          Finding unmissable moments in sports
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  .container {
    max-width: 1200px;
  }
</style>
