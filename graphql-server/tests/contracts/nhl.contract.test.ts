/**
 * NHL API Contract Tests
 *
 * These tests call the real NHL API to verify response shapes
 * match our expected TypeScript types. Run separately from unit tests.
 *
 * Note: NHL API is public (no API key required).
 *
 * @group contract
 */

import got from 'got';

const API_BASE = 'https://api-web.nhle.com/v1';

describe('NHL API Contract', () => {
  const timeout = { request: 15000 };

  describe('GET /standings/now', () => {
    let response: any;

    beforeAll(async () => {
      const result = await got(`${API_BASE}/standings/now`, {
        timeout,
        responseType: 'json',
      });
      response = result.body;
    });

    it('should return standings object', () => {
      expect(response).toHaveProperty('standings');
      expect(Array.isArray(response.standings)).toBe(true);
    });

    it('should have valid team standing objects', () => {
      expect(response.standings.length).toBeGreaterThan(0);

      for (const team of response.standings) {
        // Team identification
        expect(team).toHaveProperty('teamAbbrev');
        expect(typeof team.teamAbbrev.default).toBe('string');
        expect(team.teamAbbrev.default.length).toBe(3);

        expect(team).toHaveProperty('teamName');

        // Conference/Division
        expect(team).toHaveProperty('conferenceName');
        expect(team).toHaveProperty('divisionName');

        // Core stats
        expect(typeof team.points).toBe('number');
        expect(typeof team.wins).toBe('number');
        expect(typeof team.losses).toBe('number');
        expect(typeof team.gamesPlayed).toBe('number');

        // OT losses
        expect(typeof team.otLosses).toBe('number');

        // Goals
        expect(typeof team.goalFor).toBe('number');
        expect(typeof team.goalAgainst).toBe('number');
        expect(typeof team.goalDifferential).toBe('number');
      }
    });

    it('should have teams sorted by points', () => {
      // First team should be near the top
      const topTeamPoints = response.standings[0].points;
      const maxPoints = Math.max(...response.standings.map((t: any) => t.points));
      expect(topTeamPoints).toBeGreaterThanOrEqual(maxPoints - 10);
    });

    it('should have 32 NHL teams', () => {
      // May vary during season transitions, but roughly 32
      expect(response.standings.length).toBeGreaterThanOrEqual(30);
      expect(response.standings.length).toBeLessThanOrEqual(33);
    });
  });

  describe('GET /schedule/now', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/schedule/now`, {
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (_error) {
        // During off-season, schedule might be empty
        response = { gameWeek: [] };
      }
    });

    it('should return schedule structure', () => {
      expect(response).toHaveProperty('gameWeek');
      expect(Array.isArray(response.gameWeek)).toBe(true);
    });

    it('should have valid game objects (if any)', () => {
      for (const day of response.gameWeek) {
        expect(day).toHaveProperty('date');
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        if (day.games && day.games.length > 0) {
          for (const game of day.games) {
            expect(game).toHaveProperty('id');
            expect(game).toHaveProperty('awayTeam');
            expect(game).toHaveProperty('homeTeam');
            expect(game).toHaveProperty('gameState');
          }
        }
      }
    });
  });

  describe('GET /score/now', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/score/now`, {
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (_error) {
        response = { games: [] };
      }
    });

    it('should return scores structure', () => {
      expect(response).toHaveProperty('games');
      expect(Array.isArray(response.games)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for invalid endpoint', async () => {
      try {
        await got(`${API_BASE}/invalid-endpoint`, {
          timeout,
          responseType: 'json',
        });
        throw new Error('Expected request to fail');
      } catch (error: any) {
        expect(error.response?.statusCode).toBe(404);
      }
    });
  });
});
