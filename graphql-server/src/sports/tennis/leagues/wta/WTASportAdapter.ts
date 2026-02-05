/**
 * WTA Sport Adapter - implements the generic SportsService interface for WTA
 *
 * Note: Tennis is an individual sport, so some team-focused methods return
 * adapted individual player data instead.
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { wtaRankingsService } from './services/rankingsService.js';
import { wtaTournamentsService } from './services/tournamentsService.js';
import type { WTARankingEntry } from './types/wta-api.types.js';

export class WTASportAdapter implements SportsService {
  private config: SportConfig = {
    name: 'WTA',
    sport: 'Tennis',
    country: 'International',
    defaultSeason: '2025',
  };

  /**
   * For tennis, "standings" returns rankings adapted to the TeamStanding interface
   */
  async getStandings(query?: StandingsQuery): Promise<TeamStanding[]> {
    const rankings = await wtaRankingsService.getRankings();

    return rankings.map((entry: WTARankingEntry): TeamStanding => ({
      teamName: entry.playerName,
      teamAbbrev: entry.playerId,
      teamLogo: `https://www.wtatennis.com/players/${entry.playerId}/headshot`,
      gamesPlayed: entry.tournamentsPlayed,
      wins: entry.points,
      losses: 0,
      points: entry.points,
      winPercentage: 0,
      sport: 'Tennis',
      league: 'WTA',
      division: 'Singles',
      conference: undefined,
      date: query?.date || new Date().toISOString().split('T')[0],
    }));
  }

  /**
   * Get player profile details
   */
  async getTeamDetails(teamId: string): Promise<Record<string, unknown>> {
    const player = await wtaRankingsService.getPlayerProfile(teamId);

    if (!player) {
      return {
        id: teamId,
        league: 'WTA',
        sport: 'Tennis',
        error: 'Player not found',
      };
    }

    return {
      id: player.id,
      name: player.fullName,
      country: player.country,
      countryCode: player.countryCode,
      ranking: player.currentRanking,
      highestRanking: player.highestRanking,
      birthDate: player.birthDate,
      height: player.height,
      plays: player.plays,
      backhand: player.backhand,
      coach: player.coach,
      careerTitles: player.careerTitles,
      careerRecord: `${player.careerWins}-${player.careerLosses}`,
      ytdRecord: `${player.ytdWins}-${player.ytdLosses}`,
      prizeMoney: player.prizeMoney,
      league: 'WTA',
      sport: 'Tennis',
    };
  }

  /**
   * Get player statistics
   */
  async getTeamStats(teamId: string, _season?: string): Promise<Record<string, unknown> | null> {
    const player = await wtaRankingsService.getPlayerProfile(teamId);

    if (!player) {
      return null;
    }

    return {
      playerId: player.id,
      playerName: player.fullName,
      currentRanking: player.currentRanking,
      points: 0,
      careerTitles: player.careerTitles,
      careerWins: player.careerWins,
      careerLosses: player.careerLosses,
      ytdWins: player.ytdWins,
      ytdLosses: player.ytdLosses,
      winPercentage: player.careerWins / (player.careerWins + player.careerLosses),
    };
  }

  /**
   * Validate player ID (4-character alphanumeric)
   */
  isValidTeam(teamId: string): boolean {
    return /^[A-Z0-9]{4}$/.test(teamId);
  }

  /**
   * Get WTA Tour metadata
   */
  getLeagueInfo() {
    return {
      name: "Women's Tennis Association",
      sport: 'Tennis',
      country: 'International',
      founded: 1973,
      teams: 500,
    };
  }

  /**
   * WTA-specific: Get tournament schedule
   */
  async getTournaments(year?: number) {
    return await wtaTournamentsService.getTournaments({ year });
  }
}

export const wtaSportAdapter = new WTASportAdapter();
