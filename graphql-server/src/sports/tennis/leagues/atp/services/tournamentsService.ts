/**
 * ATP Tournaments Service
 *
 * Handles fetching and transforming tennis tournament data.
 * Uses BALLDONTLIE API with fallback to mock data.
 */

import got, { HTTPError } from 'got';
import { logger } from '../../../../../utils/logger.js';
import { tennisCache, CACHE_TTL } from '../../../../../utils/cache.js';
import type { ATPTournamentEntry, ATPMatchEntry, TournamentsQueryArgs, MatchesQueryArgs } from '../types/atp-api.types.js';
import { ATP_ERROR_MESSAGES, ATP_RANKING_POINTS, BALLDONTLIE_API } from '../constants/index.js';
import { config } from '../../../../../config/env.js';

// BALLDONTLIE API Response Types
interface BallDontLieTournament {
  id: number;
  name: string;
  city?: string;
  country: string;
  surface?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  prize_money?: number;
  currency?: string;
  draw_size?: number;
}

interface BallDontLieMatch {
  id: number;
  tournament_id: number;
  tournament_name?: string;
  round?: string;
  surface?: string;
  player1?: {
    id: number;
    name: string;
    country_code?: string;
    seed?: number;
  };
  player2?: {
    id: number;
    name: string;
    country_code?: string;
    seed?: number;
  };
  score?: string;
  winner_id?: number;
  scheduled_time?: string;
  completed_time?: string;
  status?: string;
  court?: string;
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

// Mock tournament data for development and fallback
const MOCK_TOURNAMENTS: ATPTournamentEntry[] = [
  {
    id: 'ao-2025',
    name: 'Australian Open',
    location: 'Melbourne',
    country: 'Australia',
    surface: 'hard',
    category: 'grand_slam',
    startDate: '2025-01-12',
    endDate: '2025-01-26',
    prizeMoney: 86500000,
    currency: 'AUD',
    drawSize: 128,
    points: ATP_RANKING_POINTS.grand_slam,
  },
  {
    id: 'iw-2025',
    name: 'Indian Wells Masters',
    location: 'Indian Wells',
    country: 'USA',
    surface: 'hard',
    category: 'masters_1000',
    startDate: '2025-03-05',
    endDate: '2025-03-16',
    prizeMoney: 8800000,
    currency: 'USD',
    drawSize: 96,
    points: ATP_RANKING_POINTS.masters_1000,
  },
  {
    id: 'mia-2025',
    name: 'Miami Open',
    location: 'Miami',
    country: 'USA',
    surface: 'hard',
    category: 'masters_1000',
    startDate: '2025-03-19',
    endDate: '2025-03-30',
    prizeMoney: 8800000,
    currency: 'USD',
    drawSize: 96,
    points: ATP_RANKING_POINTS.masters_1000,
  },
  {
    id: 'mc-2025',
    name: 'Monte-Carlo Masters',
    location: 'Monte-Carlo',
    country: 'Monaco',
    surface: 'clay',
    category: 'masters_1000',
    startDate: '2025-04-06',
    endDate: '2025-04-13',
    prizeMoney: 5950000,
    currency: 'EUR',
    drawSize: 56,
    points: ATP_RANKING_POINTS.masters_1000,
  },
  {
    id: 'rg-2025',
    name: 'Roland Garros',
    location: 'Paris',
    country: 'France',
    surface: 'clay',
    category: 'grand_slam',
    startDate: '2025-05-25',
    endDate: '2025-06-08',
    prizeMoney: 53500000,
    currency: 'EUR',
    drawSize: 128,
    points: ATP_RANKING_POINTS.grand_slam,
  },
  {
    id: 'wim-2025',
    name: 'Wimbledon',
    location: 'London',
    country: 'UK',
    surface: 'grass',
    category: 'grand_slam',
    startDate: '2025-06-30',
    endDate: '2025-07-13',
    prizeMoney: 50000000,
    currency: 'GBP',
    drawSize: 128,
    points: ATP_RANKING_POINTS.grand_slam,
  },
  {
    id: 'uso-2025',
    name: 'US Open',
    location: 'New York',
    country: 'USA',
    surface: 'hard',
    category: 'grand_slam',
    startDate: '2025-08-25',
    endDate: '2025-09-07',
    prizeMoney: 65000000,
    currency: 'USD',
    drawSize: 128,
    points: ATP_RANKING_POINTS.grand_slam,
  },
];

// Mock match data for development and fallback
const MOCK_MATCHES: ATPMatchEntry[] = [
  {
    id: 'ao-2025-f',
    tournamentId: 'ao-2025',
    tournamentName: 'Australian Open',
    round: 'Final',
    surface: 'hard',
    player1: { id: 'S0AG', name: 'Jannik Sinner', seed: 1, countryCode: 'ITA' },
    player2: { id: 'Z355', name: 'Alexander Zverev', seed: 2, countryCode: 'GER' },
    score: {
      sets: [
        { player1: 6, player2: 3 },
        { player1: 7, player2: 6, tiebreak: { player1: 7, player2: 4 } },
        { player1: 6, player2: 3 },
      ],
      winner: 'player1',
    },
    scheduledTime: '2025-01-26T09:30:00Z',
    completedTime: '2025-01-26T12:15:00Z',
    status: 'completed',
    court: 'Rod Laver Arena',
    duration: 165,
  },
  {
    id: 'iw-2025-sf1',
    tournamentId: 'iw-2025',
    tournamentName: 'Indian Wells Masters',
    round: 'Semifinal',
    surface: 'hard',
    player1: { id: 'A0E2', name: 'Carlos Alcaraz', seed: 2, countryCode: 'ESP' },
    player2: { id: 'MM58', name: 'Daniil Medvedev', seed: 5, countryCode: 'RUS' },
    scheduledTime: '2025-03-15T20:00:00Z',
    status: 'scheduled',
    court: 'Stadium 1',
  },
];

class ATPTournamentsService {
  private readonly maxRetries = 3;
  private readonly requestTimeout = 10000;

