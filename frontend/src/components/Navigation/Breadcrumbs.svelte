<script lang="ts">
  import { page } from '$app/stores';
  import { getBreadcrumbs, findRoute } from '../../config/sitemap';

  $: currentPath = $page.url.pathname;
  $: breadcrumbs = getBreadcrumbs(currentPath);
  $: currentRoute = findRoute(currentPath);

  // Include home as first breadcrumb
  $: fullBreadcrumbs = [
    { path: '/', title: 'Home', icon: '🏠', implemented: true },
    ...breadcrumbs,
  ];
</script>

{#if breadcrumbs.length > 0}
  <nav aria-label="Breadcrumb" class="text-sm breadcrumbs py-2">
    <ul>
      {#each fullBreadcrumbs as crumb, index (crumb.path)}
        <li>
          {#if index === fullBreadcrumbs.length - 1}
            <!-- Current page - not a link -->
            <span class="text-base-content font-medium">
              {#if crumb.icon}
                <span class="mr-1">{crumb.icon}</span>
              {/if}
              {crumb.title}
            </span>
          {:else}
            <!-- Link to parent -->
            <a
              href={crumb.path}
              class="text-base-content/60 hover:text-primary transition-colors"
            >
              {#if crumb.icon}
                <span class="mr-1">{crumb.icon}</span>
              {/if}
              {crumb.title}
            </a>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
{/if}
