/**
 * Cycling Business Logic Unit Tests
 *
 * Tests for cycling excitement scoring and GC movement detection.
 * No I/O, no mocking - just logic verification.
 */

import {
  calculateExcitementScore,
  isExcitingGCMovement,
  type GCMovement,
} from '../../src/sports/racing/cycling/pro-tour/types';
import { mapUCIStageType } from '../../src/sports/racing/cycling/pro-tour/adapters/types';

describe('Cycling Excitement Scoring', () => {
  describe('calculateExcitementScore', () => {
    it('returns 0 for empty factors', () => {
      expect(calculateExcitementScore({})).toBe(0);
    });

    it('terrain factor affects score', () => {
      const mountain = calculateExcitementScore({ terrain: 100 });
      const flat = calculateExcitementScore({ terrain: 20 });
      expect(mountain).toBeGreaterThan(flat);
    });

    it('race position (final week) affects score', () => {
      const finalWeek = calculateExcitementScore({ racePosition: 100 });
      const early = calculateExcitementScore({ racePosition: 20 });
      expect(finalWeek).toBeGreaterThan(early);
    });

    it('heritage factor affects score', () => {
      const historic = calculateExcitementScore({ heritage: 80 });
      const normal = calculateExcitementScore({ heritage: 20 });
      expect(historic).toBeGreaterThan(normal);
    });

    it('normalizes single factors to full value', () => {
      // Single factor normalizes: score / weight = 100
      const single = calculateExcitementScore({ terrain: 100 });
      expect(single).toBe(100);
    });

    it('weights gcMovement higher than terrain', () => {
      // gcMovement weight: 0.35, terrain weight: 0.15
      // With both at 50, gcMovement contributes more to final score
      const gcHigh = calculateExcitementScore({ gcMovement: 100, terrain: 0 });
      const terrainHigh = calculateExcitementScore({ gcMovement: 0, terrain: 100 });
      expect(gcHigh).toBeGreaterThan(terrainHigh);
    });
  });

  describe('isExcitingGCMovement', () => {
    const baseMovement: GCMovement = {
      leaderChanged: false,
      top10Changes: 0,
      top20Changes: 0,
      biggestGain: null,
      biggestLoss: null,
      significantTimeGapsChanged: false,
      timeChanges: [],
      standingsAfter: [],
    };

    it('detects leader change as exciting', () => {
      expect(isExcitingGCMovement({
        ...baseMovement,
        leaderChanged: true,
      })).toBe(true);
    });

    it('detects significant time gaps as exciting', () => {
      expect(isExcitingGCMovement({
        ...baseMovement,
        significantTimeGapsChanged: true,
      })).toBe(true);
    });

    it('detects many top 10 changes as exciting', () => {
      expect(isExcitingGCMovement({
        ...baseMovement,
        top10Changes: 5,
      })).toBe(true);
    });

    it('detects big position gains as exciting', () => {
      expect(isExcitingGCMovement({
        ...baseMovement,
        biggestGain: {
          riderName: 'Pogacar',
          positionsBefore: 15,
          positionsAfter: 5,
          positionsGained: 10,
        },
      })).toBe(true);
    });

    it('returns false for stable GC', () => {
      expect(isExcitingGCMovement(baseMovement)).toBe(false);
    });

    it('returns false for small position gains', () => {
      expect(isExcitingGCMovement({
        ...baseMovement,
        biggestGain: {
          riderName: 'Rider',
          positionsBefore: 5,
          positionsAfter: 4,
          positionsGained: 1,
        },
      })).toBe(false);
    });
  });
});

describe('UCI Stage Type Mapping', () => {
  describe('mapUCIStageType', () => {
    it('maps Flat stages', () => {
      expect(mapUCIStageType('Flat')).toBe('flat');
    });

    it('maps Mountain stages', () => {
      expect(mapUCIStageType('Mountain')).toBe('mountain');
      expect(mapUCIStageType('High mountain')).toBe('mountain');
    });

    it('maps Hilly stages', () => {
      expect(mapUCIStageType('Hilly')).toBe('hilly');
      expect(mapUCIStageType('Medium mountain')).toBe('hilly');
    });

    it('maps time trials', () => {
      expect(mapUCIStageType('ITT')).toBe('itt');
      expect(mapUCIStageType('Individual time trial')).toBe('itt');
      expect(mapUCIStageType('TTT')).toBe('ttt');
      expect(mapUCIStageType('Team time trial')).toBe('ttt');
    });

    it('maps prologue', () => {
      expect(mapUCIStageType('Prologue')).toBe('prologue');
    });

    it('defaults unknown types to flat', () => {
      expect(mapUCIStageType('unknown')).toBe('flat');
      expect(mapUCIStageType('')).toBe('flat');
    });
  });
});
