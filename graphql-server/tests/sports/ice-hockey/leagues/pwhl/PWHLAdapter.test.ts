/**
 * PWHL Adapter Contract Tests
 *
 * Verifies that PWHLSportAdapter implements the SportsService interface correctly.
 */

import { PWHLSportAdapter } from '../../../../../src/sports/ice-hockey/leagues/pwhl/PWHLSportAdapter';
import { PWHL_TEAMS, PWHL_TEAM_ABBREVS } from '../../../../../src/sports/ice-hockey/leagues/pwhl/constants';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('PWHLSportAdapter', () => {
  let adapter: PWHLSportAdapter;

  beforeEach(() => {
    adapter = new PWHLSportAdapter();
  });

  describe('interface compliance', () => {
    it('should implement SportsService interface', () => {
      expect(typeof adapter.getStandings).toBe('function');
      expect(typeof adapter.getTeamDetails).toBe('function');
      expect(typeof adapter.getTeamStats).toBe('function');
      expect(typeof adapter.isValidTeam).toBe('function');
      expect(typeof adapter.getLeagueInfo).toBe('function');
    });
  });

  describe('getLeagueInfo', () => {
    it('should return PWHL league metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe("Professional Women's Hockey League");
      expect(info.sport).toBe('Ice Hockey');
      expect(info.country).toBe('North America');
      expect(info.founded).toBe(2023);
      expect(info.teams).toBe(6);
    });
  });

  describe('isValidTeam', () => {
    it('should return true for valid PWHL teams', () => {
      for (const abbrev of PWHL_TEAM_ABBREVS) {
        expect(adapter.isValidTeam(abbrev)).toBe(true);
      }
    });

    it('should be case insensitive', () => {
      expect(adapter.isValidTeam('min')).toBe(true);
      expect(adapter.isValidTeam('MIN')).toBe(true);
      expect(adapter.isValidTeam('Min')).toBe(true);
    });

    it('should return false for invalid team abbreviations', () => {
      expect(adapter.isValidTeam('XXX')).toBe(false);
      expect(adapter.isValidTeam('NHL')).toBe(false);
      expect(adapter.isValidTeam('')).toBe(false);
    });

    it('should return false for NHL team abbreviations not in PWHL', () => {
      expect(adapter.isValidTeam('VGK')).toBe(false); // Vegas
      expect(adapter.isValidTeam('SEA')).toBe(false); // Seattle
    });
  });

  describe('getTeamDetails', () => {
    it('should return team details for valid team', async () => {
      const details = await adapter.getTeamDetails('MIN');

      expect(details.id).toBe('MIN');
      expect(details.name).toBe('Minnesota Frost');
      expect(details.city).toBe('Minneapolis');
      expect(details.founded).toBe(2023);
      expect(details.league).toBe('PWHL');
      expect(details.sport).toBe('Ice Hockey');
    });

    it('should return error for invalid team', async () => {
      const details = await adapter.getTeamDetails('XXX');

      expect(details.id).toBe('XXX');
      expect(details.error).toBe('Team not found');
      expect(details.league).toBe('PWHL');
    });
  });

  describe('getStandings', () => {
    let standings: TeamStanding[];

    beforeAll(async () => {
      standings = await adapter.getStandings();
    });

    it('should return standings for all 6 teams', () => {
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBe(6);
    });

    describe('TeamStanding contract', () => {
      it('should have all required fields', () => {
        for (const standing of standings) {
          expect(typeof standing.teamName).toBe('string');
          expect(standing.teamName.length).toBeGreaterThan(0);

          expect(typeof standing.teamAbbrev).toBe('string');
          expect(PWHL_TEAM_ABBREVS).toContain(standing.teamAbbrev);

          expect(typeof standing.teamLogo).toBe('string');

          expect(typeof standing.gamesPlayed).toBe('number');
          expect(standing.gamesPlayed).toBeGreaterThanOrEqual(0);

          expect(typeof standing.wins).toBe('number');
          expect(standing.wins).toBeGreaterThanOrEqual(0);

          expect(typeof standing.losses).toBe('number');
          expect(standing.losses).toBeGreaterThanOrEqual(0);

          expect(typeof standing.points).toBe('number');
          expect(standing.points).toBeGreaterThanOrEqual(0);

          expect(typeof standing.winPercentage).toBe('number');
          expect(standing.winPercentage).toBeGreaterThanOrEqual(0);
          expect(standing.winPercentage).toBeLessThanOrEqual(1);

          expect(standing.sport).toBe('Ice Hockey');
          expect(standing.league).toBe('PWHL');

          expect(typeof standing.date).toBe('string');
          expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should be sorted by points descending', () => {
        for (let i = 1; i < standings.length; i++) {
          expect(standings[i - 1].points).toBeGreaterThanOrEqual(standings[i].points);
        }
      });
    });
  });

  describe('getTeamStats', () => {
    it('should return detailed stats for valid team', async () => {
      const stats = await adapter.getTeamStats('MIN');

      expect(stats).not.toBeNull();
      expect(stats?.teamAbbrev).toBe('MIN');
      expect(stats?.teamName).toBe('Minnesota Frost');
      expect(typeof stats?.gamesPlayed).toBe('number');
      expect(typeof stats?.wins).toBe('number');
      expect(typeof stats?.losses).toBe('number');
      expect(typeof stats?.otLosses).toBe('number');
      expect(typeof stats?.points).toBe('number');
      expect(typeof stats?.regulationWins).toBe('number');
      expect(typeof stats?.goalsFor).toBe('number');
      expect(typeof stats?.goalsAgainst).toBe('number');
      expect(typeof stats?.goalDifferential).toBe('number');
      expect(typeof stats?.homeRecord).toBe('string');
      expect(typeof stats?.awayRecord).toBe('string');
      expect(typeof stats?.streak).toBe('string');
      expect(typeof stats?.last10).toBe('string');
    });

    it('should return null for invalid team', async () => {
      const stats = await adapter.getTeamStats('XXX');
      expect(stats).toBeNull();
    });
  });

  describe('PWHL teams data', () => {
    it('should have all 6 founding teams', () => {
      expect(Object.keys(PWHL_TEAMS).length).toBe(6);
      expect(PWHL_TEAMS.BOS).toBeDefined();
      expect(PWHL_TEAMS.MIN).toBeDefined();
      expect(PWHL_TEAMS.MTL).toBeDefined();
      expect(PWHL_TEAMS.NYC).toBeDefined();
      expect(PWHL_TEAMS.OTT).toBeDefined();
      expect(PWHL_TEAMS.TOR).toBeDefined();
    });

    it('should have correct team names', () => {
      expect(PWHL_TEAMS.BOS.name).toBe('Boston Fleet');
      expect(PWHL_TEAMS.MIN.name).toBe('Minnesota Frost');
      expect(PWHL_TEAMS.MTL.name).toBe('Montreal Victoire');
      expect(PWHL_TEAMS.NYC.name).toBe('New York Sirens');
      expect(PWHL_TEAMS.OTT.name).toBe('Ottawa Charge');
      expect(PWHL_TEAMS.TOR.name).toBe('Toronto Sceptres');
    });

    it('should all be founded in 2023', () => {
      for (const team of Object.values(PWHL_TEAMS)) {
        expect(team.founded).toBe(2023);
      }
    });
  });
});
