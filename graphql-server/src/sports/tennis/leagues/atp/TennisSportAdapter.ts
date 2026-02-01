/**
 * Tennis Sport Adapter - implements the generic SportsService interface for Tennis
 *
 * Note: Tennis is an individual sport, so some team-focused methods return
 * adapted individual player data instead.
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { atpRankingsService } from './services/rankingsService.js';
import { atpTournamentsService } from './services/tournamentsService.js';
import type { ATPRankingEntry } from './types/atp-api.types.js';

export class TennisSportAdapter implements SportsService {
  private config: SportConfig = {
    name: 'ATP',
    sport: 'Tennis',
    country: 'International',
    defaultSeason: '2025',
  };

  /**
   * For tennis, "standings" returns rankings adapted to the TeamStanding interface
   */
  async getStandings(query?: StandingsQuery): Promise<TeamStanding[]> {
    const rankings = await atpRankingsService.getRankings();

    // Adapt individual rankings to team-like standings for interface compatibility
    return rankings.map((entry: ATPRankingEntry): TeamStanding => ({
      teamName: entry.playerName,
      teamAbbrev: entry.playerId,
      teamLogo: `https://www.atptour.com/en/players/-/${entry.playerId}/headshot`, // Placeholder
      gamesPlayed: entry.tournamentsPlayed,
      wins: entry.points, // Using points as "wins" equivalent
      losses: 0, // Not applicable for rankings
      points: entry.points,
      winPercentage: 0, // Would need match record
      sport: 'Tennis',
      league: 'ATP',
      division: 'Singles',
      conference: undefined,
      date: query?.date || new Date().toISOString().split('T')[0],
    }));
  }

  /**
   * Get player profile details
   */
  async getTeamDetails(teamId: string): Promise<Record<string, unknown>> {
    const player = await atpRankingsService.getPlayerProfile(teamId);

    if (!player) {
      return {
        id: teamId,
        league: 'ATP',
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
      weight: player.weight,
      plays: player.plays,
      backhand: player.backhand,
      coach: player.coach,
      careerTitles: player.careerTitles,
      careerRecord: `${player.careerWins}-${player.careerLosses}`,
      ytdRecord: `${player.ytdWins}-${player.ytdLosses}`,
      prizeMoney: player.prizeMoney,
      league: 'ATP',
      sport: 'Tennis',
    };
  }

  /**
   * Get player statistics
   */
  async getTeamStats(teamId: string, _season?: string): Promise<Record<string, unknown> | null> {
    const player = await atpRankingsService.getPlayerProfile(teamId);

    if (!player) {
      return null;
    }

    return {
      playerId: player.id,
      playerName: player.fullName,
      currentRanking: player.currentRanking,
      points: 0, // Would need to fetch from rankings
      careerTitles: player.careerTitles,
      careerWins: player.careerWins,
      careerLosses: player.careerLosses,
      ytdWins: player.ytdWins,
      ytdLosses: player.ytdLosses,
      winPercentage: player.careerWins / (player.careerWins + player.careerLosses),
    };
  }

  /**
   * Validate player ID
   */
  isValidTeam(teamId: string): boolean {
    // ATP player IDs are typically 4-character alphanumeric
    return /^[A-Z0-9]{4}$/.test(teamId);
  }

  /**
   * Get ATP Tour metadata
   */
  getLeagueInfo() {
    return {
      name: 'Association of Tennis Professionals',
      sport: 'Tennis',
      country: 'International',
      founded: 1972,
      teams: 500, // Approximate number of ranked players
    };
  }

  /**
   * Tennis-specific: Get tournament schedule
   */
  async getTournaments(year?: number) {
    return await atpTournamentsService.getTournaments({ year });
  }

  /**
   * Tennis-specific: Get live matches
   */
  async getLiveMatches() {
    return await atpTournamentsService.getLiveMatches();
  }
}

export const tennisSportAdapter = new TennisSportAdapter();
