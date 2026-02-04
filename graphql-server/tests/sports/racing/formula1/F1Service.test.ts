/**
 * F1 Service Tests
 *
 * Tests for F1Service business logic including:
 * - Calendar and standings transformation
 * - Championship battle calculations
 * - Excitement scoring
 * - Caching behavior
 */

import { F1Service } from '../../../../src/sports/racing/formula1/services/F1Service';
import {
  calculateMaxPoints,
  canStillWinChampionship,
  calculateClosenessScore,
  getPointsForPosition,
} from '../../../../src/sports/racing/formula1/types';

describe('F1Service', () => {
  let service: F1Service;

  beforeEach(() => {
    service = new F1Service();
    service.clearCache();
  });

  describe('getCalendar', () => {
    it('should return calendar for 2025', async () => {
      const calendar = await service.getCalendar({ season: 2025 });
      expect(Array.isArray(calendar)).toBe(true);
      expect(calendar.length).toBe(24);
    });

    it('should transform races to GrandPrix format', async () => {
      const calendar = await service.getCalendar({ season: 2025 });
      const gp = calendar[0];

      expect(gp.id).toBeDefined();
      expect(gp.name).toBeDefined();
      expect(gp.slug).toBeDefined();
      expect(gp.round).toBeDefined();
      expect(gp.season).toBe(2025);
      expect(gp.circuit).toBeDefined();
      expect(gp.format).toBeDefined();
      expect(gp.startDate).toBeInstanceOf(Date);
      expect(gp.endDate).toBeInstanceOf(Date);
      expect(gp.status).toBeDefined();
      expect(gp.sessions).toBeDefined();
      expect(Array.isArray(gp.sessions)).toBe(true);
    });

    it('should filter by status', async () => {
      const upcoming = await service.getCalendar({ season: 2025, status: 'upcoming' });
      expect(upcoming.every(gp => gp.status === 'upcoming')).toBe(true);
    });

    it('should filter by format', async () => {
      const sprints = await service.getCalendar({ season: 2025, format: 'sprint' });
      expect(sprints.length).toBe(6);
      expect(sprints.every(gp => gp.format === 'sprint')).toBe(true);
    });

    it('should generate valid slugs', async () => {
      const calendar = await service.getCalendar({ season: 2025 });
      for (const gp of calendar) {
        expect(gp.slug).toMatch(/^[a-z0-9-]+$/);
      }
    });

    it('should calculate predicted excitement for each race', async () => {
      const calendar = await service.getCalendar({ season: 2025 });
      for (const gp of calendar) {
        expect(gp.predictedExcitement).toBeDefined();
        expect(gp.predictedExcitement?.score).toBeGreaterThanOrEqual(0);
        expect(gp.predictedExcitement?.score).toBeLessThanOrEqual(100);
        expect(gp.predictedExcitement?.factors).toBeDefined();
      }
    });
  });

  describe('getGrandPrix', () => {
    it('should return a single Grand Prix by ID', async () => {
      const gp = await service.getGrandPrix('2025_1');
      expect(gp).not.toBeNull();
      expect(gp?.round).toBe(1);
    });

    it('should return null for invalid ID format', async () => {
      const gp = await service.getGrandPrix('invalid');
      expect(gp).toBeNull();
    });

    it('should return null for unknown round', async () => {
      const gp = await service.getGrandPrix('2025_99');
      expect(gp).toBeNull();
    });
  });

  describe('getUpcomingSessions', () => {
    it('should return sessions sorted by date', async () => {
      const sessions = await service.getUpcomingSessions(20);

      for (let i = 1; i < sessions.length; i++) {
        const prevDate = new Date(sessions[i - 1].date).getTime();
        const currDate = new Date(sessions[i].date).getTime();
        expect(currDate).toBeGreaterThanOrEqual(prevDate);
      }
    });

    it('should respect limit parameter', async () => {
      const sessions = await service.getUpcomingSessions(5);
      expect(sessions.length).toBeLessThanOrEqual(5);
    });

    it('should include grandPrixName on each session', async () => {
      const sessions = await service.getUpcomingSessions(5);
      for (const session of sessions) {
        expect(session.grandPrixName).toBeDefined();
      }
    });
  });

  describe('getDriverStandings', () => {
    it('should return driver standings', async () => {
      const standings = await service.getDriverStandings({ season: 2025 });
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    it('should transform to DriverStanding format', async () => {
      const standings = await service.getDriverStandings({ season: 2025 });
      const standing = standings[0];

      expect(standing.position).toBe(1);
      expect(standing.driver).toBeDefined();
      expect(standing.driver.id).toBeDefined();
      expect(standing.driver.code).toBeDefined();
      expect(standing.driver.fullName).toBeDefined();
      expect(typeof standing.points).toBe('number');
      expect(typeof standing.pointsToLeader).toBe('number');
      expect(typeof standing.canWinTitle).toBe('boolean');
    });

    it('should have leader with pointsToLeader of 0', async () => {
      const standings = await service.getDriverStandings({ season: 2025 });
      expect(standings[0].pointsToLeader).toBe(0);
    });
  });

  describe('getConstructorStandings', () => {
    it('should return constructor standings', async () => {
      const standings = await service.getConstructorStandings({ season: 2025 });
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    it('should transform to ConstructorStanding format', async () => {
      const standings = await service.getConstructorStandings({ season: 2025 });
      const standing = standings[0];

      expect(standing.position).toBe(1);
      expect(standing.constructor).toBeDefined();
      expect(standing.constructor.id).toBeDefined();
      expect(standing.constructor.name).toBeDefined();
      expect(typeof standing.points).toBe('number');
      expect(typeof standing.canWinTitle).toBe('boolean');
    });
  });

  describe('getChampionshipBattle', () => {
    it('should return championship battle analysis', async () => {
      const battle = await service.getChampionshipBattle(2025);

      expect(battle.season).toBe(2025);
      expect(typeof battle.racesRemaining).toBe('number');
      expect(typeof battle.maxPointsAvailable).toBe('number');
      expect(typeof battle.isOpen).toBe('boolean');

      expect(battle.drivers).toBeDefined();
      expect(battle.drivers.leader).toBeDefined();
      expect(Array.isArray(battle.drivers.challengers)).toBe(true);
      expect(Array.isArray(battle.drivers.eliminated)).toBe(true);

      expect(battle.constructors).toBeDefined();
      expect(battle.constructors.leader).toBeDefined();

      expect(Array.isArray(battle.narratives)).toBe(true);
    });

    it('should have closeness scores between 0 and 100', async () => {
      const battle = await service.getChampionshipBattle(2025);

      expect(battle.drivers.closenessScore).toBeGreaterThanOrEqual(0);
      expect(battle.drivers.closenessScore).toBeLessThanOrEqual(100);

      expect(battle.constructors.closenessScore).toBeGreaterThanOrEqual(0);
      expect(battle.constructors.closenessScore).toBeLessThanOrEqual(100);
    });
  });

  describe('caching', () => {
    it('should cache calendar data', async () => {
      const stats1 = service.getCacheStats();
      expect(stats1.calendar).toBe(0);

      await service.getCalendar({ season: 2025 });

      const stats2 = service.getCacheStats();
      expect(stats2.calendar).toBe(1);
    });

    it('should cache standings data', async () => {
      await service.getDriverStandings({ season: 2025 });
      await service.getConstructorStandings({ season: 2025 });

      const stats = service.getCacheStats();
      expect(stats.driverStandings).toBe(1);
      expect(stats.constructorStandings).toBe(1);
    });

    it('should clear cache when requested', async () => {
      await service.getCalendar({ season: 2025 });
      await service.getDriverStandings({ season: 2025 });

      service.clearCache();

      const stats = service.getCacheStats();
      expect(stats.calendar).toBe(0);
      expect(stats.driverStandings).toBe(0);
    });
  });
});

describe('F1 Points Calculations', () => {
  describe('getPointsForPosition', () => {
    it('should return correct points for race positions', () => {
      expect(getPointsForPosition(1)).toBe(25);
      expect(getPointsForPosition(2)).toBe(18);
      expect(getPointsForPosition(3)).toBe(15);
      expect(getPointsForPosition(10)).toBe(1);
      expect(getPointsForPosition(11)).toBe(0);
    });

    it('should return correct points for sprint positions', () => {
      expect(getPointsForPosition(1, true)).toBe(8);
      expect(getPointsForPosition(2, true)).toBe(7);
      expect(getPointsForPosition(8, true)).toBe(1);
      expect(getPointsForPosition(9, true)).toBe(0);
    });
  });

  describe('calculateMaxPoints', () => {
    it('should calculate max points for races only', () => {
      // 26 points max per race (25 + fastest lap)
      expect(calculateMaxPoints(1, 0)).toBe(26);
      expect(calculateMaxPoints(5, 0)).toBe(130);
    });

    it('should include sprint points', () => {
      // 26 per race + 8 per sprint
      expect(calculateMaxPoints(1, 1)).toBe(34);
      expect(calculateMaxPoints(24, 6)).toBe(24 * 26 + 6 * 8); // Full season
    });
  });

  describe('canStillWinChampionship', () => {
    it('should return true when mathematically possible', () => {
      expect(canStillWinChampionship(100, 150, 100)).toBe(true);
      expect(canStillWinChampionship(100, 200, 100)).toBe(true); // Exactly tied
    });

    it('should return false when mathematically impossible', () => {
      expect(canStillWinChampionship(100, 250, 100)).toBe(false);
    });
  });

  describe('calculateClosenessScore', () => {
    it('should return 100 for tied championship', () => {
      const score = calculateClosenessScore(0, 100, 2);
      expect(score).toBeGreaterThanOrEqual(100);
    });

    it('should return lower score for larger gaps', () => {
      const closeScore = calculateClosenessScore(10, 100, 2);
      const wideScore = calculateClosenessScore(50, 100, 2);
      expect(closeScore).toBeGreaterThan(wideScore);
    });

    it('should give bonus for more contenders', () => {
      const twoWay = calculateClosenessScore(20, 100, 2);
      const fourWay = calculateClosenessScore(20, 100, 4);
      expect(fourWay).toBeGreaterThan(twoWay);
    });

    it('should return 0 when no points available', () => {
      expect(calculateClosenessScore(10, 0, 2)).toBe(0);
    });
  });
});
