# Session: 2026-02-11 - ESLint Configuration Fix

## Context

Continuing from test restructuring work. Pre-commit hooks were blocking commits due to 78+ ESLint errors. This session focused on resolving the root cause of lint failures.

Previous session reference: 2026-02-08-frontend-sports-ui.md

## Problem

ESLint was reporting `no-unused-vars` errors for parameters that were already prefixed with underscores (`_param`). The underscore convention is standard for intentionally unused parameters, but ESLint wasn't respecting it.

**Root Cause**: The base ESLint `no-unused-vars` rule was enabled alongside `@typescript-eslint/no-unused-vars`. The base rule doesn't understand TypeScript and doesn't respect the `argsIgnorePattern` configured in the TypeScript version.

Example errors:
```
src/sports/american-football/leagues/nfl/NFLLeagueAdapter.ts
  46:22  error  '_season' is defined but never used  no-unused-vars
```

## Solution

Updated `shared/eslint.config.base.js` to disable the base rule:

```javascript
rules: {
  // Disable base rule - it conflicts with the TypeScript version
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }
  ],
  // ... other rules
}
```

## Files Modified

1. **`shared/eslint.config.base.js`**
   - Added `'no-unused-vars': 'off'` to prevent base rule conflicts

2. **`graphql-server/src/prioritization/services/PriorityCalculator.ts`**
   - Removed now-unnecessary `// eslint-disable-next-line @typescript-eslint/no-unused-vars` comment

3. **`graphql-server/src/sports/shared/interfaces/SportsService.ts`**
   - Removed now-unnecessary `/* eslint-disable no-unused-vars */` block comment

## Result

- GraphQL server lint: **0 errors, 0 warnings** ✅
- Reduced from 78 errors to 0
- Pre-commit hooks should now pass for graphql-server changes

## Technical Notes

### ESLint Flat Config (v9+)
This project uses ESLint 9.x with flat config format (`eslint.config.js`). The shared base config pattern allows consistent rules across workspaces:

```
shared/eslint.config.base.js  <- Base rules defined here
├── graphql-server/eslint.config.js  <- Imports and extends
└── frontend/eslint.config.js        <- Imports and extends
```

### TypeScript ESLint Pattern
When using TypeScript with ESLint, always:
1. Disable the base `no-unused-vars` rule
2. Enable `@typescript-eslint/no-unused-vars` with patterns
3. Use underscore prefix (`_param`) for intentionally unused parameters

### Frontend Lint Status
Frontend has separate issues (23 errors, 20 warnings) unrelated to this fix:
- Unused variables in Svelte components
- Missing `each` block keys
- `any` type warnings

These are independent from the graphql-server work.

## Next Steps

1. Commit graphql-server changes (lint now passes)
2. Address frontend lint issues in separate session
3. Continue with API integration plan from `quiet-discovering-lampson.md`
