/**
 * NHL Standings Service - handles fetching and transforming NHL standings data
 */

import got from 'got';
import type { NHLApiStandingsResponse, NHLApiTeam, TransformedTeam } from '../types/nhl-api.types.js';
import { NHL_API_ENDPOINTS, NHL_POINT_SYSTEMS, NHL_ERROR_MESSAGES } from '../constants/index.js';
import { logger, PerformanceLogger } from '../../../../../utils/logger.js';
import { API_TIMEOUTS, RETRY_LIMITS } from '../../../../../constants/shared.js';
import { powerplayService } from './powerplayService.js';

export class NHLStandingsService {
  private static instance: NHLStandingsService;

  private constructor() {}

  public static getInstance(): NHLStandingsService {
    if (!NHLStandingsService.instance) {
      NHLStandingsService.instance = new NHLStandingsService();
    }
    return NHLStandingsService.instance;
  }

  /**
   * Fetches NHL standings for a specific date
   */
  async getStandings(date?: string): Promise<TransformedTeam[]> {
    const requestDate = date || new Date().toISOString().split('T')[0];
    const url = `${NHL_API_ENDPOINTS.STANDINGS}/${requestDate}`;
    
    logger.info({ date: requestDate, url }, 'Fetching NHL standings');
    
    return await PerformanceLogger.measureAsync('nhl-api-request', async () => {
      try {
        const response = await got.get(url, {
          responseType: 'json',
          timeout: {
            request: API_TIMEOUTS.DEFAULT_REQUEST
          },
          retry: {
            limit: RETRY_LIMITS.API_REQUESTS,
            methods: ['GET']
          }
        }).json<NHLApiStandingsResponse>();

        const teams = response.standings;
        
        logger.info({ 
          date: requestDate, 
          teamCount: teams.length 
        }, 'Successfully fetched NHL standings');

        const transformedTeams = teams.map((team: NHLApiTeam): TransformedTeam => 
          this.transformTeamData(team)
        );
        
        logger.debug({ 
          date: requestDate, 
          transformedCount: transformedTeams.length 
        }, 'Successfully transformed NHL team data');
        
        return transformedTeams;
      } catch (error) {
        logger.error({ 
          date: requestDate, 
          url, 
          error: error instanceof Error ? error.message : String(error) 
        }, NHL_ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
        throw new Error(NHL_ERROR_MESSAGES.FETCH_STANDINGS_FAILED);
      }
    }, { date: requestDate });
  }

  /**
   * Transforms NHL API team data to our GraphQL schema format
   */
  private transformTeamData(team: NHLApiTeam): TransformedTeam {
    return {
      conferenceAbbrev: team.conferenceAbbrev,
      conferenceName: team.conferenceName,
      conferenceSequence: team.conferenceSequence,
      date: team.date,
      divisionName: team.divisionName,
      divisionSequence: team.divisionSequence,
      gamesPlayed: team.gamesPlayed,
      goalDifferential: team.goalDifferential,
      goalAgainst: team.goalAgainst,
      goalFor: team.goalFor,
      homePoints: team.homePoints,
      losses: team.losses,
      otWins: team.wins - team.regulationWins,
      otLosses: team.otLosses,
      points: team.points,
      internationalSystemPoints: this.calculateInternationalPoints(team),
      regulationWins: team.regulationWins,
      roadPoints: team.roadPoints,
      teamName: team.teamName.default,
      teamAbbrev: team.teamAbbrev.default,
      teamLogo: team.teamLogo,
      winPercentage: team.winPctg,
      wins: team.wins
    };
  }

  /**
   * Calculates points using the international (3-point) system
   */
  private calculateInternationalPoints(team: NHLApiTeam): number {
    const { REGULATION_WIN, OT_WIN, OT_LOSS } = NHL_POINT_SYSTEMS.INTERNATIONAL;
    
    return (
      team.otLosses * OT_LOSS + 
      (team.wins - team.regulationWins) * OT_WIN + 
      team.regulationWins * REGULATION_WIN
    );
  }

  /**
   * Gets powerplay stats for a team (delegated to powerplay service)
   */
  async getTeamPowerplayStats(teamAbbrev: string, season?: string): Promise<Record<string, unknown> | null> {
    try {
      const stats = await powerplayService.getPowerplayStats(teamAbbrev, season);
      return stats as Record<string, unknown> | null;
    } catch (error) {
      logger.error({ 
        teamAbbrev,
        season,
        error: error instanceof Error ? error.message : String(error) 
      }, NHL_ERROR_MESSAGES.FETCH_POWERPLAY_FAILED);
      return null;
    }
  }
}

export const nhlStandingsService = NHLStandingsService.getInstance();