# Visual Direction: Editorial Utility

## 1. Interface character

**Recommendation.** Use a quiet editorial base with the precision of a planning tool:

- neutral canvas and ink;
- compact but readable typography;
- thin borders rather than floating card shadows;
- one blue interactive color;
- limited sport accents;
- no photography required for core decisions.

The interface should feel trustworthy at 07:00 in dark mode and scannable during a commute—not like a live broadcast.

## 2. Information hierarchy

### Home/feed order

1. `Your viewing plan` + date/window.
2. Safe-mode status: `Results hidden` with a shield icon.
3. Time budget segmented control.
4. Lead recommendation.
5. Tier sections, expanded for Must/Worth and collapsed for Highlights/Skip.
6. Method/help link.

### Event-card order

1. Sport/competition/round or session.
2. Event title or participants.
3. Recommendation: `Watch full replay`.
4. Estimated viewing time.
5. Two personalized reasons.
6. Tier + optional numeric score.
7. Queue and details actions.

**Recommendation.** Never put `priorityScore` above the event name or viewing action.

## 3. Responsive layouts

### Mobile, 320–639 px

```text
[shield Results hidden]       [profile]
Your viewing plan
[10] [30] [60] [120+ min]

MUST WATCH · 1
┌ Hockey · NHL · Yesterday ┐
│ Canadiens — Bruins       │
│ Watch full replay · 52m  │
│ High suspense · Rivalry  │
│ [Details]       [Queue]  │
└──────────────────────────┘

WORTH YOUR TIME · 3        [⌄]
```

- One column; 16 px page gutter.
- Sticky bottom navigation: Plan, Discover, Queue, Profile.
- Filters open in a bottom sheet.
- Primary targets 44 px high; never make the whole card an ambiguous button.

### Tablet, 640–1023 px

- 24 px gutter; maximum two equal cards per tier.
- Top app bar plus optional compact bottom navigation in portrait.
- Filters may use an anchored popover; event detail becomes a full route, not a narrow drawer.

### Desktop, 1024+ px

```text
[logo] Plan Discover Queue                 [safe] [profile]
┌ Filters, 240 ┐ ┌ Main plan, max 760 ┐ ┌ Why this, 288 ┐
│ sports       │ │ ranked vertical feed │ │ selected card │
│ date         │ │                       │ │ explanation   │
│ duration     │ │                       │ │ viewing links │
└──────────────┘ └───────────────────────┘ └───────────────┘
```

- Content max width 1280 px; gutters 32 px.
- Use a two-column layout below 1180 px; the explanation panel becomes a dialog/route.
- Do not turn the ranked list into a masonry grid; vertical position communicates priority.

## 4. Cross-sport identity

**Recommendation.** Use one shell and one event-card geometry. Sport identity appears in a 2 px accent, Lucide/custom line icon, and compact label:

- F1: warm red accent; use `Gauge` or a purpose-built accessible motorsport mark.
- Tennis: grass/teal accent; use `CircleDot` only if labeled “Tennis.”
- Ice hockey: ice blue accent; use a project-owned hockey pictogram if Lucide lacks one.

Never color participant names by result. Team/driver colors may appear only in revealed detail and must not encode state alone. Sport accents must pass 3:1 against adjacent surfaces when used as meaningful UI.

## 5. Emotional profile

**Evidence.** The current five colored emoji bars are compact but rely on emoji rendering, color, and unlabeled tooltips.

**Recommendation.** Rename the module “Event character.” Default card view shows the top two traits as text chips: `High suspense`, `Historic stakes`. Expanded detail shows five labeled horizontal meters:

```text
Suspense       High       ━━━━━━━━░░
Stakes         Very high  ━━━━━━━━━░
Volatility     Medium     ━━━━━░░░░░
Underdog story Low        ━━░░░░░░░░
Historic value High       ━━━━━━━━░░
```

Use one fill color with varying length; keep numeric values optional behind “Model detail.” Screen-reader text should say “Suspense: high,” not merely “82 percent.”

## 6. Tokens

### Recommended semantic palette

