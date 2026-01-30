# Contributing to otw.sport

Thank you for your interest in contributing to **otw** - The IMDb of Sporting Events! This guide outlines our development workflow, branching strategy, and contribution standards.

## 📋 Quick Start

1. **Fork and clone** the repository
2. **Create a feature branch** from `main`
3. **Use conventional commits** for all changes
4. **Run local validation** before pushing
5. **Create a Pull Request** to `main`

## 🌳 Trunk-Based Development Strategy

We use **trunk-based development** with short-lived feature branches and continuous integration to `main`.

### Branch Types

| Branch Type | Purpose | Naming Convention | Lifespan | Example |
|-------------|---------|-------------------|----------|---------|
| `main` | Production-ready code, always deployable | `main` | Permanent | `main` |
| Feature | New features or enhancements | `feat/description` | < 1 day | `feat/event-rating-system` |
| Bugfix | Bug fixes | `fix/description` | < 1 day | `fix/search-filters` |
| Hotfix | Critical production fixes | `hotfix/description` | < 2 hours | `hotfix/security-patch` |

### Trunk-Based Development Workflow

```mermaid
graph LR
    A[feature/new-feature] -->|< 1 day| B[main]
    B --> C[Automatic Release]
    C --> D[Production]
    
    E[fix/bug-fix] -->|< 1 day| B
    F[hotfix/critical-fix] -->|< 2 hours| B
```

**Key Principles:**
- **Main is always deployable** - All merges must pass full validation
- **Short-lived branches** - Feature branches live less than 1 day
- **Frequent integration** - Push to main multiple times per day
- **Feature flags** - Use toggles for incomplete features
- **No release branches** - Releases happen automatically on main

## 🚀 Development Process

### 1. Creating a Feature Branch

```bash
# Start from latest main (always up to date)
git checkout main
git pull origin main

# Create and switch to short-lived feature branch
git checkout -b feat/event-discovery-feature

# Goal: Merge back to main within 24 hours
```

### 2. Development with Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Features (minor version bump)
git commit -m "feat: add event rating and tagging system"
git commit -m "feat(ui): implement event discovery filters"

# Bug fixes (patch version bump)
git commit -m "fix: resolve event search pagination issue"
git commit -m "fix(api): handle missing event metadata gracefully"

# Breaking changes (major version bump)
git commit -m "feat!: redesign event schema for v2"
# or
git commit -m "feat: redesign event API endpoints

BREAKING CHANGE: All endpoints now require authentication headers"

# Other types
git commit -m "docs: update event rating API documentation"
git commit -m "test: add integration tests for event service"
git commit -m "chore: update dependencies to latest versions"
git commit -m "style: fix linting issues in components"
git commit -m "refactor: extract event logic into services"
```

### 3. Local Validation

Before pushing, run our validation suite:

```bash
# Quick validation (runs automatically on commit)
npm run lint
npm run check
npm test

# Full validation (runs automatically on push)
npm run release:prepare
```

### 4. Creating Pull Requests

```bash
# Push feature branch
git push origin feat/event-discovery-feature

# Create PR through GitHub UI or CLI
gh pr create --title "feat: add event discovery feature" --body "Description of changes"
```

**PR Requirements:**
- ✅ All CI checks must pass
- ✅ Code review approval required
- ✅ Conventional commit format
- ✅ Tests included for new features
- ✅ Documentation updated if needed

### 5. Merging Strategy

**Use "Squash and Merge"** to maintain clean history:
- Squashes all feature commits into one
- Ensures conventional commit format in main branch
- Enables proper semantic-release versioning

## 📦 Trunk-Based Release Strategy

We use **continuous releases** aligned with trunk-based development:

### Automatic Continuous Releases

Every successful merge to `main` triggers an automatic release:

```bash
feat/event-ratings → main → CI validation passes → automatic v0.3.0 release
```

**Release Flow:**
1. **Feature merged to main** - All parallel component validation passes
2. **Semantic versioning** - Version determined by conventional commits
3. **Automatic release** - Tagged and published to GitHub releases
4. **Production deployment** - Immediately available for deployment

**No manual release management** - The system handles versioning and releases automatically.

## 🛠️ Development Commands

### Essential Commands

```bash
# Development
npm run dev                    # Start development servers
npm run dev:frontend          # Start frontend only
npm run dev:server            # Start GraphQL server only

