# Component System Specification

## Architecture rule

Build components in three layers:

1. **Primitives** — `Button`, `IconButton`, `Badge`, `Meter`, `Dialog`, `Sheet`, `Skeleton`.
2. **Product patterns** — `SpoilerGuard`, `ViewingFormat`, `EventCharacter`, `PrioritySection`.
3. **Sport adapters** — map F1/tennis/hockey data into one `EventPresentation` view model.

DaisyUI may supply primitive behavior/classes, but OTW owns semantic tokens and product patterns. Do not expose DaisyUI theme names in domain components.

## Presentation model

**Recommendation.** Cards must not derive user-facing text from IDs. Create a typed view model:

```ts
type EventPresentation = {
  id: string;
  sport: 'formula1' | 'tennis' | 'iceHockey';
  competition: string;
  context: string;             // "Quarter-final" or "Race"
  title: string;               // matchup or "Belgian Grand Prix"
  scheduledAt: string;
  state: 'upcoming' | 'live' | 'completed' | 'postponed';
  priority: { tier: PriorityTier; score?: number };
  recommendation: {
    format: 'full' | 'condensed' | 'highlights' | 'recap' | 'skip';
    durationMinutes?: number;
    reasons: string[];
  };
  traits: Array<{ key: string; label: string; level: 'low'|'medium'|'high'|'veryHigh' }>;
  spoiler: { level: 'safe'|'contextual'|'outcome'; revealed: boolean };
  availability: Array<{ provider: string; href: string; territory?: string }>;
};
```

Keep raw score, winner, celebration imagery, and outcome summary in a separately fetched/revealed payload. This reduces accidental DOM and logging leakage.

## Core component inventory

### `SpoilerModeControl`

- Variants: Safe, Custom, Revealed session.
- Visible label always includes state; shield icon is supplemental.
- Opens settings rather than toggling all outcomes instantly.
- Persists user preference; announces changes without outcome content.

### `EventRecommendationCard`

Semantic `<article>` with a heading-linked detail route. Actions are sibling buttons, never nested inside the link.

Variants:

- `lead`: one per plan; complete reasons and format.
- `standard`: default tier list.
- `compact`: Highlights/Skip; never removes essential context.
- `skeleton`, `unavailable`.

States: default, hover, focus-within, queued, watched, stale, provider-unavailable. Do not create a “winner” state while safe mode is active.

Minimum mobile anatomy:

```text
[sport icon] NHL · Regular season · Yesterday
Canadiens — Bruins
[Full replay] 52 min
Because: follows Canadiens · high suspense
[Must watch] [Score 87, optional]
Details                            + Queue
```

### `PrioritySection`

- Heading + plain-language description + count.
- Must/Worth expanded by default; lower tiers collapsed.
- Section toggle minimum 44 px tall.
- Preserve expansion state during refresh.
- Use an ordered list where rank matters.
- Empty tiers are omitted unless filters caused the empty result.

### `TimeBudgetControl`

Segmented single-select: 10, 30, 60, 120+ minutes. Use radio semantics, visible group label, arrow-key support, and a Custom option only after MVP. Updating the plan retains prior content until the new plan resolves.

### `ViewingFormatBadge`

Use icon + text: Full replay, Condensed, Highlights, Recap, Skip. This is a recommendation, not availability. If duration is estimated, label it `~52 min`.

### `EventCharacter`

- Card: top two text traits.
- Detail: five labeled meters.
- One hue for meter values; qualitative label always present.
- Optional “How this was calculated” disclosure.

### `SpoilerGuard`

Owns protected content and confirmation. API:

```svelte
<SpoilerGuard eventId={id} protection="outcome">
  {#snippet safe()}...{/snippet}
  {#snippet revealed()}...{/snippet}
</SpoilerGuard>
```

Never render the revealed snippet until authorized. Unit-test DOM, accessible name, and analytics payloads.

### `ViewingOptions`

List verified providers with territory and external-link label. A disabled “Watch Now” button is not acceptable. If none exist, present an honest unavailable state and allow Queue.

### Navigation

- Desktop: top bar—Plan, Discover, Queue; Profile/utilities right.
- Mobile: bottom bar—Plan, Discover, Queue, Profile.
- Sport selection is a filter within Plan/Discover, not a permanent top-level page per sport.
- Detail routes keep breadcrumb/back behavior and current safe mode.

## Sport adaptation

| Slot | F1 | Tennis | Ice hockey |
|---|---|---|---|
| Competition | Formula 1 | ATP/WTA + tournament | NHL/league |
| Context | Practice/Qualifying/Sprint/Race | Round + singles/doubles + surface | Regular season/playoffs |
| Title | Grand Prix | Player A — Player B | Team A — Team B |
| Duration | replay/condensed estimate | match/replay estimate | full/condensed estimate |
| Traits | volatility, stakes | suspense, underdog | suspense, rivalry |

Sport-specific metadata is allowed in detail slots, not by forking the entire card.

## Primitives and interaction specifications

- Buttons: primary, secondary, ghost, danger; sizes 36 desktop / 44 touch; loading retains width.
- Icon buttons: 44×44 touch; tooltip plus accessible name.
- Inputs: visible labels; description/error linked with `aria-describedby`.
- Badges: never interactive; use buttons/chips for filters.
- Dialog: focus trap, initial safe focus on Cancel, Escape closes unless destructive work is underway, focus returns to trigger.
- Sheet: mobile filters only; same DOM semantics as desktop filter panel.
- Toast: confirmations only; errors requiring recovery stay inline.
- Tooltip: supplemental only; no essential meaning.
- Icons: Lucide at 18/20/24 px, `stroke-width: 1.75–2`; add project-owned SVG only when the sport cannot be represented accurately. Always pair unfamiliar icons with text.

## Design-token mapping

Define CSS custom properties (`--color-surface`, `--color-ink`, `--space-4`) and map them into Tailwind. DaisyUI aliases may point to them. This keeps semantic names usable in Svelte CSS and makes theme switching predictable.

Avoid arbitrary values in product components. Permit them only for documented geometry (for example, the 240 px desktop filter rail).

## Component quality gates

Each product component requires:

- light, dark, high-contrast, and reduced-motion review;
- keyboard and screen-reader interaction tests;
- 320, 375, 768, 1024, and 1280 px snapshots;
- loading, empty, long text, and provider-failure fixtures;
- German/French-length copy stress test even before localization;
- spoiler audit of visible DOM, accessible tree, analytics, URL, and logs;
- no color-only meaning;
- no layout shift when async data arrives.

## Existing-component migration

| Existing | Action |
|---|---|
| `EventCard.svelte` | Refactor to semantic article + typed presentation model |
| `EmotionalProfileBar.svelte` | Replace emoji/multicolor bars with `EventCharacter` |
| `PriorityTierSection.svelte` | Keep concept; use ordered list and persistence |
| `FilterBar.svelte` | Adapt into desktop panel/mobile sheet |
| `WeekendRecap.svelte` | Reframe as `ViewingPlan` shell |
| `LoadingSpinner.svelte` | Reserve for small actions; use skeletons for page load |
| `ThemeToggle.svelte` | Add System preference and verified theme tokens |

## Testing note

Svelte Testing Library/Vitest should test roles and behavior, not class names. Add axe-compatible automated checks if the repository accepts the dependency, but retain manual keyboard, zoom, contrast, and screen-reader passes; automation cannot prove spoiler safety or comprehension.
