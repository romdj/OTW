/**
 * ITF Adapter Contract Tests
 *
 * Verifies that ITFSportAdapter implements the SportsService interface correctly.
 * Covers Davis Cup, Billie Jean King Cup, and Olympic Tennis.
 */

import { ITFSportAdapter } from '../../../../../src/sports/tennis/leagues/itf/ITFSportAdapter';
import { ITF_TOP_NATIONS, ITF_EVENTS, DAVIS_CUP_PHASES, OLYMPIC_DRAWS } from '../../../../../src/sports/tennis/leagues/itf/constants';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('ITFSportAdapter', () => {
  let adapter: ITFSportAdapter;

  beforeEach(() => {
    adapter = new ITFSportAdapter();
  });

  describe('interface compliance', () => {
    it('should implement SportsService interface', () => {
      expect(typeof adapter.getStandings).toBe('function');
      expect(typeof adapter.getTeamDetails).toBe('function');
      expect(typeof adapter.getTeamStats).toBe('function');
      expect(typeof adapter.isValidTeam).toBe('function');
      expect(typeof adapter.getLeagueInfo).toBe('function');
    });

    it('should have ITF-specific methods', () => {
      expect(typeof adapter.getEvents).toBe('function');
      expect(typeof adapter.getDavisCup).toBe('function');
      expect(typeof adapter.getDavisCupTies).toBe('function');
      expect(typeof adapter.getDavisCupFinal).toBe('function');
      expect(typeof adapter.getBJKCup).toBe('function');
      expect(typeof adapter.getOlympics).toBe('function');
      expect(typeof adapter.getOlympicMedalMatches).toBe('function');
      expect(typeof adapter.setActiveEvent).toBe('function');
    });
  });

  describe('getLeagueInfo', () => {
    it('should return ITF metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe('International Tennis Federation');
      expect(info.sport).toBe('Tennis');
      expect(info.country).toBe('International');
      expect(info.founded).toBe(1913);
      expect(info.teams).toBeGreaterThan(0);
    });
  });

  describe('isValidTeam (nation validation)', () => {
    it('should return true for top tennis nations', () => {
      expect(adapter.isValidTeam('ITA')).toBe(true);
      expect(adapter.isValidTeam('ESP')).toBe(true);
      expect(adapter.isValidTeam('USA')).toBe(true);
      expect(adapter.isValidTeam('AUS')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(adapter.isValidTeam('ita')).toBe(true);
      expect(adapter.isValidTeam('ITA')).toBe(true);
      expect(adapter.isValidTeam('Ita')).toBe(true);
    });

    it('should return false for invalid nation codes', () => {
      expect(adapter.isValidTeam('XXX')).toBe(false);
      expect(adapter.isValidTeam('INVALID')).toBe(false);
      expect(adapter.isValidTeam('')).toBe(false);
    });
  });

  describe('getStandings (Davis Cup)', () => {
    beforeAll(() => {
      adapter.setActiveEvent('dc-2024');
    });

    let standings: TeamStanding[];

    beforeAll(async () => {
      standings = await adapter.getStandings();
    });

    it('should return standings array', () => {
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    it('should have all required fields', () => {
      for (const standing of standings) {
        expect(typeof standing.teamName).toBe('string');
        expect(standing.teamName.length).toBeGreaterThan(0);

        expect(typeof standing.teamAbbrev).toBe('string');
        expect(standing.teamAbbrev).toMatch(/^[A-Z]{3}$/);

        expect(typeof standing.gamesPlayed).toBe('number');
        expect(typeof standing.wins).toBe('number');
        expect(typeof standing.losses).toBe('number');

        expect(standing.sport).toBe('Tennis');

        expect(typeof standing.date).toBe('string');
        expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });

  describe('getTeamDetails (Davis Cup)', () => {
    beforeAll(() => {
      adapter.setActiveEvent('dc-2024');
    });

    it('should return team details for participating nation', async () => {
      const details = await adapter.getTeamDetails('ITA');

      expect(details.id).toBe('ITA');
      expect(details.name).toBe('Italy');
      expect(typeof details.flag).toBe('string');
      expect(typeof details.captain).toBe('string');
      expect(Array.isArray(details.players)).toBe(true);
      expect(details.sport).toBe('Tennis');
    });

    it('should return error for non-participating nation', async () => {
      const details = await adapter.getTeamDetails('XXX');

      expect(details.error).toBeDefined();
      expect(details.sport).toBe('Tennis');
    });
  });

  describe('getEvents', () => {
    it('should return all ITF events', async () => {
      const events = await adapter.getEvents();

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it('should filter by event type', async () => {
      const davisCupEvents = await adapter.getEvents('davis_cup');

      expect(davisCupEvents.every(e => e.type === 'davis_cup')).toBe(true);
    });

    it('should have required fields on events', async () => {
      const events = await adapter.getEvents();

      for (const event of events) {
        expect(typeof event.id).toBe('string');
        expect(typeof event.name).toBe('string');
        expect(['davis_cup', 'bjk_cup', 'olympics', 'united_cup']).toContain(event.type);
        expect(typeof event.year).toBe('number');
        expect(typeof event.location).toBe('string');
        expect(event.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(['upcoming', 'in_progress', 'completed']).toContain(event.status);
      }
    });
  });

  describe('getDavisCup', () => {
    it('should return Davis Cup events', async () => {
      const events = await adapter.getDavisCup();

      expect(Array.isArray(events)).toBe(true);
      for (const event of events as any[]) {
        expect(event.type).toBe('davis_cup');
      }
    });

    it('should filter by year', async () => {
      const event = await adapter.getDavisCup(2024);

      expect(event).toBeDefined();
      expect((event as any).year).toBe(2024);
    });
  });

  describe('getDavisCupTies', () => {
    it('should return ties for Davis Cup event', async () => {
      const ties = await adapter.getDavisCupTies('dc-2024');

      expect(Array.isArray(ties)).toBe(true);
      expect(ties.length).toBeGreaterThan(0);
    });

    it('should have required fields on ties', async () => {
      const ties = await adapter.getDavisCupTies('dc-2024');

      for (const tie of ties) {
        expect(typeof tie.id).toBe('string');
        expect(DAVIS_CUP_PHASES).toContain(tie.phase);
        expect(tie.homeTeam).toBeDefined();
        expect(tie.awayTeam).toBeDefined();
        expect(typeof tie.homeTeam.code).toBe('string');
        expect(typeof tie.awayTeam.code).toBe('string');
        expect(['scheduled', 'live', 'completed']).toContain(tie.status);
      }
    });
  });

  describe('getDavisCupFinal', () => {
    it('should return the final tie', async () => {
      const final = await adapter.getDavisCupFinal('dc-2024');

      expect(final).not.toBeNull();
      expect(final?.phase).toBe('final');
    });

    it('should have winner information for completed final', async () => {
      const final = await adapter.getDavisCupFinal('dc-2024');

      if (final?.status === 'completed') {
        expect(final.score).toBeDefined();
        expect(final.score?.home).toBeDefined();
        expect(final.score?.away).toBeDefined();
      }
    });
  });

  describe('getOlympics', () => {
    it('should return Olympic tennis events', async () => {
      const events = await adapter.getOlympics();

      expect(Array.isArray(events)).toBe(true);
      for (const event of events as any[]) {
        expect(event.type).toBe('olympics');
      }
    });

    it('should filter by year', async () => {
      const event = await adapter.getOlympics(2024);

      expect(event).toBeDefined();
      expect((event as any).year).toBe(2024);
      expect((event as any).location).toBe('Paris');
    });
  });

  describe('getOlympicMedalMatches', () => {
    it('should return medal matches', async () => {
      const matches = await adapter.getOlympicMedalMatches('oly-2024');

      expect(Array.isArray(matches)).toBe(true);
      expect(matches.length).toBeGreaterThan(0);

      for (const match of matches) {
        expect(match.medal).toBeDefined();
        expect(['gold', 'silver', 'bronze']).toContain(match.medal);
      }
    });

    it('should have required fields on matches', async () => {
      const matches = await adapter.getOlympicMedalMatches('oly-2024');

      for (const match of matches) {
        expect(typeof match.id).toBe('string');
        expect(OLYMPIC_DRAWS).toContain(match.draw);
        expect(typeof match.round).toBe('string');
        expect(match.player1).toBeDefined();
        expect(match.player2).toBeDefined();
        expect(['scheduled', 'live', 'completed']).toContain(match.status);
      }
    });
  });

  describe('getOlympicMatches', () => {
    it('should filter by draw', async () => {
      const mensMatches = await adapter.getOlympicMatches('oly-2024', 'mens_singles');

      expect(mensMatches.every(m => m.draw === 'mens_singles')).toBe(true);
    });
  });

  describe('ITF constants', () => {
    it('should have event definitions', () => {
      expect(ITF_EVENTS.DAVIS_CUP.name).toBe('Davis Cup');
      expect(ITF_EVENTS.BJK_CUP.name).toBe('Billie Jean King Cup');
      expect(ITF_EVENTS.OLYMPICS.name).toBe('Olympic Tennis Tournament');
    });

    it('should have top nations defined', () => {
      expect(ITF_TOP_NATIONS.length).toBeGreaterThan(10);

      const nationCodes = ITF_TOP_NATIONS.map(n => n.code);
      expect(nationCodes).toContain('ITA');
      expect(nationCodes).toContain('ESP');
      expect(nationCodes).toContain('USA');
      expect(nationCodes).toContain('AUS');
    });

    it('should have correct Davis Cup phases', () => {
      expect(DAVIS_CUP_PHASES).toContain('group_stage');
      expect(DAVIS_CUP_PHASES).toContain('quarterfinal');
      expect(DAVIS_CUP_PHASES).toContain('semifinal');
      expect(DAVIS_CUP_PHASES).toContain('final');
    });

    it('should have all Olympic draws', () => {
      expect(OLYMPIC_DRAWS).toContain('mens_singles');
      expect(OLYMPIC_DRAWS).toContain('womens_singles');
      expect(OLYMPIC_DRAWS).toContain('mens_doubles');
      expect(OLYMPIC_DRAWS).toContain('womens_doubles');
      expect(OLYMPIC_DRAWS).toContain('mixed_doubles');
    });
  });
});
