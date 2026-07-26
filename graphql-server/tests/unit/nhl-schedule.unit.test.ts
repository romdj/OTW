import {
  normalizeNhlGameStatus,
  transformNhlScheduleGame,
  validateNhlScheduleDate,
} from '../../src/sports/ice-hockey/leagues/nhl/services/scheduleService.js';
import type { NHLApiScheduleGame } from '../../src/sports/ice-hockey/leagues/nhl/types/nhl-api.types.js';

const scheduledGame: NHLApiScheduleGame = {
  id: 2025020001,
  season: 20252026,
  gameType: 2,
  gameState: 'FUT',
  gameScheduleState: 'OK',
  startTimeUTC: '2025-10-08T23:00:00Z',
  venue: { default: 'Bell Centre' },
  neutralSite: false,
  awayTeam: {
    id: 10,
    abbrev: 'TOR',
    placeName: { default: 'Toronto' },
    commonName: { default: 'Maple Leafs' },
    score: 0,
  },
  homeTeam: {
    id: 8,
    abbrev: 'MTL',
    placeName: { default: 'Montréal' },
    commonName: { default: 'Canadiens' },
    score: 0,
  },
};

describe('NHL schedule normalization', () => {
  describe('validateNhlScheduleDate', () => {
    it('accepts a real ISO calendar date', () => {
      expect(() => validateNhlScheduleDate('2026-02-28')).not.toThrow();
      expect(() => validateNhlScheduleDate('2024-02-29')).not.toThrow();
    });

    it('rejects malformed and impossible dates', () => {
      expect(() => validateNhlScheduleDate('02/28/2026')).toThrow('YYYY-MM-DD');
      expect(() => validateNhlScheduleDate('2026-02-30')).toThrow('valid calendar date');
    });
  });

  describe('normalizeNhlGameStatus', () => {
    it.each([
      ['FUT', 'OK', 'scheduled'],
      ['PRE', 'OK', 'pregame'],
      ['LIVE', 'OK', 'live'],
      ['CRIT', 'OK', 'live'],
      ['FINAL', 'OK', 'final'],
      ['OFF', 'OK', 'final'],
      ['FUT', 'PPD', 'postponed'],
      ['FUT', 'CNCL', 'cancelled'],
      ['UNEXPECTED', 'OK', 'unknown'],
    ])('maps %s/%s to %s', (gameState, scheduleState, expected) => {
      expect(normalizeNhlGameStatus(gameState, scheduleState)).toBe(expected);
    });
  });

  describe('transformNhlScheduleGame', () => {
    it('normalizes stable IDs, UTC start time, teams, and venue', () => {
      expect(transformNhlScheduleGame(scheduledGame)).toEqual({
        providerId: '2025020001',
        provider: 'NHL',
        league: 'NHL',
        season: '20252026',
        gameType: 2,
        startTime: '2025-10-08T23:00:00.000Z',
        status: 'scheduled',
        providerStatus: 'FUT:OK',
        venue: 'Bell Centre',
        neutralSite: false,
        awayTeam: {
          providerId: '10',
          abbreviation: 'TOR',
          name: 'Toronto Maple Leafs',
        },
        homeTeam: {
          providerId: '8',
          abbreviation: 'MTL',
          name: 'Montréal Canadiens',
        },
      });
    });

    it('includes scores for live/final games but not scheduled games', () => {
      expect(transformNhlScheduleGame(scheduledGame).homeTeam.score).toBeUndefined();

      const finalGame = {
        ...scheduledGame,
        gameState: 'FINAL',
        homeTeam: { ...scheduledGame.homeTeam, score: 4 },
        awayTeam: { ...scheduledGame.awayTeam, score: 2 },
      };

      expect(transformNhlScheduleGame(finalGame).homeTeam.score).toBe(4);
      expect(transformNhlScheduleGame(finalGame).awayTeam.score).toBe(2);
    });
  });
});
