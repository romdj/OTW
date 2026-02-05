/**
 * PWHL Standings Service
 *
 * Handles fetching and transforming PWHL standings data.
 * Currently uses mock data - will integrate with real APIs later.
 */

import { logger } from '../../../../../utils/logger.js';
import type { PWHLTeamStanding } from '../types/pwhl-api.types.js';
import { PWHL_TEAMS, PWHL_ERROR_MESSAGES } from '../constants/index.js';

// Mock standings data for 2024-25 season
const MOCK_PWHL_STANDINGS: PWHLTeamStanding[] = [
  {
    teamAbbrev: 'MIN',
    teamName: 'Minnesota Frost',
    teamLogo: 'https://pwhl.com/logos/min.svg',
    gamesPlayed: 24,
    wins: 14,
    losses: 6,
    otLosses: 4,
    points: 46, // 14*3 + 4*1 = 46 (3-2-1 system)
    regulationWins: 11,
    goalsFor: 72,
    goalsAgainst: 48,
    goalDifferential: 24,
    winPercentage: 0.667,
    homeRecord: '8-2-1',
    awayRecord: '6-4-3',
    streak: 'W3',
    last10: '7-2-1',
    date: new Date().toISOString().split('T')[0],
  },
  {
    teamAbbrev: 'TOR',
    teamName: 'Toronto Sceptres',
    teamLogo: 'https://pwhl.com/logos/tor.svg',
    gamesPlayed: 24,
    wins: 13,
    losses: 8,
    otLosses: 3,
    points: 42,
    regulationWins: 10,
    goalsFor: 68,
    goalsAgainst: 52,
    goalDifferential: 16,
    winPercentage: 0.604,
    homeRecord: '7-3-2',
    awayRecord: '6-5-1',
    streak: 'W1',
    last10: '6-3-1',
    date: new Date().toISOString().split('T')[0],
  },
  {
    teamAbbrev: 'MTL',
    teamName: 'Montreal Victoire',
    teamLogo: 'https://pwhl.com/logos/mtl.svg',
    gamesPlayed: 24,
    wins: 12,
    losses: 9,
    otLosses: 3,
    points: 39,
    regulationWins: 9,
    goalsFor: 64,
    goalsAgainst: 55,
    goalDifferential: 9,
    winPercentage: 0.563,
    homeRecord: '7-4-1',
    awayRecord: '5-5-2',
    streak: 'L1',
    last10: '5-4-1',
    date: new Date().toISOString().split('T')[0],
  },
  {
    teamAbbrev: 'BOS',
    teamName: 'Boston Fleet',
    teamLogo: 'https://pwhl.com/logos/bos.svg',
    gamesPlayed: 24,
    wins: 11,
    losses: 10,
    otLosses: 3,
    points: 36,
    regulationWins: 8,
    goalsFor: 58,
    goalsAgainst: 54,
    goalDifferential: 4,
    winPercentage: 0.521,
    homeRecord: '6-4-2',
    awayRecord: '5-6-1',
    streak: 'W2',
    last10: '5-4-1',
    date: new Date().toISOString().split('T')[0],
  },
  {
    teamAbbrev: 'OTT',
    teamName: 'Ottawa Charge',
    teamLogo: 'https://pwhl.com/logos/ott.svg',
    gamesPlayed: 24,
    wins: 9,
    losses: 11,
    otLosses: 4,
    points: 31,
    regulationWins: 7,
    goalsFor: 52,
    goalsAgainst: 58,
    goalDifferential: -6,
    winPercentage: 0.458,
    homeRecord: '5-5-2',
    awayRecord: '4-6-2',
    streak: 'L2',
    last10: '4-5-1',
    date: new Date().toISOString().split('T')[0],
  },
  {
    teamAbbrev: 'NYC',
    teamName: 'New York Sirens',
    teamLogo: 'https://pwhl.com/logos/nyc.svg',
    gamesPlayed: 24,
    wins: 7,
    losses: 14,
    otLosses: 3,
    points: 24,
    regulationWins: 5,
    goalsFor: 46,
    goalsAgainst: 68,
    goalDifferential: -22,
    winPercentage: 0.354,
    homeRecord: '4-7-1',
    awayRecord: '3-7-2',
    streak: 'L3',
    last10: '3-6-1',
    date: new Date().toISOString().split('T')[0],
  },
];

class PWHLStandingsService {
  /**
   * Get current PWHL standings
   */
  async getStandings(): Promise<PWHLTeamStanding[]> {
    try {
      logger.info('Fetching PWHL standings');

      // TODO: Replace with real API call when available
      const standings = [...MOCK_PWHL_STANDINGS];

      // Sort by points (descending), then regulation wins
      standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.regulationWins - a.regulationWins;
      });

      logger.info({ count: standings.length }, 'Successfully fetched PWHL standings');
      return standings;
    } catch (error) {
      logger.error({ err: error }, PWHL_ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
      throw error;
    }
  }

  /**
   * Get team info by abbreviation
   */
  getTeamInfo(teamAbbrev: string): typeof PWHL_TEAMS[keyof typeof PWHL_TEAMS] | null {
    const abbrev = teamAbbrev.toUpperCase() as keyof typeof PWHL_TEAMS;
    return PWHL_TEAMS[abbrev] || null;
  }
}

export const pwhlStandingsService = new PWHLStandingsService();
