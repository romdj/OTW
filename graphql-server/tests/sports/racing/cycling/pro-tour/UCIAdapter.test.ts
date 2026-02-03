/**
 * UCI Adapter Contract Tests
 *
 * Verifies that UCIAdapter implements the CyclingDataAdapter interface correctly
 * and returns data in the expected format.
 */

import { UCIAdapter } from '../../../../../src/sports/racing/cycling/pro-tour/adapters/UCIAdapter';
import type { CyclingDataAdapter, UCIRaceData, UCIStageData } from '../../../../../src/sports/racing/cycling/pro-tour/adapters/types';

describe('UCIAdapter', () => {
  let adapter: UCIAdapter;

  beforeEach(() => {
    adapter = new UCIAdapter();
  });

  describe('interface compliance', () => {
    it('should implement CyclingDataAdapter interface', () => {
      // Verify all required methods exist
      expect(typeof adapter.fetchCalendar).toBe('function');
      expect(typeof adapter.fetchStages).toBe('function');
      expect(typeof adapter.fetchGCStandings).toBe('function');
      expect(typeof adapter.getSource).toBe('function');
    });
  });

  describe('getSource', () => {
    it('should return a non-empty source identifier', () => {
      const source = adapter.getSource();
      expect(typeof source).toBe('string');
      expect(source.length).toBeGreaterThan(0);
    });
  });

  describe('fetchCalendar', () => {
    it('should return an array of races for 2025', async () => {
      const races = await adapter.fetchCalendar(2025);
      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBeGreaterThan(0);
    });

    it('should return empty array for unsupported years', async () => {
      const races = await adapter.fetchCalendar(2020);
      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBe(0);
    });

    describe('race data contract', () => {
      let races: UCIRaceData[];

      beforeAll(async () => {
        races = await adapter.fetchCalendar(2025);
      });

      it('should have required fields on each race', () => {
        for (const race of races) {
          expect(race.uciCode).toBeDefined();
          expect(typeof race.uciCode).toBe('string');

          expect(race.name).toBeDefined();
          expect(typeof race.name).toBe('string');

          expect(race.category).toBeDefined();
          expect(typeof race.category).toBe('string');

          expect(race.class).toBeDefined();
          expect(['ME', 'WE']).toContain(race.class);

          expect(race.country).toBeDefined();
          expect(typeof race.country).toBe('string');

          expect(race.countryCode).toBeDefined();
          expect(typeof race.countryCode).toBe('string');

          expect(race.startDate).toBeDefined();
          expect(race.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);

          expect(race.endDate).toBeDefined();
          expect(race.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should have valid UCI category codes', () => {
        const validCategories = ['2.GT', '2.UWT', '1.UWT', '2.WWT', '1.WWT', '2.Pro', '1.Pro'];
        for (const race of races) {
          expect(validCategories).toContain(race.category);
        }
      });

      it('should include all three grand tours', () => {
        const grandTours = races.filter(r => r.category === '2.GT');
        expect(grandTours.length).toBe(3);

        const names = grandTours.map(r => r.name);
        expect(names).toContain('Tour de France');
        expect(names).toContain("Giro d'Italia");
        expect(names).toContain('Vuelta a Espana');
      });

      it('should include all five monuments', () => {
        const monuments = races.filter(r =>
          r.name.includes('Sanremo') ||
          r.name.includes('Vlaanderen') ||
          r.name.includes('Roubaix') ||
          r.name.includes('Liege') ||
          r.name.includes('Lombardia')
        );
        expect(monuments.length).toBeGreaterThanOrEqual(5);
      });

      it('should have stage count for multi-stage races', () => {
        const stageRaces = races.filter(r => r.category.startsWith('2.'));
        for (const race of stageRaces) {
          expect(race.stages).toBeDefined();
          expect(typeof race.stages).toBe('number');
          expect(race.stages).toBeGreaterThan(1);
        }
      });

      it('should have distance for one-day races', () => {
        const oneDayRaces = races.filter(r => r.category.startsWith('1.'));
        for (const race of oneDayRaces) {
          expect(race.distance).toBeDefined();
          expect(typeof race.distance).toBe('number');
          expect(race.distance).toBeGreaterThan(100);
        }
      });

      it('should include both men and women races', () => {
        const menRaces = races.filter(r => r.class === 'ME');
        const womenRaces = races.filter(r => r.class === 'WE');

        expect(menRaces.length).toBeGreaterThan(0);
        expect(womenRaces.length).toBeGreaterThan(0);
      });
    });
  });

  describe('fetchStages', () => {
    it('should return stages for Tour de France 2025', async () => {
      const stages = await adapter.fetchStages('TDF2025');
      expect(Array.isArray(stages)).toBe(true);
      expect(stages.length).toBe(21);
    });

    it('should return empty array for unknown race', async () => {
      const stages = await adapter.fetchStages('UNKNOWN2025');
      expect(Array.isArray(stages)).toBe(true);
      expect(stages.length).toBe(0);
    });

    describe('stage data contract', () => {
      let stages: UCIStageData[];

      beforeAll(async () => {
        stages = await adapter.fetchStages('TDF2025');
      });

      it('should have required fields on each stage', () => {
        for (const stage of stages) {
          expect(stage.raceCode).toBe('TDF2025');

          expect(stage.stageNumber).toBeDefined();
          expect(typeof stage.stageNumber).toBe('number');
          expect(stage.stageNumber).toBeGreaterThan(0);

          expect(stage.date).toBeDefined();
          expect(stage.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

          expect(stage.startCity).toBeDefined();
          expect(typeof stage.startCity).toBe('string');

          expect(stage.finishCity).toBeDefined();
          expect(typeof stage.finishCity).toBe('string');

          expect(stage.distance).toBeDefined();
          expect(typeof stage.distance).toBe('number');
          expect(stage.distance).toBeGreaterThan(0);

          expect(stage.type).toBeDefined();
          expect(typeof stage.type).toBe('string');
        }
      });

      it('should have valid stage types', () => {
        const validTypes = ['Flat', 'Hilly', 'Medium mountain', 'High mountain', 'ITT', 'TTT', 'Prologue'];
        for (const stage of stages) {
          expect(validTypes).toContain(stage.type);
        }
      });

      it('should have stages in chronological order', () => {
        for (let i = 1; i < stages.length; i++) {
          expect(stages[i].stageNumber).toBe(stages[i - 1].stageNumber + 1);
        }
      });

      it('should have mountain stages with finish altitude', () => {
        const mountainStages = stages.filter(s => s.type === 'High mountain');
        expect(mountainStages.length).toBeGreaterThan(0);

        // At least some should have finish altitude
        const withAltitude = mountainStages.filter(s => s.finishAltitude !== undefined);
        expect(withAltitude.length).toBeGreaterThan(0);

        for (const stage of withAltitude) {
          expect(stage.finishAltitude).toBeGreaterThan(1000);
        }
      });

      it('should have ITT stages', () => {
        const ittStages = stages.filter(s => s.type === 'ITT');
        expect(ittStages.length).toBeGreaterThanOrEqual(1);

        // ITT stages should be shorter
        for (const stage of ittStages) {
          expect(stage.distance).toBeLessThan(60);
        }
      });

      it('should have start times for stages', () => {
        const withStartTime = stages.filter(s => s.startTime !== undefined);
        expect(withStartTime.length).toBeGreaterThan(0);

        for (const stage of withStartTime) {
          expect(stage.startTime).toMatch(/^\d{2}:\d{2}$/);
        }
      });
    });
  });

  describe('fetchGCStandings', () => {
    it('should return an array (placeholder implementation)', async () => {
      const standings = await adapter.fetchGCStandings('TDF2025');
      expect(Array.isArray(standings)).toBe(true);
    });
  });
});
