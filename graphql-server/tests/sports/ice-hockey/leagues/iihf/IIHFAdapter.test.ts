/**
 * IIHF Adapter Contract Tests
 *
 * Verifies that IIHFSportAdapter implements the SportsService interface correctly.
 * Covers World Championship, World Juniors, and Olympics.
 */

import { IIHFSportAdapter } from '../../../../../src/sports/ice-hockey/leagues/iihf/IIHFSportAdapter';
import { IIHF_TOP_NATIONS, IIHF_NATION_CODES, IIHF_EVENTS } from '../../../../../src/sports/ice-hockey/leagues/iihf/constants';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('IIHFSportAdapter', () => {
  let adapter: IIHFSportAdapter;

  beforeEach(() => {
    adapter = new IIHFSportAdapter();
  });

  describe('interface compliance', () => {
    it('should implement SportsService interface', () => {
      expect(typeof adapter.getStandings).toBe('function');
      expect(typeof adapter.getTeamDetails).toBe('function');
      expect(typeof adapter.getTeamStats).toBe('function');
      expect(typeof adapter.isValidTeam).toBe('function');
      expect(typeof adapter.getLeagueInfo).toBe('function');
    });

    it('should have IIHF-specific methods', () => {
      expect(typeof adapter.getTournaments).toBe('function');
      expect(typeof adapter.getWorldJuniors).toBe('function');
      expect(typeof adapter.getWorldChampionship).toBe('function');
      expect(typeof adapter.getOlympics).toBe('function');
      expect(typeof adapter.getMedalGames).toBe('function');
      expect(typeof adapter.setActiveTournament).toBe('function');
    });
  });

  describe('getLeagueInfo', () => {
    it('should return IIHF metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe('International Ice Hockey Federation');
      expect(info.sport).toBe('Ice Hockey');
      expect(info.country).toBe('International');
      expect(info.founded).toBe(1908);
      expect(info.teams).toBeGreaterThan(0);
    });
  });

  describe('isValidTeam (nation validation)', () => {
    it('should return true for top tier nations', () => {
      expect(adapter.isValidTeam('CAN')).toBe(true);
      expect(adapter.isValidTeam('USA')).toBe(true);
      expect(adapter.isValidTeam('SWE')).toBe(true);
      expect(adapter.isValidTeam('FIN')).toBe(true);
      expect(adapter.isValidTeam('CZE')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(adapter.isValidTeam('can')).toBe(true);
      expect(adapter.isValidTeam('CAN')).toBe(true);
      expect(adapter.isValidTeam('Can')).toBe(true);
    });

    it('should return false for invalid nation codes', () => {
      expect(adapter.isValidTeam('XXX')).toBe(false);
      expect(adapter.isValidTeam('INVALID')).toBe(false);
      expect(adapter.isValidTeam('')).toBe(false);
    });
  });

  describe('getStandings', () => {
    beforeAll(() => {
      adapter.setActiveTournament('wjc-2025');
    });

    let standings: TeamStanding[];

    beforeAll(async () => {
      standings = await adapter.getStandings();
    });

    it('should return standings array', () => {
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    describe('TeamStanding contract', () => {
      it('should have all required fields', () => {
        for (const standing of standings) {
          expect(typeof standing.teamName).toBe('string');
          expect(standing.teamName.length).toBeGreaterThan(0);

          expect(typeof standing.teamAbbrev).toBe('string');
          expect(standing.teamAbbrev).toMatch(/^[A-Z]{3}$/);

          expect(typeof standing.teamLogo).toBe('string');

          expect(typeof standing.gamesPlayed).toBe('number');
          expect(standing.gamesPlayed).toBeGreaterThanOrEqual(0);

          expect(typeof standing.wins).toBe('number');
          expect(standing.wins).toBeGreaterThanOrEqual(0);

          expect(typeof standing.losses).toBe('number');
          expect(standing.losses).toBeGreaterThanOrEqual(0);

          expect(typeof standing.points).toBe('number');
          expect(standing.points).toBeGreaterThanOrEqual(0);

          expect(standing.sport).toBe('Ice Hockey');

          expect(typeof standing.date).toBe('string');
          expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should have group assignments', () => {
        for (const standing of standings) {
          expect(standing.division).toBeDefined();
          expect(['A', 'B']).toContain(standing.division);
        }
      });
    });
  });

  describe('getTeamDetails', () => {
    beforeAll(() => {
      adapter.setActiveTournament('wjc-2025');
    });

    it('should return nation details for participating team', async () => {
      const details = await adapter.getTeamDetails('CAN');

      expect(details.id).toBe('CAN');
      expect(details.name).toBe('Canada');
      expect(typeof details.flag).toBe('string');
      expect(details.league).toBe('IIHF');
      expect(details.sport).toBe('Ice Hockey');
    });

    it('should return error for non-participating nation', async () => {
      const details = await adapter.getTeamDetails('XXX');

      expect(details.error).toBe('Nation not found in tournament');
      expect(details.league).toBe('IIHF');
    });
  });

  describe('getTeamStats', () => {
    beforeAll(() => {
      adapter.setActiveTournament('wjc-2025');
    });

    it('should return tournament stats for nation', async () => {
      const stats = await adapter.getTeamStats('USA');

      expect(stats).not.toBeNull();
      expect(stats?.nationCode).toBe('USA');
      expect(typeof stats?.gamesPlayed).toBe('number');
      expect(typeof stats?.wins).toBe('number');
      expect(typeof stats?.otWins).toBe('number');
      expect(typeof stats?.otLosses).toBe('number');
      expect(typeof stats?.losses).toBe('number');
      expect(typeof stats?.points).toBe('number');
      expect(typeof stats?.goalsFor).toBe('number');
      expect(typeof stats?.goalsAgainst).toBe('number');
      expect(typeof stats?.goalDifferential).toBe('number');
      expect(typeof stats?.rank).toBe('number');
    });

    it('should return null for non-participating nation', async () => {
      const stats = await adapter.getTeamStats('XXX');
      expect(stats).toBeNull();
    });
  });

  describe('getTournaments', () => {
    it('should return all tournaments', async () => {
      const tournaments = await adapter.getTournaments();

      expect(Array.isArray(tournaments)).toBe(true);
      expect(tournaments.length).toBeGreaterThan(0);
    });

    it('should filter by type', async () => {
      const wjcTournaments = await adapter.getTournaments('world_juniors');

      expect(wjcTournaments.every(t => t.type === 'world_juniors')).toBe(true);
    });

    it('should have required fields on tournaments', async () => {
      const tournaments = await adapter.getTournaments();

      for (const tournament of tournaments) {
        expect(typeof tournament.id).toBe('string');
        expect(typeof tournament.name).toBe('string');
        expect(['world_championship', 'world_juniors', 'olympics', 'u18']).toContain(tournament.type);
        expect(typeof tournament.year).toBe('number');
        expect(typeof tournament.hostCountry).toBe('string');
        expect(typeof tournament.hostCity).toBe('string');
        expect(tournament.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tournament.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(['upcoming', 'in_progress', 'completed']).toContain(tournament.status);
      }
    });
  });

  describe('getWorldJuniors', () => {
    it('should return World Junior Championships', async () => {
      const tournaments = await adapter.getWorldJuniors();

      expect(Array.isArray(tournaments)).toBe(true);
      for (const t of tournaments as any[]) {
        expect(t.type).toBe('world_juniors');
      }
    });

    it('should filter by year', async () => {
      const tournament = await adapter.getWorldJuniors(2025);

      expect(tournament).toBeDefined();
      expect((tournament as any).year).toBe(2025);
    });
  });

  describe('getWorldChampionship', () => {
    it('should return World Championships', async () => {
      const tournaments = await adapter.getWorldChampionship();

      expect(Array.isArray(tournaments)).toBe(true);
      for (const t of tournaments as any[]) {
        expect(t.type).toBe('world_championship');
      }
    });
  });

  describe('getOlympics', () => {
    it('should return Olympic tournaments', async () => {
      const tournaments = await adapter.getOlympics();

      expect(Array.isArray(tournaments)).toBe(true);
      for (const t of tournaments as any[]) {
        expect(t.type).toBe('olympics');
      }
    });
  });

  describe('getMedalGames', () => {
    it('should return medal game results', async () => {
      const medals = await adapter.getMedalGames('wjc-2025');

      expect(medals).toBeDefined();
      expect(medals.gold).not.toBeNull();
      expect(medals.bronze).not.toBeNull();

      if (medals.gold) {
        expect(medals.gold.phase).toBe('gold_medal');
      }
      if (medals.bronze) {
        expect(medals.bronze.phase).toBe('bronze_medal');
      }
    });
  });

  describe('IIHF constants', () => {
    it('should have top nations defined', () => {
      expect(IIHF_TOP_NATIONS.length).toBeGreaterThan(10);
    });

    it('should have tier 1 hockey nations', () => {
      const tier1 = IIHF_TOP_NATIONS.filter(n => n.tier === 1);
      const tier1Codes = tier1.map(n => n.code);

      expect(tier1Codes).toContain('CAN');
      expect(tier1Codes).toContain('USA');
      expect(tier1Codes).toContain('SWE');
      expect(tier1Codes).toContain('FIN');
      expect(tier1Codes).toContain('RUS');
      expect(tier1Codes).toContain('CZE');
    });

    it('should have correct event definitions', () => {
      expect(IIHF_EVENTS.WORLD_CHAMPIONSHIP.teams).toBe(16);
      expect(IIHF_EVENTS.WORLD_JUNIORS.teams).toBe(10);
      expect(IIHF_EVENTS.OLYMPICS.teams).toBe(12);
    });
  });
});
