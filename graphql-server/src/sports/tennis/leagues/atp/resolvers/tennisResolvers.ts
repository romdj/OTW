/**
 * Tennis GraphQL Resolvers
 *
 * Handles all tennis-related GraphQL queries for ATP and WTA tours.
 */

import type { RankingsQueryArgs, TournamentsQueryArgs, MatchesQueryArgs, PlayerQueryArgs, ATPTournamentEntry, ATPMatchEntry } from '../types/atp-api.types.js';
import { logger } from '../../../../../utils/logger.js';
import { atpRankingsService } from '../services/rankingsService.js';
import { atpTournamentsService } from '../services/tournamentsService.js';
import { ATP_ERROR_MESSAGES } from '../constants/index.js';

// Transform surface to GraphQL enum (uppercase)
const surfaceToEnum: Record<string, string> = {
  hard: 'HARD',
  clay: 'CLAY',
  grass: 'GRASS',
  indoor_hard: 'INDOOR_HARD',
};

// Transform category to GraphQL enum (uppercase)
const categoryToEnum: Record<string, string> = {
  grand_slam: 'GRAND_SLAM',
  masters_1000: 'MASTERS_1000',
  wta_1000: 'WTA_1000',
  atp_500: 'ATP_500',
  wta_500: 'WTA_500',
  atp_250: 'ATP_250',
  wta_250: 'WTA_250',
  atp_finals: 'ATP_FINALS',
  wta_finals: 'WTA_FINALS',
};

// Transform match status to GraphQL enum
const statusToEnum: Record<string, string> = {
  scheduled: 'SCHEDULED',
  live: 'LIVE',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

/**
 * Transform tournament to GraphQL response
 */
function transformTournament(tournament: ATPTournamentEntry) {
  return {
    ...tournament,
    surface: surfaceToEnum[tournament.surface] || tournament.surface.toUpperCase(),
    category: categoryToEnum[tournament.category] || tournament.category.toUpperCase(),
    points: {
      winner: tournament.points,
      finalist: Math.floor(tournament.points * 0.6),
      semifinalist: Math.floor(tournament.points * 0.36),
      quarterfinalist: Math.floor(tournament.points * 0.18),
      round16: Math.floor(tournament.points * 0.09),
      round32: Math.floor(tournament.points * 0.045),
      round64: Math.floor(tournament.points * 0.025),
      round128: Math.floor(tournament.points * 0.01),
    },
  };
}

/**
 * Transform match to GraphQL response
 */
function transformMatch(match: ATPMatchEntry) {
  return {
    ...match,
    surface: surfaceToEnum[match.surface] || match.surface.toUpperCase(),
    status: statusToEnum[match.status] || match.status.toUpperCase(),
    formattedScore: atpTournamentsService.formatScore(match),
  };
}

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
        const tournaments = await atpTournamentsService.getTournaments(args);
        return tournaments.map(transformTournament);
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
        const tournament = await atpTournamentsService.getTournamentById(tournamentId);
        return tournament ? transformTournament(tournament) : null;
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
        return matches.map(transformMatch);
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
        return matches.map(transformMatch);
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
      const tournament = await atpTournamentsService.getTournamentById(parent.tournamentId);
      return tournament ? transformTournament(tournament) : null;
    },
  },
};
