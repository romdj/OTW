/**
 * ATP Rankings Service
 *
 * Handles fetching and transforming tennis rankings data.
 * Uses BALLDONTLIE API with fallback to mock data.
 */

import got, { HTTPError } from 'got';
import { logger } from '../../../../../utils/logger.js';
import { tennisCache, CACHE_TTL } from '../../../../../utils/cache.js';
import type { ATPRankingEntry, ATPPlayerProfile, RankingsQueryArgs } from '../types/atp-api.types.js';
import { ATP_ERROR_MESSAGES, BALLDONTLIE_API } from '../constants/index.js';
import { config } from '../../../../../config/env.js';

// BALLDONTLIE API Response Types
interface BallDontLiePlayer {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  country: string;
  country_code?: string;
  ranking?: number;
  previous_ranking?: number;
  points?: number;
  tournaments_played?: number;
  birth_date?: string;
  turned_pro?: number;
  height?: number;
  weight?: number;
  plays?: string;
  backhand?: string;
}

interface BallDontLieResponse<T> {
  data: T[];
  meta?: {
    total_count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

// Mock data for development and fallback
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
  private readonly maxRetries = 3;
  private readonly requestTimeout = 10000;

  /**
   * Check if API is configured
   */
  private isApiConfigured(): boolean {
    return Boolean(config.BALLDONTLIE_API_KEY && config.BALLDONTLIE_API_KEY !== 'your_api_key_here');
  }

  /**
   * Fetch rankings from BALLDONTLIE API
   */
  private async fetchFromApi(limit: number): Promise<ATPRankingEntry[]> {
    const url = `${BALLDONTLIE_API.baseUrl}${BALLDONTLIE_API.endpoints.players}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLiePlayer>>(url, {
          headers: BALLDONTLIE_API.headers(),
          searchParams: {
            per_page: limit,
            sort: 'ranking',
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformApiResponse(response.body.data);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API response to ATPRankingEntry format
   */
  private transformApiResponse(players: BallDontLiePlayer[]): ATPRankingEntry[] {
    return players
      .filter(p => p.ranking !== undefined)
      .map(p => ({
        rank: p.ranking!,
        previousRank: p.previous_ranking ?? p.ranking!,
        playerName: p.full_name,
        playerId: String(p.id),
        country: p.country,
        countryCode: p.country_code ?? p.country.substring(0, 3).toUpperCase(),
        points: p.points ?? 0,
        tournamentsPlayed: p.tournaments_played ?? 0,
        pointsDropping: 0,
        nextBestPoints: 0,
      }));
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current ATP rankings
   */
  async getRankings(args?: RankingsQueryArgs): Promise<ATPRankingEntry[]> {
    const limit = args?.limit && args.limit > 0 ? args.limit : 100;
    const cacheKey = `atp_rankings_${limit}`;

    try {
      // Check cache first
      const cached = tennisCache.get<ATPRankingEntry[]>(cacheKey);
      if (cached) {
        logger.info({ count: cached.length, source: 'cache' }, 'Returning cached ATP rankings');
        return cached;
      }

      logger.info({ args }, 'Fetching ATP rankings');

      let rankings: ATPRankingEntry[];

      // Try API if configured
      if (this.isApiConfigured()) {
        try {
          rankings = await this.fetchFromApi(limit);
          logger.info({ count: rankings.length, source: 'api' }, 'Successfully fetched ATP rankings from API');
        } catch (error) {
          logger.warn({ error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to mock data');
          rankings = [...MOCK_ATP_RANKINGS].slice(0, limit);
        }
      } else {
        logger.info('BALLDONTLIE API key not configured, using mock data');
        rankings = [...MOCK_ATP_RANKINGS].slice(0, limit);
      }

      // Cache the results
      tennisCache.set(cacheKey, rankings, CACHE_TTL.SHORT);

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
    const cacheKey = `atp_player_${playerId}`;

    try {
      // Check cache first
      const cached = tennisCache.get<ATPPlayerProfile>(cacheKey);
      if (cached) {
        logger.info({ playerId, source: 'cache' }, 'Returning cached player profile');
        return cached;
      }

      logger.info({ playerId }, 'Fetching player profile');

      // Try API if configured
      if (this.isApiConfigured()) {
        try {
          const url = `${BALLDONTLIE_API.baseUrl}${BALLDONTLIE_API.endpoints.players}/${playerId}`;
          const response = await got<{ data: BallDontLiePlayer }>(url, {
            headers: BALLDONTLIE_API.headers(),
            timeout: { request: this.requestTimeout },
            responseType: 'json',
          });

          const profile = this.transformPlayerProfile(response.body.data);
          tennisCache.set(cacheKey, profile, CACHE_TTL.MEDIUM);
          return profile;
        } catch (error) {
          logger.warn({ playerId, error: error instanceof Error ? error.message : String(error) }, 'API failed for player profile');
        }
      }

      // Fallback to mock data
      const profile = MOCK_PLAYER_PROFILES[playerId];

      if (!profile) {
        logger.warn({ playerId }, 'Player profile not found');
        return null;
      }

      tennisCache.set(cacheKey, profile, CACHE_TTL.MEDIUM);
      logger.info({ playerId, playerName: profile.fullName }, 'Successfully fetched player profile');
      return profile;
    } catch (error) {
      logger.error({ err: error, playerId }, ATP_ERROR_MESSAGES.FETCH_PLAYER_FAILED);
      throw error;
    }
  }

  /**
   * Transform API player to profile format
   */
  private transformPlayerProfile(player: BallDontLiePlayer): ATPPlayerProfile {
    return {
      id: String(player.id),
      firstName: player.first_name,
      lastName: player.last_name,
      fullName: player.full_name,
      country: player.country,
      countryCode: player.country_code ?? player.country.substring(0, 3).toUpperCase(),
      birthDate: player.birth_date ?? '',
      birthPlace: '',
      height: player.height ?? 0,
      weight: player.weight ?? 0,
      turnedPro: player.turned_pro ?? 0,
      plays: player.plays as 'right' | 'left' ?? 'right',
      backhand: player.backhand as 'one-handed' | 'two-handed' ?? 'two-handed',
      currentRanking: player.ranking ?? 0,
      highestRanking: player.ranking ?? 0,
      highestRankingDate: '',
      careerTitles: 0,
      careerWins: 0,
      careerLosses: 0,
      ytdWins: 0,
      ytdLosses: 0,
      prizeMoney: 0,
    };
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
