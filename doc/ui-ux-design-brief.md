# UI/UX Design Brief — OTW.sport

## Project Overview

**OTW.sport** ("OverTime Winner") is "The IMDb of Sporting Events" — a platform for discovering, rating, and recommending unmissable sporting moments. We help users find games worth watching based on drama, tension, and excitement rather than just statistics.

**Live URL:** otw.sport (in development)

**Tech Stack:** SvelteKit, TailwindCSS, GraphQL

---

## What We Need

### 1. Design System / Tokens (Priority: High)

Export as JSON or CSS variables. We'll integrate directly into Tailwind.

**Required tokens:**
- Color palette (primary, secondary, semantic colors, surfaces)
- Typography scale (font sizes, weights, line heights)
- Spacing scale (consistent increments, e.g., 4/8/12/16/24/32px)
- Border radii
- Shadows (if any — we prefer minimal)

**Format example:**
```json
{
  "color": {
    "primary": { "default": "#3B82F6", "hover": "#2563EB" },
    "text": { "default": "#334155", "muted": "#64748B", "subtle": "#94A3B8" },
    "surface": { "default": "#FFFFFF", "raised": "#F8FAFC" },
    "border": { "default": "#E2E8F0" }
  },
  "spacing": {
    "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px"
  },
  "fontSize": {
    "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px"
  },
  "radius": {
    "sm": "6px", "md": "10px", "lg": "16px", "full": "9999px"
  }
}
```

---

### 2. Component Library (Figma)

Design reusable components we can implement as Svelte components.

**Core components needed:**

| Component | Variants/States |
|-----------|-----------------|
| Button | Primary, Secondary, Ghost, Disabled, Loading |
| Card | Default, Hover, Sport card, Game card |
| Input | Default, Focus, Error, Disabled |
| Badge/Tag | Primary, Muted, Status (live, upcoming, finished) |
| Avatar | Image, Initials, Sizes (sm, md, lg) |
| Dropdown/Menu | Open, Closed, With icons |
| Empty State | With icon, title, description, optional action |
| Navigation | Desktop, Mobile, Active states |
| Modal/Dialog | Default, Confirmation |

**For each component, please include:**
- All interactive states (default, hover, focus, active, disabled)
- Light and dark mode variants
- Mobile and desktop sizes where applicable

---

### 3. Page Layouts

Design key pages at **3 breakpoints**: Mobile (375px), Tablet (768px), Desktop (1280px)

**Pages needed:**

| Page | Purpose |
|------|---------|
| **Sports Selection** | Grid of available sports, entry point |
| **Sport Landing** | Overview for a sport (e.g., Ice Hockey) |
| **Games/Events** | Live, upcoming, recently finished games with watchability scores |
| **Game Detail** | Single game view with stats, watchability breakdown, tags |
| **Watchlist** | User's saved games |
| **Profile** | User info, preferences, stats |
| **How It Works** | Explanation of watchability scoring |
| **Auth Callback** | Loading/error states for login |

---

### 4. Sitemap / Information Architecture

A simple diagram showing:
- Page hierarchy
- Navigation structure
- Key user flows (browse → select sport → view games → add to watchlist)

Tool suggestion: FigJam, Miro, or simple diagram in Figma

---

### 5. Interaction Notes

For each page/component, brief annotations on:
- What happens on click/tap
- Hover behaviors
- Loading states
- Error states
- Empty states
- Transitions (if any)

---

## Design Direction

**Tone:** Professional, trustworthy, modern — not playful or gamified

**References we like:**
- Linear (clean, minimal, functional)
- Notion (approachable, good typography)
- Stripe (professional, subtle polish)
- Vercel (modern, developer-friendly)

**What to avoid:**
- Heavy shadows or 3D effects
- Overly colorful / rainbow palettes
- Gamification elements (badges, achievements, points)
- Cluttered information density

**Key principles:**
- Light, airy feel with generous whitespace
- Subtle borders over shadows
- Clear typography hierarchy
- Consistent iconography (we'll use Lucide or similar)
- Mobile-first responsive design

---

## Deliverables Checklist

```
[ ] Design tokens (JSON export)
[ ] Figma component library
[ ] Page designs (mobile + desktop)
[ ] Sitemap / IA diagram
[ ] Interaction annotations
[ ] Icon set recommendation (or custom icons if needed)
```

---

## Implementation Context

Your designs will be implemented by an AI coding assistant (Claude) working with SvelteKit and TailwindCSS. To optimize this workflow:

1. **Use consistent naming** — Component names should be clear (e.g., "Button/Primary" not "CTA-v2-final")
2. **Use auto-layout in Figma** — Maps cleanly to flexbox/grid
3. **Export tokens** — We can directly convert JSON tokens to Tailwind config
4. **Annotate spacing** — Explicit px values help avoid guessing
5. **Show all states** — Don't assume hover/loading states will be inferred

---

## Questions?

Before starting, please clarify:
1. Any brand colors or existing assets to incorporate?
2. Preferred icon style (outlined, filled, duotone)?
3. Any accessibility requirements beyond WCAG AA?
4. Timeline and milestones?

---

## Contact

[Your contact info here]
