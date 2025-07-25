# 🏆 otw.sport — The IMDb of Sporting Events

**otw** (OverTime Winner) is a platform designed to become the go-to destination for discovering, reviewing, and recommending **sporting events worth watching** — past, present, or upcoming. Think IMDb, but for sports.

Visit us at **otw.sport** - The IMDb of Sporting Events.

---

## 🚀 Project Structure

The repository is organized into these main components:

* **frontend/** → SvelteKit web interface for browsing, rating, and discovering events
* **app/** → Flutter mobile app (iOS & Android) for on-the-go access and notifications
* **graphql-server/** → Multi-sport GraphQL API with modular architecture
* **DB/** → Hybrid database architecture (MongoDB + Neo4j) for events and relationships
* **dev-tools/** → Development utilities and debugging tools
* **shared/** → Common constants and utilities across all modules

---

## ✨ Vision

The project captures the **intangibles** of great sporting events — not just scores or stats, but **drama**, **tension**, **passion**, and **skill**. Users can:
- Rate and tag games as *"nail-biters"*, *"historic moments"*, *"explosive finishes"*, etc.
- Browse curated lists (e.g. *Top 10 Upsets in Tennis*, *Most Intense F1 Races*)
- Contribute reviews and metadata to build a rich, emotional archive of sports history.

---

## 🧱 Tech Stack

| Component       | Stack/Tooling                 |
|----------------|-------------------------------|
| Frontend       | SvelteKit + TypeScript + TailwindCSS + DaisyUI |
| Flutter App    | Dart + Flutter SDK            |
| Backend        | Fastify + Mercurius (GraphQL) + TypeScript |
| Database       | MongoDB (planned)             |
| Testing        | Vitest (frontend), Jest (backend) |
| Build          | Vite, ts-node, TypeScript     |
| Data           | GraphQL with URQL client      |
| Auth           | Auth0 / OpenID Connect        |
| CI/CD          | GitHub Actions                |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 22.x or higher
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/otw.sport.git
   cd otw.sport
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the GraphQL server**
   ```bash
   npm run dev
   ```

4. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev:frontend
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

### Development Commands

#### Root Level
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

#### GraphQL Server
```bash
cd graphql-server
npm run dev                # Development with nodemon
npm start                  # Production start
npm test                   # Backend tests
npm run build              # TypeScript compilation
```

#### Frontend
```bash
cd frontend
npm run dev                # Vite development server
npm run build              # Production build
npm run preview            # Preview production build
npm run check              # Svelte type checking
npm run test               # Vitest tests
npm run test:coverage      # Coverage reporting
```

---

## 🏗️ Architecture

### Project Structure

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
│   ├── static/                 # Static assets
│   └── Configuration files
├── graphql-server/             # GraphQL backend
│   ├── src/
│   │   ├── config/             # Server configuration
│   │   ├── graphql/            # GraphQL schema and resolvers
│   │   └── utils/              # Backend utilities
│   ├── tests/                  # Backend tests
│   └── Configuration files
├── app/                        # Flutter mobile application
├── DB/                         # Database architecture
│   ├── mongodb/              # Document storage schemas
│   ├── neo4j/                # Graph relationships
│   └── shared/               # Common database utilities
├── dev-tools/                  # Development and debugging tools
├── shared/                     # Shared constants and utilities
├── doc/                        # API documentation
├── .github/workflows/          # CI/CD configuration
└── Configuration files
```

### Key Architectural Concepts
- **Domain-driven design** in `business/` directories
- **Reactive state management** with Svelte stores
- **GraphQL** for efficient data fetching
- **Responsive, mobile-first** design patterns
- **Real-time data processing** and transformation
- **Clean architecture** with business logic separation

---

## 📊 API Design

The application uses a GraphQL API for efficient data fetching. The schema will be designed around sporting events, user ratings, and community-generated content:

```graphql
type Event {
  id: ID!
  title: String!
  sport: String!
  date: DateTime!
  participants: [String!]!
  rating: Float
  tags: [String!]!
  reviews: [Review!]!
  # ... additional fields
}

type Review {
  id: ID!
  user: User!
  rating: Int!
  content: String
  tags: [String!]!
  createdAt: DateTime!
}

type Query {
  events(sport: String, dateRange: DateRange): [Event!]!
  event(id: ID!): Event
  trendingEvents: [Event!]!
}
```

---

## 📂 Subfolders

### `/frontend`
> Web application interface  
- Search, filters, and event exploration  
- Ratings breakdown and user-generated tags  
- Responsive layout and accessibility  

### `/app`
> Cross-platform Flutter mobile application
- Real-time event alerts and notifications  
- Offline viewing & caching  
- Social features and friend activity
- Biometric authentication  

### `/graphql-server`
> API layer exposing all event data  
- Normalized event schema  
- Queries: trending events, user ratings, metadata  
- Mutations: submit review, tag event, suggest edit  

---

## 🧪 Testing

### Test Structure
```
├── graphql-server/tests/
│   ├── graphql/
│   │   ├── resolvers/          # GraphQL resolver tests
│   │   └── schemas/            # Schema validation tests
│   └── utils/                  # Utility function tests
└── frontend/src/
    └── **/*.spec.ts            # Component and utility tests
```

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests
cd graphql-server && npm test

# Run frontend tests
cd frontend && npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🔄 Development Workflow

### Conventional Commits
This project uses conventional commits for automated versioning:

```bash
feat: add event rating functionality
fix: resolve table sorting issue
docs: update API documentation
chore: update dependencies
```

### Code Style
- **TypeScript**: Strict typing throughout
- **ESLint**: Enforced code style
- **Conventional Commits**: Standardized commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for sports enthusiasts**

*Building the definitive platform for discovering unmissable sporting moments.*