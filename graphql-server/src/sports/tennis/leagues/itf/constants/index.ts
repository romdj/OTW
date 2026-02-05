/**
 * ITF (International Tennis Federation) Constants
 *
 * Covers Davis Cup, Billie Jean King Cup, and Olympic Tennis.
 */

export const ITF_EVENTS = {
  DAVIS_CUP: {
    name: 'Davis Cup',
    shortName: 'DC',
    format: 'team',
    gender: 'men',
  },
  BJK_CUP: {
    name: 'Billie Jean King Cup',
    shortName: 'BJK',
    format: 'team',
    gender: 'women',
  },
  OLYMPICS: {
    name: 'Olympic Tennis Tournament',
    shortName: 'OLY',
    format: 'individual',
    gender: 'mixed',
  },
  UNITED_CUP: {
    name: 'United Cup',
    shortName: 'UC',
    format: 'mixed_team',
    gender: 'mixed',
  },
} as const;

export const ITF_TOP_NATIONS = [
  { code: 'ITA', name: 'Italy', continent: 'Europe' },
  { code: 'ESP', name: 'Spain', continent: 'Europe' },
  { code: 'AUS', name: 'Australia', continent: 'Oceania' },
  { code: 'USA', name: 'United States', continent: 'Americas' },
  { code: 'CAN', name: 'Canada', continent: 'Americas' },
  { code: 'CRO', name: 'Croatia', continent: 'Europe' },
  { code: 'GER', name: 'Germany', continent: 'Europe' },
  { code: 'GBR', name: 'Great Britain', continent: 'Europe' },
  { code: 'FRA', name: 'France', continent: 'Europe' },
  { code: 'ARG', name: 'Argentina', continent: 'Americas' },
  { code: 'NED', name: 'Netherlands', continent: 'Europe' },
  { code: 'SRB', name: 'Serbia', continent: 'Europe' },
  { code: 'CHN', name: 'China', continent: 'Asia' },
  { code: 'JPN', name: 'Japan', continent: 'Asia' },
  { code: 'POL', name: 'Poland', continent: 'Europe' },
  { code: 'CZE', name: 'Czechia', continent: 'Europe' },
] as const;

export const ITF_NATION_CODES = ITF_TOP_NATIONS.map(n => n.code);

export const DAVIS_CUP_PHASES = [
  'group_stage',
  'quarterfinal',
  'semifinal',
  'final',
] as const;

export const OLYMPIC_DRAWS = [
  'mens_singles',
  'womens_singles',
  'mens_doubles',
  'womens_doubles',
  'mixed_doubles',
] as const;

export const ITF_ERROR_MESSAGES = {
  FETCH_DRAW_FAILED: 'Failed to fetch ITF draw',
  FETCH_MATCHES_FAILED: 'Failed to fetch ITF matches',
  EVENT_NOT_FOUND: 'ITF event not found',
} as const;
