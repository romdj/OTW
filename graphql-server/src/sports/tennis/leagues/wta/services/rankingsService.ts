/**
 * WTA Rankings Service
 *
 * Handles fetching and transforming WTA rankings data.
 * Currently uses mock data - will integrate with real APIs later.
 */

import { logger } from '../../../../../utils/logger.js';
import type { WTARankingEntry, WTAPlayerProfile, RankingsQueryArgs } from '../types/wta-api.types.js';
import { WTA_ERROR_MESSAGES } from '../constants/index.js';

// Mock WTA rankings data
const MOCK_WTA_RANKINGS: WTARankingEntry[] = [
  {
    rank: 1,
    previousRank: 1,
    playerName: 'Aryna Sabalenka',
    playerId: 'S3B1',
    country: 'Belarus',
    countryCode: 'BLR',
    points: 10780,
    tournamentsPlayed: 17,
    pointsDropping: 1300,
    nextBestPoints: 470,
  },
  {
    rank: 2,
    previousRank: 2,
    playerName: 'Iga Swiatek',
    playerId: 'SW19',
    country: 'Poland',
    countryCode: 'POL',
    points: 9495,
    tournamentsPlayed: 16,
    pointsDropping: 2000,
    nextBestPoints: 780,
  },
  {
    rank: 3,
    previousRank: 3,
    playerName: 'Coco Gauff',
    playerId: 'G0FF',
    country: 'United States',
    countryCode: 'USA',
    points: 6888,
    tournamentsPlayed: 18,
    pointsDropping: 1000,
    nextBestPoints: 470,
  },
  {
    rank: 4,
    previousRank: 5,
    playerName: 'Jasmine Paolini',
    playerId: 'PA0L',
    country: 'Italy',
    countryCode: 'ITA',
    points: 5893,
    tournamentsPlayed: 20,
    pointsDropping: 780,
    nextBestPoints: 470,
  },
  {
    rank: 5,
    previousRank: 4,
    playerName: 'Elena Rybakina',
    playerId: 'RY8A',
    country: 'Kazakhstan',
    countryCode: 'KAZ',
    points: 5773,
    tournamentsPlayed: 15,
    pointsDropping: 1300,
    nextBestPoints: 470,
  },
  {
    rank: 6,
    previousRank: 6,
    playerName: 'Qinwen Zheng',
    playerId: 'ZH3N',
    country: 'China',
    countryCode: 'CHN',
    points: 5055,
    tournamentsPlayed: 19,
    pointsDropping: 1300,
    nextBestPoints: 390,
  },
  {
    rank: 7,
    previousRank: 7,
    playerName: 'Jessica Pegula',
    playerId: 'PE6U',
    country: 'United States',
    countryCode: 'USA',
    points: 4665,
    tournamentsPlayed: 18,
    pointsDropping: 785,
    nextBestPoints: 470,
  },
  {
    rank: 8,
    previousRank: 9,
    playerName: 'Emma Navarro',
    playerId: 'NA9R',
    country: 'United States',
    countryCode: 'USA',
    points: 3698,
    tournamentsPlayed: 19,
    pointsDropping: 780,
    nextBestPoints: 280,
  },
  {
    rank: 9,
    previousRank: 8,
    playerName: 'Daria Kasatkina',
    playerId: 'KA5T',
    country: 'Russia',
    countryCode: 'RUS',
    points: 3488,
    tournamentsPlayed: 22,
    pointsDropping: 470,
    nextBestPoints: 280,
  },
  {
    rank: 10,
    previousRank: 10,
    playerName: 'Barbora Krejcikova',
    playerId: 'KR3J',
    country: 'Czechia',
    countryCode: 'CZE',
    points: 3393,
    tournamentsPlayed: 18,
    pointsDropping: 2000,
    nextBestPoints: 280,
  },
];

const MOCK_WTA_PLAYER_PROFILES: Record<string, WTAPlayerProfile> = {
  'S3B1': {
    id: 'S3B1',
    firstName: 'Aryna',
    lastName: 'Sabalenka',
    fullName: 'Aryna Sabalenka',
    country: 'Belarus',
    countryCode: 'BLR',
    birthDate: '1998-05-05',
    birthPlace: 'Minsk, Belarus',
    height: 182,
    turnedPro: 2015,
    plays: 'right',
    backhand: 'two-handed',
    coach: 'Anton Dubrov',
    currentRanking: 1,
    highestRanking: 1,
    highestRankingDate: '2024-10-21',
    careerTitles: 17,
    careerWins: 342,
    careerLosses: 136,
    ytdWins: 58,
    ytdLosses: 10,
    prizeMoney: 28456789,
  },
  'SW19': {
    id: 'SW19',
    firstName: 'Iga',
    lastName: 'Swiatek',
    fullName: 'Iga Swiatek',
    country: 'Poland',
    countryCode: 'POL',
    birthDate: '2001-05-31',
    birthPlace: 'Warsaw, Poland',
    height: 176,
    turnedPro: 2016,
    plays: 'right',
    backhand: 'two-handed',
    coach: 'Wim Fissette',
    currentRanking: 2,
    highestRanking: 1,
    highestRankingDate: '2022-04-04',
    careerTitles: 22,
    careerWins: 298,
    careerLosses: 65,
    ytdWins: 52,
    ytdLosses: 12,
    prizeMoney: 32145678,
  },
};

class WTARankingsService {
  /**
   * Get current WTA rankings
   */
  async getRankings(args?: RankingsQueryArgs): Promise<WTARankingEntry[]> {
    try {
      logger.info({ args }, 'Fetching WTA rankings');

      let rankings = [...MOCK_WTA_RANKINGS];

      if (args?.limit && args.limit > 0) {
        rankings = rankings.slice(0, args.limit);
      }

      logger.info({ count: rankings.length }, 'Successfully fetched WTA rankings');
      return rankings;
    } catch (error) {
      logger.error({ err: error }, WTA_ERROR_MESSAGES.FETCH_RANKINGS_FAILED);
      throw error;
    }
  }

  /**
   * Get player profile by ID
   */
  async getPlayerProfile(playerId: string): Promise<WTAPlayerProfile | null> {
    try {
      logger.info({ playerId }, 'Fetching WTA player profile');

      const profile = MOCK_WTA_PLAYER_PROFILES[playerId];

      if (!profile) {
        logger.warn({ playerId }, 'WTA player profile not found');
        return null;
      }

      logger.info({ playerId, playerName: profile.fullName }, 'Successfully fetched WTA player profile');
      return profile;
    } catch (error) {
      logger.error({ err: error, playerId }, WTA_ERROR_MESSAGES.FETCH_PLAYER_FAILED);
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

export const wtaRankingsService = new WTARankingsService();
