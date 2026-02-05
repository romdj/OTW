/**
 * NHL Adapter Contract Tests
 *
 * Verifies that NHLSportAdapter implements the SportsService interface correctly.
 */

import { NHLSportAdapter } from '../../../../../src/sports/ice-hockey/leagues/nhl/NHLSportAdapter';
import { NHL_DIVISIONS, NHL_CONFERENCES } from '../../../../../src/sports/ice-hockey/leagues/nhl/constants';
import type { TeamStanding } from '../../../../../src/sports/shared/interfaces/SportsService';

describe('NHLSportAdapter', () => {
  let adapter: NHLSportAdapter;

  beforeEach(() => {
    adapter = new NHLSportAdapter();
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
    it('should return NHL league metadata', () => {
      const info = adapter.getLeagueInfo();

      expect(info.name).toBe('National Hockey League');
      expect(info.sport).toBe('Ice Hockey');
      expect(info.country).toBe('North America');
      expect(info.founded).toBe(1917);
      expect(info.teams).toBe(32);
    });
  });

  describe('isValidTeam', () => {
    it('should return true for valid Eastern Conference teams', () => {
      for (const teamAbbrev of NHL_CONFERENCES.EASTERN) {
        expect(adapter.isValidTeam(teamAbbrev)).toBe(true);
      }
    });

    it('should return true for valid Western Conference teams', () => {
      for (const teamAbbrev of NHL_CONFERENCES.WESTERN) {
        expect(adapter.isValidTeam(teamAbbrev)).toBe(true);
      }
    });

    it('should be case insensitive', () => {
      expect(adapter.isValidTeam('bos')).toBe(true);
      expect(adapter.isValidTeam('BOS')).toBe(true);
      expect(adapter.isValidTeam('Bos')).toBe(true);
    });

    it('should return false for invalid team abbreviations', () => {
      expect(adapter.isValidTeam('XXX')).toBe(false);
      expect(adapter.isValidTeam('INVALID')).toBe(false);
      expect(adapter.isValidTeam('')).toBe(false);
    });
  });

  describe('getTeamDetails', () => {
    it('should return team details with required fields', async () => {
      const details = await adapter.getTeamDetails('BOS');

      expect(details.id).toBe('BOS');
      expect(details.league).toBe('NHL');
      expect(details.sport).toBe('Ice Hockey');
    });
  });

  describe('getStandings', () => {
    let standings: TeamStanding[];

    beforeAll(async () => {
      standings = await adapter.getStandings();
    });

    it('should return an array of standings', () => {
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
    });

    describe('TeamStanding contract', () => {
      it('should have all required fields on each standing', () => {
        for (const standing of standings) {
          // Required string fields
          expect(typeof standing.teamName).toBe('string');
          expect(standing.teamName.length).toBeGreaterThan(0);

          expect(typeof standing.teamAbbrev).toBe('string');
          expect(standing.teamAbbrev.length).toBeGreaterThan(0);

          expect(typeof standing.teamLogo).toBe('string');

          // Required number fields
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

          // Sport/league identifiers
          expect(standing.sport).toBe('Ice Hockey');
          expect(standing.league).toBe('NHL');

          // Date field
          expect(typeof standing.date).toBe('string');
          expect(standing.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
      });

      it('should have valid division assignments', () => {
        const validDivisions = ['Atlantic', 'Metropolitan', 'Central', 'Pacific'];

        for (const standing of standings) {
          if (standing.division) {
            expect(validDivisions).toContain(standing.division);
          }
        }
      });

      it('should have valid conference assignments', () => {
        const validConferences = ['Eastern', 'Western'];

        for (const standing of standings) {
          if (standing.conference) {
            expect(validConferences).toContain(standing.conference);
          }
        }
      });

      it('should have consistent division-conference mapping', () => {
        const divisionToConference: Record<string, string> = {
          'Atlantic': 'Eastern',
          'Metropolitan': 'Eastern',
          'Central': 'Western',
          'Pacific': 'Western',
        };

        for (const standing of standings) {
          if (standing.division && standing.conference) {
            expect(standing.conference).toBe(divisionToConference[standing.division]);
          }
        }
      });
    });
  });

  describe('NHL division structure', () => {
    it('should have 4 divisions', () => {
      const divisions = Object.keys(NHL_DIVISIONS);
      expect(divisions.length).toBe(4);
      expect(divisions).toContain('ATLANTIC');
      expect(divisions).toContain('METROPOLITAN');
      expect(divisions).toContain('CENTRAL');
      expect(divisions).toContain('PACIFIC');
    });

    it('should have 8 teams per division', () => {
      expect(NHL_DIVISIONS.ATLANTIC.length).toBe(8);
      expect(NHL_DIVISIONS.METROPOLITAN.length).toBe(8);
      expect(NHL_DIVISIONS.CENTRAL.length).toBe(8);
      expect(NHL_DIVISIONS.PACIFIC.length).toBe(8);
    });

    it('should have 2 conferences', () => {
      expect(NHL_CONFERENCES.EASTERN.length).toBe(16);
      expect(NHL_CONFERENCES.WESTERN.length).toBe(16);
    });

    it('should have all 32 teams', () => {
      const allTeams = new Set([
        ...NHL_CONFERENCES.EASTERN,
        ...NHL_CONFERENCES.WESTERN,
      ]);
      expect(allTeams.size).toBe(32);
    });

    it('should include notable teams', () => {
      const allTeams = [...NHL_CONFERENCES.EASTERN, ...NHL_CONFERENCES.WESTERN];

      // Original Six teams (well, 5 of them still have same abbreviations)
      expect(allTeams).toContain('BOS'); // Boston Bruins
      expect(allTeams).toContain('CHI'); // Chicago Blackhawks
      expect(allTeams).toContain('DET'); // Detroit Red Wings
      expect(allTeams).toContain('MTL'); // Montreal Canadiens
      expect(allTeams).toContain('NYR'); // New York Rangers
      expect(allTeams).toContain('TOR'); // Toronto Maple Leafs

      // Recent expansion teams
      expect(allTeams).toContain('SEA'); // Seattle Kraken
      expect(allTeams).toContain('VGK'); // Vegas Golden Knights
    });
  });
});
