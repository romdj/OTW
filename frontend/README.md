# 🏒 OTW.sport Frontend

The web interface for **otw.sport** - "The IMDb of Sporting Events". A SvelteKit application that allows users to discover, rate, and share unmissable sporting moments across all sports.

## 🎯 Purpose

This frontend serves as the primary web interface for the otw.sport platform, focusing on:

- **Event Discovery**: Browse and search through sporting events by sport, league, or emotional tags
- **Rating & Reviews**: Rate events and write reviews with emotional descriptors ("nail-biter", "upset", "comeback")
- **Community Features**: Create and share curated lists of must-watch sporting moments
- **Cross-Sport Recommendations**: Discover great events outside your favorite sports
- **Historical Context**: Understand the significance and story behind each event

## 🏗️ Architecture

### Technology Stack
- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS + DaisyUI for consistent design system
- **State Management**: Svelte stores for reactive state
- **GraphQL Client**: URQL for efficient API integration
- **Testing**: Vitest for unit and component testing
- **Build**: Vite for fast development and optimized production builds

### Directory Structure
```
src/
├── api/                    # GraphQL client and API integrations
├── business/              # Business logic and use cases
├── components/            # Reusable Svelte components
│   ├── Table/            # Sports standings and event tables
│   └── UI/               # Generic UI components
├── domain/               # Data models and types
├── routes/               # SvelteKit routes and pages
├── stores/               # Svelte stores for state management
├── styles/               # Global CSS and theme files
└── utils/                # Utility functions and helpers
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

### Available Scripts
```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # Svelte type checking
npm run test         # Run Vitest tests
npm run test:coverage # Test coverage report
npm run lint         # ESLint code linting
```

## 🎨 Design System

The frontend uses a consistent design system based on:

- **Colors**: DaisyUI theme with dark/light mode support
- **Typography**: System fonts with readable hierarchies
- **Components**: Reusable UI components with props-based configuration
- **Responsiveness**: Mobile-first design with Tailwind breakpoints
- **Accessibility**: ARIA labels and semantic HTML

## 📊 Key Features

### Multi-Sport Support
- Modular architecture supporting any sport
- Dynamic GraphQL queries based on sport type
- Consistent UI patterns across different sports

### Event Discovery
- Advanced filtering by sport, league, date, rating
- Emotional tag-based discovery ("thrilling", "historic", "comeback")
- Personalized recommendations based on user preferences

### Interactive Rating System
- 1-10 rating scale with emotional descriptors
- Community-driven tagging system
- Review system with spoiler warnings

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Progressive web app capabilities

## 🔧 Development

### State Management
The app uses Svelte stores for state management:

- **`standingsStore`**: Current sporting event standings
- **`themeStore`**: Dark/light mode preferences
- **`viewStore`**: Current view state and filters
- **`errorStore`**: Global error handling

### GraphQL Integration
URQL client handles GraphQL operations:

```typescript
// Example query
const standingsQuery = `
  query GetStandings($sport: String!, $date: String) {
    standings(sport: $sport, date: $date) {
      teamName
      wins
      losses
      rating
      emotionalTags
    }
  }
`;
```

### Component Architecture
Components follow a consistent pattern:

```svelte
<script lang="ts">
  // Props and reactive statements
  export let data: EventData;
  
  // Business logic
  import { someBusinessLogic } from '../business';
</script>

<!-- Template with semantic HTML -->
<article class="card">
  <h2>{data.title}</h2>
  <!-- Component content -->
</article>

<style>
  /* Component-specific styles */
</style>
```

## 🧪 Testing

The frontend includes comprehensive testing:

```bash
# Run all tests
npm run test

# Watch mode for development  
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Business logic and utilities
- **Component Tests**: Svelte component behavior
- **Integration Tests**: API interactions and user flows

## 🌐 Integration with Platform

### GraphQL API
Connects to the multi-sport GraphQL server for:
- Real-time event data
- User ratings and reviews
- Community-generated content
- Personalized recommendations

### Mobile App Sync
Shares design patterns and data models with the Flutter mobile app for consistent user experience.

### Database Integration
Interfaces with the hybrid database architecture:
- **MongoDB**: Event details, user profiles, reviews
- **Neo4j**: Recommendations, relationships, social features

## 📱 Progressive Web App

The frontend is configured as a PWA with:
- Offline capability for cached events
- Push notifications for new recommendations
- App-like experience on mobile devices
- Fast loading with service worker caching

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Configuration
Configure environment variables in `.env`:

```env
PUBLIC_GRAPHQL_ENDPOINT=https://api.otw.sport/graphql
PUBLIC_APP_NAME=otw.sport
PUBLIC_VERSION=1.0.0
```

## 🤝 Contributing

1. Follow the established component patterns
2. Maintain TypeScript strict mode compliance
3. Add tests for new features
4. Use semantic commit messages
5. Ensure accessibility compliance

## 📚 Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [TailwindCSS Guide](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)
- [URQL GraphQL Client](https://formidable.com/open-source/urql/)

---

**Part of the otw.sport ecosystem** - Building "The IMDb of Sporting Events" 🏆