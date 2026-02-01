<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authStore, authError } from '../../../stores/authStore';

  let processing = true;
  let error: string | null = null;

  onMount(async () => {
    const searchParams = $page.url.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle error from OIDC provider
    if (errorParam) {
      error = errorDescription || errorParam;
      processing = false;
      return;
    }

    // Validate required parameters
    if (!code || !state) {
      error = 'Missing required authentication parameters';
      processing = false;
      return;
    }

    // Handle the callback
    const success = await authStore.handleCallback(code, state);

    if (success) {
      // Redirect to home or previous page
      const returnTo = sessionStorage.getItem('otw-auth-return-to') || '/sports';
      sessionStorage.removeItem('otw-auth-return-to');
      goto(returnTo);
    } else {
      processing = false;
    }
  });

  // Subscribe to auth errors
  $: if ($authError) {
    error = $authError;
    processing = false;
  }

  function retry() {
    authStore.clearError();
    authStore.login();
  }

  function goHome() {
    goto('/sports');
  }
</script>

<svelte:head>
  <title>Signing in... | OTW.sport</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center">
  <div class="text-center max-w-md mx-auto px-4">
    {#if processing}
      <!-- Processing state -->
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            class="w-8 h-8 text-primary animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-medium text-base-content mb-2">
          Signing you in...
        </h1>
        <p class="text-base-content/60">
          Please wait while we complete your authentication.
        </p>
      </div>
    {:else if error}
      <!-- Error state -->
      <div class="mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-medium text-base-content mb-2">
          Authentication Failed
        </h1>
        <p class="text-base-content/60 mb-6">
          {error}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            class="px-6 py-2 rounded-lg bg-primary text-primary-content font-medium
                   hover:shadow-elevation-3 transition-all"
            on:click={retry}
          >
            Try Again
          </button>
          <button
            class="px-6 py-2 rounded-lg bg-base-200 text-base-content font-medium
                   hover:bg-base-300 transition-colors"
            on:click={goHome}
          >
            Go Home
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
