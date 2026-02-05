/**
 * IIHF Sport Adapter - handles international ice hockey tournaments
 *
 * Covers:
 * - IIHF World Championship (WC)
 * - IIHF World Junior Championship (WJC)
 * - Olympic Ice Hockey Tournament
 * - IIHF U18 World Championship
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { iihfTournamentService } from './services/tournamentService.js';
import type { IIHFTeamStanding, TournamentType } from './types/iihf-api.types.js';
import { IIHF_NATION_CODES } from './constants/index.js';

export class IIHFSportAdapter implements SportsService {
  private config: SportConfig = {
    name: 'IIHF',
    sport: 'Ice Hockey',
    country: 'International',
  };

  private currentTournamentId: string = 'wjc-2025';

  /**
   * Set the active tournament for standings queries
   */
  setActiveTournament(tournamentId: string): void {
    this.currentTournamentId = tournamentId;
  }

  async getStandings(_query?: StandingsQuery): Promise<TeamStanding[]> {
    const standings = await iihfTournamentService.getStandings(this.currentTournamentId);
    const tournament = await iihfTournamentService.getTournamentById(this.currentTournamentId);

    return standings.map((team: IIHFTeamStanding): TeamStanding => ({
      teamName: team.nationName,
      teamAbbrev: team.nationCode,
      teamLogo: team.flag,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins + team.otWins,
      losses: team.losses + team.otLosses,
      points: team.points,
      winPercentage: team.gamesPlayed > 0 ? (team.wins + team.otWins) / team.gamesPlayed : 0,
      sport: 'Ice Hockey',
      league: tournament?.name || 'IIHF',
      division: team.group,
      conference: undefined,
      date: new Date().toISOString().split('T')[0],
    }));
  }

  async getTeamDetails(teamId: string): Promise<Record<string, unknown>> {
    const standings = await iihfTournamentService.getStandings(this.currentTournamentId);
    const team = standings.find(t => t.nationCode === teamId.toUpperCase());

    if (!team) {
      return {
        id: teamId,
        league: 'IIHF',
        sport: 'Ice Hockey',
        error: 'Nation not found in tournament',
      };
    }

    return {
      id: team.nationCode,
      name: team.nationName,
      flag: team.flag,
      group: team.group,
      rank: team.rank,
      league: 'IIHF',
      sport: 'Ice Hockey',
    };
  }

  async getTeamStats(teamId: string, _season?: string): Promise<Record<string, unknown> | null> {
    const standings = await iihfTournamentService.getStandings(this.currentTournamentId);
    const team = standings.find(t => t.nationCode === teamId.toUpperCase());

    if (!team) {
      return null;
    }

    return {
      nationCode: team.nationCode,
      nationName: team.nationName,
      group: team.group,
      gamesPlayed: team.gamesPlayed,
      wins: team.wins,
      otWins: team.otWins,
      otLosses: team.otLosses,
      losses: team.losses,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifferential: team.goalDifferential,
      rank: team.rank,
    };
  }

  isValidTeam(teamId: string): boolean {
    return (IIHF_NATION_CODES as readonly string[]).includes(teamId.toUpperCase());
  }

  getLeagueInfo() {
    return {
      name: 'International Ice Hockey Federation',
      sport: 'Ice Hockey',
      country: 'International',
      founded: 1908,
      teams: 83, // IIHF member nations
    };
  }

  // IIHF-specific methods

  /**
   * Get all tournaments of a specific type
   */
  async getTournaments(type?: TournamentType) {
    return iihfTournamentService.getTournaments(type);
  }

  /**
   * Get World Junior Championship info
   */
  async getWorldJuniors(year?: number) {
    const tournaments = await iihfTournamentService.getTournaments('world_juniors');
    if (year) {
      return tournaments.find(t => t.year === year);
    }
    return tournaments;
  }

  /**
   * Get World Championship info
   */
  async getWorldChampionship(year?: number) {
    const tournaments = await iihfTournamentService.getTournaments('world_championship');
    if (year) {
      return tournaments.find(t => t.year === year);
    }
    return tournaments;
  }

  /**
   * Get Olympic hockey info
   */
  async getOlympics(year?: number) {
    const tournaments = await iihfTournamentService.getTournaments('olympics');
    if (year) {
      return tournaments.find(t => t.year === year);
    }
    return tournaments;
  }

  /**
   * Get medal games for a tournament
   */
  async getMedalGames(tournamentId: string) {
    return iihfTournamentService.getMedalGames(tournamentId);
  }
}

export const iihfSportAdapter = new IIHFSportAdapter();
