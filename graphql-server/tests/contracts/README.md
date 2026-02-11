# Contract Tests

Contract tests verify that external APIs still return response shapes matching our TypeScript types.

## Purpose

These tests:
- Hit **real APIs** (not mocks)
- Verify response structure matches expectations
- Catch breaking API changes before they hit production
- Document the actual API contracts we depend on

## Prerequisites

### NHL API
- No API key required
- Public API at `https://api-web.nhle.com/v1`

### BALLDONTLIE API
1. Sign up at https://www.balldontlie.io/
2. Get your API key
3. Add to `.env`:
   ```
   BALLDONTLIE_API_KEY=your_key_here
   ```

## Running

```bash
# Run all contract tests
npm run test:contracts

# Run specific contract test
npm run test:contracts -- --testPathPattern=nhl
```

## Rate Limits

- **BALLDONTLIE**: 5 requests/minute on free tier
- **NHL**: No published rate limit (be respectful)

Contract tests are designed to make minimal API calls. Run them sparingly.

## What These Tests Verify

### NHL (`nhl.contract.test.ts`)
- `/standings/now` - Team standings with points, wins, losses
- `/schedule/now` - Game schedule structure
- `/score/now` - Live scores structure

### BALLDONTLIE Tennis (`balldontlie-tennis.contract.test.ts`)
- `/tennis/players` - Player data with rankings
- `/tennis/tournaments` - Tournament schedule
- `/tennis/matches` - Match data

### BALLDONTLIE F1 (`balldontlie-f1.contract.test.ts`)
- `/formula1/races` - Race calendar with sessions
- `/formula1/drivers` - Driver standings
- `/formula1/constructors` - Constructor standings

## When to Update

Update these tests when:
1. An external API changes (add new field checks)
2. We start using new API endpoints
3. API documentation differs from reality