  /**
   * Check if API is configured
   */
  private isApiConfigured(): boolean {
    return Boolean(config.BALLDONTLIE_API_KEY && config.BALLDONTLIE_API_KEY !== 'your_api_key_here');
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch tournaments from BALLDONTLIE API
   */
  private async fetchTournamentsFromApi(year?: number): Promise<ATPTournamentEntry[]> {
    const url = `${BALLDONTLIE_API.baseUrl}${BALLDONTLIE_API.endpoints.tournaments}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLieTournament>>(url, {
          headers: BALLDONTLIE_API.headers(),
          searchParams: {
            per_page: 100,
            ...(year && { year }),
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformTournamentsResponse(response.body.data);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE tournaments API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE tournaments API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API tournaments to ATPTournamentEntry format
   */
  private transformTournamentsResponse(tournaments: BallDontLieTournament[]): ATPTournamentEntry[] {
    return tournaments.map(t => ({
      id: String(t.id),
      name: t.name,
      location: t.city ?? '',
      country: t.country,
      surface: this.normalizeSurface(t.surface),
      category: this.normalizeCategory(t.category),
      startDate: t.start_date ?? '',
      endDate: t.end_date ?? '',
      prizeMoney: t.prize_money ?? 0,
      currency: t.currency ?? 'USD',
      drawSize: t.draw_size ?? 0,
      points: this.getPointsForCategory(this.normalizeCategory(t.category)),
    }));
  }

  /**
   * Normalize surface string to expected type
   */
  private normalizeSurface(surface?: string): 'hard' | 'clay' | 'grass' | 'indoor_hard' {
    if (!surface) return 'hard';
    const normalized = surface.toLowerCase();
    if (normalized.includes('clay')) return 'clay';
    if (normalized.includes('grass')) return 'grass';
    if (normalized.includes('indoor')) return 'indoor_hard';
    return 'hard';
  }

  /**
   * Normalize category string to expected type
   */
  private normalizeCategory(category?: string): 'grand_slam' | 'masters_1000' | 'atp_500' | 'atp_250' | 'atp_finals' {
    if (!category) return 'atp_250';
    const normalized = category.toLowerCase();
    if (normalized.includes('grand slam') || normalized.includes('grandslam')) return 'grand_slam';
    if (normalized.includes('1000') || normalized.includes('masters')) return 'masters_1000';
    if (normalized.includes('500')) return 'atp_500';
    if (normalized.includes('finals')) return 'atp_finals';
    return 'atp_250';
  }

  /**
   * Get points structure for a category
   */
  private getPointsForCategory(category: string): ATPTournamentEntry['points'] {
    switch (category) {
      case 'grand_slam':
        return ATP_RANKING_POINTS.grand_slam;
      case 'masters_1000':
        return ATP_RANKING_POINTS.masters_1000;
      case 'atp_500':
        return ATP_RANKING_POINTS.atp_500;
      default:
        return ATP_RANKING_POINTS.atp_250;
    }
  }

  /**
   * Adapt tournaments to a different year (for 2026+ when we only have 2025 data)
   */
  private adaptTournamentsToYear(tournaments: ATPTournamentEntry[], targetYear: number): ATPTournamentEntry[] {
    return tournaments.map(t => ({
      ...t,
      id: t.id.replace('2025', String(targetYear)),
      startDate: t.startDate.replace('2025', String(targetYear)),
      endDate: t.endDate.replace('2025', String(targetYear)),
    }));
  }

  /**
   * Get tournament schedule
   */
  async getTournaments(args?: TournamentsQueryArgs): Promise<ATPTournamentEntry[]> {
    const requestedYear = args?.year ?? new Date().getFullYear();
    const cacheKey = `atp_tournaments_${requestedYear}_${args?.surface ?? 'all'}_${args?.category ?? 'all'}`;

    try {
      // Check cache first
      const cached = tennisCache.get<ATPTournamentEntry[]>(cacheKey);
      if (cached) {
        logger.info({ count: cached.length, source: 'cache' }, 'Returning cached ATP tournaments');
        return cached;
      }

      logger.info({ args }, 'Fetching ATP tournaments');

      let tournaments: ATPTournamentEntry[];

      // Try API if configured
      if (this.isApiConfigured()) {
        try {
          tournaments = await this.fetchTournamentsFromApi(requestedYear);
          logger.info({ count: tournaments.length, source: 'api' }, 'Successfully fetched ATP tournaments from API');
        } catch (error) {
          logger.warn({ error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to mock data');
          tournaments = [...MOCK_TOURNAMENTS];
        }
      } else {
        logger.info('BALLDONTLIE API key not configured, using mock data');
        tournaments = [...MOCK_TOURNAMENTS];
      }

      // Support 2026+ by adapting data
      if (requestedYear >= 2026 && tournaments === MOCK_TOURNAMENTS) {
        tournaments = this.adaptTournamentsToYear(tournaments, requestedYear);
      }

      // Filter by surface if specified (case-insensitive to handle GraphQL enums)
      if (args?.surface) {
        const surfaceLower = args.surface.toLowerCase();
        tournaments = tournaments.filter(t => t.surface.toLowerCase() === surfaceLower);
      }

      // Filter by category if specified (case-insensitive to handle GraphQL enums)
      if (args?.category) {
        const categoryLower = args.category.toLowerCase();
        tournaments = tournaments.filter(t => t.category.toLowerCase() === categoryLower);
      }

      // Filter by year if specified
      if (args?.year) {
        tournaments = tournaments.filter(t =>
          new Date(t.startDate).getFullYear() === args.year
        );
      }

      // Cache the results
      tennisCache.set(cacheKey, tournaments, CACHE_TTL.MEDIUM);

      logger.info({ count: tournaments.length }, 'Successfully fetched ATP tournaments');
      return tournaments;
    } catch (error) {
      logger.error({ err: error }, ATP_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
      throw error;
    }
  }

  /**
   * Get tournament by ID
   */
  async getTournamentById(tournamentId: string): Promise<ATPTournamentEntry | null> {
    const cacheKey = `atp_tournament_${tournamentId}`;

    try {
      // Check cache first
      const cached = tennisCache.get<ATPTournamentEntry>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info({ tournamentId }, 'Fetching tournament by ID');

      // Try API if configured
      if (this.isApiConfigured()) {
        try {
          const url = `${BALLDONTLIE_API.baseUrl}${BALLDONTLIE_API.endpoints.tournaments}/${tournamentId}`;
          const response = await got<{ data: BallDontLieTournament }>(url, {
            headers: BALLDONTLIE_API.headers(),
            timeout: { request: this.requestTimeout },
            responseType: 'json',
          });

          const tournaments = this.transformTournamentsResponse([response.body.data]);
          if (tournaments.length > 0) {
            tennisCache.set(cacheKey, tournaments[0], CACHE_TTL.MEDIUM);
            return tournaments[0];
          }
        } catch (error) {
          logger.warn({ tournamentId, error: error instanceof Error ? error.message : String(error) }, 'API failed for tournament');
        }
      }

      // Fallback to mock data
      // Support 2026+ IDs by converting to 2025 for lookup
      const yearMatch = tournamentId.match(/(20\d{2})$/);
      const requestedYear = yearMatch ? parseInt(yearMatch[1]) : 2025;
      const lookupId = requestedYear >= 2026 ? tournamentId.replace(String(requestedYear), '2025') : tournamentId;

      const tournament = MOCK_TOURNAMENTS.find(t => t.id === lookupId);

      if (!tournament) {
        logger.warn({ tournamentId }, 'Tournament not found');
        return null;
      }

      // Adapt to requested year if needed
      let result = tournament;
      if (requestedYear >= 2026) {
        result = {
          ...tournament,
          id: tournamentId,
          startDate: tournament.startDate.replace('2025', String(requestedYear)),
          endDate: tournament.endDate.replace('2025', String(requestedYear)),
        };
      }

      tennisCache.set(cacheKey, result, CACHE_TTL.MEDIUM);
      return result;
    } catch (error) {
      logger.error({ err: error, tournamentId }, ATP_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
      throw error;
    }
  }

  /**
   * Adapt matches to a different year (for 2026+ when we only have 2025 data)
   */
  private adaptMatchesToYear(matches: ATPMatchEntry[], targetYear: number): ATPMatchEntry[] {
    return matches.map(m => ({
      ...m,
      id: m.id.replace('2025', String(targetYear)),
      tournamentId: m.tournamentId.replace('2025', String(targetYear)),
      scheduledTime: m.scheduledTime?.replace('2025', String(targetYear)),
      completedTime: m.completedTime?.replace('2025', String(targetYear)),
    }));
  }

  /**
   * Fetch matches from BALLDONTLIE API
   */
  private async fetchMatchesFromApi(tournamentId?: string): Promise<ATPMatchEntry[]> {
    const url = `${BALLDONTLIE_API.baseUrl}${BALLDONTLIE_API.endpoints.matches}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLieMatch>>(url, {
          headers: BALLDONTLIE_API.headers(),
          searchParams: {
            per_page: 50,
            ...(tournamentId && { tournament_id: tournamentId }),
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformMatchesResponse(response.body.data);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE matches API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE matches API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API matches to ATPMatchEntry format
   */
  private transformMatchesResponse(matches: BallDontLieMatch[]): ATPMatchEntry[] {
    return matches.map(m => ({
      id: String(m.id),
      tournamentId: String(m.tournament_id),
      tournamentName: m.tournament_name ?? '',
      round: m.round ?? '',
      surface: m.surface ?? 'hard',
      player1: {
        id: String(m.player1?.id ?? 0),
        name: m.player1?.name ?? 'TBD',
        countryCode: m.player1?.country_code ?? '',
        seed: m.player1?.seed,
      },
      player2: {
        id: String(m.player2?.id ?? 0),
        name: m.player2?.name ?? 'TBD',
        countryCode: m.player2?.country_code ?? '',
        seed: m.player2?.seed,
      },
      scheduledTime: m.scheduled_time,
      completedTime: m.completed_time,
      status: this.normalizeMatchStatus(m.status),
      court: m.court,
    }));
  }

  /**
   * Normalize match status
   */
  private normalizeMatchStatus(status?: string): 'scheduled' | 'live' | 'completed' | 'cancelled' {
    if (!status) return 'scheduled';
    const normalized = status.toLowerCase();
    if (normalized.includes('live') || normalized.includes('progress')) return 'live';
    if (normalized.includes('complete') || normalized.includes('finished')) return 'completed';
    if (normalized.includes('cancel') || normalized.includes('postpone')) return 'cancelled';
    return 'scheduled';
  }

  /**
   * Get matches
   */
  async getMatches(args?: MatchesQueryArgs): Promise<ATPMatchEntry[]> {
    const cacheKey = `atp_matches_${args?.tournamentId ?? 'all'}_${args?.status ?? 'all'}`;

    try {
      // Check cache first
      const cached = tennisCache.get<ATPMatchEntry[]>(cacheKey);
      if (cached) {
        logger.info({ count: cached.length, source: 'cache' }, 'Returning cached ATP matches');
        return cached;
      }

      logger.info({ args }, 'Fetching ATP matches');

      let matches: ATPMatchEntry[];

      // Try API if configured
      if (this.isApiConfigured()) {
        try {
          matches = await this.fetchMatchesFromApi(args?.tournamentId);
          logger.info({ count: matches.length, source: 'api' }, 'Successfully fetched ATP matches from API');
        } catch (error) {
          logger.warn({ error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to mock data');
          matches = [...MOCK_MATCHES];
        }
      } else {
        logger.info('BALLDONTLIE API key not configured, using mock data');
        matches = [...MOCK_MATCHES];
      }

      // Support 2026+ by adapting 2025 data
      const currentYear = new Date().getFullYear();
      if (currentYear >= 2026 && matches === MOCK_MATCHES) {
        matches = this.adaptMatchesToYear(matches, currentYear);
      }

      // Filter by tournament if specified
      if (args?.tournamentId) {
        matches = matches.filter(m => m.tournamentId === args.tournamentId);
      }

      // Filter by player if specified
      if (args?.playerId) {
        matches = matches.filter(m =>
          m.player1.id === args.playerId || m.player2.id === args.playerId
        );
      }

      // Filter by status if specified (case-insensitive to handle GraphQL enums)
      if (args?.status) {
        const statusLower = args.status.toLowerCase();
        matches = matches.filter(m => m.status.toLowerCase() === statusLower);
      }

      // Cache the results (shorter TTL for matches as they change frequently)
      tennisCache.set(cacheKey, matches, CACHE_TTL.SHORT);

      logger.info({ count: matches.length }, 'Successfully fetched ATP matches');
      return matches;
    } catch (error) {
      logger.error({ err: error }, ATP_ERROR_MESSAGES.FETCH_MATCHES_FAILED);
      throw error;
    }
  }

  /**
   * Get live matches
   */
  async getLiveMatches(): Promise<ATPMatchEntry[]> {
    return this.getMatches({ status: 'live' });
  }

  /**
   * Format match score for display
   */
  formatScore(match: ATPMatchEntry): string {
    if (!match.score) return 'Not started';

    return match.score.sets.map(set => {
      const tiebreak = set.tiebreak
        ? `(${set.tiebreak.player1}-${set.tiebreak.player2})`
        : '';
      return `${set.player1}-${set.player2}${tiebreak}`;
    }).join(' ');
  }
}

export const atpTournamentsService = new ATPTournamentsService();
