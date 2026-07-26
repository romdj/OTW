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
import { wtaRankingsService } from '../../wta/services/rankingsService.js';
import { wtaTournamentsService } from '../../wta/services/tournamentsService.js';
import { ballDontLieTennisProvider } from '../../../providers/balldontlie.js';
import { davisCupService } from '../../itf/davisCupService.js';

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
    // Points are already in the correct structure from the service
    points: tournament.points,
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

        if (tour === 'ITF') {
          throw new Error('ITF does not publish an ATP/WTA-style combined ranking');
        }
        const rankings = await ballDontLieTennisProvider.rankings(
          tour as 'ATP' | 'WTA',
          args.limit,
        );

        return rankings.map(entry => ({
          ...entry,
          tour,
          type,
          movement: tour === 'WTA'
            ? wtaRankingsService.getRankingMovement(entry.rank, entry.previousRank)
            : atpRankingsService.getRankingMovement(entry.rank, entry.previousRank),
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
        const tour = String(args.tour ?? 'ATP').toUpperCase();
        if (tour === 'ITF') throw new Error('Use davisCupEvent for ITF competitions');
        if (tour === 'WTA') {
          const tournaments = await wtaTournamentsService.getTournaments({
            year: args.year,
            surface: args.surface,
            category: args.category as 'grand_slam' | 'wta_1000' | 'wta_500' | 'wta_250' | undefined,
          });
          return tournaments.map(tournament => ({
            ...tournament,
            surface: surfaceToEnum[tournament.surface],
            category: categoryToEnum[tournament.category],
            points: {
              winner: tournament.points,
              finalist: 0,
              semifinalist: 0,
              quarterfinalist: 0,
              round16: 0,
              round32: 0,
            },
          }));
        }
        return (await atpTournamentsService.getTournaments(args)).map(transformTournament);
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
        const tour = String((args as MatchesQueryArgs & { tour?: string }).tour ?? 'ATP').toUpperCase();
        if (tour === 'ITF') throw new Error('Use davisCupTies for ITF competition matches');
        const matches = await ballDontLieTennisProvider.matches(tour as 'ATP' | 'WTA', {
          tournamentId: args.tournamentId,
          playerId: args.playerId,
          status: args.status?.toUpperCase() as never,
          date: args.date,
        });
        return matches.map(match => ({
          id: match.providerId,
          tournamentId: match.eventId,
          tournamentName: '',
          round: match.round ?? '',
          surface: 'UNKNOWN',
          player1: {
            id: match.competitors[0].providerId,
            name: match.competitors[0].name,
            seed: match.competitors[0].seed,
            countryCode: match.competitors[0].countryCode ?? '',
          },
          player2: {
            id: match.competitors[1].providerId,
            name: match.competitors[1].name,
            seed: match.competitors[1].seed,
            countryCode: match.competitors[1].countryCode ?? '',
          },
          score: {
            sets: match.sets.map(set => ({
              player1: set.player1Games,
              player2: set.player2Games,
              tiebreak: set.player1Tiebreak !== undefined && set.player2Tiebreak !== undefined
                ? { player1: set.player1Tiebreak, player2: set.player2Tiebreak }
                : undefined,
            })),
            winner: match.winnerId === match.competitors[0].otwId ? 'player1'
              : match.winnerId === match.competitors[1].otwId ? 'player2' : undefined,
            retired: match.status === 'RETIRED',
            walkover: match.status === 'WALKOVER',
          },
          formattedScore: match.scoreText,
          scheduledTime: match.scheduledAt,
          status: match.status,
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

    tennisEventsV2: async (_: unknown, args: { tour: string; season?: number }) => {
      const tour = args.tour.toUpperCase();
      if (tour === 'ITF') {
        throw new Error('Use davisCupEvent for ITF competitions');
      }
      return ballDontLieTennisProvider.events(tour as 'ATP' | 'WTA', { season: args.season });
    },

    tennisMatchesV2: async (_: unknown, args: {
      tour: string;
      season?: number;
      tournamentId?: string;
      playerId?: string;
      status?: string;
      date?: string;
      limit?: number;
    }) => {
      const tour = args.tour.toUpperCase();
      if (tour === 'ITF') {
        throw new Error('Use davisCupTies for ITF competition matches');
      }
      return ballDontLieTennisProvider.matches(tour as 'ATP' | 'WTA', {
        ...args,
        status: args.status as never,
      });
    },

    davisCupEvent: async (_: unknown, { season }: { season: number }) =>
      davisCupService.getEvent(season),

    davisCupTies: async (_: unknown, { season }: { season: number }) =>
      davisCupService.getTies(season),
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
