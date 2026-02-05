/**
 * IIHF (International Ice Hockey Federation) Constants
 *
 * Covers World Championship, World Juniors, Olympics, and other international events.
 */

// Top Division nations for World Championship and World Juniors
export const IIHF_TOP_NATIONS = [
  { code: 'CAN', name: 'Canada', tier: 1 },
  { code: 'USA', name: 'United States', tier: 1 },
  { code: 'RUS', name: 'Russia', tier: 1 }, // Note: Currently suspended
  { code: 'SWE', name: 'Sweden', tier: 1 },
  { code: 'FIN', name: 'Finland', tier: 1 },
  { code: 'CZE', name: 'Czechia', tier: 1 },
  { code: 'SUI', name: 'Switzerland', tier: 1 },
  { code: 'GER', name: 'Germany', tier: 1 },
  { code: 'SVK', name: 'Slovakia', tier: 2 },
  { code: 'LAT', name: 'Latvia', tier: 2 },
  { code: 'DEN', name: 'Denmark', tier: 2 },
  { code: 'NOR', name: 'Norway', tier: 2 },
  { code: 'AUT', name: 'Austria', tier: 2 },
  { code: 'FRA', name: 'France', tier: 2 },
  { code: 'KAZ', name: 'Kazakhstan', tier: 2 },
  { code: 'GBR', name: 'Great Britain', tier: 2 },
] as const;

export const IIHF_NATION_CODES = IIHF_TOP_NATIONS.map(n => n.code);

export const IIHF_EVENTS = {
  WORLD_CHAMPIONSHIP: {
    name: 'IIHF World Championship',
    shortName: 'WC',
    teams: 16,
    typicalMonth: 'May',
  },
  WORLD_JUNIORS: {
    name: 'IIHF World Junior Championship',
    shortName: 'WJC',
    teams: 10,
    typicalMonth: 'December-January',
  },
  OLYMPICS: {
    name: 'Olympic Ice Hockey Tournament',
    shortName: 'OLY',
    teams: 12,
    typicalMonth: 'February',
  },
  WORLD_U18: {
    name: 'IIHF U18 World Championship',
    shortName: 'U18',
    teams: 10,
    typicalMonth: 'April',
  },
} as const;

export const IIHF_TOURNAMENT_PHASES = [
  'preliminary_round',
  'qualification_round',
  'quarterfinal',
  'semifinal',
  'bronze_medal',
  'gold_medal',
] as const;

export const IIHF_POINT_SYSTEM = {
  REGULATION_WIN: 3,
  OT_WIN: 2,
  OT_LOSS: 1,
  REGULATION_LOSS: 0,
} as const;

export const IIHF_ERROR_MESSAGES = {
  FETCH_STANDINGS_FAILED: 'Failed to fetch IIHF tournament standings',
  FETCH_SCHEDULE_FAILED: 'Failed to fetch IIHF tournament schedule',
  TOURNAMENT_NOT_FOUND: 'IIHF tournament not found',
} as const;

// Historic medal counts (Men's World Championship)
export const IIHF_WC_MEDAL_HISTORY = {
  CAN: { gold: 28, silver: 15, bronze: 9 },
  RUS: { gold: 27, silver: 10, bronze: 10 }, // Includes Soviet era
  SWE: { gold: 12, silver: 21, bronze: 17 },
  FIN: { gold: 4, silver: 9, bronze: 4 },
  CZE: { gold: 6, silver: 4, bronze: 6 }, // Includes Czechoslovakia
  USA: { gold: 2, silver: 9, bronze: 8 },
} as const;
