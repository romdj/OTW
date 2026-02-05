/**
 * IIHF Tournament Service
 *
 * Handles fetching and transforming IIHF tournament data.
 * Covers World Championship, World Juniors, and Olympic hockey.
 */

import { logger } from '../../../../../utils/logger.js';
import type {
  IIHFTournament,
  IIHFTeamStanding,
  IIHFGame,
  TournamentType,
} from '../types/iihf-api.types.js';
import { IIHF_ERROR_MESSAGES } from '../constants/index.js';

// Mock tournament data
const MOCK_TOURNAMENTS: IIHFTournament[] = [
  {
    id: 'wjc-2025',
    name: '2025 World Junior Championship',
    type: 'world_juniors',
    year: 2025,
    hostCountry: 'Canada',
    hostCity: 'Ottawa',
    startDate: '2024-12-26',
    endDate: '2025-01-05',
    teams: 10,
    status: 'completed',
  },
  {
    id: 'wc-2025',
    name: '2025 IIHF World Championship',
    type: 'world_championship',
    year: 2025,
    hostCountry: 'Sweden',
    hostCity: 'Stockholm',
    startDate: '2025-05-09',
    endDate: '2025-05-25',
    teams: 16,
    status: 'upcoming',
  },
  {
    id: 'wjc-2026',
    name: '2026 World Junior Championship',
    type: 'world_juniors',
    year: 2026,
    hostCountry: 'United States',
    hostCity: 'Minneapolis',
    startDate: '2025-12-26',
    endDate: '2026-01-05',
    teams: 10,
    status: 'upcoming',
  },
  {
    id: 'oly-2026',
    name: '2026 Olympic Ice Hockey Tournament',
    type: 'olympics',
    year: 2026,
    hostCountry: 'Italy',
    hostCity: 'Milan',
    startDate: '2026-02-08',
    endDate: '2026-02-22',
    teams: 12,
    status: 'upcoming',
  },
];

// Mock WJC 2025 standings
const MOCK_WJC_2025_STANDINGS: IIHFTeamStanding[] = [
  {
    nationCode: 'USA',
    nationName: 'United States',
    flag: 'https://iihf.com/flags/usa.svg',
    group: 'A',
    gamesPlayed: 7,
    wins: 6,
    otWins: 0,
    otLosses: 0,
    losses: 1,
    points: 18,
    goalsFor: 32,
    goalsAgainst: 14,
    goalDifferential: 18,
    rank: 1,
  },
  {
    nationCode: 'FIN',
    nationName: 'Finland',
    flag: 'https://iihf.com/flags/fin.svg',
    group: 'B',
    gamesPlayed: 7,
    wins: 5,
    otWins: 1,
    otLosses: 0,
    losses: 1,
    points: 17,
    goalsFor: 28,
    goalsAgainst: 15,
    goalDifferential: 13,
    rank: 2,
  },
  {
    nationCode: 'SWE',
    nationName: 'Sweden',
    flag: 'https://iihf.com/flags/swe.svg',
    group: 'A',
    gamesPlayed: 7,
    wins: 5,
    otWins: 0,
    otLosses: 1,
    losses: 1,
    points: 16,
    goalsFor: 30,
    goalsAgainst: 16,
    goalDifferential: 14,
    rank: 3,
  },
  {
    nationCode: 'CAN',
    nationName: 'Canada',
    flag: 'https://iihf.com/flags/can.svg',
    group: 'A',
    gamesPlayed: 7,
    wins: 4,
    otWins: 1,
    otLosses: 1,
    losses: 1,
    points: 15,
    goalsFor: 26,
    goalsAgainst: 18,
    goalDifferential: 8,
    rank: 4,
  },
  {
    nationCode: 'CZE',
    nationName: 'Czechia',
    flag: 'https://iihf.com/flags/cze.svg',
    group: 'B',
    gamesPlayed: 5,
    wins: 3,
    otWins: 0,
    otLosses: 0,
    losses: 2,
    points: 9,
    goalsFor: 18,
    goalsAgainst: 14,
    goalDifferential: 4,
    rank: 5,
  },
];

// Mock games
const MOCK_GAMES: IIHFGame[] = [
  {
    id: 'wjc-2025-gold',
    tournamentId: 'wjc-2025',
    phase: 'gold_medal',
    date: '2025-01-05',
    time: '19:00',
    venue: 'Canadian Tire Centre',
    homeTeam: { code: 'USA', name: 'United States', score: 4 },
    awayTeam: { code: 'FIN', name: 'Finland', score: 3 },
    status: 'final_ot',
    attendance: 17500,
  },
  {
    id: 'wjc-2025-bronze',
    tournamentId: 'wjc-2025',
    phase: 'bronze_medal',
    date: '2025-01-05',
    time: '14:00',
    venue: 'Canadian Tire Centre',
    homeTeam: { code: 'SWE', name: 'Sweden', score: 5 },
    awayTeam: { code: 'CAN', name: 'Canada', score: 2 },
    status: 'final',
    attendance: 18000,
  },
];

class IIHFTournamentService {
  /**
   * Get all tournaments
   */
  async getTournaments(type?: TournamentType): Promise<IIHFTournament[]> {
    try {
      logger.info({ type }, 'Fetching IIHF tournaments');

      let tournaments = [...MOCK_TOURNAMENTS];

      if (type) {
        tournaments = tournaments.filter(t => t.type === type);
      }

      return tournaments;
    } catch (error) {
      logger.error({ err: error }, IIHF_ERROR_MESSAGES.FETCH_SCHEDULE_FAILED);
      throw error;
    }
  }

  /**
   * Get tournament by ID
   */
  async getTournamentById(tournamentId: string): Promise<IIHFTournament | null> {
    const tournaments = await this.getTournaments();
    return tournaments.find(t => t.id === tournamentId) || null;
  }

  /**
   * Get standings for a tournament
   */
  async getStandings(tournamentId: string): Promise<IIHFTeamStanding[]> {
    try {
      logger.info({ tournamentId }, 'Fetching IIHF tournament standings');

      // TODO: Replace with real API calls
      if (tournamentId === 'wjc-2025') {
        return [...MOCK_WJC_2025_STANDINGS];
      }

      return [];
    } catch (error) {
      logger.error({ err: error, tournamentId }, IIHF_ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
      throw error;
    }
  }

  /**
   * Get games for a tournament
   */
  async getGames(tournamentId: string): Promise<IIHFGame[]> {
    try {
      logger.info({ tournamentId }, 'Fetching IIHF tournament games');

      return MOCK_GAMES.filter(g => g.tournamentId === tournamentId);
    } catch (error) {
      logger.error({ err: error, tournamentId }, IIHF_ERROR_MESSAGES.FETCH_SCHEDULE_FAILED);
      throw error;
    }
  }

  /**
   * Get medal game results
   */
  async getMedalGames(tournamentId: string): Promise<{ gold: IIHFGame | null; bronze: IIHFGame | null }> {
    const games = await this.getGames(tournamentId);

    return {
      gold: games.find(g => g.phase === 'gold_medal') || null,
      bronze: games.find(g => g.phase === 'bronze_medal') || null,
    };
  }

  /**
   * Get upcoming tournaments
   */
  async getUpcomingTournaments(): Promise<IIHFTournament[]> {
    const tournaments = await this.getTournaments();
    return tournaments.filter(t => t.status === 'upcoming');
  }
}

export const iihfTournamentService = new IIHFTournamentService();
