/**
 * NHL Sport Adapter - implements the generic SportsService interface for NHL
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { nhlStandingsService } from './services/standingsService.js';
import type { TransformedTeam } from './types/nhl-api.types.js';
import { NHL_CONFERENCES, NHL_DIVISIONS } from './constants/index.js';

export class NHLSportAdapter implements SportsService {
  private config: SportConfig = {
    name: 'NHL',
    sport: 'Ice Hockey',
    country: 'North America',
    defaultSeason: '20242025'
  };

  async getStandings(query?: StandingsQuery): Promise<TeamStanding[]> {
    const nhlTeams = await nhlStandingsService.getStandings(query?.date);
    
    return nhlTeams.map((team: TransformedTeam): TeamStanding => ({
      teamName: team.teamName,
      teamAbbrev: team.teamAbbrev,
      teamLogo: team.teamLogo,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins,
      losses: team.losses,
      points: team.points,
      winPercentage: team.winPercentage,
      sport: 'Ice Hockey',
      league: 'NHL',
      division: team.divisionName,
      conference: team.conferenceName,
      date: team.date
    }));
  }

  async getTeamDetails(teamId: string): Promise<any> {
    // TODO: Implement NHL team details fetching
    return {
      id: teamId,
      league: 'NHL',
      sport: 'Ice Hockey'
    };
  }

  async getTeamStats(teamId: string, season?: string): Promise<any> {
    return await nhlStandingsService.getTeamPowerplayStats(teamId, season);
  }

  isValidTeam(teamId: string): boolean {
    const allTeams = [
      ...NHL_CONFERENCES.EASTERN,
      ...NHL_CONFERENCES.WESTERN
    ];
    return allTeams.includes(teamId.toUpperCase());
  }

  getLeagueInfo() {
    return {
      name: 'National Hockey League',
      sport: 'Ice Hockey',
      country: 'North America',
      founded: 1917,
      teams: 32
    };
  }
}