# Quality Assurance
npm run lint                  # Lint all code
npm run lint -- --fix        # Auto-fix linting issues
npm run check                 # Type checking
npm run test                  # Run all tests
npm run test:coverage         # Run tests with coverage

# Building
npm run build                 # Build all packages
npm run clean                 # Clean build artifacts

# Release Management
npm run version:bump:patch    # Manual version bump (patch)
npm run version:bump:minor    # Manual version bump (minor)
npm run version:bump:major    # Manual version bump (major)
npm run release:prepare       # Full release validation
npm run semantic-release      # Automated release
```

### Docker Commands

```bash
npm run docker:up             # Start development containers
npm run docker:down           # Stop containers
npm run docker:logs           # View container logs
npm run docker:clean          # Clean up containers and images
```

## 🏗️ Project Structure

```
otw.sport/
├── frontend/                 # SvelteKit frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── business/         # Business logic layer
│   │   ├── stores/          # Svelte stores
│   │   └── utils/           # Utility functions
├── graphql-server/          # Fastify GraphQL server
│   ├── src/
│   │   ├── graphql/         # GraphQL schemas and resolvers
│   │   ├── config/          # Configuration management
│   │   └── utils/           # Server utilities
├── shared/                  # Shared constants and types
├── flutter-app/             # Flutter mobile app (planned)
├── scripts/                 # Build and release scripts
├── .github/workflows/       # CI/CD workflows
└── doc/                     # Documentation
```

## 🧪 Testing Guidelines

### Test Requirements

- **New features** must include tests
- **Bug fixes** should include regression tests
- **Maintain coverage** above 80% where possible

### Test Types

```bash
# Unit tests
npm run test:frontend         # Frontend unit tests (Vitest)
npm run test:server          # Server unit tests (Jest)

# Integration tests
npm run test:coverage        # Full test suite with coverage

# E2E tests (when implemented)
npm run test:e2e             # End-to-end tests
```

## 📝 Code Standards

### TypeScript

- Use **strict TypeScript** configuration
- Avoid `any` types - use proper typing
- Export interfaces and types for reusability

### Code Style

- **ESLint** for code quality
- **Prettier** formatting (automatic via pre-commit)
- **Conventional naming** for files and functions

### Component Guidelines

- **Single responsibility** - one concern per component
- **Props interface** - define clear component APIs
- **Business logic** - extract to services, not in components
- **Error boundaries** - handle errors gracefully

## 🔒 Security Guidelines

- **Never commit secrets** or API keys
- **Audit dependencies** regularly (`npm audit`)
- **Review security alerts** in GitHub
- **Follow OWASP guidelines** for web security

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (browser, Node version)
- **Screenshots** if applicable

### Feature Requests

Include:
- **Use case description**
- **Proposed solution**
- **Alternative approaches considered**

## 🤝 Code Review Process

### For Authors

- **Self-review** your changes before requesting review
- **Write descriptive** PR descriptions
- **Respond promptly** to review feedback
- **Keep PRs focused** - one feature per PR

### For Reviewers

- **Be constructive** and helpful
- **Focus on code quality** and maintainability
- **Check for test coverage**
- **Verify conventional commit format**

## 🏆 otw.sport Vision

When contributing, keep in mind our core mission:

- **Capture the intangibles** - Focus on drama, tension, passion, and skill, not just statistics
- **Community-driven discovery** - Help users find unmissable sporting moments
- **Emotional tagging** - Support descriptors like "nail-biters", "historic moments", "explosive finishes"
- **Rich sports archive** - Build a comprehensive emotional record of sports history

## 📚 Additional Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Release Process](./RELEASE.md)
- [Project README](./README.md)

## ❓ Getting Help

- **Create an issue** for bugs or questions
- **Check existing issues** before creating new ones
- **Join discussions** for feature planning

---

Thank you for contributing to **otw.sport** - helping build The IMDb of Sporting Events! 🏆