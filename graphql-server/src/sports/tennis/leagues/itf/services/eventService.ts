/**
 * ITF Event Service
 *
 * Handles fetching and transforming ITF event data.
 * Covers Davis Cup, Billie Jean King Cup, and Olympic Tennis.
 */

import { logger } from '../../../../../utils/logger.js';
import type {
  ITFEvent,
  DavisCupTie,
  OlympicMatch,
  EventType,
} from '../types/itf-api.types.js';
import { ITF_ERROR_MESSAGES } from '../constants/index.js';

// Mock ITF events
const MOCK_EVENTS: ITFEvent[] = [
  {
    id: 'dc-2024',
    name: '2024 Davis Cup Finals',
    type: 'davis_cup',
    year: 2024,
    location: 'Malaga',
    country: 'Spain',
    startDate: '2024-11-19',
    endDate: '2024-11-24',
    surface: 'indoor_hard',
    status: 'completed',
  },
  {
    id: 'dc-2025',
    name: '2025 Davis Cup',
    type: 'davis_cup',
    year: 2025,
    location: 'Various',
    country: 'Various',
    startDate: '2025-02-01',
    endDate: '2025-11-30',
    surface: 'hard',
    status: 'upcoming',
  },
  {
    id: 'bjk-2024',
    name: '2024 Billie Jean King Cup Finals',
    type: 'bjk_cup',
    year: 2024,
    location: 'Malaga',
    country: 'Spain',
    startDate: '2024-11-13',
    endDate: '2024-11-20',
    surface: 'indoor_hard',
    status: 'completed',
  },
  {
    id: 'oly-2024',
    name: '2024 Paris Olympic Tennis',
    type: 'olympics',
    year: 2024,
    location: 'Paris',
    country: 'France',
    startDate: '2024-07-27',
    endDate: '2024-08-04',
    surface: 'clay',
    status: 'completed',
  },
  {
    id: 'oly-2028',
    name: '2028 Los Angeles Olympic Tennis',
    type: 'olympics',
    year: 2028,
    location: 'Los Angeles',
    country: 'USA',
    startDate: '2028-07-21',
    endDate: '2028-08-06',
    surface: 'hard',
    status: 'upcoming',
  },
  {
    id: 'uc-2025',
    name: '2025 United Cup',
    type: 'united_cup',
    year: 2025,
    location: 'Sydney & Perth',
    country: 'Australia',
    startDate: '2024-12-28',
    endDate: '2025-01-05',
    surface: 'hard',
    status: 'completed',
  },
];

// Mock Davis Cup 2024 Finals ties
const MOCK_DC_TIES: DavisCupTie[] = [
  {
    id: 'dc-2024-final',
    eventId: 'dc-2024',
    phase: 'final',
    homeTeam: {
      code: 'ITA',
      name: 'Italy',
      flag: 'https://itf.com/flags/ita.svg',
      captain: 'Filippo Volandri',
      players: [
        { id: 'sinner', firstName: 'Jannik', lastName: 'Sinner', fullName: 'Jannik Sinner', countryCode: 'ITA', ranking: 1 },
        { id: 'berrettini', firstName: 'Matteo', lastName: 'Berrettini', fullName: 'Matteo Berrettini', countryCode: 'ITA', ranking: 35 },
      ],
    },
    awayTeam: {
      code: 'NED',
      name: 'Netherlands',
      flag: 'https://itf.com/flags/ned.svg',
      captain: 'Paul Haarhuis',
      players: [
        { id: 'griekspoor', firstName: 'Tallon', lastName: 'Griekspoor', fullName: 'Tallon Griekspoor', countryCode: 'NED', ranking: 40 },
        { id: 'vankoot', firstName: 'Botic', lastName: 'van de Zandschulp', fullName: 'Botic van de Zandschulp', countryCode: 'NED', ranking: 80 },
      ],
    },
    score: { home: 2, away: 0 },
    date: '2024-11-24',
    venue: 'Palacio de Deportes Martin Carpena',
    surface: 'indoor_hard',
    status: 'completed',
  },
  {
    id: 'dc-2024-sf1',
    eventId: 'dc-2024',
    phase: 'semifinal',
    homeTeam: {
      code: 'ITA',
      name: 'Italy',
      flag: 'https://itf.com/flags/ita.svg',
      captain: 'Filippo Volandri',
      players: [],
    },
    awayTeam: {
      code: 'AUS',
      name: 'Australia',
      flag: 'https://itf.com/flags/aus.svg',
      captain: 'Lleyton Hewitt',
      players: [],
    },
    score: { home: 2, away: 0 },
    date: '2024-11-23',
    venue: 'Palacio de Deportes Martin Carpena',
    surface: 'indoor_hard',
    status: 'completed',
  },
];

