/**
 * Tennis/ATP Adapter Contract Tests
 *
 * Verifies that TennisSportAdapter implements the SportsService interface correctly.
 * Note: Tennis is an individual sport - rankings are adapted to the team-based interface.
 */

import { TennisSportAdapter } from '../../../../../src/sports/tennis/leagues/atp/TennisSportAdapter';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('TennisSportAdapter', () => {
  let adapter: TennisSportAdapter;

  beforeEach(() => {
    adapter = new TennisSportAdapter();
  });

  describe('interface compliance', () => {
    it('should implement SportsService interface', () => {
      expect(typeof adapter.getStandings).toBe('function');
      expect(typeof adapter.getTeamDetails).toBe('function');
      expect(typeof adapter.getTeamStats).toBe('function');
      expect(typeof adapter.isValidTeam).toBe('function');
      expect(typeof adapter.getLeagueInfo).toBe('function');
    });

    it('should have tennis-specific methods', () => {
      expect(typeof adapter.getTournaments).toBe('function');
      expect(typeof adapter.getLiveMatches).toBe('function');
    });
  });

  describe('getLeagueInfo', () => {
    it('should return ATP tour metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe('Association of Tennis Professionals');
      expect(info.sport).toBe('Tennis');
      expect(info.country).toBe('International');
      expect(info.founded).toBe(1972);
      expect(typeof info.teams).toBe('number');
      expect(info.teams).toBeGreaterThan(0);
    });
  });

  describe('isValidTeam (player ID validation)', () => {
    it('should return true for valid 4-character alphanumeric player IDs', () => {
      expect(adapter.isValidTeam('S0AG')).toBe(true); // Sinner
      expect(adapter.isValidTeam('D643')).toBe(true); // Djokovic
      expect(adapter.isValidTeam('A0E2')).toBe(true); // Alcaraz
      expect(adapter.isValidTeam('Z355')).toBe(true); // Zverev
    });

    it('should return false for invalid player IDs', () => {
      expect(adapter.isValidTeam('invalid')).toBe(false);
      expect(adapter.isValidTeam('ABC')).toBe(false); // Too short
      expect(adapter.isValidTeam('ABCDE')).toBe(false); // Too long
      expect(adapter.isValidTeam('')).toBe(false);
      expect(adapter.isValidTeam('ab12')).toBe(false); // Lowercase not allowed
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

    describe('TeamStanding contract (adapted from rankings)', () => {
      it('should have all required fields on each standing', () => {
        for (const standing of standings) {
          // teamName = player name
          expect(typeof standing.teamName).toBe('string');
          expect(standing.teamName.length).toBeGreaterThan(0);

          // teamAbbrev = player ID
          expect(typeof standing.teamAbbrev).toBe('string');
          expect(standing.teamAbbrev.length).toBeGreaterThan(0);

          // teamLogo = player headshot URL
          expect(typeof standing.teamLogo).toBe('string');

          // gamesPlayed = tournaments played
          expect(typeof standing.gamesPlayed).toBe('number');
          expect(standing.gamesPlayed).toBeGreaterThanOrEqual(0);

          // wins = points (adapted)
          expect(typeof standing.wins).toBe('number');
          expect(standing.wins).toBeGreaterThanOrEqual(0);

          // points = ranking points
          expect(typeof standing.points).toBe('number');
          expect(standing.points).toBeGreaterThanOrEqual(0);

          // Sport/league identifiers
          expect(standing.sport).toBe('Tennis');
          expect(standing.league).toBe('ATP');
          expect(standing.division).toBe('Singles');

          // Date field
          expect(typeof standing.date).toBe('string');
          expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should have top players in correct order', () => {
        // First player should be #1 ranked (most points)
        expect(standings[0].points).toBeGreaterThan(standings[1].points);
      });

      it('should include known top players', () => {
        const playerNames = standings.map(s => s.teamName);

        // Check for some known top ATP players (from mock data)
        expect(playerNames.some(name => name.includes('Sinner'))).toBe(true);
        expect(playerNames.some(name => name.includes('Alcaraz'))).toBe(true);
        expect(playerNames.some(name => name.includes('Djokovic'))).toBe(true);
      });
    });
  });

  describe('getTeamDetails (player profile)', () => {
    it('should return player profile for known player', async () => {
      const details = await adapter.getTeamDetails('S0AG'); // Sinner

      expect(details.id).toBe('S0AG');
      expect(details.name).toBe('Jannik Sinner');
      expect(details.country).toBe('Italy');
      expect(details.countryCode).toBe('ITA');
      expect(typeof details.ranking).toBe('number');
      expect(typeof details.highestRanking).toBe('number');
      expect(details.league).toBe('ATP');
      expect(details.sport).toBe('Tennis');
    });

    it('should return error object for unknown player', async () => {
      const details = await adapter.getTeamDetails('XXXX');

      expect(details.id).toBe('XXXX');
      expect(details.error).toBe('Player not found');
      expect(details.league).toBe('ATP');
      expect(details.sport).toBe('Tennis');
    });

    it('should include career statistics', async () => {
      const details = await adapter.getTeamDetails('D643'); // Djokovic

      expect(typeof details.careerTitles).toBe('number');
      expect(typeof details.careerRecord).toBe('string');
      expect(typeof details.ytdRecord).toBe('string');
      expect(typeof details.prizeMoney).toBe('number');
    });

    it('should include player physical and style info', async () => {
      const details = await adapter.getTeamDetails('S0AG');

      expect(typeof details.height).toBe('number');
      expect(typeof details.weight).toBe('number');
      expect(['right', 'left']).toContain(details.plays);
      expect(['one-handed', 'two-handed']).toContain(details.backhand);
    });
  });

  describe('getTeamStats (player statistics)', () => {
    it('should return stats for known player', async () => {
      const stats = await adapter.getTeamStats('S0AG');

      expect(stats).not.toBeNull();
      expect(stats?.playerId).toBe('S0AG');
      expect(stats?.playerName).toBe('Jannik Sinner');
      expect(typeof stats?.currentRanking).toBe('number');
      expect(typeof stats?.careerTitles).toBe('number');
      expect(typeof stats?.careerWins).toBe('number');
      expect(typeof stats?.careerLosses).toBe('number');
      expect(typeof stats?.winPercentage).toBe('number');
    });

    it('should return null for unknown player', async () => {
      const stats = await adapter.getTeamStats('XXXX');
      expect(stats).toBeNull();
    });

    it('should calculate win percentage correctly', async () => {
      const stats = await adapter.getTeamStats('S0AG');

      if (stats && stats.careerWins && stats.careerLosses) {
        const expectedPct = Number(stats.careerWins) / (Number(stats.careerWins) + Number(stats.careerLosses));
        expect(stats.winPercentage).toBeCloseTo(expectedPct, 5);
      }
    });
  });

  describe('getTournaments', () => {
    it('should return tournament list', async () => {
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

    it('should have required fields on tournaments', async () => {
      const tournaments = await adapter.getTournaments();

      for (const tournament of tournaments) {
        expect(typeof tournament.id).toBe('string');
        expect(typeof tournament.name).toBe('string');
        expect(typeof tournament.location).toBe('string');
        expect(typeof tournament.country).toBe('string');
        expect(['hard', 'clay', 'grass']).toContain(tournament.surface);
        expect(['grand_slam', 'masters_1000', 'atp_500', 'atp_250']).toContain(tournament.category);
        expect(tournament.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tournament.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });
  });

  describe('getLiveMatches', () => {
    it('should return matches array', async () => {
      const matches = await adapter.getLiveMatches();

      expect(Array.isArray(matches)).toBe(true);
      // May be empty if no live matches
    });
  });
});
