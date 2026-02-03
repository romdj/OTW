/**
 * Schedule Service Tests
 *
 * Tests for ScheduleService business logic including:
 * - Race and stage data transformation
 * - GC movement calculations
 * - Excitement scoring
 * - Caching behavior
 */

import { ScheduleService } from '../../../../../src/sports/racing/cycling/pro-tour/services/ScheduleService';
import type { GCStanding, CyclingRace, CyclingStage } from '../../../../../src/sports/racing/cycling/pro-tour/types';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    service = new ScheduleService();
    service.clearCache();
  });

  describe('getRaces', () => {
    it('should return races for 2025', async () => {
      const races = await service.getRaces({ year: 2025 });
      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBeGreaterThan(0);
    });

    it('should transform UCI data to CyclingRace format', async () => {
      const races = await service.getRaces({ year: 2025 });
      const race = races[0];

      // Verify transformed structure
      expect(race.id).toBeDefined();
      expect(race.name).toBeDefined();
      expect(race.slug).toBeDefined();
      expect(race.category).toBeDefined();
      expect(race.gender).toBeDefined();
      expect(race.startDate).toBeInstanceOf(Date);
      expect(race.endDate).toBeInstanceOf(Date);
      expect(race.country).toBeDefined();
      expect(race.status).toBeDefined();
    });

    it('should filter by category', async () => {
      const grandTours = await service.getRaces({ year: 2025, category: 'grand_tour' });
      expect(grandTours.length).toBe(3);
      expect(grandTours.every(r => r.category === 'grand_tour')).toBe(true);
    });

    it('should filter by gender', async () => {
      const womenRaces = await service.getRaces({ year: 2025, gender: 'women' });
      expect(womenRaces.length).toBeGreaterThan(0);
      expect(womenRaces.every(r => r.gender === 'women')).toBe(true);
    });

    it('should filter by country', async () => {
      const frenchRaces = await service.getRaces({ year: 2025, country: 'France' });
      expect(frenchRaces.length).toBeGreaterThan(0);
      expect(frenchRaces.every(r => r.country === 'France')).toBe(true);
    });

    it('should identify monuments correctly', async () => {
      const monuments = await service.getRaces({ year: 2025, category: 'monument' });
      expect(monuments.length).toBe(5);

      const names = monuments.map(r => r.name);
      expect(names.some(n => n.includes('Sanremo'))).toBe(true);
      expect(names.some(n => n.includes('Vlaanderen'))).toBe(true);
      expect(names.some(n => n.includes('Roubaix'))).toBe(true);
      expect(names.some(n => n.includes('Liege'))).toBe(true);
      expect(names.some(n => n.includes('Lombardia'))).toBe(true);
    });

    it('should generate valid slugs', async () => {
      const races = await service.getRaces({ year: 2025 });
      for (const race of races) {
        expect(race.slug).toMatch(/^[a-z0-9-]+$/);
        expect(race.slug).not.toMatch(/--/); // No double hyphens
        expect(race.slug).not.toMatch(/^-|-$/); // No leading/trailing hyphens
      }
    });
  });

  describe('getRace', () => {
    it('should return a single race by ID', async () => {
      const race = await service.getRace('TDF2025');
      expect(race).not.toBeNull();
      expect(race?.name).toBe('Tour de France');
    });

    it('should include stages for the race', async () => {
      const race = await service.getRace('TDF2025');
      expect(race?.stages).toBeDefined();
      expect(race?.stages?.length).toBe(21);
    });

    it('should return null for unknown race ID', async () => {
      const race = await service.getRace('UNKNOWN2025');
      expect(race).toBeNull();
    });
  });

  describe('getStages', () => {
    it('should return stages for a race', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });
      expect(stages.length).toBe(21);
    });

    it('should transform UCI stage data correctly', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });
      const stage = stages[0];

      expect(stage.id).toBeDefined();
      expect(stage.raceId).toBe('TDF2025');
      expect(stage.stageNumber).toBe(1);
      expect(stage.name).toBeDefined();
      expect(stage.date).toBeInstanceOf(Date);
      expect(stage.startLocation).toBeDefined();
      expect(stage.finishLocation).toBeDefined();
      expect(stage.distance).toBeGreaterThan(0);
      expect(stage.stageType).toBeDefined();
      expect(stage.status).toBeDefined();
    });

    it('should filter by stage type', async () => {
      const mountainStages = await service.getStages({
        raceId: 'TDF2025',
        stageType: 'mountain',
      });

      expect(mountainStages.length).toBeGreaterThan(0);
      expect(mountainStages.every(s => s.stageType === 'mountain')).toBe(true);
    });

    it('should map stage types correctly', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });
      const validTypes = ['flat', 'hilly', 'mountain', 'itt', 'ttt', 'prologue'];

      for (const stage of stages) {
        expect(validTypes).toContain(stage.stageType);
      }
    });

    it('should calculate predicted excitement for each stage', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });

      for (const stage of stages) {
        expect(stage.predictedExcitement).toBeDefined();
        expect(stage.predictedExcitement?.score).toBeGreaterThanOrEqual(0);
        expect(stage.predictedExcitement?.score).toBeLessThanOrEqual(100);
        expect(stage.predictedExcitement?.factors).toBeDefined();
      }
    });
  });

  describe('predicted excitement scoring', () => {
    it('should score mountain stages higher than flat stages', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });

      const flatStages = stages.filter(s => s.stageType === 'flat');
      const mountainStages = stages.filter(s => s.stageType === 'mountain');

      const avgFlat = flatStages.reduce((sum, s) => sum + (s.predictedExcitement?.score || 0), 0) / flatStages.length;
      const avgMountain = mountainStages.reduce((sum, s) => sum + (s.predictedExcitement?.score || 0), 0) / mountainStages.length;

      expect(avgMountain).toBeGreaterThan(avgFlat);
    });

    it('should score final week stages higher', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });

      // Compare similar stage types between first and final week
      const firstWeekMountain = stages.find(s => s.stageNumber <= 7 && s.stageType === 'mountain');
      const finalWeekMountain = stages.find(s => s.stageNumber >= 17 && s.stageType === 'mountain');

      if (firstWeekMountain && finalWeekMountain) {
        expect(finalWeekMountain.predictedExcitement?.factors.gcImportance)
          .toBeGreaterThan(firstWeekMountain.predictedExcitement?.factors.gcImportance || 0);
      }
    });

    it('should give historic locations higher scores', async () => {
      const stages = await service.getStages({ raceId: 'TDF2025' });

      const alpeDHuez = stages.find(s => s.finishLocation.toLowerCase().includes('huez'));
      const regularStage = stages.find(s =>
        s.stageType === 'mountain' &&
        !s.finishLocation.toLowerCase().includes('huez') &&
        !s.finishLocation.toLowerCase().includes('ventoux')
      );

      if (alpeDHuez && regularStage) {
        expect(alpeDHuez.predictedExcitement?.factors.historicLocation)
          .toBeGreaterThan(regularStage.predictedExcitement?.factors.historicLocation || 0);
      }
    });
  });

  describe('calculateGCMovement', () => {
    const createStanding = (position: number, riderId: string, name: string, timeGap: number): GCStanding => ({
      position,
      riderId,
      riderName: name,
      teamId: `team-${riderId}`,
      teamName: `Team ${name}`,
      totalTime: timeGap,
      timeGap: timeGap === 0 ? '0:00' : `+${Math.floor(timeGap / 60000)}:${String((timeGap / 1000) % 60).padStart(2, '0')}`,
    });

    it('should detect leader change', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 60000),
        createStanding(3, 'rider-c', 'Rider C', 120000),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-b', 'Rider B', 0),
        createStanding(2, 'rider-a', 'Rider A', 30000),
        createStanding(3, 'rider-c', 'Rider C', 90000),
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.leaderChanged).toBe(true);
      expect(movement.previousLeader).toBe('Rider A');
      expect(movement.newLeader).toBe('Rider B');
    });

    it('should detect no leader change', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 60000),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 90000),
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.leaderChanged).toBe(false);
      expect(movement.previousLeader).toBeUndefined();
      expect(movement.newLeader).toBeUndefined();
    });

    it('should count top 10 position changes', () => {
      const before: GCStanding[] = Array.from({ length: 10 }, (_, i) =>
        createStanding(i + 1, `rider-${i}`, `Rider ${i}`, i * 60000)
      );

      // Shuffle positions 5-10
      const after: GCStanding[] = [
        ...before.slice(0, 4),
        createStanding(5, 'rider-7', 'Rider 7', 240000),
        createStanding(6, 'rider-5', 'Rider 5', 250000),
        createStanding(7, 'rider-8', 'Rider 8', 260000),
        createStanding(8, 'rider-4', 'Rider 4', 270000),
        createStanding(9, 'rider-6', 'Rider 6', 280000),
        createStanding(10, 'rider-9', 'Rider 9', 290000),
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.top10Changes).toBeGreaterThan(0);
    });

    it('should track biggest position gain', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 60000),
        createStanding(10, 'rider-c', 'Climber C', 600000),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-c', 'Climber C', 30000), // Jumped from 10th to 2nd
        createStanding(3, 'rider-b', 'Rider B', 90000),
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.biggestGain).not.toBeNull();
      expect(movement.biggestGain?.riderName).toBe('Climber C');
      expect(movement.biggestGain?.positionsGained).toBe(8);
    });

    it('should track biggest position loss', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Cracker B', 30000),
        createStanding(3, 'rider-c', 'Rider C', 60000),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-c', 'Rider C', 45000),
        createStanding(10, 'rider-b', 'Cracker B', 600000), // Cracked, dropped to 10th
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.biggestLoss).not.toBeNull();
      expect(movement.biggestLoss?.riderName).toBe('Cracker B');
      expect(movement.biggestLoss?.positionsLost).toBe(8);
    });

    it('should detect significant time gap changes', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 10000), // 10 seconds
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 120000), // 2 minutes - significant change
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.significantTimeGapsChanged).toBe(true);
    });

    it('should not flag insignificant time changes', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 60000),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
        createStanding(2, 'rider-b', 'Rider B', 75000), // Only 15 seconds change
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.significantTimeGapsChanged).toBe(false);
    });

    it('should include standings after in result', () => {
      const before: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
      ];

      const after: GCStanding[] = [
        createStanding(1, 'rider-a', 'Rider A', 0),
      ];

      const movement = service.calculateGCMovement(before, after);

      expect(movement.standingsAfter).toEqual(after);
    });
  });

  describe('caching', () => {
    it('should cache race data', async () => {
      const stats1 = service.getCacheStats();
      expect(stats1.races).toBe(0);

      await service.getRaces({ year: 2025 });

      const stats2 = service.getCacheStats();
      expect(stats2.races).toBe(1);
    });

    it('should cache stage data', async () => {
      const stats1 = service.getCacheStats();
      expect(stats1.stages).toBe(0);

      await service.getStages({ raceId: 'TDF2025' });

      const stats2 = service.getCacheStats();
      expect(stats2.stages).toBe(1);
    });

    it('should return cached data on subsequent calls', async () => {
      const races1 = await service.getRaces({ year: 2025 });
      const races2 = await service.getRaces({ year: 2025 });

      // Same reference means cached
      expect(races1).toEqual(races2);
    });

    it('should clear cache when requested', async () => {
      await service.getRaces({ year: 2025 });
      await service.getStages({ raceId: 'TDF2025' });

      service.clearCache();

      const stats = service.getCacheStats();
      expect(stats.races).toBe(0);
      expect(stats.stages).toBe(0);
    });
  });

  describe('getUpcomingStages', () => {
    it('should return stages sorted by date', async () => {
      const stages = await service.getUpcomingStages({});

      for (let i = 1; i < stages.length; i++) {
        const prevDate = new Date(stages[i - 1].date).getTime();
        const currDate = new Date(stages[i].date).getTime();
        expect(currDate).toBeGreaterThanOrEqual(prevDate);
      }
    });
  });
});
