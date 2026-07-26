<script lang="ts">
  import { Bookmark, Check, ChevronRight, Gauge, ShieldCheck, Sparkles } from 'lucide-svelte';
  import { PLAN_EVENTS, rankPlan } from './planFixtures';
  import type { DisclosureMode, PlanEvent, TimeBudget } from './planTypes';

  const modes: Array<{ value: DisclosureMode; label: string; description: string }> = [
    { value: 'no-hints', label: 'No hints', description: 'Pre-event context only' },
    { value: 'guidance', label: 'Guidance', description: 'Worth-watching signal, no result' },
    { value: 'full-story', label: 'Full story', description: 'Results and analysis' }
  ];
  const budgets: TimeBudget[] = [15, 30, 60, 120];

  let mode: DisclosureMode = 'guidance';
  let budget: TimeBudget = 60;
  let queued: string[] = [];
  let announcement = 'Guidance enabled. Worth-watching scores are visible; results remain hidden.';

  $: rankedEvents = rankPlan(PLAN_EVENTS, mode, budget);
  $: leadEvent = rankedEvents[0];
  $: alternatives = rankedEvents.slice(1);
  $: protectionStatus = mode === 'full-story'
    ? 'Results and complete analysis are visible'
    : mode === 'guidance'
      ? 'Worth-watching guidance is visible; results remain hidden'
      : 'Post-event quality and results are hidden';

  function selectMode(nextMode: DisclosureMode) {
    mode = nextMode;
    const selected = modes.find((item) => item.value === nextMode);
    announcement = `${selected?.label} enabled. ${selected?.description}. Plan reordered.`;
  }

  function selectBudget(nextBudget: TimeBudget) {
    budget = nextBudget;
    announcement = `Plan updated for ${nextBudget === 120 ? '120 or more' : nextBudget} minutes.`;
  }

  function toggleQueue(event: PlanEvent) {
    const isQueued = queued.includes(event.id);
    queued = isQueued ? queued.filter((id) => id !== event.id) : [...queued, event.id];
    announcement = isQueued ? `${event.title} removed from your queue.` : `${event.title} added to your queue.`;
  }
</script>

<svelte:head>
  <title>Your sports edit | OTW</title>
  <meta name="description" content="A personal, spoiler-aware plan for sporting events worth your time." />
</svelte:head>

