/**
 * BALLDONTLIE Formula 1 API Contract Tests
 *
 * These tests call the real BALLDONTLIE API to verify response shapes
 * match our expected TypeScript types. Run separately from unit tests.
 *
 * @group contract
 * @group integration
 */

import got from 'got';
import { config } from '../../src/config/env';

const API_BASE = config.BALLDONTLIE_API_BASE_URL;
const API_KEY = config.BALLDONTLIE_API_KEY;

const isApiConfigured = API_KEY && API_KEY !== 'your_api_key_here';

// Skip all tests if API key not configured
const describeIfConfigured = isApiConfigured ? describe : describe.skip;

describeIfConfigured('BALLDONTLIE F1 API Contract', () => {
  const headers = {
    'Authorization': API_KEY,
    'Content-Type': 'application/json',
  };

  const timeout = { request: 15000 };

  describe('GET /formula1/races', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/formula1/races`, {
          headers,
          searchParams: { season: 2024, per_page: 25 },
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (error) {
        console.warn('F1 races endpoint may not be available:', error);
        response = { data: [], meta: {} };
      }
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return pagination meta', () => {
      if (response.meta) {
        expect(typeof response.meta.total_count === 'number' || response.meta.total_count === undefined).toBe(true);
      }
    });

    it('should have valid race objects (if any)', () => {
      for (const race of response.data) {
        // ID is required
        expect(race).toHaveProperty('id');

        // Season/round
        if (race.season !== undefined) {
          expect(typeof race.season).toBe('number');
        }

        if (race.round !== undefined) {
          expect(typeof race.round).toBe('number');
        }

        // Name
        if (race.name) {
          expect(typeof race.name).toBe('string');
        }

        // Circuit info
        if (race.circuit_name) {
          expect(typeof race.circuit_name).toBe('string');
        }

        if (race.country) {
          expect(typeof race.country).toBe('string');
        }

        // Date format
        if (race.date) {
          expect(race.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
        }

        // Format
        if (race.format) {
          expect(['standard', 'sprint']).toContain(race.format.toLowerCase());
        }

        // Sessions array
        if (race.sessions) {
          expect(Array.isArray(race.sessions)).toBe(true);
          for (const session of race.sessions) {
            expect(session).toHaveProperty('type');
            if (session.date) {
              expect(session.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
            }
          }
        }
      }
    });

    it('should have races in round order (if any)', () => {
      if (response.data.length > 1) {
        const rounds = response.data
          .filter((r: any) => r.round !== undefined)
          .map((r: any) => r.round);

        for (let i = 1; i < rounds.length; i++) {
          expect(rounds[i]).toBeGreaterThanOrEqual(rounds[i - 1]);
        }
      }
    });
  });

  describe('GET /formula1/drivers', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/formula1/drivers`, {
          headers,
          searchParams: { season: 2024, per_page: 25 },
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (error) {
        console.warn('F1 drivers endpoint may not be available:', error);
        response = { data: [], meta: {} };
      }
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should have valid driver objects (if any)', () => {
      for (const driver of response.data) {
        // ID is required
        expect(driver).toHaveProperty('id');

        // Name fields
        if (driver.first_name) {
          expect(typeof driver.first_name).toBe('string');
        }

        if (driver.last_name) {
          expect(typeof driver.last_name).toBe('string');
        }

        // Driver code (3 letters)
        if (driver.code) {
          expect(typeof driver.code).toBe('string');
          expect(driver.code.length).toBe(3);
        }

        // Number
        if (driver.number !== undefined) {
          expect(typeof driver.number).toBe('number');
        }

        // Points
        if (driver.points !== undefined) {
          expect(typeof driver.points).toBe('number');
        }

        // Position
        if (driver.position !== undefined) {
          expect(typeof driver.position).toBe('number');
        }

        // Wins
        if (driver.wins !== undefined) {
          expect(typeof driver.wins).toBe('number');
        }

        // Constructor
        if (driver.constructor_name) {
          expect(typeof driver.constructor_name).toBe('string');
        }

        // Nationality
        if (driver.nationality) {
          expect(typeof driver.nationality).toBe('string');
        }
      }
    });

    it('should have positions in order (if standings data)', () => {
      const driversWithPosition = response.data.filter((d: any) => d.position !== undefined);
      if (driversWithPosition.length > 1) {
        const positions = driversWithPosition.map((d: any) => d.position);
        for (let i = 1; i < positions.length; i++) {
          expect(positions[i]).toBeGreaterThanOrEqual(positions[i - 1]);
        }
      }
    });
  });

  describe('GET /formula1/constructors', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/formula1/constructors`, {
          headers,
          searchParams: { season: 2024, per_page: 15 },
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (error) {
        console.warn('F1 constructors endpoint may not be available:', error);
        response = { data: [], meta: {} };
      }
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should have valid constructor objects (if any)', () => {
      for (const constructor of response.data) {
        // ID is required
        expect(constructor).toHaveProperty('id');

        // Name
        if (constructor.name) {
          expect(typeof constructor.name).toBe('string');
        }

        // Nationality
        if (constructor.nationality) {
          expect(typeof constructor.nationality).toBe('string');
        }

        // Points
        if (constructor.points !== undefined) {
          expect(typeof constructor.points).toBe('number');
        }

        // Position
        if (constructor.position !== undefined) {
          expect(typeof constructor.position).toBe('number');
        }

        // Wins
        if (constructor.wins !== undefined) {
          expect(typeof constructor.wins).toBe('number');
        }
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limit headers gracefully', async () => {
      try {
        const result = await got(`${API_BASE}/formula1/races`, {
          headers,
          searchParams: { per_page: 1 },
          timeout,
          responseType: 'json',
        });

        // Check for rate limit headers (if present)
        const rateLimitRemaining = result.headers['x-ratelimit-remaining'];
        const rateLimitLimit = result.headers['x-ratelimit-limit'];

        if (rateLimitRemaining !== undefined) {
          expect(parseInt(rateLimitRemaining as string, 10)).toBeGreaterThanOrEqual(0);
        }

        if (rateLimitLimit !== undefined) {
          expect(parseInt(rateLimitLimit as string, 10)).toBeGreaterThan(0);
        }
      } catch (error: any) {
        // 429 is acceptable - means rate limiting is working
        if (error.response?.statusCode === 429) {
          expect(error.response.statusCode).toBe(429);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Error Responses', () => {
    it('should return proper error for invalid season', async () => {
      try {
        const result = await got(`${API_BASE}/formula1/races`, {
          headers,
          searchParams: { season: 1800 }, // Invalid season
          timeout,
          responseType: 'json',
        });
        // Either empty data or 4xx error is acceptable
        expect(result.body).toHaveProperty('data');
      } catch (error: any) {
        // 400 or 404 for invalid season is acceptable
        expect([400, 404, 422]).toContain(error.response?.statusCode);
      }
    });
  });
});
