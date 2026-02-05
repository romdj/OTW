/**
 * Cycling GraphQL Resolvers Tests
 *
 * Integration tests for cycling GraphQL resolvers.
 * Verifies correct GraphQL response shapes and enum mappings.
 */

import { cyclingResolvers } from '../../../../../src/sports/racing/cycling/pro-tour/resolvers/cyclingResolvers';

describe('cyclingResolvers', () => {
  describe('Query.cyclingRaces', () => {
    it('should return races with correct GraphQL shape', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, { year: 2025 });

      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBeGreaterThan(0);

      const race = races[0];
      expect(race.id).toBeDefined();
      expect(race.name).toBeDefined();
      expect(race.slug).toBeDefined();
      expect(typeof race.startDate).toBe('string'); // ISO string for GraphQL
      expect(typeof race.endDate).toBe('string');
    });

    it('should return category as GraphQL enum value', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, { year: 2025 });
      const validCategories = ['GRAND_TOUR', 'MONUMENT', 'WORLD_TOUR', 'PRO_SERIES'];

      for (const race of races) {
        expect(validCategories).toContain(race.category);
      }
    });

    it('should return gender as GraphQL enum value', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, { year: 2025 });
      const validGenders = ['MEN', 'WOMEN'];

      for (const race of races) {
        expect(validGenders).toContain(race.gender);
      }
    });

    it('should return status as GraphQL enum value', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, { year: 2025 });
      const validStatuses = ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

      for (const race of races) {
        expect(validStatuses).toContain(race.status);
      }
    });

    it('should filter by GraphQL category enum', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, {
        year: 2025,
        category: 'GRAND_TOUR',
      });

      expect(races.length).toBe(3);
      expect(races.every(r => r.category === 'GRAND_TOUR')).toBe(true);
    });

    it('should filter by GraphQL gender enum', async () => {
      const races = await cyclingResolvers.Query.cyclingRaces({}, {
        year: 2025,
        gender: 'WOMEN',
      });

      expect(races.length).toBeGreaterThan(0);
      expect(races.every(r => r.gender === 'WOMEN')).toBe(true);
    });
  });

  describe('Query.cyclingRace', () => {
    it('should return a single race by ID', async () => {
      const race = await cyclingResolvers.Query.cyclingRace({}, { id: 'TDF2025' });

      expect(race).not.toBeNull();
      expect(race?.id).toBe('TDF2025');
      expect(race?.name).toBe('Tour de France');
    });

    it('should return null for unknown ID', async () => {
      const race = await cyclingResolvers.Query.cyclingRace({}, { id: 'UNKNOWN2025' });
      expect(race).toBeNull();
    });
  });

  describe('Query.cyclingStages', () => {
    it('should return stages for a race', async () => {
      const stages = await cyclingResolvers.Query.cyclingStages({}, { raceId: 'TDF2025' });

      expect(Array.isArray(stages)).toBe(true);
      expect(stages.length).toBe(21);
    });

    it('should return stageType as GraphQL enum value', async () => {
      const stages = await cyclingResolvers.Query.cyclingStages({}, { raceId: 'TDF2025' });
      const validTypes = ['FLAT', 'HILLY', 'MOUNTAIN', 'ITT', 'TTT', 'PROLOGUE'];

      for (const stage of stages) {
        expect(validTypes).toContain(stage.stageType);
      }
    });

    it('should return status as GraphQL enum value', async () => {
      const stages = await cyclingResolvers.Query.cyclingStages({}, { raceId: 'TDF2025' });
      const validStatuses = ['UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED', 'REST_DAY'];

      for (const stage of stages) {
        expect(validStatuses).toContain(stage.status);
      }
    });

    it('should filter by GraphQL stageType enum', async () => {
      const stages = await cyclingResolvers.Query.cyclingStages({}, {
        raceId: 'TDF2025',
        stageType: 'MOUNTAIN',
      });

      expect(stages.length).toBeGreaterThan(0);
      expect(stages.every(s => s.stageType === 'MOUNTAIN')).toBe(true);
    });

    it('should include predictedExcitement', async () => {
      const stages = await cyclingResolvers.Query.cyclingStages({}, { raceId: 'TDF2025' });

      for (const stage of stages) {
        expect(stage.predictedExcitement).toBeDefined();
        expect(stage.predictedExcitement?.score).toBeDefined();
        expect(stage.predictedExcitement?.factors).toBeDefined();
      }
    });
  });

  describe('Query.cyclingStage', () => {
    it('should return a single stage by ID', async () => {
      const stage = await cyclingResolvers.Query.cyclingStage({}, { id: 'TDF2025-S1' });

      expect(stage).not.toBeNull();
      expect(stage?.id).toBe('TDF2025-S1');
      expect(stage?.stageNumber).toBe(1);
    });

    it('should return null for unknown ID', async () => {
      const stage = await cyclingResolvers.Query.cyclingStage({}, { id: 'UNKNOWN-S1' });
      expect(stage).toBeNull();
    });

    it('should return null for invalid ID format', async () => {
      const stage = await cyclingResolvers.Query.cyclingStage({}, { id: 'invalid-format' });
      expect(stage).toBeNull();
    });
  });

  describe('Query.grandTours', () => {
    it('should return only grand tours', async () => {
      const grandTours = await cyclingResolvers.Query.grandTours({}, { year: 2025 });

      expect(grandTours.length).toBe(3);
      expect(grandTours.every(r => r.category === 'GRAND_TOUR')).toBe(true);
    });

    it('should include Tour de France, Giro, and Vuelta', async () => {
      const grandTours = await cyclingResolvers.Query.grandTours({}, { year: 2025 });
      const names = grandTours.map(r => r.name);

      expect(names).toContain('Tour de France');
      expect(names.some(n => n.includes('Giro'))).toBe(true);
      expect(names.some(n => n.includes('Vuelta'))).toBe(true);
    });

    it('should filter by gender', async () => {
      const womenGT = await cyclingResolvers.Query.grandTours({}, {
        year: 2025,
        gender: 'WOMEN',
      });

      expect(womenGT.length).toBeGreaterThan(0);
      expect(womenGT.every(r => r.gender === 'WOMEN')).toBe(true);
    });
  });

  describe('Query.monuments', () => {
    it('should return only monuments', async () => {
      const monuments = await cyclingResolvers.Query.monuments({}, { year: 2025 });

      expect(monuments.length).toBe(5);
      expect(monuments.every(r => r.category === 'MONUMENT')).toBe(true);
    });

    it('should include all five classic monuments', async () => {
      const monuments = await cyclingResolvers.Query.monuments({}, { year: 2025 });
      const names = monuments.map(r => r.name);

      expect(names.some(n => n.includes('Sanremo'))).toBe(true);
      expect(names.some(n => n.includes('Vlaanderen') || n.includes('Flanders'))).toBe(true);
      expect(names.some(n => n.includes('Roubaix'))).toBe(true);
      expect(names.some(n => n.includes('Liege'))).toBe(true);
      expect(names.some(n => n.includes('Lombardia'))).toBe(true);
    });
  });

  describe('Query.upcomingCyclingStages', () => {
    it('should return stages sorted by date', async () => {
      const stages = await cyclingResolvers.Query.upcomingCyclingStages({}, {});

      for (let i = 1; i < stages.length; i++) {
        const prevDate = new Date(stages[i - 1].date).getTime();
        const currDate = new Date(stages[i].date).getTime();
        expect(currDate).toBeGreaterThanOrEqual(prevDate);
      }
    });

    it('should respect limit parameter', async () => {
      const stages = await cyclingResolvers.Query.upcomingCyclingStages({}, { limit: 5 });
      expect(stages.length).toBeLessThanOrEqual(5);
    });

    it('should filter by stageType', async () => {
      const stages = await cyclingResolvers.Query.upcomingCyclingStages({}, {
        stageType: 'MOUNTAIN',
      });

      if (stages.length > 0) {
        expect(stages.every(s => s.stageType === 'MOUNTAIN')).toBe(true);
      }
    });
  });

  describe('Query.mustWatchStages', () => {
    it('should return high excitement stages', async () => {
      const stages = await cyclingResolvers.Query.mustWatchStages({}, {});

      for (const stage of stages) {
        expect(stage.predictedExcitement?.score).toBeGreaterThanOrEqual(60);
      }
    });

    it('should return stages sorted by excitement score descending', async () => {
      const stages = await cyclingResolvers.Query.mustWatchStages({}, {});

      for (let i = 1; i < stages.length; i++) {
        expect(stages[i - 1].predictedExcitement?.score ?? 0)
          .toBeGreaterThanOrEqual(stages[i].predictedExcitement?.score ?? 0);
      }
    });

    it('should respect limit parameter', async () => {
      const stages = await cyclingResolvers.Query.mustWatchStages({}, { limit: 3 });
      expect(stages.length).toBeLessThanOrEqual(3);
    });
  });

  describe('CyclingRace.stages field resolver', () => {
    it('should load stages for a race', async () => {
      const stages = await cyclingResolvers.CyclingRace.stages({ id: 'TDF2025' });

      expect(Array.isArray(stages)).toBe(true);
      expect(stages.length).toBe(21);
    });

    it('should return existing stages if already loaded', async () => {
      const existingStages = [{ id: 'test-stage' }];
      const result = await cyclingResolvers.CyclingRace.stages({
        id: 'TDF2025',
        stages: existingStages,
      });

      expect(result).toEqual(existingStages);
    });
  });

  describe('CyclingStage.race field resolver', () => {
    it('should load parent race for a stage', async () => {
      const race = await cyclingResolvers.CyclingStage.race({ raceId: 'TDF2025' });

      expect(race).not.toBeNull();
      expect(race?.id).toBe('TDF2025');
      expect(race?.name).toBe('Tour de France');
    });
  });
});
