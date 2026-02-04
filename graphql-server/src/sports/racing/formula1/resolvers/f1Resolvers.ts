/**
 * F1 GraphQL Resolvers
 *
 * Resolvers for Formula 1 calendar, standings, and championship queries.
 */

import { f1Service } from '../services/F1Service.js';
import type { GrandPrix, Session, DriverStanding, ConstructorStanding, ChampionshipBattle } from '../types.js';

// GraphQL enum mappings
const weekendFormatToEnum: Record<string, string> = {
  standard: 'STANDARD',
  sprint: 'SPRINT',
};

const grandPrixStatusToEnum: Record<string, string> = {
  upcoming: 'UPCOMING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

const sessionTypeToEnum: Record<string, string> = {
  FP1: 'FP1',
  FP2: 'FP2',
  FP3: 'FP3',
  qualifying: 'QUALIFYING',
  sprint_shootout: 'SPRINT_SHOOTOUT',
  sprint: 'SPRINT',
  race: 'RACE',
};

const sessionStatusToEnum: Record<string, string> = {
  scheduled: 'SCHEDULED',
  live: 'LIVE',
  completed: 'COMPLETED',
  delayed: 'DELAYED',
  cancelled: 'CANCELLED',
  red_flagged: 'RED_FLAGGED',
};

const circuitTypeToEnum: Record<string, string> = {
  permanent: 'PERMANENT',
  street: 'STREET',
  semi_permanent: 'SEMI_PERMANENT',
};

// Enum to internal mappings
const enumToWeekendFormat: Record<string, string> = {
  STANDARD: 'standard',
  SPRINT: 'sprint',
};

const enumToGrandPrixStatus: Record<string, string> = {
  UPCOMING: 'upcoming',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Transform Grand Prix to GraphQL response
 */
function transformGrandPrixToGraphQL(gp: GrandPrix) {
  return {
    ...gp,
    format: weekendFormatToEnum[gp.format],
    status: grandPrixStatusToEnum[gp.status],
    startDate: gp.startDate instanceof Date ? gp.startDate.toISOString() : gp.startDate,
    endDate: gp.endDate instanceof Date ? gp.endDate.toISOString() : gp.endDate,
    circuit: {
      ...gp.circuit,
      type: circuitTypeToEnum[gp.circuit.type],
    },
    sessions: gp.sessions.map(transformSessionToGraphQL),
  };
}

/**
 * Transform Session to GraphQL response
 */
function transformSessionToGraphQL(session: Session & { grandPrixName?: string }) {
  return {
    ...session,
    type: sessionTypeToEnum[session.type],
    status: sessionStatusToEnum[session.status],
    date: session.date instanceof Date ? session.date.toISOString() : session.date,
  };
}

/**
 * Transform Driver Standing to GraphQL response
 */
function transformDriverStandingToGraphQL(standing: DriverStanding) {
  return {
    ...standing,
  };
}

/**
 * Transform Constructor Standing to GraphQL response
 */
function transformConstructorStandingToGraphQL(standing: ConstructorStanding) {
  return {
    ...standing,
  };
}

/**
 * Transform Championship Battle to GraphQL response
 */
function transformChampionshipBattleToGraphQL(battle: ChampionshipBattle) {
  return {
    ...battle,
    drivers: {
      ...battle.drivers,
      leader: transformDriverStandingToGraphQL(battle.drivers.leader),
      challengers: battle.drivers.challengers.map(transformDriverStandingToGraphQL),
      eliminated: battle.drivers.eliminated.map(transformDriverStandingToGraphQL),
    },
    constructors: {
      ...battle.constructors,
      leader: transformConstructorStandingToGraphQL(battle.constructors.leader),
      challengers: battle.constructors.challengers.map(transformConstructorStandingToGraphQL),
      eliminated: battle.constructors.eliminated.map(transformConstructorStandingToGraphQL),
    },
  };
}

/**
 * Query resolvers
 */
export const f1Resolvers = {
  Query: {
    /**
     * Get F1 calendar for a season
     */
    f1Calendar: async (
      _parent: unknown,
      args: {
        season?: number;
        status?: string;
        format?: string;
        country?: string;
      }
    ) => {
      const filters = {
        season: args.season,
        status: args.status ? enumToGrandPrixStatus[args.status] as 'upcoming' | 'in_progress' | 'completed' : undefined,
        format: args.format ? enumToWeekendFormat[args.format] as 'standard' | 'sprint' : undefined,
        country: args.country,
      };

      const calendar = await f1Service.getCalendar(filters);
      return calendar.map(transformGrandPrixToGraphQL);
    },

    /**
     * Get a single Grand Prix by ID
     */
    f1GrandPrix: async (_parent: unknown, args: { id: string }) => {
      const gp = await f1Service.getGrandPrix(args.id);
      return gp ? transformGrandPrixToGraphQL(gp) : null;
    },

    /**
     * Get upcoming sessions
     */
    f1UpcomingSessions: async (_parent: unknown, args: { limit?: number }) => {
      const sessions = await f1Service.getUpcomingSessions(args.limit ?? 10);
      return sessions.map(transformSessionToGraphQL);
    },

    /**
     * Get next race
     */
    f1NextRace: async () => {
      const calendar = await f1Service.getCalendar({ status: 'upcoming' });
      if (calendar.length === 0) return null;

      // Sort by date and get first
      calendar.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      return transformGrandPrixToGraphQL(calendar[0]);
    },

    /**
     * Get driver standings
     */
    f1DriverStandings: async (_parent: unknown, args: { season?: number; round?: number }) => {
      const standings = await f1Service.getDriverStandings({
        season: args.season,
        round: args.round,
      });
      return standings.map(transformDriverStandingToGraphQL);
    },

    /**
     * Get constructor standings
     */
    f1ConstructorStandings: async (_parent: unknown, args: { season?: number; round?: number }) => {
      const standings = await f1Service.getConstructorStandings({
        season: args.season,
        round: args.round,
      });
      return standings.map(transformConstructorStandingToGraphQL);
    },

    /**
     * Get championship battle analysis
     */
    f1ChampionshipBattle: async (_parent: unknown, args: { season?: number }) => {
      const battle = await f1Service.getChampionshipBattle(args.season);
      return transformChampionshipBattleToGraphQL(battle);
    },

    /**
     * Get sprint weekends only
     */
    f1SprintWeekends: async (_parent: unknown, args: { season?: number }) => {
      const calendar = await f1Service.getCalendar({
        season: args.season,
        format: 'sprint',
      });
      return calendar.map(transformGrandPrixToGraphQL);
    },

    /**
     * Get most exciting upcoming races
     */
    f1MustWatchRaces: async (_parent: unknown, args: { limit?: number }) => {
      const calendar = await f1Service.getCalendar({ status: 'upcoming' });

      // Sort by excitement score
      const sorted = calendar
        .filter((gp) => gp.predictedExcitement)
        .sort((a, b) => (b.predictedExcitement?.score ?? 0) - (a.predictedExcitement?.score ?? 0));

      const limited = args.limit ? sorted.slice(0, args.limit) : sorted;
      return limited.map(transformGrandPrixToGraphQL);
    },
  },

  /**
   * Field resolvers for F1GrandPrix
   */
  F1GrandPrix: {
    sessions: (parent: { sessions?: unknown[] }) => {
      return parent.sessions || [];
    },
  },
};
