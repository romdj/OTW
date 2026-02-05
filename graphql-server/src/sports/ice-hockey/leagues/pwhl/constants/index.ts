/**
 * PWHL (Professional Women's Hockey League) Constants
 */

export const PWHL_TEAMS = {
  BOS: { name: 'Boston Fleet', city: 'Boston', founded: 2023 },
  MIN: { name: 'Minnesota Frost', city: 'Minneapolis', founded: 2023 },
  MTL: { name: 'Montreal Victoire', city: 'Montreal', founded: 2023 },
  NYC: { name: 'New York Sirens', city: 'New York', founded: 2023 },
  OTT: { name: 'Ottawa Charge', city: 'Ottawa', founded: 2023 },
  TOR: { name: 'Toronto Sceptres', city: 'Toronto', founded: 2023 },
} as const;

export const PWHL_TEAM_ABBREVS = Object.keys(PWHL_TEAMS) as Array<keyof typeof PWHL_TEAMS>;

export const PWHL_POINT_SYSTEM = {
  REGULATION_WIN: 3,
  OT_WIN: 2,
  OT_LOSS: 1,
  REGULATION_LOSS: 0,
} as const;

export const PWHL_SEASONS = {
  INAUGURAL: '2024',
  CURRENT: '2025',
} as const;

export const PWHL_ERROR_MESSAGES = {
  FETCH_STANDINGS_FAILED: 'Failed to fetch PWHL standings data',
  TEAM_NOT_FOUND: 'PWHL team not found',
} as const;
