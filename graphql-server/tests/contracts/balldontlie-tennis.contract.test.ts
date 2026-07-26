/**
 * BALLDONTLIE Tennis API Contract Tests
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

describeIfConfigured('BALLDONTLIE ATP/WTA API Contract', () => {
  const headers = {
    'Authorization': API_KEY,
    'Content-Type': 'application/json',
  };

  const timeout = { request: 15000 };

  describe('GET /atp/v1/players', () => {
    let response: any;

    beforeAll(async () => {
      try {
        const result = await got(`${API_BASE}/atp/v1/players`, {
          headers,
          searchParams: { per_page: 5 },
          timeout,
          responseType: 'json',
        });
        response = result.body;
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return pagination meta', () => {
      expect(response).toHaveProperty('meta');
      if (response.meta) {
        expect(typeof response.meta.per_page).toBe('number');
        if (response.meta.next_cursor != null) {
          expect(typeof response.meta.next_cursor).toBe('number');
        }
      }
    });

    it('should have valid player objects', () => {
      for (const player of response.data) {
        // Required fields
        expect(player).toHaveProperty('id');
        expect(typeof player.id).toBe('number');

        // Name fields (at least one should exist)
        const hasName = player.full_name || player.first_name || player.last_name;
        expect(hasName).toBeTruthy();

        // Country field
        if (player.country) {
          expect(typeof player.country).toBe('string');
        }

        // Ranking field (if present)
        if (player.ranking !== undefined) {
          expect(typeof player.ranking).toBe('number');
        }

        // Points field (if present)
        if (player.points !== undefined) {
          expect(typeof player.points).toBe('number');
        }
      }
    });

    it('should have consistent field types across all players', () => {
      const fieldTypes: Record<string, Set<string>> = {};

      for (const player of response.data) {
        for (const [key, value] of Object.entries(player)) {
          if (!fieldTypes[key]) {
            fieldTypes[key] = new Set();
          }
          fieldTypes[key].add(value === null ? 'null' : typeof value);
        }
      }

      // Each field should have consistent types (allowing null)
      for (const [_field, types] of Object.entries(fieldTypes)) {
        const nonNullTypes = new Set([...types].filter(t => t !== 'null'));
        expect(nonNullTypes.size).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('GET /atp/v1/tournaments', () => {
    let response: any;

    beforeAll(async () => {
      const result = await got(`${API_BASE}/atp/v1/tournaments`, {
        headers,
        searchParams: { per_page: 10 },
        timeout,
        responseType: 'json',
      });
      response = result.body;
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should have valid tournament objects (if any)', () => {
      for (const tournament of response.data) {
        expect(tournament).toHaveProperty('id');

        if (tournament.name) {
          expect(typeof tournament.name).toBe('string');
        }

        if (tournament.country) {
          expect(typeof tournament.country).toBe('string');
        }

        if (tournament.surface) {
          expect(typeof tournament.surface).toBe('string');
        }

        if (tournament.start_date) {
          expect(tournament.start_date).toMatch(/^\d{4}-\d{2}-\d{2}/);
        }
      }
    });
  });

  describe('GET /atp/v1/matches', () => {
    let response: any;

    beforeAll(async () => {
      const result = await got(`${API_BASE}/atp/v1/matches`, {
        headers,
        searchParams: { per_page: 5 },
        timeout,
        responseType: 'json',
      });
      response = result.body;
    });

    it('should return a data array', () => {
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should have valid match objects (if any)', () => {
      for (const match of response.data) {
        expect(match).toHaveProperty('id');

        // Player references
        if (match.player1) {
          expect(typeof match.player1).toBe('object');
        }

        if (match.player2) {
          expect(typeof match.player2).toBe('object');
        }

        // Status field
        if (match.status) {
          expect(typeof match.status).toBe('string');
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for invalid API key', async () => {
      try {
        await got(`${API_BASE}/atp/v1/players`, {
          headers: { Authorization: 'invalid-key' },
          timeout,
          responseType: 'json',
        });
        throw new Error('Expected request to fail');
      } catch (error: any) {
        expect([401, 403]).toContain(error.response?.statusCode);
      }
    });
  });

  describe.each(['atp', 'wta'])('GET /%s/v1/tournaments exact shape', tour => {
    it('returns documented cursor pagination and tournament records', async () => {
      const result = await got(`${API_BASE}/${tour}/v1/tournaments`, {
        headers,
        searchParams: { per_page: 2 },
        timeout,
        responseType: 'json',
      });
      const body = result.body as {
        data: Array<{ id: number; season?: number | null }>;
        meta: { next_cursor?: number | null; per_page: number };
      };
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(typeof body.meta.per_page).toBe('number');
      for (const tournament of body.data) {
        expect(typeof tournament.id).toBe('number');
        if (tournament.season != null) expect(typeof tournament.season).toBe('number');
      }
    });
  });
});