| Token | Light | Dark | Use |
|---|---:|---:|---|
| `canvas` | `#F7F8FA` | `#0B0E14` | page |
| `surface` | `#FFFFFF` | `#121722` | card/panel |
| `surface-subtle` | `#F0F2F5` | `#1A2130` | grouped control |
| `ink` | `#18202B` | `#F1F5F9` | primary text |
| `ink-muted` | `#526071` | `#A9B4C2` | secondary text |
| `border` | `#DCE1E7` | `#303A4A` | separators |
| `action` | `#155EEF` | `#78A6FF` | links/actions |
| `focus` | `#0B63CE` | `#9CC0FF` | focus ring |
| `danger` | `#B42318` | `#FF8A80` | destructive/error |

Tier colors are accents, not backgrounds: Must `#B54708`, Worth `#175CD3`, Highlights `#6941C6`, Skip `#667085`. Validate every text/background pair in implementation; token values are proposals, not a substitute for automated contrast checks.

### Type and spacing

- Font: Inter/system stack already present; self-host or use system fallback to avoid render-blocking external CSS.
- Body: 16/24; metadata 13/18; label 14/20; card title 18/24; section 20/28; page title 32/38.
- Use tabular numerals for durations/scores.
- Weight range: 400, 500, 600; avoid low-contrast 300.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: 6 controls, 10 cards, 14 dialogs; no pill containers except statuses/segmented controls.
- Shadow: none by default; `0 8px 24px rgb(0 0 0 / 12%)` only for overlays.

## 7. Accessibility and safety

**Evidence.** WCAG 2.2 AA requires pointer targets of at least 24×24 CSS px or sufficient spacing; larger targets remain preferable ([W3C target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)). WCAG also covers contrast, reflow, non-text contrast, name/role/value, and focus visibility ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)).

**Recommendation.**

- Adopt WCAG 2.2 AA; use 44×44 px for primary touch controls.
- Use semantic headings, links, buttons, lists, and tables.
- Provide a 2 px focus ring with 2 px offset and ≥3:1 visual change.
- Keep hidden outcomes out of DOM, `aria-label`, image alt text, URLs, page titles, and live-region announcements.
- Reveal uses a confirmation dialog: “Reveal outcome for this event?” Result remains local to that event; offer “Hide again.”
- Announce async updates politely, but never announce live score changes in safe mode.
- Preserve 200% zoom and 320 CSS px reflow without horizontal page scroll.

## 8. Theme and motion

**Evidence.** Apple recommends respecting the system appearance and designing dark surfaces/icons deliberately ([Apple Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)).

**Recommendation.**

- Default to `prefers-color-scheme`; allow explicit Light/Dark/System override.
- Dark mode uses elevated *lighter* surfaces, not white shadows or pure black.
- Verify logos, charts, focus, disabled states, and tier accents in both themes.
- Motion duration: 120–180 ms for state change; 180–240 ms for sheets/dialogs.
- Animate opacity/transform only; no score pulses, auto-scrolling, parallax, or width animation on initial emotional meters.
- Under `prefers-reduced-motion: reduce`, remove nonessential animation and smooth scrolling.

## 9. Loading, empty, and failure states

- **Initial load:** skeleton matches final hierarchy; never show fake scores/text.
- **Refresh:** retain stale plan, add `Updating…`; avoid blanking the page.
- **No events:** “No completed events match these filters” + Reset filters.
- **No preferences:** onboarding panel with three steps; do not show a generic empty feed.
- **Partial provider failure:** keep unaffected sports, mark unavailable section and last updated time.
- **Offline:** retain cached plan, “Offline · updated 07:42.”
- **Unknown viewing provider:** say “Viewing source unavailable,” not a dead Watch button.
- **Error:** plain cause, recovery action, reference ID; avoid technical stack language.

## 10. Visual anti-patterns

- emoji as core iconography;
- gradients inside numeric score badges;
- red/green winner cues in safe mode;
- all-caps paragraphs or condensed broadcast fonts;
- animation tied to “excitement”;
- image-heavy cards with unlicensed team/driver photography;
- translucent text below AA contrast;
- disabled controls without an explanation;
- tables on mobile for decision content.