// Mock Olympic 2024 medal matches
const MOCK_OLYMPIC_MATCHES: OlympicMatch[] = [
  {
    id: 'oly-2024-ms-gold',
    eventId: 'oly-2024',
    draw: 'mens_singles',
    round: 'Final',
    player1: {
      player: { id: 'djokovic', firstName: 'Novak', lastName: 'Djokovic', fullName: 'Novak Djokovic', countryCode: 'SRB' },
      countryCode: 'SRB',
      seed: 1,
    },
    player2: {
      player: { id: 'alcaraz', firstName: 'Carlos', lastName: 'Alcaraz', fullName: 'Carlos Alcaraz', countryCode: 'ESP' },
      countryCode: 'ESP',
      seed: 2,
    },
    score: '7-6(3) 7-6(2)',
    winner: 'player1',
    medal: 'gold',
    scheduledTime: '2024-08-04T12:00:00Z',
    status: 'completed',
    court: 'Court Philippe Chatrier',
  },
  {
    id: 'oly-2024-ws-gold',
    eventId: 'oly-2024',
    draw: 'womens_singles',
    round: 'Final',
    player1: {
      player: { id: 'zheng', firstName: 'Qinwen', lastName: 'Zheng', fullName: 'Qinwen Zheng', countryCode: 'CHN' },
      countryCode: 'CHN',
      seed: 6,
    },
    player2: {
      player: { id: 'vekic', firstName: 'Donna', lastName: 'Vekic', fullName: 'Donna Vekic', countryCode: 'CRO' },
      countryCode: 'CRO',
    },
    score: '6-2 6-3',
    winner: 'player1',
    medal: 'gold',
    scheduledTime: '2024-08-03T15:00:00Z',
    status: 'completed',
    court: 'Court Philippe Chatrier',
  },
];

class ITFEventService {
  /**
   * Get all ITF events
   */
  async getEvents(type?: EventType): Promise<ITFEvent[]> {
    try {
      logger.info({ type }, 'Fetching ITF events');

      let events = [...MOCK_EVENTS];

      if (type) {
        events = events.filter(e => e.type === type);
      }

      return events;
    } catch (error) {
      logger.error({ err: error }, ITF_ERROR_MESSAGES.FETCH_DRAW_FAILED);
      throw error;
    }
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<ITFEvent | null> {
    const events = await this.getEvents();
    return events.find(e => e.id === eventId) || null;
  }

  /**
   * Get Davis Cup ties
   */
  async getDavisCupTies(eventId: string): Promise<DavisCupTie[]> {
    try {
      logger.info({ eventId }, 'Fetching Davis Cup ties');
      return MOCK_DC_TIES.filter(t => t.eventId === eventId);
    } catch (error) {
      logger.error({ err: error, eventId }, ITF_ERROR_MESSAGES.FETCH_MATCHES_FAILED);
      throw error;
    }
  }

  /**
   * Get Davis Cup final
   */
  async getDavisCupFinal(eventId: string): Promise<DavisCupTie | null> {
    const ties = await this.getDavisCupTies(eventId);
    return ties.find(t => t.phase === 'final') || null;
  }

  /**
   * Get Olympic matches
   */
  async getOlympicMatches(eventId: string, draw?: string): Promise<OlympicMatch[]> {
    try {
      logger.info({ eventId, draw }, 'Fetching Olympic matches');

      let matches = MOCK_OLYMPIC_MATCHES.filter(m => m.eventId === eventId);

      if (draw) {
        matches = matches.filter(m => m.draw === draw);
      }

      return matches;
    } catch (error) {
      logger.error({ err: error, eventId }, ITF_ERROR_MESSAGES.FETCH_MATCHES_FAILED);
      throw error;
    }
  }

  /**
   * Get Olympic medal matches
   */
  async getOlympicMedalMatches(eventId: string): Promise<OlympicMatch[]> {
    const matches = await this.getOlympicMatches(eventId);
    return matches.filter(m => m.medal !== undefined);
  }

  /**
   * Get upcoming ITF events
   */
  async getUpcomingEvents(): Promise<ITFEvent[]> {
    const events = await this.getEvents();
    return events.filter(e => e.status === 'upcoming');
  }
}

export const itfEventService = new ITFEventService();
