/**
 * NHL-specific GraphQL resolvers for standings data
 */

import type { StandingsQueryArgs, TransformedTeam } from '../types/nhl-api.types.js';
import { logger } from '../../../../../utils/logger.js';
import { nhlStandingsService } from '../services/standingsService.js';
import { powerplayService } from '../services/powerplayService.js';
import { NHL_ERROR_MESSAGES } from '../constants/index.js';

export const nhlStandingsResolvers = {
  Query: {
    /**
     * Fetches NHL standings for a specific date
     */
    standings: async (_: unknown, { date }: StandingsQueryArgs): Promise<TransformedTeam[]> => {
      try {
        logger.info({ date }, 'NHL standings query received');
        return await nhlStandingsService.getStandings(date);
      } catch (error) {
        logger.error({ 
          date,
          error: error instanceof Error ? error.message : String(error) 
        }, 'NHL standings query failed');
        throw error;
      }
    }
  },
  
  Team: {
    /**
     * Resolver for powerplay stats field on Team type
     */
    powerplayStats: async (parent: TransformedTeam) => {
      logger.debug({ 
        teamAbbrev: parent.teamAbbrev,
        teamName: parent.teamName 
      }, 'Fetching powerplay stats for NHL team');
      
      try {
        const powerplayStats = await powerplayService.getPowerplayStats(parent.teamAbbrev);
        
        logger.debug({ 
          teamAbbrev: parent.teamAbbrev,
          powerplayStats 
        }, 'Successfully fetched NHL powerplay stats');
        
        return powerplayStats;
      } catch (error) {
        logger.error({ 
          teamAbbrev: parent.teamAbbrev,
          error: error instanceof Error ? error.message : String(error) 
        }, NHL_ERROR_MESSAGES.FETCH_POWERPLAY_FAILED);
        
        return null;
      }
    }
  }
};