# OTW Event Prioritization Engine

> "I missed 30 sporting events this weekend. What should I watch and how should I prioritize?"

## Overview

The Event Prioritization Engine is a personalized recommendation system that helps users discover the most compelling sporting events based on their preferences and objective event quality metrics.

## Core Concept: Priority Score vs Watchability Score

Unlike a simple "watchability score," this system provides **personalized priority scores** - the same event can have different priorities for different users based on:

- What they care about (teams, sports, emotional preferences)
- What actually happened (without spoilers)
- How they want to feel (suspense, drama, upsets, transcendence)

## Emotional Framework

The engine analyzes events across five core emotional dimensions:

| Factor | Description | Detection Method |
|--------|-------------|------------------|
| **Suspense** | Uncertainty of outcome | Close score, lead changes, late drama |
| **Stakes** | Something meaningful at risk | Playoff implications, rivalry, records |
| **Volatility** | Rapid hope/fear shifts | Momentum swings, critical moments |
| **Underdog** | Asymmetry being corrected | Ranking/seed differential |
| **Transcendence** | Instant classic potential | Historic moments, community buzz |

## Priority Tiers

Events are categorized into four tiers:

1. **Must Watch** (Score >= 80) - Don't miss these
2. **Worth Your Time** (Score >= 60) - Solid entertainment
3. **Highlights** (Score >= 40) - Catch the recap
4. **Skip** (Score < 40) - Only for dedicated fans

## User Preferences

### What Users Can Configure

1. **Follows** - Teams, players, leagues they care about
2. **Sport Familiarity** - How well they understand each sport
3. **Emotional Preferences** - What experiences they value:
   - Nail-biters and close finishes
   - Dominant performances
   - Upsets and underdog stories
   - Historic moments
   - Skill displays
   - Intensity
   - Drama

### Spoiler Control

All information is spoiler-safe by default. Users can:
- Set their spoiler tolerance (none, mild, moderate, full)
- Reveal individual event results
- View emotional profiles without knowing outcomes

## Architecture

### Backend (GraphQL Server)

```
graphql-server/src/prioritization/
├── types/
│   ├── emotional-factors.ts    # Emotional framework types
│   ├── user-preferences.ts     # User preference models
│   ├── event-priority.ts       # Priority scoring types
│   └── index.ts
├── services/
│   ├── EmotionalAnalyzer.ts    # Calculates emotional profiles
│   ├── PriorityCalculator.ts   # Calculates personalized priorities
│   └── TagService.ts           # Hybrid tagging system
├── resolvers/
│   └── priorityResolvers.ts    # GraphQL resolvers
└── index.ts
```

### Frontend (SvelteKit)

```
frontend/src/
├── domain/prioritization/
│   └── types.ts                # Frontend type definitions
├── api/
│   └── prioritizationAPI.ts    # GraphQL API client
├── business/services/prioritization/
│   └── PrioritizationService.ts
├── stores/
│   └── prioritizationStore.ts  # Svelte state store
├── components/Discovery/
│   ├── WeekendRecap.svelte     # Main feed component
│   ├── PriorityTierSection.svelte
│   ├── EventCard.svelte
│   ├── EmotionalProfileBar.svelte
│   └── FilterBar.svelte
└── routes/discover/
    └── +page.svelte            # Discovery page route
```

## GraphQL API

### Queries

```graphql
# Get personalized prioritized events
prioritizedEvents(userId: String!, filters: PriorityFiltersInput, viewingContext: ViewingContextInput): PrioritizedEventList!

# Get priority for a single event
eventPriority(eventId: String!, userId: String!): EventPriority

# Get summary statistics
prioritySummary(userId: String!, filters: PriorityFiltersInput): PriorityListSummary!

# Get user preferences
userPreferences(userId: String!): UserPreferences
```

### Mutations

```graphql
# Update preferences
updateUserPreferences(userId: String!, input: UserPreferencesInput!): UserPreferences!

# Manage follows
addUserFollow(userId: String!, follow: UserFollowInput!): UserPreferences!
removeUserFollow(userId: String!, followId: String!): UserPreferences!

# Add tags
addEventTag(userId: String!, input: UserTagInput!): EventTag!
```

## Hybrid Tagging System

Tags come from three sources:

1. **Algorithm** - Auto-generated based on emotional profile
2. **User** - Added by community members
3. **Curator** - Verified by trusted users

Example tags: `#nail-biter`, `#upset`, `#instant-classic`, `#rivalry`, `#comeback`

## Usage

### Access the Discovery Page

Navigate to `/discover` to see your personalized event feed.

### Filtering

- Filter by sports
- Filter by minimum tier
- Show only followed teams
- Filter by tags

### Integration Points

The prioritization engine integrates with:
- NHL game data (implemented)
- Tennis match data (implemented)
- Future: Basketball, Football, Soccer, etc.

## Future Enhancements

1. **Community Layer** - User ratings to validate/adjust algorithm
2. **Watch History** - Track what users have watched
3. **Notifications** - Alert users to must-watch events
4. **Social Features** - See what friends are watching
5. **Curator System** - Trusted user verification
