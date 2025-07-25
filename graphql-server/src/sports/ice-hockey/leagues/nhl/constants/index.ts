/**
 * NHL-specific constants and configuration values
 */

import config from '../../../../../config/env.js';

export const NHL_API_ENDPOINTS = {
  STANDINGS: `${config.NHL_API_BASE_URL}/standings`,
  TEAM_STATS: (teamId: string, season: string) => `https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=${season} and teamId=${teamId}`,
  POWERPLAY_STATS: (season: string) => `https://api.nhle.com/stats/rest/en/team/powerplay?cayenneExp=seasonId=${season}`,
} as const;

export const NHL_POINT_SYSTEMS = {
  TRADITIONAL: {
    WIN: 2,
    OT_WIN: 2,
    OT_LOSS: 1,
    REGULATION_LOSS: 0,
  },
  INTERNATIONAL: {
    REGULATION_WIN: 3,
    OT_WIN: 2,
    OT_LOSS: 1,
    REGULATION_LOSS: 0,
  },
} as const;

export const NHL_SEASONS = {
  CURRENT: '20242025',
  PREVIOUS: '20232024',
  DEFAULT_TEST: '20232024',
} as const;

export const NHL_ERROR_MESSAGES = {
  FETCH_STANDINGS_FAILED: 'Failed to fetch NHL standings data',
  FETCH_POWERPLAY_FAILED: 'Failed to fetch NHL powerplay statistics',
  TEAM_NOT_FOUND: 'NHL team not found',
  INVALID_SEASON_FORMAT: 'Invalid NHL season format provided',
} as const;

export const NHL_DIVISIONS = {
  ATLANTIC: ['BOS', 'BUF', 'DET', 'FLA', 'MTL', 'OTT', 'TBL', 'TOR'],
  METROPOLITAN: ['CAR', 'CBJ', 'NJD', 'NYI', 'NYR', 'PHI', 'PIT', 'WSH'],
  CENTRAL: ['CHI', 'COL', 'DAL', 'MIN', 'NSH', 'STL', 'UTA', 'WPG'],
  PACIFIC: ['ANA', 'CGY', 'EDM', 'LAK', 'SJS', 'SEA', 'VAN', 'VGK'],
} as const;

export const NHL_CONFERENCES = {
  EASTERN: [...NHL_DIVISIONS.ATLANTIC, ...NHL_DIVISIONS.METROPOLITAN],
  WESTERN: [...NHL_DIVISIONS.CENTRAL, ...NHL_DIVISIONS.PACIFIC],
} as const;