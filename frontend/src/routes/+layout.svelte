<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { themeStore } from '../stores/themeStore';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import '../app.css';

  onMount(() => {
    themeStore.initializeTheme();
  });

  // Navigation items
  const navItems = [
    { href: '/sports', label: 'Sports', icon: '🏆' },
    { href: '/sports/ice-hockey/standings', label: 'NHL Standings', icon: '🏒' },
    { href: '/how-it-works', label: 'How It Works', icon: '❓' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
  ];

  $: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen bg-base-100 flex flex-col">
  <!-- Header -->
  <header class="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50">
    <div class="container mx-auto">
      <!-- Mobile: Dropdown menu -->
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {#each navItems as item}
              <li>
                <a
                  href={item.href}
                  class:active={currentPath === item.href || currentPath.startsWith(item.href + '/')}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
        <a href="/sports" class="btn btn-ghost normal-case text-xl text-primary font-bold">
          🏆 OTW.sport
        </a>
      </div>

      <!-- Desktop: Horizontal menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-1">
          {#each navItems as item}
            <li>
              <a
                href={item.href}
                class="text-sm {currentPath === item.href || currentPath.startsWith(item.href + '/') ? 'active' : ''}"
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right side: Theme toggle -->
      <div class="navbar-end">
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="container mx-auto px-4 py-6 flex-1">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-6 bg-base-200 text-base-content">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <!-- Brand -->
      <div class="text-center md:text-left">
        <span class="font-bold text-lg">OTW.sport</span>
        <p class="text-sm text-base-content/60">The IMDb of Sporting Events</p>
      </div>

      <!-- Quick Links -->
      <div class="text-center">
        <span class="font-semibold text-sm">Quick Links</span>
        <div class="flex flex-wrap justify-center gap-2 mt-2">
          <a href="/sports" class="link link-hover text-sm">Sports</a>
          <a href="/how-it-works" class="link link-hover text-sm">How It Works</a>
          <a href="/about" class="link link-hover text-sm">About</a>
        </div>
      </div>

      <!-- Built With -->
      <div class="text-center md:text-right">
        <span class="font-semibold text-sm">Built With</span>
        <div class="flex flex-wrap justify-center md:justify-end gap-2 mt-2">
          <a href="https://svelte.dev" class="link link-hover text-sm">Svelte</a>
          <a href="https://daisyui.com" class="link link-hover text-sm">DaisyUI</a>
          <a href="https://graphql.org" class="link link-hover text-sm">GraphQL</a>
        </div>
      </div>
    </div>

    <div class="text-sm text-base-content/50 mt-4">
      Finding unmissable moments in sports since 2024
    </div>
  </footer>
</div>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .container {
    max-width: 1200px;
  }
</style>