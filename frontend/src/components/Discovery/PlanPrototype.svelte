<script lang="ts">
  import { ShieldCheck, Sparkles } from 'lucide-svelte';
  import DisclosureControl from './DisclosureControl.svelte';
  import EventInspector from './EventInspector.svelte';
  import EventRecommendationCard from './EventRecommendationCard.svelte';
  import QueuePanel from './QueuePanel.svelte';
  import { getMockViewingPlan } from './planFixtures';
  import type { DisclosureMode, FeedbackReason, FullStoryEvent, PlanEvent, TimeBudget, ViewingPlanResponse } from './planTypes';

  const budgets: TimeBudget[] = [15, 30, 60, 120];
  let mode: DisclosureMode = 'guidance';
  let budget: TimeBudget = 60;
  let response: ViewingPlanResponse | null = null;
  let loading = true;
  let error = '';
  let confirmFullStory = false;
  let selected: PlanEvent | null = null;
  let revealedEvent: FullStoryEvent | null = null;
  let queued: PlanEvent[] = [];
  let watched: string[] = [];
  let feedback: Record<string, FeedbackReason> = {};
  let announcement = 'Guidance enabled. OTW Scores are visible; results remain hidden.';

  async function loadPlan(nextMode = mode, nextBudget = budget) {
    loading = true;
    error = '';
    try { response = await getMockViewingPlan(nextMode, nextBudget); }
    catch { error = 'We could not compose your edit. Try again.'; }
    finally { loading = false; }
  }

  function requestMode(nextMode: DisclosureMode) {
    if (nextMode === 'full-story' && mode !== 'full-story') { confirmFullStory = true; return; }
    applyMode(nextMode);
  }

  function applyMode(nextMode: DisclosureMode) {
    mode = nextMode;
    confirmFullStory = false;
    selected = null;
    revealedEvent = null;
    announcement = nextMode === 'guidance'
      ? 'Guidance enabled. OTW Scores are visible as opted-in quality hints; results remain hidden. Plan updated.'
      : nextMode === 'no-hints'
        ? 'No hints enabled. Post-event quality and results are hidden. Plan updated.'
        : 'Full story enabled. Results and complete analysis are visible. Plan updated.';
    loadPlan();
  }

  function selectBudget(nextBudget: TimeBudget) {
    budget = nextBudget;
    announcement = `Plan updated for ${nextBudget === 120 ? '120 or more' : nextBudget} minutes.`;
    loadPlan();
  }

  function toggleQueue(event: PlanEvent) {
    const exists = queued.some((item) => item.id === event.id);
    queued = exists ? queued.filter((item) => item.id !== event.id) : [...queued, event];
    announcement = exists ? `${event.title} removed from your queue.` : `${event.title} added to your queue.`;
  }

  async function revealOne(id: string) {
    const full = await getMockViewingPlan('full-story', budget);
    revealedEvent = [...full.plan, ...full.excluded].find((event): event is FullStoryEvent => event.id === id && event.projection === 'full-story') ?? null;
    announcement = `Full story revealed for ${selected?.title ?? 'this event'} only.`;
  }

  function markWatched(event: PlanEvent) {
    watched = [...watched, event.id];
    announcement = `${event.title} marked watched. Tell us whether it was worth your time.`;
  }

  function saveFeedback(event: PlanEvent, reason: FeedbackReason) {
    feedback = { ...feedback, [event.id]: reason };
    announcement = `Feedback saved for ${event.title}: ${reason}.`;
  }

  loadPlan();
  $: queueTotal = queued.reduce((sum, event) => sum + event.estimatedMinutes, 0);
</script>

<svelte:head><title>Your sports edit | OTW</title><meta name="description" content="A personal, spoiler-aware plan for sporting events worth your time." /></svelte:head>

