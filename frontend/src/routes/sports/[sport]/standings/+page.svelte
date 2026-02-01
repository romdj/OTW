<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { StandingsTable } from '../../../../components/Table';
  import ViewSelector from '../../../../components/ViewSelector.svelte';
  import HistoricalComparison from '../../../../components/HistoricalComparison.svelte';
  import ErrorBoundary from '../../../../components/ErrorBoundary.svelte';
  import ErrorDisplay from '../../../../components/ErrorDisplay.svelte';
  import { LoadingSpinner, ErrorMessage } from '../../../../components/UI';
  import { standingsStore } from '../../../../stores/standingsStore';
  import { viewTypeStore } from '../../../../stores/viewStore';
  import { AppErrorHandler } from '../../../../utils/errorHandler';
  import { logger } from '../../../../utils/logger';
  import { StandingsService } from '../../../../business';
  import { SPORTS } from '../../../../components/Sports';

  $: sportId = $page.params.sport;
  $: sportConfig = SPORTS.find((s) => s.id === sportId);

  let isLoading = true;
  let hasInitialError = false;

  const loadStandings = async () => {
    logger.info('Starting standings load', {}, 'StandingsPage', 'loadStandings');
    isLoading = true;
    hasInitialError = false;

    try {
      const standingsService = StandingsService.getInstance();
      const fetchedStandings = await standingsService.getStandings();
      standingsStore.set(fetchedStandings);
      logger.info(
        'Successfully loaded standings',
        { standingsCount: fetchedStandings.length },
        'StandingsPage',
        'loadStandings'
      );
      isLoading = false;
    } catch (error) {
      logger.error(
        'Failed to load standings',
        { error: error instanceof Error ? error.message : String(error) },
        'StandingsPage',
        'loadStandings'
      );
      AppErrorHandler.handleRuntimeError(error, {
        operation: 'initial-load',
        component: 'standings-page',
      });
      hasInitialError = true;
      isLoading = false;
    }
  };

  onMount(() => {
    // Only ice-hockey standings are implemented for now
    if (sportId !== 'ice-hockey') {
      goto(`/sports/${sportId}`);
      return;
    }
    loadStandings();
  });
</script>

<svelte:head>
  <title>Standings | {sportConfig?.name ?? 'Sport'} | OTW.sport</title>
</svelte:head>

{#if sportId === 'ice-hockey'}
  <ErrorBoundary
    fallback="Failed to load the standings application"
    retryAction={loadStandings}
  >
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-2">
          NHL Standings
        </h1>
        <p class="text-base-content/70 text-lg">
          Explore how the standings would look with the 3-point system
        </p>
        <div class="badge badge-secondary mt-2">IIHF 3-Point System</div>
      </div>

      {#if isLoading}
        <LoadingSpinner size="lg" text="Loading NHL standings..." />
      {:else if hasInitialError}
        <ErrorMessage
          title="Failed to Load Standings"
          message="We couldn't load the NHL standings. Please try again."
          retryAction={loadStandings}
          retryText="Retry"
        />
      {:else}
        <ErrorBoundary fallback="An error occurred while displaying the standings">
          <div class="space-y-6">
            <ViewSelector />
            {#if $viewTypeStore === 'comparison'}
              <HistoricalComparison />
            {:else}
              <StandingsTable />
            {/if}
          </div>
        </ErrorBoundary>
      {/if}
    </div>
  </ErrorBoundary>

  <ErrorDisplay />
{:else}
  <div class="text-center py-12">
    <LoadingSpinner size="md" text="Redirecting..." />
  </div>
{/if}
