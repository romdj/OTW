/**
 * F1 GraphQL Resolvers Tests
 *
 * Integration tests for F1 GraphQL resolvers.
 */

import { f1Resolvers } from '../../../../src/sports/racing/formula1/resolvers/f1Resolvers';

describe('f1Resolvers', () => {
  describe('Query.f1Calendar', () => {
    it('should return calendar with correct GraphQL shape', async () => {
      const calendar = await f1Resolvers.Query.f1Calendar({}, { season: 2025 });

      expect(Array.isArray(calendar)).toBe(true);
      expect(calendar.length).toBe(24);

      const gp = calendar[0];
      expect(gp.id).toBeDefined();
      expect(gp.name).toBeDefined();
      expect(gp.slug).toBeDefined();
      expect(typeof gp.startDate).toBe('string'); // ISO string
      expect(typeof gp.endDate).toBe('string');
    });

    it('should return format as GraphQL enum value', async () => {
      const calendar = await f1Resolvers.Query.f1Calendar({}, { season: 2025 });
      const validFormats = ['STANDARD', 'SPRINT'];

      for (const gp of calendar) {
        expect(validFormats).toContain(gp.format);
      }
    });

    it('should return status as GraphQL enum value', async () => {
      const calendar = await f1Resolvers.Query.f1Calendar({}, { season: 2025 });
      const validStatuses = ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

      for (const gp of calendar) {
        expect(validStatuses).toContain(gp.status);
      }
    });

    it('should filter by GraphQL format enum', async () => {
      const sprints = await f1Resolvers.Query.f1Calendar({}, {
        season: 2025,
        format: 'SPRINT',
      });

      expect(sprints.length).toBe(6);
      expect(sprints.every(gp => gp.format === 'SPRINT')).toBe(true);
    });
  });

  describe('Query.f1GrandPrix', () => {
    it('should return a single Grand Prix by ID', async () => {
      const gp = await f1Resolvers.Query.f1GrandPrix({}, { id: '2025_8' });

      expect(gp).not.toBeNull();
      expect(gp?.round).toBe(8);
      expect(gp?.name).toContain('Monaco');
    });

    it('should return null for unknown ID', async () => {
      const gp = await f1Resolvers.Query.f1GrandPrix({}, { id: '2025_99' });
      expect(gp).toBeNull();
    });
  });

  describe('Query.f1UpcomingSessions', () => {
    it('should return sessions with correct shape', async () => {
      const sessions = await f1Resolvers.Query.f1UpcomingSessions({}, { limit: 5 });

      expect(Array.isArray(sessions)).toBe(true);

      if (sessions.length > 0) {
        const session = sessions[0];
        expect(session.id).toBeDefined();
        expect(session.type).toBeDefined();
        expect(session.name).toBeDefined();
        expect(session.grandPrixName).toBeDefined();
      }
    });

    it('should return session type as GraphQL enum', async () => {
      const sessions = await f1Resolvers.Query.f1UpcomingSessions({}, { limit: 10 });
      const validTypes = ['FP1', 'FP2', 'FP3', 'QUALIFYING', 'SPRINT_SHOOTOUT', 'SPRINT', 'RACE'];

      for (const session of sessions) {
        expect(validTypes).toContain(session.type);
      }
    });

    it('should respect limit parameter', async () => {
      const sessions = await f1Resolvers.Query.f1UpcomingSessions({}, { limit: 3 });
      expect(sessions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Query.f1NextRace', () => {
    it('should return next upcoming race', async () => {
      const nextRace = await f1Resolvers.Query.f1NextRace({}, {});

      if (nextRace) {
        expect(nextRace.status).toBe('UPCOMING');
        expect(nextRace.id).toBeDefined();
        expect(nextRace.name).toBeDefined();
      }
    });
  });

  describe('Query.f1DriverStandings', () => {
    it('should return driver standings', async () => {
      const standings = await f1Resolvers.Query.f1DriverStandings({}, { season: 2025 });

      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);

      const standing = standings[0];
      expect(standing.position).toBe(1);
      expect(standing.driver).toBeDefined();
      expect(standing.driver.id).toBeDefined();
      expect(standing.driver.code).toBeDefined();
      expect(standing.driver.fullName).toBeDefined();
    });
  });

  describe('Query.f1ConstructorStandings', () => {
    it('should return constructor standings', async () => {
      const standings = await f1Resolvers.Query.f1ConstructorStandings({}, { season: 2025 });

      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);

      const standing = standings[0];
      expect(standing.position).toBe(1);
      expect(standing.constructor).toBeDefined();
      expect(standing.constructor.id).toBeDefined();
      expect(standing.constructor.name).toBeDefined();
    });
  });

  describe('Query.f1ChampionshipBattle', () => {
    it('should return championship battle analysis', async () => {
      const battle = await f1Resolvers.Query.f1ChampionshipBattle({}, { season: 2025 });

      expect(battle.season).toBe(2025);
      expect(typeof battle.racesRemaining).toBe('number');
      expect(typeof battle.maxPointsAvailable).toBe('number');
      expect(typeof battle.isOpen).toBe('boolean');

      expect(battle.drivers).toBeDefined();
      expect(battle.drivers.leader).toBeDefined();
      expect(battle.drivers.leader.driver).toBeDefined();

      expect(battle.constructors).toBeDefined();
      expect(battle.constructors.leader).toBeDefined();

      expect(Array.isArray(battle.narratives)).toBe(true);
    });
  });

  describe('Query.f1SprintWeekends', () => {
    it('should return only sprint weekends', async () => {
      const sprints = await f1Resolvers.Query.f1SprintWeekends({}, { season: 2025 });

      expect(sprints.length).toBe(6);
      expect(sprints.every(gp => gp.format === 'SPRINT')).toBe(true);
    });
  });

  describe('Query.f1MustWatchRaces', () => {
    it('should return races sorted by excitement score', async () => {
      const races = await f1Resolvers.Query.f1MustWatchRaces({}, {});

      for (let i = 1; i < races.length; i++) {
        const prevScore = races[i - 1].predictedExcitement?.score ?? 0;
        const currScore = races[i].predictedExcitement?.score ?? 0;
        expect(prevScore).toBeGreaterThanOrEqual(currScore);
      }
    });

    it('should respect limit parameter', async () => {
      const races = await f1Resolvers.Query.f1MustWatchRaces({}, { limit: 3 });
      expect(races.length).toBeLessThanOrEqual(3);
    });

    it('should include excitement prediction', async () => {
      const races = await f1Resolvers.Query.f1MustWatchRaces({}, { limit: 5 });

      for (const race of races) {
        expect(race.predictedExcitement).toBeDefined();
        expect(race.predictedExcitement.score).toBeDefined();
        expect(race.predictedExcitement.factors).toBeDefined();
      }
    });
  });

  describe('F1GrandPrix.sessions field resolver', () => {
    it('should return sessions array', () => {
      const result = f1Resolvers.F1GrandPrix.sessions({ sessions: [{ id: 'test' }] });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('should return empty array if no sessions', () => {
      const result = f1Resolvers.F1GrandPrix.sessions({});
      expect(result).toEqual([]);
    });
  });
});
