<script lang="ts">
  import { onMount } from "svelte";
  import { StandingsTable } from "../../components/Table";
  import ViewSelector from "../../components/ViewSelector.svelte";
  import HistoricalComparison from "../../components/HistoricalComparison.svelte";
  import ErrorBoundary from "../../components/ErrorBoundary.svelte";
  import ErrorDisplay from "../../components/ErrorDisplay.svelte";
  import { LoadingSpinner, ErrorMessage } from "../../components/UI";
  import { standingsStore } from "../../stores/standingsStore";
  import { viewTypeStore } from "../../stores/viewStore";
  import { AppErrorHandler } from "../../utils/errorHandler";
  import { logger } from "../../utils/logger";
  import { StandingsService } from "../../business";

  let isLoading = true;
  let hasInitialError = false;

  const loadStandings = async () => {
    logger.info('Starting standings load', {}, 'Page', 'loadStandings');
    isLoading = true;
    hasInitialError = false;

    try {
      const standingsService = StandingsService.getInstance();
      const fetchedStandings = await standingsService.getStandings();
      standingsStore.set(fetchedStandings);
      logger.info('Successfully loaded standings',
        { standingsCount: fetchedStandings.length },
        'Page',
        'loadStandings'
      );
      isLoading = false;
    } catch (error) {
      logger.error('Failed to load standings',
        { error: error instanceof Error ? error.message : String(error) },
        'Page',
        'loadStandings'
      );
      AppErrorHandler.handleRuntimeError(error, {
        operation: 'initial-load',
        component: 'page'
      });
      hasInitialError = true;
      isLoading = false;
    }
  };

  onMount(loadStandings);
</script>

<svelte:head>
  <title>NHL 3-Point Standings | OTW.sport</title>
</svelte:head>

<ErrorBoundary fallback="Failed to load the NHL standings application" retryAction={loadStandings}>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="text-center">
      <h1 class="text-2xl font-medium text-base-content mb-2">NHL 3-Point Standings</h1>
      <p class="text-base-content/60">
        Explore how the standings would look with the international 3-point system
      </p>
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

<!-- Global error display -->
<ErrorDisplay />