<section class="plan-shell" aria-labelledby="plan-title">
  <header class="plan-header">
    <div>
      <p class="kicker">OTW · The weekend edit</p>
      <h1 id="plan-title">Your sports edit</h1>
      <p class="intro">A considered shortlist for the time you have—not another wall of scores.</p>
    </div>
    <div class="status"><ShieldCheck size={18} aria-hidden="true" /> {protectionStatus}</div>
  </header>

  <div class="controls" aria-label="Plan controls">
    <fieldset>
      <legend>What may we reveal?</legend>
      <div class="segments modes">
        {#each modes as item (item.value)}
          <label class:active={mode === item.value}>
            <input type="radio" name="disclosure" value={item.value} checked={mode === item.value} on:change={() => selectMode(item.value)} />
            <span>{item.label}<small>{item.description}</small></span>
          </label>
        {/each}
      </div>
    </fieldset>

    <fieldset>
      <legend>How much time do you have?</legend>
      <div class="segments budget">
        {#each budgets as item (item)}
          <label class:active={budget === item}>
            <input type="radio" name="budget" value={item} checked={budget === item} on:change={() => selectBudget(item)} />
            <span>{item}{item === 120 ? '+' : ''} min</span>
          </label>
        {/each}
      </div>
    </fieldset>
  </div>

  <p class="sr-only" aria-live="polite">{announcement}</p>

  <section class="lead" aria-labelledby="lead-heading">
    <div class="section-label"><Sparkles size={16} aria-hidden="true" /> Our first pick for your {budget === 120 ? '120+' : budget} minutes</div>
    <article class="event-card lead-card accent-{leadEvent.accent}">
      <div class="event-main">
        <p class="event-context">{leadEvent.sport} · {leadEvent.context} · {leadEvent.dateLabel}</p>
        <h2 id="lead-heading">{leadEvent.title}</h2>

        {#if mode !== 'no-hints'}
          <div class="assessment">
            <span class="score-band">{leadEvent.scoreBand}</span>
            <span class="score">OTW {leadEvent.score}</span>
            <span class="percentile">{leadEvent.percentile}</span>
          </div>
        {/if}

        {#if mode === 'no-hints'}
          <p class="fit"><strong>Relevant to you</strong> · Replay listed</p>
          <p class="reason">{leadEvent.safeReason} · Ordered without post-event quality signals</p>
        {:else}
          <p class="fit"><strong>{leadEvent.fit} for you</strong> · {leadEvent.format} · ~{leadEvent.minutes} min</p>
          <p class="reason">{leadEvent.guidanceTraits.join(' · ')}</p>
        {/if}

        {#if mode === 'full-story'}
          <div class="result"><strong>Result</strong><span>{leadEvent.result}</span></div>
          <p class="full-reason">{leadEvent.fullReason}</p>
          <div class="dimensions" aria-label="OTW Score dimensions">
            {#each leadEvent.dimensions as dimension (dimension.label)}
              <div class="dimension">
                <div><span>{dimension.label}</span><strong>{dimension.band}</strong></div>
                <div class="meter" aria-label={`${dimension.label}: ${dimension.band}`}><span style={`width: ${dimension.value}%`}></span></div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="actions">
        <button class="queue" class:queued={queued.includes(leadEvent.id)} on:click={() => toggleQueue(leadEvent)}>
          {#if queued.includes(leadEvent.id)}<Check size={17} aria-hidden="true" /> Queued{:else}<Bookmark size={17} aria-hidden="true" /> Queue{/if}
        </button>
        <button class="details">Details <ChevronRight size={17} aria-hidden="true" /></button>
      </div>
    </article>
  </section>

  <section class="alternatives" aria-labelledby="alternatives-heading">
    <div class="section-heading">
      <div><p class="kicker">The shortlist</p><h2 id="alternatives-heading">Also worth considering</h2></div>
      <span>{alternatives.length} events</span>
    </div>

    <ol class="event-list">
      {#each alternatives as event (event.id)}
        <li>
          <article class="event-card compact accent-{event.accent}">
            <div class="event-main">
              <p class="event-context">{event.sport} · {event.context} · {event.dateLabel}</p>
              <h3>{event.title}</h3>
              {#if mode !== 'no-hints'}
                <div class="assessment compact-score"><span class="score-band">{event.scoreBand}</span><span class="score">OTW {event.score}</span></div>
              {/if}
              {#if mode === 'no-hints'}
                <p class="fit"><strong>Relevant to you</strong> · Replay listed</p>
                <p class="reason">{event.safeReason}</p>
              {:else}
                <p class="fit"><strong>{event.fit}</strong> · {event.format} · ~{event.minutes} min</p>
                <p class="reason">{event.guidanceTraits.join(' · ')}</p>
              {/if}
              {#if mode === 'full-story'}<p class="compact-result"><strong>Result:</strong> {event.result}</p>{/if}
            </div>
            <button class="icon-action" class:queued={queued.includes(event.id)} on:click={() => toggleQueue(event)} aria-label={queued.includes(event.id) ? `Remove ${event.title} from queue` : `Add ${event.title} to queue`}>
              {#if queued.includes(event.id)}<Check size={18} aria-hidden="true" />{:else}<Bookmark size={18} aria-hidden="true" />{/if}
            </button>
          </article>
        </li>
      {/each}
    </ol>
  </section>

  <aside class="method-note">
    <Gauge size={19} aria-hidden="true" />
    <div><strong>One event score, a plan made for you.</strong><p>The OTW Score is our historical assessment. Your Fit also considers your tastes, available time and preferred format.</p></div>
  </aside>
</section>

<style>
  :global(main) { max-width: none !important; padding-top: 0 !important; }
  .plan-shell { --paper: #f6f3ed; --ink: #17202a; --muted: #637083; --rule: #d9d8d3; --action: #155eef; color: var(--ink); background: var(--paper); min-height: calc(100vh - 3.5rem); margin: 0 -1rem -2rem; padding: 3rem max(1rem, calc((100vw - 1120px) / 2)); }
  .plan-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--rule); }
  .kicker, .event-context, .section-label { margin: 0; font-size: .73rem; font-weight: 650; letter-spacing: .105em; text-transform: uppercase; color: var(--muted); }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.35rem, 5vw, 4.5rem); line-height: .98; letter-spacing: -.045em; margin: .45rem 0 .8rem; font-weight: 500; }
  .intro { max-width: 36rem; margin: 0; color: var(--muted); font-size: 1.05rem; }
  .status { display: flex; gap: .5rem; align-items: center; font-size: .82rem; color: #285a45; background: #e9f2ec; border: 1px solid #c9dfd0; padding: .55rem .75rem; border-radius: .45rem; white-space: nowrap; }
  .controls { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; padding: 1.5rem 0 2.25rem; }
  fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
  legend { font-size: .78rem; font-weight: 650; margin-bottom: .6rem; }
  .segments { display: grid; padding: .25rem; border: 1px solid var(--rule); background: rgba(255,255,255,.55); border-radius: .65rem; }
  .segments.modes { grid-template-columns: repeat(3, 1fr); }
  .segments.budget { grid-template-columns: repeat(4, 1fr); }
  .segments label { position: relative; min-height: 3.15rem; display: flex; align-items: center; justify-content: center; border-radius: .45rem; cursor: pointer; text-align: center; color: var(--muted); }
  .segments label.active { background: #fff; color: var(--ink); box-shadow: 0 1px 4px rgb(16 24 40 / 10%); }
  .segments input { position: absolute; opacity: 0; }
  .segments input:focus-visible + span { outline: 2px solid var(--action); outline-offset: 8px; border-radius: .2rem; }
  .segments span { font-size: .84rem; font-weight: 650; }
  .segments small { display: block; margin-top: .16rem; font-size: .65rem; font-weight: 450; color: var(--muted); }
  .section-label { display: flex; align-items: center; gap: .4rem; color: #744210; margin-bottom: .65rem; }
  .event-card { position: relative; background: rgba(255,255,255,.92); border: 1px solid var(--rule); border-left-width: 3px; border-radius: .7rem; overflow: hidden; }
  .accent-racing { border-left-color: #b42318; } .accent-tennis { border-left-color: #167b68; } .accent-hockey { border-left-color: #2877a8; }
  .lead-card { display: grid; grid-template-columns: 1fr auto; padding: clamp(1.25rem, 3vw, 2rem); }
  .event-context { margin-bottom: .55rem; }
  .lead-card h2 { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(1.75rem, 4vw, 2.8rem); line-height: 1.05; margin: 0 0 1rem; font-weight: 500; letter-spacing: -.03em; }
  .assessment { display: flex; align-items: baseline; flex-wrap: wrap; gap: .5rem; margin: .6rem 0; }
  .score-band { font-size: 1.05rem; font-weight: 700; }
  .score { border-left: 1px solid var(--rule); padding-left: .5rem; font-weight: 650; color: #744210; font-variant-numeric: tabular-nums; }
  .percentile { font-size: .78rem; color: var(--muted); }
  .fit { margin: .9rem 0 .25rem; font-size: .92rem; }
  .reason, .full-reason { color: var(--muted); margin: 0; font-size: .87rem; }
  .result { margin-top: 1.25rem; padding: .85rem 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); display: grid; gap: .2rem; }
  .result span { font-family: Georgia, 'Times New Roman', serif; font-size: 1.15rem; }
  .full-reason { margin-top: .8rem; max-width: 46rem; }
  .dimensions { display: grid; grid-template-columns: repeat(2, 1fr); gap: .8rem 1.5rem; margin-top: 1rem; }
  .dimension > div:first-child { display: flex; justify-content: space-between; font-size: .72rem; margin-bottom: .32rem; }
  .dimension strong { color: var(--muted); font-weight: 550; }
  .meter { height: .28rem; background: #e5e4df; border-radius: 1rem; overflow: hidden; }
  .meter span { display: block; height: 100%; background: #93611f; }
  .actions { display: flex; align-self: flex-end; gap: .5rem; margin-left: 1.5rem; }
  button { min-height: 2.75rem; border-radius: .45rem; border: 1px solid var(--rule); background: transparent; color: var(--ink); padding: 0 .85rem; display: inline-flex; gap: .4rem; align-items: center; justify-content: center; font-weight: 650; font-size: .82rem; cursor: pointer; }
  button:hover { background: #f1f0ec; } button:focus-visible { outline: 2px solid var(--action); outline-offset: 2px; }
  .details { color: #fff; background: var(--ink); border-color: var(--ink); } .details:hover { background: #303946; }
  .queued { color: #285a45; background: #e9f2ec; border-color: #b8d2c0; }
  .alternatives { margin-top: 3.25rem; }
  .section-heading { display: flex; justify-content: space-between; align-items: end; margin-bottom: .8rem; }
  .section-heading h2 { font-family: Georgia, 'Times New Roman', serif; font-size: 1.65rem; margin: .2rem 0 0; font-weight: 500; }
  .section-heading > span { font-size: .78rem; color: var(--muted); }
  .event-list { padding: 0; margin: 0; list-style: none; display: grid; gap: .65rem; }
  .compact { padding: 1rem 1rem 1rem 1.2rem; display: grid; grid-template-columns: 1fr auto; align-items: center; }
  .compact h3 { font-family: Georgia, 'Times New Roman', serif; font-size: 1.2rem; margin: .25rem 0 .4rem; font-weight: 500; }
  .compact .fit { margin-top: .45rem; }
  .compact-score { margin: .2rem 0; }
  .compact-result { margin: .7rem 0 0; color: var(--ink); font-size: .83rem; }
  .icon-action { width: 2.75rem; padding: 0; margin-left: 1rem; }
  .method-note { display: flex; gap: .8rem; margin: 2rem 0 1rem; padding: 1rem; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); color: var(--muted); font-size: .83rem; }
  .method-note strong { color: var(--ink); } .method-note p { margin: .2rem 0 0; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  @media (max-width: 760px) {
    .plan-shell { padding-top: 1.75rem; }
    .plan-header { display: block; } .status { margin-top: 1.25rem; width: fit-content; white-space: normal; }
    .controls { grid-template-columns: 1fr; gap: 1.1rem; }
    .segments.modes { grid-template-columns: 1fr; } .segments.modes label { justify-content: flex-start; text-align: left; padding: 0 .8rem; }
    .lead-card { grid-template-columns: 1fr; } .actions { margin: 1.4rem 0 0; justify-content: stretch; } .actions button { flex: 1; }
    .dimensions { grid-template-columns: 1fr; }
  }
  @media (prefers-color-scheme: dark) {
    .plan-shell { --paper: #0d1118; --ink: #f1f3f5; --muted: #aeb7c4; --rule: #343d49; background: var(--paper); }
    .event-card, .segments label.active { background: #151b24; } .segments { background: #111720; }
    .status, .queued { background: #16271f; border-color: #315541; color: #a8d5b9; }
    .details { background: #eef2f6; color: #17202a; border-color: #eef2f6; } .details:hover { background: #dce2e8; }
    button:hover { background: #202733; } .meter { background: #313947; }
  }
  @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; transition: none !important; } }
</style>
