/**
 * Tennis GraphQL Resolvers
 *
 * Handles all tennis-related GraphQL queries for ATP and WTA tours.
 */

import type { RankingsQueryArgs, TournamentsQueryArgs, MatchesQueryArgs, PlayerQueryArgs } from '../types/atp-api.types.js';
import { logger } from '../../../../../utils/logger.js';
import { atpRankingsService } from '../services/rankingsService.js';
import { atpTournamentsService } from '../services/tournamentsService.js';
import { ATP_ERROR_MESSAGES } from '../constants/index.js';

export const tennisResolvers = {
  Query: {
    /**
     * Fetches tennis rankings (ATP or WTA)
     */
    tennisRankings: async (_: unknown, args: RankingsQueryArgs) => {
      try {
        logger.info({ args }, 'Tennis rankings query received');

        // Default to ATP singles if not specified
        // Convert from GraphQL enum (uppercase) to internal (lowercase)
        const tour = (args.tour || 'ATP').toUpperCase();
        const type = (args.type || 'SINGLES').toUpperCase();

        // TODO: Add WTA support
        if (tour === 'wta') {
          logger.warn('WTA rankings not yet implemented, returning ATP');
        }

        const rankings = await atpRankingsService.getRankings(args);

        return rankings.map(entry => ({
          ...entry,
          tour,
          type,
          movement: atpRankingsService.getRankingMovement(entry.rank, entry.previousRank),
        }));
      } catch (error) {
        logger.error({
          args,
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_RANKINGS_FAILED);
        throw error;
      }
    },

    /**
     * Fetches tennis tournaments
     */
    tennisTournaments: async (_: unknown, args: TournamentsQueryArgs) => {
      try {
        logger.info({ args }, 'Tennis tournaments query received');
        return await atpTournamentsService.getTournaments(args);
      } catch (error) {
        logger.error({
          args,
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
        throw error;
      }
    },

    /**
     * Fetches a single tournament by ID
     */
    tennisTournament: async (_: unknown, { tournamentId }: { tournamentId: string }) => {
      try {
        logger.info({ tournamentId }, 'Tennis tournament query received');
        return await atpTournamentsService.getTournamentById(tournamentId);
      } catch (error) {
        logger.error({
          tournamentId,
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_TOURNAMENTS_FAILED);
        throw error;
      }
    },

    /**
     * Fetches tennis matches
     */
    tennisMatches: async (_: unknown, args: MatchesQueryArgs) => {
      try {
        logger.info({ args }, 'Tennis matches query received');
        const matches = await atpTournamentsService.getMatches(args);

        return matches.map(match => ({
          ...match,
          formattedScore: atpTournamentsService.formatScore(match),
        }));
      } catch (error) {
        logger.error({
          args,
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_MATCHES_FAILED);
        throw error;
      }
    },

    /**
     * Fetches live tennis matches
     */
    tennisLiveMatches: async () => {
      try {
        logger.info('Tennis live matches query received');
        const matches = await atpTournamentsService.getLiveMatches();

        return matches.map(match => ({
          ...match,
          formattedScore: atpTournamentsService.formatScore(match),
        }));
      } catch (error) {
        logger.error({
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_MATCHES_FAILED);
        throw error;
      }
    },

    /**
     * Fetches a tennis player profile
     */
    tennisPlayer: async (_: unknown, { playerId }: PlayerQueryArgs) => {
      try {
        logger.info({ playerId }, 'Tennis player query received');
        return await atpRankingsService.getPlayerProfile(playerId);
      } catch (error) {
        logger.error({
          playerId,
          error: error instanceof Error ? error.message : String(error),
        }, ATP_ERROR_MESSAGES.FETCH_PLAYER_FAILED);
        throw error;
      }
    },
  },

  // Field resolvers for nested types
  TennisRanking: {
    /**
     * Resolve player profile from ranking entry
     */
    player: async (parent: { playerId: string }) => {
      return await atpRankingsService.getPlayerProfile(parent.playerId);
    },
  },

  TennisMatch: {
    /**
     * Resolve tournament details from match
     */
    tournament: async (parent: { tournamentId: string }) => {
      return await atpTournamentsService.getTournamentById(parent.tournamentId);
    },
  },
};
