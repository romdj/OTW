# Repository Guidelines

## Project Structure & Module Organization

OTW is a monorepo for discovering and rating memorable sporting events. Its main packages are:

- `frontend/`: SvelteKit, TypeScript, Tailwind CSS, and DaisyUI. Application code is under `src/`; static assets live in `static/`.
- `graphql-server/`: Fastify/Mercurius GraphQL API. Schemas and resolvers are in `src/graphql/`, sport-specific modules in `src/sports/`, and tests in `tests/`.
- `app/`: Flutter mobile application, with code in `lib/` and tests in `test/`.
- `DB/`: database schemas and utilities; `shared/` contains cross-package configuration and constants.
- `dev-tools/` and `doc/`: debugging utilities and architecture/feature documentation.

Keep domain logic near its sport or feature. Follow existing adapters, services, schema-first GraphQL, and component patterns rather than introducing parallel abstractions.

## Build, Test, and Development Commands

Use Node.js 22 or newer.

- `npm run install:all`: install root and package dependencies.
- `npm run dev`: run the GraphQL server with reload; `npm run dev:frontend` starts Vite separately.
- `npm run build`: build the server, frontend, and Flutter debug app.
- `npm run test`: run package test suites in parallel.
- `npm run lint`: run ESLint and Flutter analysis.
- `npm run check`: run TypeScript and Svelte type checks.
- `npm run validate:all`: run tests, linting, type checks, and builds before a PR.

Run package-specific commands from `frontend/` or `graphql-server/` for faster feedback.

## Coding Style & Naming Conventions

Use LF endings, final newlines, and two-space indentation for JavaScript, TypeScript, JSON, and YAML. Follow the shared ESLint configuration. Prefix intentionally unused variables or parameters with `_`; avoid `any` and console output except established logging/error paths.

Use `PascalCase` for components, classes, and adapters; `camelCase` for functions and variables; and names that match existing patterns such as `standingsService.ts` or `cycling.unit.test.ts`.

## Testing Guidelines

Frontend tests use Vitest; backend tests use Jest. Name isolated backend tests `tests/unit/*.unit.test.ts` and live external-API checks `tests/contracts/*.contract.test.ts`. Run contracts explicitly with `cd graphql-server && npm run test:contracts`; they require network access and may require `BALLDONTLIE_API_KEY`. Aim for at least 80% coverage, with 85–90% on critical resolvers and utilities.

## Commit & Pull Request Guidelines

Use small, working Conventional Commits, as reflected in history: `feat(api): ...`, `fix(lint): ...`, `docs: ...`, or `refactor(tests): ...`. Prefer short-lived `feature/*` branches and keep `main` deployable.

PRs must explain motivation, identify the change type, link issues, list verification performed, and include screenshots for UI changes. Ensure lint, types, relevant tests, and builds pass before requesting review.
