/**
 * ATP Rankings Service Tests
 *
 * Tests for ATP rankings data fetching and transformation.
 */

import { atpRankingsService } from '../../../../../src/sports/tennis/leagues/atp/services/rankingsService';

describe('ATPRankingsService', () => {
  describe('getRankings', () => {
    it('should return rankings array', async () => {
      const rankings = await atpRankingsService.getRankings();

      expect(Array.isArray(rankings)).toBe(true);
      expect(rankings.length).toBeGreaterThan(0);
    });

    it('should have required fields on each ranking entry', async () => {
      const rankings = await atpRankingsService.getRankings();

      for (const entry of rankings) {
        expect(typeof entry.rank).toBe('number');
        expect(entry.rank).toBeGreaterThan(0);

        expect(typeof entry.previousRank).toBe('number');
        expect(entry.previousRank).toBeGreaterThan(0);

        expect(typeof entry.playerName).toBe('string');
        expect(entry.playerName.length).toBeGreaterThan(0);

        expect(typeof entry.playerId).toBe('string');
        expect(entry.playerId).toMatch(/^[A-Z0-9]{4}$/);

        expect(typeof entry.country).toBe('string');
        expect(typeof entry.countryCode).toBe('string');
        expect(entry.countryCode).toMatch(/^[A-Z]{3}$/);

        expect(typeof entry.points).toBe('number');
        expect(entry.points).toBeGreaterThanOrEqual(0);

        expect(typeof entry.tournamentsPlayed).toBe('number');
        expect(entry.tournamentsPlayed).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return rankings in order', async () => {
      const rankings = await atpRankingsService.getRankings();

      for (let i = 0; i < rankings.length; i++) {
        expect(rankings[i].rank).toBe(i + 1);
      }
    });

    it('should respect limit parameter', async () => {
      const rankings = await atpRankingsService.getRankings({ limit: 5 });

      expect(rankings.length).toBe(5);
    });

    it('should have higher points for higher ranked players', async () => {
      const rankings = await atpRankingsService.getRankings();

      for (let i = 1; i < rankings.length; i++) {
        expect(rankings[i - 1].points).toBeGreaterThanOrEqual(rankings[i].points);
      }
    });
  });

  describe('getPlayerProfile', () => {
    it('should return profile for known player', async () => {
      const profile = await atpRankingsService.getPlayerProfile('S0AG'); // Sinner

      expect(profile).not.toBeNull();
      expect(profile?.id).toBe('S0AG');
      expect(profile?.fullName).toBe('Jannik Sinner');
      expect(profile?.country).toBe('Italy');
      expect(profile?.countryCode).toBe('ITA');
    });

    it('should return null for unknown player', async () => {
      const profile = await atpRankingsService.getPlayerProfile('XXXX');

      expect(profile).toBeNull();
    });

    it('should include career statistics', async () => {
      const profile = await atpRankingsService.getPlayerProfile('D643'); // Djokovic

      expect(profile).not.toBeNull();
      expect(typeof profile?.careerTitles).toBe('number');
      expect(typeof profile?.careerWins).toBe('number');
      expect(typeof profile?.careerLosses).toBe('number');
      expect(typeof profile?.ytdWins).toBe('number');
      expect(typeof profile?.ytdLosses).toBe('number');
      expect(typeof profile?.prizeMoney).toBe('number');
    });

    it('should include physical attributes', async () => {
      const profile = await atpRankingsService.getPlayerProfile('S0AG');

      expect(profile).not.toBeNull();
      expect(typeof profile?.height).toBe('number');
      expect(typeof profile?.weight).toBe('number');
      expect(['right', 'left']).toContain(profile?.plays);
      expect(['one-handed', 'two-handed']).toContain(profile?.backhand);
    });
  });

  describe('getRankingMovement', () => {
    it('should return positive movement for rank improvement', () => {
      const movement = atpRankingsService.getRankingMovement(3, 5);
      expect(movement).toBe('+2');
    });

    it('should return negative movement for rank drop', () => {
      const movement = atpRankingsService.getRankingMovement(5, 3);
      expect(movement).toBe('-2');
    });

    it('should return 0 for no change', () => {
      const movement = atpRankingsService.getRankingMovement(3, 3);
      expect(movement).toBe('0');
    });
  });
});
