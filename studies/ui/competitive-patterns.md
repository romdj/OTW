# Competitive UI Patterns

## Method and caveat

This is a pattern review, not a pixel-by-pixel teardown. Public product documentation was used where possible; no proprietary layouts should be copied. Product features can change, so links should be rechecked during implementation.

## Direct sports products

### SportsRec

**Evidence.** SportsRec groups games into named tiers, hides outcomes by default, and uses staged disclosure: card → spoiler-free recommendation → explicit reveal. It also provides “start watching from” guidance. Its own FAQ states that scores, outcomes, and probability charts remain hidden until reveal ([SportsRec FAQ](https://sportsrec.app/faq); [spoiler-free guide](https://sportsrec.app/guide/spoiler-free-sports)).

**Transferable pattern.** A tier is faster to scan than a naked number, and staged disclosure makes safety legible.

**Recommendation.** OTW should differentiate through personal fit and time budgeting: “Best for you · Full replay · 48 min,” with score in metadata. Avoid SportsRec’s exact tier labels, thresholds, or page composition.

### Official NHL

**Evidence.** The NHL app combines favorite-team personalization, scores, play-by-play, highlights, advanced stats, notifications, and “How To Watch” availability ([NHL app](https://www.nhl.com/app/nhl-app)).

**Transferable pattern.** Viewing availability belongs next to the event decision.

**Recommendation.** Show a provider-neutral “Viewing options” action only when verified availability exists. OTW should not mimic dense Gamecenter screens on the discovery surface.

### Official ATP/WTA

**Evidence.** The joint official app spans scores, schedules, draws, rankings, news, and stats; Tennis TV handles on-demand ATP video ([ATP apps](https://www.atptour.com/en/apps)).

**Transferable pattern.** Tennis users need tournament, round, surface, singles/doubles, and session context—not just player names.

**Recommendation.** Keep that context on one restrained eyebrow line; do not import draw or ranking density into recommendation cards.

### Official Formula 1

**Evidence.** F1’s official live timing foregrounds position, lap time, gaps, tyres, and telemetry ([F1 Live Timing](https://www.formula1.com/en/timing/f1-live)).

**Transferable pattern.** F1’s event object is a weekend/session, not a two-sided match.

**Recommendation.** The shared card heading slot must accept `participants` or an `eventTitle`: “Belgian Grand Prix · Race,” never force “A vs B.” Live-timing density belongs in detail, not discovery.

## Non-sports recommendation products

### Letterboxd

**Evidence.** Letterboxd distinguishes a one-click watchlist from curated lists and automatically removes a title when marked watched ([watchlist explanation](https://letterboxd.zendesk.com/hc/en-us/articles/15179261056143-What-s-the-difference-between-my-lists-and-my-watchlist)). Its paid tier filters availability by favorite streaming services and can notify when content becomes available ([Pro features](https://letterboxd.com/about/pro/)).

**Transferable pattern.** “Save for later” and “plan to consume” are distinct from rating and history.

**Recommendation.** OTW needs one quick Queue action; after “Watched,” the event moves to History. Custom lists and social activity are later-stage features.

### Streaming recommendation surfaces

**Evidence.** Recommendation products commonly use horizontal collections, but their objective is extended browsing. OTW’s objective is faster commitment.

**Recommendation.** Prefer a ranked vertical feed over carousels. Carousels hide inventory, complicate keyboard use, and make tier comparison harder. Use them only for optional editorial collections.

## Pattern matrix

| User need | Established pattern | OTW adaptation |
|---|---|---|
| Decide quickly | Tiered/ranked slate | Ranked personal plan with one lead event |
| Avoid outcomes | Hidden score + explicit reveal | Global safe mode + two-step reveal |
| Know why | Score breakdown | Two plain-language reasons, details on demand |
| Fit limited time | Start-from marker | Full / condensed / highlights + duration |
| Recognize domain | League/team branding | Neutral shell + controlled sport accent |
| Save intent | Watchlist toggle | Queue with automatic Watched transition |
| Find access | Provider availability | Verified viewing options with territory note |

## Anti-patterns to reject

- **Scoreboard mimicry:** scores, red “LIVE” pills, tables, and tickers create the wrong expectation.
- **Betting visual language:** neon green/red deltas, odds-like decimals, and urgent pulse animation weaken trust.
- **Poster-grid borrowing:** events lack stable portrait artwork; forcing imagery adds noise and licensing risk.
- **Rainbow sports:** a completely different palette and component set per sport fragments the product.
- **Hero-score fixation:** a large `87` exposes model confidence without explaining the action.
- **Accidental spoilers:** team-color win cues, winner-first ordering, celebration photos, score-shaped summaries, or accessibility labels containing hidden results.
- **Hover-only meaning:** unavailable on touch and keyboard.
- **Horizontal recommendation rails:** obscure ranking and increase navigation cost.

## Competitive opportunity

**Evidence.** Direct competitors prove that spoiler-free tiering is understandable; official sports apps prove that sport detail quickly becomes dense.

**Recommendation.** OTW’s UI moat should be a coherent decision grammar across sports:

> personal fit + available time + recommended format + safe explanation.

No reviewed product makes those four elements the consistent primary hierarchy.
