/**
 * WTA (Women's Tennis Association) Constants
 */

export const WTA_RANKING_POINTS = {
  grand_slam: 2000,
  wta_1000: 1000,
  wta_500: 500,
  wta_250: 250,
  wta_125: 125,
} as const;

export const WTA_TOURNAMENT_CATEGORIES = [
  'grand_slam',
  'wta_1000',
  'wta_500',
  'wta_250',
  'wta_125',
] as const;

export const WTA_SURFACES = ['hard', 'clay', 'grass'] as const;

export const WTA_ERROR_MESSAGES = {
  FETCH_RANKINGS_FAILED: 'Failed to fetch WTA rankings',
  FETCH_PLAYER_FAILED: 'Failed to fetch WTA player profile',
  FETCH_TOURNAMENTS_FAILED: 'Failed to fetch WTA tournament schedule',
} as const;
