/**
 * NHL Standings Service Tests
 *
 * Tests for NHL standings data fetching and transformation.
 */

import { nhlStandingsService } from '../../../../../src/sports/ice-hockey/leagues/nhl/services/standingsService';

describe('NHLStandingsService', () => {
  describe('getStandings', () => {
    it('should return standings array', async () => {
      const standings = await nhlStandingsService.getStandings();

      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    it('should return transformed team data', async () => {
      const standings = await nhlStandingsService.getStandings();
      const team = standings[0];

      // Required fields from TransformedTeam
      expect(typeof team.teamName).toBe('string');
      expect(typeof team.teamAbbrev).toBe('string');
      expect(typeof team.teamLogo).toBe('string');
      expect(typeof team.gamesPlayed).toBe('number');
      expect(typeof team.wins).toBe('number');
      expect(typeof team.losses).toBe('number');
      expect(typeof team.points).toBe('number');
      expect(typeof team.winPercentage).toBe('number');
      expect(typeof team.divisionName).toBe('string');
      expect(typeof team.conferenceName).toBe('string');
      expect(typeof team.date).toBe('string');
    });

    it('should have valid win percentage (0-1 range)', async () => {
      const standings = await nhlStandingsService.getStandings();

      for (const team of standings) {
        expect(team.winPercentage).toBeGreaterThanOrEqual(0);
        expect(team.winPercentage).toBeLessThanOrEqual(1);
      }
    });

    it('should have non-negative stats', async () => {
      const standings = await nhlStandingsService.getStandings();

      for (const team of standings) {
        expect(team.gamesPlayed).toBeGreaterThanOrEqual(0);
        expect(team.wins).toBeGreaterThanOrEqual(0);
        expect(team.losses).toBeGreaterThanOrEqual(0);
        expect(team.points).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('getTeamPowerplayStats', () => {
    it('should return powerplay stats for valid team', async () => {
      const stats = await nhlStandingsService.getTeamPowerplayStats('BOS');

      // May return null if API unavailable, but should not throw
      if (stats !== null) {
        expect(typeof stats).toBe('object');
      }
    });
  });
});
