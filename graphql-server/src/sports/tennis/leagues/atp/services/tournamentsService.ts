/**
 * ATP Tournaments Service
 *
 * Handles fetching and transforming tennis tournament data.
 * Currently uses mock data - will integrate with real APIs later.
 */

import { logger } from '../../../../../utils/logger.js';
import type { ATPTournamentEntry, ATPMatchEntry, TournamentsQueryArgs, MatchesQueryArgs } from '../types/atp-api.types.js';
import { ATP_ERROR_MESSAGES, ATP_RANKING_POINTS } from '../constants/index.js';

// Mock tournament data for development
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

// Mock match data for development
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
    try {
      logger.info({ args }, 'Fetching ATP tournaments');

      // TODO: Replace with real API call
      let tournaments = [...MOCK_TOURNAMENTS];

      // Support 2026+ by adapting 2025 data
      const requestedYear = args?.year ?? new Date().getFullYear();
      if (requestedYear >= 2026) {
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
    try {
      logger.info({ tournamentId }, 'Fetching tournament by ID');

      // TODO: Replace with real API call
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
      if (requestedYear >= 2026) {
        return {
          ...tournament,
          id: tournamentId,
          startDate: tournament.startDate.replace('2025', String(requestedYear)),
          endDate: tournament.endDate.replace('2025', String(requestedYear)),
        };
      }

      return tournament;
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
   * Get matches
   */
  async getMatches(args?: MatchesQueryArgs): Promise<ATPMatchEntry[]> {
    try {
      logger.info({ args }, 'Fetching ATP matches');

      // TODO: Replace with real API call
      let matches = [...MOCK_MATCHES];

      // Support 2026+ by adapting 2025 data
      const currentYear = new Date().getFullYear();
      if (currentYear >= 2026) {
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