<section class="plan-shell" aria-labelledby="plan-title">
  <header class="plan-header">
    <div><p class="kicker">OTW · The weekend edit</p><h1 id="plan-title">Your sports edit</h1><p class="intro">A considered viewing plan for the time you have—not another wall of scores.</p></div>
    <div class="status"><ShieldCheck size={18} aria-hidden="true" />{mode === 'full-story' ? 'Results are visible' : mode === 'guidance' ? 'Quality hints on · Results hidden' : 'No post-event hints'}</div>
  </header>

  <div class="controls">
    <DisclosureControl value={mode} onSelect={requestMode} />
    <fieldset><legend>How much time do you have?</legend><div class="segments budget">{#each budgets as item (item)}<label class:active={budget === item}><input type="radio" name="budget" checked={budget === item} on:change={() => selectBudget(item)} /><span>{item}{item === 120 ? '+' : ''} min</span></label>{/each}</div></fieldset>
  </div>
  {#if mode === 'guidance'}<p class="guidance-note"><strong>Guidance is an opted-in quality hint.</strong> OTW Scores may tell you an event was worthwhile, but never reveal the result or how it unfolded.</p>{/if}
  <p class="visible-update" aria-live="polite">{announcement}</p>

  {#if loading}<div class="state" role="status">Composing your edit…</div>
  {:else if error}<div class="state error" role="alert">{error} <button on:click={() => loadPlan()}>Try again</button></div>
  {:else if response}
    <section aria-labelledby="composed-title">
      <div class="section-heading"><div><p class="kicker">Composed plan</p><h2 id="composed-title">{response.headline}</h2></div><strong>{response.plan.length} events · ~{response.totalMinutes} min</strong></div>
      {#if response.plan.length === 0}<div class="state"><h3>No available replay fits this window</h3><p>Try a longer budget. We will not squeeze in an unavailable recommendation just to fill the plan.</p></div>{/if}
      <div class="plan-list">{#each response.plan as event, index (event.id)}<div>{#if index === 0}<p class="lead-label"><Sparkles size={15} /> First pick</p>{/if}<EventRecommendationCard {event} prominent={index === 0} queued={queued.some((item) => item.id === event.id)} onQueue={toggleQueue} onDetails={(item) => { selected = item; revealedEvent = null; }} /></div>{/each}</div>
    </section>

    <section class="excluded" aria-labelledby="excluded-title">
      <div class="section-heading"><div><p class="kicker">Alternatives</p><h2 id="excluded-title">Not in this plan</h2></div><span>{response.excluded.length} events</span></div>
      <div class="plan-list compact">{#each response.excluded as event (event.id)}<EventRecommendationCard {event} queued={queued.some((item) => item.id === event.id)} onQueue={toggleQueue} onDetails={(item) => { selected = item; revealedEvent = null; }} />{/each}</div>
    </section>
  {/if}

  <QueuePanel events={queued} {watched} {feedback} onWatched={markWatched} onFeedback={saveFeedback} />
  <footer class="method"><strong>OTW Score</strong> assesses the event historically. Your Fit reflects your taste. The plan considers your time and verified viewing formats. Queue total: ~{queueTotal} min.</footer>
</section>

{#if selected}<EventInspector event={selected} {revealedEvent} onClose={() => { selected = null; revealedEvent = null; }} onReveal={revealOne} />{/if}
{#if confirmFullStory}
  <div class="confirm-backdrop" role="presentation">
    <div class="confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><p class="kicker">Disclosure change</p><h2 id="confirm-title">Reveal every result?</h2><p>Full story will show outcomes and complete analysis across your plan. You cannot unsee revealed information.</p><div><button on:click={() => confirmFullStory = false}>Keep results hidden</button><button class="reveal-all" on:click={() => applyMode('full-story')}>Reveal full story</button></div></div>
  </div>
{/if}

<style>
  :global(.discover-page) { max-width: none; padding: 0; }
  .plan-shell { --paper:#f7f4ee; --surface:#fffdf9; --ink:#17202a; --muted:#637083; --rule:#d9d6ce; --action:#155eef; color:var(--ink); background:var(--paper); min-height:100vh; padding:3rem max(1rem,calc((100vw - 1120px)/2)); }
  .plan-header,.section-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; }
  .plan-header { padding-bottom:2rem; border-bottom:1px solid var(--rule); }
  .kicker,.lead-label,:global(.context) { margin:0; font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
  h1,h2,:global(.event-card h3),:global(.inspector h2) { font-family:Georgia,'Times New Roman',serif; font-weight:500; letter-spacing:-.03em; }
  h1 { font-size:clamp(2.5rem,6vw,4.6rem); line-height:1; margin:.4rem 0 .8rem; } .intro{color:var(--muted);margin:0;}
  .status{display:flex;gap:.5rem;align-items:center;padding:.55rem .75rem;border:1px solid #c9dfd0;background:#e9f2ec;color:#285a45;border-radius:.45rem;font-size:.8rem;}
  .controls{display:grid;grid-template-columns:1.5fr 1fr;gap:2rem;padding:1.5rem 0 1rem;} fieldset{border:0;padding:0;margin:0;} legend{font-size:.78rem;font-weight:700;margin-bottom:.6rem;}
  :global(.segments){display:grid;padding:.25rem;border:1px solid var(--rule);background:rgba(255,255,255,.55);border-radius:.65rem;} :global(.segments.modes){grid-template-columns:repeat(3,1fr)} .budget{grid-template-columns:repeat(4,1fr)}
  :global(.segments label){position:relative;min-height:3.15rem;display:flex;align-items:center;justify-content:center;border-radius:.45rem;text-align:center;color:var(--muted);cursor:pointer;} :global(.segments label.active){background:var(--surface);color:var(--ink);box-shadow:0 1px 4px #10182818;} :global(.segments input){position:absolute;opacity:0;} :global(.segments span){font-size:.82rem;font-weight:700;} :global(.segments small){display:block;font-size:.64rem;font-weight:450;color:var(--muted);}
  .guidance-note,.visible-update{font-size:.8rem;color:var(--muted);margin:.25rem 0 1rem}.visible-update{min-height:1.2rem;border-left:2px solid var(--action);padding-left:.6rem}
  .section-heading{align-items:end;margin:2rem 0 .8rem}.section-heading h2{font-size:1.7rem;margin:.15rem 0 0}.section-heading>strong,.section-heading>span{font-size:.78rem;color:var(--muted)} .plan-list{display:grid;gap:.7rem}.lead-label{display:flex;gap:.35rem;color:#744210;margin-bottom:.5rem}.excluded{margin-top:3.5rem}
  :global(.event-card){display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1.15rem 1.25rem;background:var(--surface);border:1px solid var(--rule);border-left:3px solid;border-radius:.65rem;} :global(.accent-racing){border-left-color:#b42318}:global(.accent-tennis){border-left-color:#167b68}:global(.accent-hockey){border-left-color:#2877a8}:global(.event-card.prominent){padding:1.8rem}:global(.event-card h3){font-size:1.35rem;margin:.3rem 0 .6rem}:global(.prominent h3){font-size:clamp(1.8rem,4vw,2.7rem)}
  :global(.assessment){display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}:global(.assessment span){border-left:1px solid var(--rule);padding-left:.5rem;color:#744210;font-weight:700}:global(.assessment small),:global(.reason),:global(.availability){color:var(--muted)}:global(.fit),:global(.reason),:global(.availability),:global(.result){margin:.55rem 0 0;font-size:.86rem}:global(.availability){display:flex;align-items:center;gap:.3rem}:global(.availability.warning){color:#9a4a17}:global(.actions){display:flex;align-items:end;gap:.4rem}:global(button){min-height:2.7rem;border:1px solid var(--rule);border-radius:.45rem;background:transparent;padding:0 .8rem;font-weight:650;cursor:pointer}:global(button.details),:global(.reveal-all){background:var(--ink);color:var(--surface);border-color:var(--ink)}:global(button.queued),:global(button.chosen){background:#e9f2ec;color:#285a45;border-color:#b8d2c0}
  .state{padding:2rem;border:1px dashed var(--rule);background:var(--surface);text-align:center;color:var(--muted)}.state h3{color:var(--ink);margin:0}.error{color:#9b2c2c}
  :global(.queue){margin-top:3.5rem;border-top:1px solid var(--rule);padding-top:1.5rem;display:grid;grid-template-columns:1fr auto;gap:.8rem}:global(.queue h2){margin:.15rem 0}:global(.queue>.empty),:global(.queue-item){grid-column:1/-1}:global(.queue-item){display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-top:1px solid var(--rule)}:global(.queue-item h3){margin:.2rem 0}:global(.feedback){display:flex;flex-wrap:wrap;gap:.35rem;align-items:center}:global(.feedback span){width:100%;font-size:.75rem;color:var(--muted)}:global(.feedback button){min-height:2rem;font-size:.7rem}.method{margin-top:2rem;padding:1rem 0;border-top:1px solid var(--rule);color:var(--muted);font-size:.8rem}
  :global(.backdrop),.confirm-backdrop{position:fixed;inset:0;z-index:70;background:#10182880;display:flex;justify-content:flex-end}:global(.inspector){position:relative;width:min(34rem,100%);height:100%;overflow:auto;background:var(--surface,#fffdf9);color:var(--ink,#17202a);padding:2rem}:global(.inspector .close){position:absolute;right:1rem;top:1rem;width:2.7rem;padding:0}:global(.inspector h2){font-size:2rem}:global(.inspector .score){display:flex;gap:.5rem;font-size:1.15rem}:global(.story),:global(.reveal){margin-top:1.5rem;padding-top:1rem;border-top:1px solid #ddd}:global(.dimensions>div){display:grid;grid-template-columns:1fr auto;gap:.3rem;margin-top:1rem}:global(progress){grid-column:1/-1;width:100%;accent-color:#93611f}.confirm-backdrop{justify-content:center;align-items:center}.confirm{width:min(28rem,calc(100% - 2rem));padding:1.5rem;background:var(--surface);border-radius:.7rem}.confirm h2{font-size:1.8rem;margin:.4rem 0}.confirm>div{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.2rem}
  @media(max-width:720px){.plan-header,.section-heading{display:block}.status{margin-top:1rem;width:fit-content}.controls{grid-template-columns:1fr}:global(.segments.modes){grid-template-columns:1fr}:global(.segments.modes label){justify-content:flex-start;text-align:left;padding:0 .7rem}:global(.event-card){grid-template-columns:1fr}:global(.actions){margin-top:.5rem}:global(.actions button){flex:1}:global(.queue-item){display:block}:global(.feedback){margin-top:.8rem}:global(.inspector){height:min(88vh,52rem);align-self:flex-end;border-radius:.8rem .8rem 0 0}:global(.backdrop){align-items:flex-end}}
  @media(prefers-color-scheme:dark){.plan-shell{--paper:#0d1118;--surface:#151b24;--ink:#f1f3f5;--muted:#aeb7c4;--rule:#343d49}.status,:global(button.queued),:global(button.chosen){background:#16271f;color:#a8d5b9;border-color:#315541}}
</style>
