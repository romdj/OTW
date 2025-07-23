# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**otw** (OverTime Winner) is "The IMDb of Sporting Events" - a platform for discovering, reviewing, and recommending unmissable sporting events. The platform will be available at **otw.sport**. The project captures the intangibles of great sports moments: drama, tension, passion, and skill rather than just statistics.

## Key Development Commands

**Root level:**
```bash
npm run install:all        # Install all dependencies
npm run dev                 # Start GraphQL server in development
npm run dev:frontend        # Start frontend development server
npm run build              # Build both server and frontend
npm run test               # Run all tests
npm run test:coverage      # Run tests with coverage
npm run lint               # Lint all code
npm run check              # Type checking
npm run complete-build     # Clean build with all checks
```

**GraphQL Server (graphql-server/):**
```bash
npm run dev                # Development with nodemon
npm start                  # Production start
npm test                   # Backend tests
npm run build              # TypeScript compilation
```

**Frontend (frontend/):**
```bash
npm run dev                # Vite development server
npm run build              # Production build
npm run preview            # Preview production build
npm run check              # Svelte type checking
npm run test               # Vitest tests
npm run test:coverage      # Coverage reporting
```

## Architecture & Technology Stack

**Technology Stack:**
- **Frontend**: SvelteKit + TypeScript + TailwindCSS + DaisyUI
- **Backend**: Fastify + Mercurius (GraphQL) + TypeScript
- **Testing**: Vitest (frontend), Jest (backend)
- **Build**: Vite, ts-node, TypeScript
- **Data**: GraphQL with URQL client

**Project Organization:**
- Monorepo with workspaces (frontend, graphql-server, shared)
- Clean architecture with business logic separation
- GraphQL schema-first development
- Component-based UI architecture
- Comprehensive testing strategy

**Key Architectural Concepts:**
- Domain-driven design in `business/` directories
- Reactive state management with Svelte stores
- GraphQL for efficient data fetching
- Responsive, mobile-first design patterns
- Real-time data processing and transformation

## Development Guidelines

When working on otw:

1. **Follow established patterns** from the existing codebase structure
2. **Technology choices** should align with the proven stack (TypeScript, SvelteKit, GraphQL)
3. **Testing approach** should follow established patterns (Vitest for frontend, Jest for backend)
4. **Code organization** should mirror the clean architecture shown in the codebase
5. **Build processes** should be consistent across components
6. **Focus on the vision**: Capture the emotional and experiential aspects of sporting events

## Project Structure

```
otw.sport/
├── frontend/                # SvelteKit frontend
│   ├── src/
│   │   ├── api/                 # GraphQL client and API calls
│   │   ├── components/          # Svelte components
│   │   ├── domain/             # Data models and types
│   │   ├── routes/             # SvelteKit routes
│   │   ├── stores/             # Svelte stores for state management
│   │   ├── styles/             # CSS and styling
│   │   └── utils/              # Utility functions
├── graphql-server/             # GraphQL backend
│   ├── src/
│   │   ├── config/             # Server configuration
│   │   ├── graphql/            # GraphQL schema and resolvers
│   │   └── utils/              # Backend utilities
├── flutter-app/                # Flutter mobile app (planned)
├── shared/                     # Shared constants and utilities
└── doc/                        # API documentation
```

## Development Focus

The platform is designed to become the definitive destination for:
- Rating and tagging events with emotional descriptors ("nail-biters", "historic moments", "explosive finishes")
- Creating curated lists of unmissable sporting moments
- Building a rich, emotional archive of sports history
- Community-driven discovery of worth-watching events

## Flutter App Development

The `flutter-app/` directory is planned for future mobile development. When implementing:
- Focus on event alerts and notifications
- Implement offline viewing & caching
- Consider biometric login integration
- Follow Flutter best practices for cross-platform development