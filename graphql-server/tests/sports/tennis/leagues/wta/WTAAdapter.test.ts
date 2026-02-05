/**
 * WTA Adapter Contract Tests
 *
 * Verifies that WTASportAdapter implements the SportsService interface correctly.
 */

import { WTASportAdapter } from '../../../../../src/sports/tennis/leagues/wta/WTASportAdapter';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('WTASportAdapter', () => {
  let adapter: WTASportAdapter;

  beforeEach(() => {
    adapter = new WTASportAdapter();
  });

  describe('interface compliance', () => {
    it('should implement SportsService interface', () => {
      expect(typeof adapter.getStandings).toBe('function');
      expect(typeof adapter.getTeamDetails).toBe('function');
      expect(typeof adapter.getTeamStats).toBe('function');
      expect(typeof adapter.isValidTeam).toBe('function');
      expect(typeof adapter.getLeagueInfo).toBe('function');
    });

    it('should have WTA-specific methods', () => {
      expect(typeof adapter.getTournaments).toBe('function');
    });
  });

  describe('getLeagueInfo', () => {
    it('should return WTA tour metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe("Women's Tennis Association");
      expect(info.sport).toBe('Tennis');
      expect(info.country).toBe('International');
      expect(info.founded).toBe(1973);
      expect(typeof info.teams).toBe('number');
    });
  });

  describe('isValidTeam (player ID validation)', () => {
    it('should return true for valid 4-character alphanumeric player IDs', () => {
      expect(adapter.isValidTeam('S3B1')).toBe(true); // Sabalenka
      expect(adapter.isValidTeam('SW19')).toBe(true); // Swiatek
      expect(adapter.isValidTeam('G0FF')).toBe(true); // Gauff
    });

    it('should return false for invalid player IDs', () => {
      expect(adapter.isValidTeam('invalid')).toBe(false);
      expect(adapter.isValidTeam('ABC')).toBe(false);
      expect(adapter.isValidTeam('ABCDE')).toBe(false);
      expect(adapter.isValidTeam('')).toBe(false);
      expect(adapter.isValidTeam('ab12')).toBe(false);
    });
  });

  describe('getStandings (rankings adapted to standings)', () => {
    let standings: TeamStanding[];

    beforeAll(async () => {
      standings = await adapter.getStandings();
    });

    it('should return an array of standings', () => {
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    describe('TeamStanding contract', () => {
      it('should have all required fields', () => {
        for (const standing of standings) {
          expect(typeof standing.teamName).toBe('string');
          expect(standing.teamName.length).toBeGreaterThan(0);

          expect(typeof standing.teamAbbrev).toBe('string');
          expect(standing.teamAbbrev.length).toBeGreaterThan(0);

          expect(typeof standing.teamLogo).toBe('string');

          expect(typeof standing.gamesPlayed).toBe('number');
          expect(standing.gamesPlayed).toBeGreaterThanOrEqual(0);

          expect(typeof standing.points).toBe('number');
          expect(standing.points).toBeGreaterThanOrEqual(0);

          expect(standing.sport).toBe('Tennis');
          expect(standing.league).toBe('WTA');
          expect(standing.division).toBe('Singles');

          expect(typeof standing.date).toBe('string');
          expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should have top players in correct order', () => {
        expect(standings[0].points).toBeGreaterThan(standings[1].points);
      });

      it('should include known top WTA players', () => {
        const playerNames = standings.map(s => s.teamName);

        expect(playerNames.some(name => name.includes('Sabalenka'))).toBe(true);
        expect(playerNames.some(name => name.includes('Swiatek'))).toBe(true);
        expect(playerNames.some(name => name.includes('Gauff'))).toBe(true);
      });
    });
  });

  describe('getTeamDetails (player profile)', () => {
    it('should return player profile for known player', async () => {
      const details = await adapter.getTeamDetails('S3B1'); // Sabalenka

      expect(details.id).toBe('S3B1');
      expect(details.name).toBe('Aryna Sabalenka');
      expect(details.country).toBe('Belarus');
      expect(details.countryCode).toBe('BLR');
      expect(typeof details.ranking).toBe('number');
      expect(details.league).toBe('WTA');
      expect(details.sport).toBe('Tennis');
    });

    it('should return error object for unknown player', async () => {
      const details = await adapter.getTeamDetails('XXXX');

      expect(details.error).toBe('Player not found');
      expect(details.league).toBe('WTA');
    });

    it('should include career statistics', async () => {
      const details = await adapter.getTeamDetails('S3B1');

      expect(typeof details.careerTitles).toBe('number');
      expect(typeof details.careerRecord).toBe('string');
      expect(typeof details.ytdRecord).toBe('string');
      expect(typeof details.prizeMoney).toBe('number');
    });
  });

  describe('getTeamStats (player statistics)', () => {
    it('should return stats for known player', async () => {
      const stats = await adapter.getTeamStats('S3B1');

      expect(stats).not.toBeNull();
      expect(stats?.playerId).toBe('S3B1');
      expect(stats?.playerName).toBe('Aryna Sabalenka');
      expect(typeof stats?.currentRanking).toBe('number');
      expect(typeof stats?.careerTitles).toBe('number');
      expect(typeof stats?.winPercentage).toBe('number');
    });

    it('should return null for unknown player', async () => {
      const stats = await adapter.getTeamStats('XXXX');
      expect(stats).toBeNull();
    });
  });

  describe('getTournaments', () => {
    it('should return WTA tournament list', async () => {
      const tournaments = await adapter.getTournaments();

      expect(Array.isArray(tournaments)).toBe(true);
      expect(tournaments.length).toBeGreaterThan(0);
    });

    it('should include all Grand Slams', async () => {
      const tournaments = await adapter.getTournaments(2025);
      const names = tournaments.map(t => t.name);

      expect(names.some(n => n.includes('Australian Open'))).toBe(true);
      expect(names.some(n => n.includes('Roland Garros'))).toBe(true);
      expect(names.some(n => n.includes('Wimbledon'))).toBe(true);
      expect(names.some(n => n.includes('US Open'))).toBe(true);
    });

    it('should include WTA Finals', async () => {
      const tournaments = await adapter.getTournaments(2025);
      const names = tournaments.map(t => t.name);

      expect(names.some(n => n.includes('WTA Finals'))).toBe(true);
    });

    it('should have required fields on tournaments', async () => {
      const tournaments = await adapter.getTournaments();

      for (const tournament of tournaments) {
        expect(typeof tournament.id).toBe('string');
        expect(typeof tournament.name).toBe('string');
        expect(typeof tournament.location).toBe('string');
        expect(['hard', 'clay', 'grass']).toContain(tournament.surface);
        expect(['grand_slam', 'wta_1000', 'wta_500', 'wta_250', 'wta_125']).toContain(tournament.category);
        expect(tournament.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });
});
