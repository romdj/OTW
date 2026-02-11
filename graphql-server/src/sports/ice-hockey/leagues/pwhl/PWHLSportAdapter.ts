/**
 * PWHL Sport Adapter - implements the generic SportsService interface for PWHL
 *
 * The Professional Women's Hockey League (PWHL) is the premier women's
 * professional ice hockey league in North America, founded in 2023.
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { pwhlStandingsService } from './services/standingsService.js';
import type { PWHLTeamStanding } from './types/pwhl-api.types.js';
import { PWHL_TEAM_ABBREVS } from './constants/index.js';

export class PWHLSportAdapter implements SportsService {
  private _config: SportConfig = {
    name: 'PWHL',
    sport: 'Ice Hockey',
    country: 'North America',
    defaultSeason: '2025',
  };

  async getStandings(_query?: StandingsQuery): Promise<TeamStanding[]> {
    const pwhlTeams = await pwhlStandingsService.getStandings();

    return pwhlTeams.map((team: PWHLTeamStanding): TeamStanding => ({
      teamName: team.teamName,
      teamAbbrev: team.teamAbbrev,
      teamLogo: team.teamLogo,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins,
      losses: team.losses,
      points: team.points,
      winPercentage: team.winPercentage,
      sport: 'Ice Hockey',
      league: 'PWHL',
      division: undefined, // Single division league
      conference: undefined,
      date: team.date,
    }));
  }

  async getTeamDetails(teamId: string): Promise<Record<string, unknown>> {
    const teamInfo = pwhlStandingsService.getTeamInfo(teamId);

    if (!teamInfo) {
      return {
        id: teamId,
        league: 'PWHL',
        sport: 'Ice Hockey',
        error: 'Team not found',
      };
    }

    return {
      id: teamId,
      name: teamInfo.name,
      city: teamInfo.city,
      founded: teamInfo.founded,
      league: 'PWHL',
      sport: 'Ice Hockey',
    };
  }

  async getTeamStats(teamId: string, _season?: string): Promise<Record<string, unknown> | null> {
    const standings = await pwhlStandingsService.getStandings();
    const team = standings.find(t => t.teamAbbrev === teamId.toUpperCase());

    if (!team) {
      return null;
    }

    return {
      teamAbbrev: team.teamAbbrev,
      teamName: team.teamName,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins,
      losses: team.losses,
      otLosses: team.otLosses,
      points: team.points,
      regulationWins: team.regulationWins,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifferential: team.goalDifferential,
      homeRecord: team.homeRecord,
      awayRecord: team.awayRecord,
      streak: team.streak,
      last10: team.last10,
    };
  }

  isValidTeam(teamId: string): boolean {
    return PWHL_TEAM_ABBREVS.includes(teamId.toUpperCase() as typeof PWHL_TEAM_ABBREVS[number]);
  }

  getLeagueInfo() {
    return {
      name: 'Professional Women\'s Hockey League',
      sport: 'Ice Hockey',
      country: 'North America',
      founded: 2023,
      teams: 6,
    };
  }
}

export const pwhlSportAdapter = new PWHLSportAdapter();
