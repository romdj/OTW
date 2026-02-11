# Test Strategy

This project uses a lean two-layer test pyramid optimized for a data-fetching service.

## Test Layers

### Unit Tests (`tests/unit/*.unit.test.ts`)

**Purpose:** Test pure business logic in isolation.

**Characteristics:**
- No I/O (no network, no file system)
- No mocking of external services
- Fast execution (< 1 second total)
- Run on every commit

**What we test:**
- F1 points calculations and championship math
- Cycling excitement scoring algorithm
- Tennis score formatting
- Data transformation logic

**Run:** `npm test`

### Contract Tests (`tests/contracts/*.contract.test.ts`)

**Purpose:** Verify external APIs still return expected response shapes.

**Characteristics:**
- Hit REAL APIs (NHL, BALLDONTLIE, etc.)
- Verify response structure matches our TypeScript types
- Catch breaking API changes before they hit production
- Rate-limited, run separately from CI

**What we test:**
- NHL API response shapes
- BALLDONTLIE Tennis API response shapes
- BALLDONTLIE F1 API response shapes

**Prerequisites:**
- `BALLDONTLIE_API_KEY` in `.env` for BALLDONTLIE tests
- Network access

**Run:** `npm run test:contracts`

## Why Not Integration Tests?

Integration tests with HTTP mocking (nock) test our mocks against our code - circular validation. If an external API changes, mocked tests still pass. Contract tests against real APIs catch actual breaks.

## Running Tests

```bash
# Unit tests only (fast, no API keys needed)
npm test

# Contract tests only (needs API keys, hits real APIs)
npm run test:contracts

# All tests
npm run test:all
```

## Adding Tests

### When to add a unit test:
- You wrote a pure function with actual logic
- The function has edge cases worth documenting
- The function could break and tests would catch it

### When to add a contract test:
- You integrate with a new external API
- An API has undocumented behavior you want to lock in
- You've been bitten by an API change before

### When NOT to add a test:
- Testing that mock data has the properties you put in it
- Testing trivial getters/setters
- Testing framework behavior (GraphQL resolvers returning what services return)
