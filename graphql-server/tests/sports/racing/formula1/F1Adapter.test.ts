/**
 * F1 Adapter Contract Tests
 *
 * Verifies that F1Adapter implements the F1DataAdapter interface correctly.
 */

import { F1Adapter } from '../../../../src/sports/racing/formula1/adapters/F1Adapter';
import type { F1RaceData, F1DriverStandingData, F1ConstructorStandingData } from '../../../../src/sports/racing/formula1/adapters/types';

describe('F1Adapter', () => {
  let adapter: F1Adapter;

  beforeEach(() => {
    adapter = new F1Adapter();
  });

  describe('interface compliance', () => {
    it('should implement F1DataAdapter interface', () => {
      expect(typeof adapter.fetchCalendar).toBe('function');
      expect(typeof adapter.fetchDriverStandings).toBe('function');
      expect(typeof adapter.fetchConstructorStandings).toBe('function');
      expect(typeof adapter.fetchCircuit).toBe('function');
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
    it('should return 24 races for 2025 season', async () => {
      const races = await adapter.fetchCalendar(2025);
      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBe(24);
    });

    it('should return empty array for unsupported seasons', async () => {
      const races = await adapter.fetchCalendar(2020);
      expect(Array.isArray(races)).toBe(true);
      expect(races.length).toBe(0);
    });

    describe('race data contract', () => {
      let races: F1RaceData[];

      beforeAll(async () => {
        races = await adapter.fetchCalendar(2025);
      });

      it('should have required fields on each race', () => {
        for (const race of races) {
          expect(race.season).toBe(2025);
          expect(typeof race.round).toBe('number');
          expect(race.round).toBeGreaterThan(0);

          expect(race.raceName).toBeDefined();
          expect(typeof race.raceName).toBe('string');

          expect(race.circuitId).toBeDefined();
          expect(race.circuitName).toBeDefined();
          expect(race.location).toBeDefined();
          expect(race.country).toBeDefined();
          expect(race.countryCode).toBeDefined();

          expect(race.date).toBeDefined();
          expect(race.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

          expect(race.format).toBeDefined();
          expect(['standard', 'sprint']).toContain(race.format);

          expect(race.sessions).toBeDefined();
          expect(Array.isArray(race.sessions)).toBe(true);
        }
      });

      it('should have rounds in sequential order', () => {
        for (let i = 0; i < races.length; i++) {
          expect(races[i].round).toBe(i + 1);
        }
      });

      it('should have 6 sprint weekends', () => {
        const sprintWeekends = races.filter(r => r.format === 'sprint');
        expect(sprintWeekends.length).toBe(6);
      });

      it('should have correct sessions for standard weekends', () => {
        const standardWeekend = races.find(r => r.format === 'standard');
        expect(standardWeekend).toBeDefined();

        const sessionTypes = standardWeekend!.sessions.map(s => s.type);
        expect(sessionTypes).toContain('FP1');
        expect(sessionTypes).toContain('FP2');
        expect(sessionTypes).toContain('FP3');
        expect(sessionTypes).toContain('qualifying');
        expect(sessionTypes).toContain('race');
      });

      it('should have correct sessions for sprint weekends', () => {
        const sprintWeekend = races.find(r => r.format === 'sprint');
        expect(sprintWeekend).toBeDefined();

        const sessionTypes = sprintWeekend!.sessions.map(s => s.type);
        expect(sessionTypes).toContain('FP1');
        expect(sessionTypes).toContain('sprint_shootout');
        expect(sessionTypes).toContain('sprint');
        expect(sessionTypes).toContain('qualifying');
        expect(sessionTypes).toContain('race');
      });

      it('should include key races', () => {
        const raceNames = races.map(r => r.raceName);
        expect(raceNames.some(n => n.includes('Monaco'))).toBe(true);
        expect(raceNames.some(n => n.includes('British'))).toBe(true);
        expect(raceNames.some(n => n.includes('Italian'))).toBe(true);
        expect(raceNames.some(n => n.includes('Abu Dhabi'))).toBe(true);
      });

      it('should have session dates matching or before race date', () => {
        for (const race of races) {
          const raceDate = new Date(race.date);
          for (const session of race.sessions) {
            const sessionDate = new Date(session.date);
            expect(sessionDate.getTime()).toBeLessThanOrEqual(raceDate.getTime());
          }
        }
      });
    });
  });

  describe('fetchDriverStandings', () => {
    it('should return driver standings for 2025', async () => {
      const standings = await adapter.fetchDriverStandings(2025);
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    it('should return empty for unsupported seasons', async () => {
      const standings = await adapter.fetchDriverStandings(2020);
      expect(standings.length).toBe(0);
    });

    describe('driver standing contract', () => {
      let standings: F1DriverStandingData[];

      beforeAll(async () => {
        standings = await adapter.fetchDriverStandings(2025);
      });

      it('should have required fields', () => {
        for (const standing of standings) {
          expect(typeof standing.position).toBe('number');
          expect(typeof standing.points).toBe('number');
          expect(typeof standing.wins).toBe('number');

          expect(standing.driver).toBeDefined();
          expect(standing.driver.driverId).toBeDefined();
          expect(standing.driver.permanentNumber).toBeDefined();
          expect(standing.driver.code).toBeDefined();
          expect(standing.driver.givenName).toBeDefined();
          expect(standing.driver.familyName).toBeDefined();

          expect(standing.constructors).toBeDefined();
          expect(standing.constructors.length).toBeGreaterThan(0);
        }
      });

      it('should have positions in order', () => {
        for (let i = 0; i < standings.length; i++) {
          expect(standings[i].position).toBe(i + 1);
        }
      });

      it('should have valid driver codes (3 letters)', () => {
        for (const standing of standings) {
          expect(standing.driver.code).toMatch(/^[A-Z]{3}$/);
        }
      });
    });
  });

  describe('fetchConstructorStandings', () => {
    it('should return constructor standings for 2025', async () => {
      const standings = await adapter.fetchConstructorStandings(2025);
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    describe('constructor standing contract', () => {
      let standings: F1ConstructorStandingData[];

      beforeAll(async () => {
        standings = await adapter.fetchConstructorStandings(2025);
      });

      it('should have required fields', () => {
        for (const standing of standings) {
          expect(typeof standing.position).toBe('number');
          expect(typeof standing.points).toBe('number');
          expect(typeof standing.wins).toBe('number');

          expect(standing.constructor).toBeDefined();
          expect(standing.constructor.constructorId).toBeDefined();
          expect(standing.constructor.name).toBeDefined();
          expect(standing.constructor.nationality).toBeDefined();
        }
      });
    });
  });

  describe('fetchCircuit', () => {
    it('should return circuit data for known circuits', async () => {
      const circuit = await adapter.fetchCircuit('monaco');
      expect(circuit).not.toBeNull();
      expect(circuit?.circuitId).toBe('monaco');
      expect(circuit?.circuitName).toContain('Monaco');
    });

    it('should return null for unknown circuits', async () => {
      const circuit = await adapter.fetchCircuit('unknown_circuit');
      expect(circuit).toBeNull();
    });

    it('should have lap record for iconic circuits', async () => {
      const monaco = await adapter.fetchCircuit('monaco');
      expect(monaco?.lapRecord).toBeDefined();
      expect(monaco?.lapRecord?.time).toBeDefined();
      expect(monaco?.lapRecord?.driver).toBeDefined();
    });
  });
});
