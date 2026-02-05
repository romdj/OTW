<script lang="ts">
  import type { F1Session } from '../../api/formula1API.js';
  import { getSessionTypeShort, getStatusColor } from '../../api/formula1API.js';

  export let sessions: F1Session[] = [];
  export let loading = false;

  function formatDateTime(date: string, time?: string): string {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (time) {
      return `${dateStr} ${time}`;
    }
    return dateStr;
  }
</script>

{#if loading}
  <div class="space-y-2">
    {#each Array(5) as _, i (i)}
      <div class="h-14 bg-base-200/50 rounded-lg animate-pulse"></div>
    {/each}
  </div>
{:else if sessions.length === 0}
  <div class="text-center py-8 border border-base-200 rounded-xl">
    <p class="text-base-content/50">No upcoming sessions</p>
  </div>
{:else}
  <div class="space-y-2">
    {#each sessions as session (session.id)}
      {@const isLive = session.status === 'LIVE'}
      <div
        class="p-3 border rounded-lg transition-colors {isLive ? 'border-red-200 bg-red-50' : 'border-base-200 hover:border-base-300'}"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Session type badge -->
            <span class="text-xs font-medium px-2 py-1 bg-base-200 rounded shrink-0 {isLive ? 'bg-red-100 text-red-700' : ''}">
              {getSessionTypeShort(session.type)}
            </span>

            <div class="min-w-0">
              <div class="font-medium text-base-content truncate">
                {session.grandPrixName}
              </div>
              <div class="text-sm text-base-content/60">
                {session.name}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            {#if isLive}
              <div class="flex items-center gap-1 text-red-600 text-sm font-medium">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live
              </div>
            {:else}
              <div class="text-sm text-base-content/60">
                {formatDateTime(session.date, session.startTime)}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
