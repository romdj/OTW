/**
 * WTA Tournaments Service
 *
 * Handles fetching and transforming WTA tournament data.
 */

import { logger } from '../../../../../utils/logger.js';
import type { WTATournamentEntry, TournamentsQueryArgs } from '../types/wta-api.types.js';
import { WTA_ERROR_MESSAGES, WTA_RANKING_POINTS } from '../constants/index.js';

// Mock WTA tournament data
const MOCK_WTA_TOURNAMENTS: WTATournamentEntry[] = [
  {
    id: 'ao-w-2025',
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
    points: WTA_RANKING_POINTS.grand_slam,
  },
  {
    id: 'doha-2025',
    name: 'Qatar TotalEnergies Open',
    location: 'Doha',
    country: 'Qatar',
    surface: 'hard',
    category: 'wta_1000',
    startDate: '2025-02-09',
    endDate: '2025-02-15',
    prizeMoney: 3221715,
    currency: 'USD',
    drawSize: 56,
    points: WTA_RANKING_POINTS.wta_1000,
  },
  {
    id: 'dubai-2025',
    name: 'Dubai Duty Free Tennis Championships',
    location: 'Dubai',
    country: 'UAE',
    surface: 'hard',
    category: 'wta_1000',
    startDate: '2025-02-16',
    endDate: '2025-02-22',
    prizeMoney: 3221715,
    currency: 'USD',
    drawSize: 56,
    points: WTA_RANKING_POINTS.wta_1000,
  },
  {
    id: 'iw-w-2025',
    name: 'BNP Paribas Open',
    location: 'Indian Wells',
    country: 'USA',
    surface: 'hard',
    category: 'wta_1000',
    startDate: '2025-03-05',
    endDate: '2025-03-16',
    prizeMoney: 8800000,
    currency: 'USD',
    drawSize: 96,
    points: WTA_RANKING_POINTS.wta_1000,
  },
  {
    id: 'mia-w-2025',
    name: 'Miami Open',
    location: 'Miami',
    country: 'USA',
    surface: 'hard',
    category: 'wta_1000',
    startDate: '2025-03-19',
    endDate: '2025-03-30',
    prizeMoney: 8800000,
    currency: 'USD',
    drawSize: 96,
    points: WTA_RANKING_POINTS.wta_1000,
  },
  {
    id: 'rg-w-2025',
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
    points: WTA_RANKING_POINTS.grand_slam,
  },
  {
    id: 'wim-w-2025',
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
    points: WTA_RANKING_POINTS.grand_slam,
  },
  {
    id: 'uso-w-2025',
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
    points: WTA_RANKING_POINTS.grand_slam,
  },
  {
    id: 'wta-finals-2025',
    name: 'WTA Finals',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    surface: 'hard',
    category: 'wta_1000',
    startDate: '2025-11-01',
    endDate: '2025-11-08',
    prizeMoney: 15250000,
    currency: 'USD',
    drawSize: 8,
    points: 1500, // Variable based on performance
  },
];

class WTATournamentsService {
  /**
   * Get WTA tournament schedule
   */
  async getTournaments(args?: TournamentsQueryArgs): Promise<WTATournamentEntry[]> {
    try {
      logger.info({ args }, 'Fetching WTA tournaments');

      let tournaments = [...MOCK_WTA_TOURNAMENTS];

      if (args?.surface) {
        tournaments = tournaments.filter(t => t.surface === args.surface);
      }

      if (args?.category) {
        tournaments = tournaments.filter(t => t.category === args.category);
      }

      if (args?.year) {
        tournaments = tournaments.filter(t =>
          new Date(t.startDate).getFullYear() === args.year
        );
      }

      logger.info({ count: tournaments.length }, 'Successfully fetched WTA tournaments');
      return tournaments;
    } catch (error) {
      logger.error({ err: error }, WTA_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
      throw error;
    }
  }

  /**
   * Get tournament by ID
   */
  async getTournamentById(tournamentId: string): Promise<WTATournamentEntry | null> {
    try {
      const tournament = MOCK_WTA_TOURNAMENTS.find(t => t.id === tournamentId);
      return tournament || null;
    } catch (error) {
      logger.error({ err: error, tournamentId }, WTA_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
      throw error;
    }
  }
}

export const wtaTournamentsService = new WTATournamentsService();
