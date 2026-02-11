/**
 * F1 Business Logic Unit Tests
 *
 * Tests for pure F1 calculation functions.
 * No I/O, no mocking - just logic verification.
 */

import {
  getPointsForPosition,
  calculateMaxPoints,
  canStillWinChampionship,
  calculateClosenessScore,
} from '../../src/sports/racing/formula1/types';

describe('F1 Points System', () => {
  describe('getPointsForPosition', () => {
    it('returns correct race points for top 10', () => {
      expect(getPointsForPosition(1)).toBe(25);
      expect(getPointsForPosition(2)).toBe(18);
      expect(getPointsForPosition(3)).toBe(15);
      expect(getPointsForPosition(4)).toBe(12);
      expect(getPointsForPosition(5)).toBe(10);
      expect(getPointsForPosition(6)).toBe(8);
      expect(getPointsForPosition(7)).toBe(6);
      expect(getPointsForPosition(8)).toBe(4);
      expect(getPointsForPosition(9)).toBe(2);
      expect(getPointsForPosition(10)).toBe(1);
    });

    it('returns 0 for positions outside top 10', () => {
      expect(getPointsForPosition(11)).toBe(0);
      expect(getPointsForPosition(20)).toBe(0);
    });

    it('returns correct sprint points (reduced scale)', () => {
      expect(getPointsForPosition(1, true)).toBe(8);
      expect(getPointsForPosition(2, true)).toBe(7);
      expect(getPointsForPosition(3, true)).toBe(6);
      expect(getPointsForPosition(8, true)).toBe(1);
      expect(getPointsForPosition(9, true)).toBe(0);
    });
  });

  describe('calculateMaxPoints', () => {
    it('calculates max points for races only', () => {
      // 26 points max per race (25 win + 1 fastest lap)
      expect(calculateMaxPoints(1, 0)).toBe(26);
      expect(calculateMaxPoints(5, 0)).toBe(130);
    });

    it('includes sprint points when sprints remain', () => {
      // 26 per race + 8 per sprint
      expect(calculateMaxPoints(1, 1)).toBe(34);
    });

    it('calculates full season maximum', () => {
      // 24 races + 6 sprints = 24*26 + 6*8 = 624 + 48 = 672
      expect(calculateMaxPoints(24, 6)).toBe(672);
    });

    it('returns 0 when no races remain', () => {
      expect(calculateMaxPoints(0, 0)).toBe(0);
    });
  });

  describe('canStillWinChampionship', () => {
    it('returns true when gap is smaller than max points', () => {
      expect(canStillWinChampionship(100, 150, 100)).toBe(true);
    });

    it('returns true when exactly tied with max points', () => {
      expect(canStillWinChampionship(100, 200, 100)).toBe(true);
    });

    it('returns false when mathematically eliminated', () => {
      expect(canStillWinChampionship(100, 250, 100)).toBe(false);
    });

    it('returns true when leading', () => {
      expect(canStillWinChampionship(200, 100, 50)).toBe(true);
    });
  });

  describe('calculateClosenessScore', () => {
    it('returns high score for tied championship', () => {
      const score = calculateClosenessScore(0, 100, 2);
      expect(score).toBeGreaterThanOrEqual(100);
    });

    it('returns lower score for larger gaps', () => {
      const closeScore = calculateClosenessScore(10, 100, 2);
      const wideScore = calculateClosenessScore(50, 100, 2);
      expect(closeScore).toBeGreaterThan(wideScore);
    });

    it('gives bonus for more contenders', () => {
      const twoWay = calculateClosenessScore(20, 100, 2);
      const fourWay = calculateClosenessScore(20, 100, 4);
      expect(fourWay).toBeGreaterThan(twoWay);
    });

    it('returns 0 when no points available', () => {
      expect(calculateClosenessScore(10, 0, 2)).toBe(0);
    });

    it('clamps to 0-100 range', () => {
      const score = calculateClosenessScore(0, 1000, 10);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });
});
