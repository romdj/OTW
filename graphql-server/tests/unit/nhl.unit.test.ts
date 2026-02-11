/**
 * NHL Business Logic Unit Tests
 *
 * Tests for team ID mappings.
 * No I/O, no mocking - just logic verification.
 */

import { getTeamId, getTeamAbbrev } from '../../src/sports/ice-hockey/leagues/nhl/utils/teamMappings';

describe('NHL Team Mappings', () => {
  describe('getTeamId', () => {
    it('returns correct ID for valid abbreviation', () => {
      expect(getTeamId('TOR')).toBe(10);
      expect(getTeamId('MTL')).toBe(8);
      expect(getTeamId('BOS')).toBe(6);
    });

    it('handles lowercase input', () => {
      expect(getTeamId('tor')).toBe(10);
      expect(getTeamId('Mtl')).toBe(8);
    });

    it('returns null for invalid abbreviation', () => {
      expect(getTeamId('XXX')).toBeNull();
      expect(getTeamId('')).toBeNull();
    });
  });

  describe('getTeamAbbrev', () => {
    it('returns correct abbreviation for valid ID', () => {
      expect(getTeamAbbrev(10)).toBe('TOR');
      expect(getTeamAbbrev(8)).toBe('MTL');
    });

    it('returns null for invalid ID', () => {
      expect(getTeamAbbrev(999)).toBeNull();
      expect(getTeamAbbrev(-1)).toBeNull();
    });
  });
});
