/**
 * ATP Rankings Service
 *
 * Handles fetching and transforming tennis rankings data.
 * Currently uses mock data - will integrate with real APIs later.
 */

import { logger } from '../../../../../utils/logger.js';
import type { ATPRankingEntry, ATPPlayerProfile, RankingsQueryArgs } from '../types/atp-api.types.js';
import { ATP_ERROR_MESSAGES } from '../constants/index.js';

// Mock data for development - will be replaced with real API calls
const MOCK_ATP_RANKINGS: ATPRankingEntry[] = [
  {
    rank: 1,
    previousRank: 1,
    playerName: 'Jannik Sinner',
    playerId: 'S0AG',
    country: 'Italy',
    countryCode: 'ITA',
    points: 11830,
    tournamentsPlayed: 18,
    pointsDropping: 2000,
    nextBestPoints: 400,
  },
  {
    rank: 2,
    previousRank: 2,
    playerName: 'Carlos Alcaraz',
    playerId: 'A0E2',
    country: 'Spain',
    countryCode: 'ESP',
    points: 9010,
    tournamentsPlayed: 17,
    pointsDropping: 1300,
    nextBestPoints: 650,
  },
  {
    rank: 3,
    previousRank: 3,
    playerName: 'Alexander Zverev',
    playerId: 'Z355',
    country: 'Germany',
    countryCode: 'GER',
    points: 7515,
    tournamentsPlayed: 20,
    pointsDropping: 800,
    nextBestPoints: 500,
  },
  {
    rank: 4,
    previousRank: 5,
    playerName: 'Taylor Fritz',
    playerId: 'FB98',
    country: 'United States',
    countryCode: 'USA',
    points: 5100,
    tournamentsPlayed: 19,
    pointsDropping: 650,
    nextBestPoints: 390,
  },
  {
    rank: 5,
    previousRank: 4,
    playerName: 'Daniil Medvedev',
    playerId: 'MM58',
    country: 'Russia',
    countryCode: 'RUS',
    points: 5030,
    tournamentsPlayed: 21,
    pointsDropping: 1000,
    nextBestPoints: 250,
  },
  {
    rank: 6,
    previousRank: 6,
    playerName: 'Casper Ruud',
    playerId: 'RH16',
    country: 'Norway',
    countryCode: 'NOR',
    points: 4210,
    tournamentsPlayed: 22,
    pointsDropping: 400,
    nextBestPoints: 330,
  },
  {
    rank: 7,
    previousRank: 8,
    playerName: 'Novak Djokovic',
    playerId: 'D643',
    country: 'Serbia',
    countryCode: 'SRB',
    points: 3910,
    tournamentsPlayed: 12,
    pointsDropping: 2000,
    nextBestPoints: 800,
  },
  {
    rank: 8,
    previousRank: 7,
    playerName: 'Alex de Minaur',
    playerId: 'DH58',
    country: 'Australia',
    countryCode: 'AUS',
    points: 3745,
    tournamentsPlayed: 23,
    pointsDropping: 390,
    nextBestPoints: 250,
  },
  {
    rank: 9,
    previousRank: 9,
    playerName: 'Andrey Rublev',
    playerId: 'RE44',
    country: 'Russia',
    countryCode: 'RUS',
    points: 3520,
    tournamentsPlayed: 24,
    pointsDropping: 500,
    nextBestPoints: 195,
  },
  {
    rank: 10,
    previousRank: 10,
    playerName: 'Grigor Dimitrov',
    playerId: 'D875',
    country: 'Bulgaria',
    countryCode: 'BUL',
    points: 3340,
    tournamentsPlayed: 20,
    pointsDropping: 330,
    nextBestPoints: 250,
  },
];

const MOCK_PLAYER_PROFILES: Record<string, ATPPlayerProfile> = {
  'S0AG': {
    id: 'S0AG',
    firstName: 'Jannik',
    lastName: 'Sinner',
    fullName: 'Jannik Sinner',
    country: 'Italy',
    countryCode: 'ITA',
    birthDate: '2001-08-16',
    birthPlace: 'San Candido, Italy',
    height: 188,
    weight: 76,
    turnedPro: 2018,
    plays: 'right',
    backhand: 'two-handed',
    coach: 'Darren Cahill & Simone Vagnozzi',
    currentRanking: 1,
    highestRanking: 1,
    highestRankingDate: '2024-06-10',
    careerTitles: 16,
    careerWins: 234,
    careerLosses: 62,
    ytdWins: 64,
    ytdLosses: 6,
    prizeMoney: 25847563,
  },
  'D643': {
    id: 'D643',
    firstName: 'Novak',
    lastName: 'Djokovic',
    fullName: 'Novak Djokovic',
    country: 'Serbia',
    countryCode: 'SRB',
    birthDate: '1987-05-22',
    birthPlace: 'Belgrade, Serbia',
    height: 188,
    weight: 77,
    turnedPro: 2003,
    plays: 'right',
    backhand: 'two-handed',
    coach: 'Goran Ivanisevic',
    currentRanking: 7,
    highestRanking: 1,
    highestRankingDate: '2011-07-04',
    careerTitles: 99,
    careerWins: 1117,
    careerLosses: 212,
    ytdWins: 28,
    ytdLosses: 8,
    prizeMoney: 185388927,
  },
};

class ATPRankingsService {
  /**
   * Get current ATP rankings
   */
  async getRankings(args?: RankingsQueryArgs): Promise<ATPRankingEntry[]> {
    try {
      logger.info({ args }, 'Fetching ATP rankings');

      // TODO: Replace with real API call
      // const response = await axios.get(`${ATP_API_BASE}/rankings`, { params: args });

      let rankings = [...MOCK_ATP_RANKINGS];

      // Apply limit if specified
      if (args?.limit && args.limit > 0) {
        rankings = rankings.slice(0, args.limit);
      }

      logger.info({ count: rankings.length }, 'Successfully fetched ATP rankings');
      return rankings;
    } catch (error) {
      logger.error({ err: error }, ATP_ERROR_MESSAGES.FETCH_RANKINGS_FAILED);
      throw error;
    }
  }

  /**
   * Get player profile by ID
   */
  async getPlayerProfile(playerId: string): Promise<ATPPlayerProfile | null> {
    try {
      logger.info({ playerId }, 'Fetching player profile');

      // TODO: Replace with real API call
      const profile = MOCK_PLAYER_PROFILES[playerId];

      if (!profile) {
        logger.warn({ playerId }, 'Player profile not found');
        return null;
      }

      logger.info({ playerId, playerName: profile.fullName }, 'Successfully fetched player profile');
      return profile;
    } catch (error) {
      logger.error({ err: error, playerId }, ATP_ERROR_MESSAGES.FETCH_PLAYER_FAILED);
      throw error;
    }
  }

  /**
   * Get ranking movement for a player
   */
  getRankingMovement(current: number, previous: number): string {
    if (current < previous) {
      return `+${previous - current}`;
    } else if (current > previous) {
      return `-${current - previous}`;
    }
    return '0';
  }
}

export const atpRankingsService = new ATPRankingsService();
