/**
 * Cycling GraphQL Resolvers
 *
 * Resolvers for cycling race and stage queries.
 */

import { scheduleService } from '../services/ScheduleService.js';
import type { CyclingRace, CyclingStage, RaceCategory, Gender, StageType } from '../types.js';

// GraphQL enum to internal type mappings
const raceCategoryMap: Record<string, RaceCategory> = {
  GRAND_TOUR: 'grand_tour',
  MONUMENT: 'monument',
  WORLD_TOUR: 'world_tour',
  PRO_SERIES: 'pro_series',
};

const genderMap: Record<string, Gender> = {
  MEN: 'men',
  WOMEN: 'women',
};

const stageTypeMap: Record<string, StageType> = {
  FLAT: 'flat',
  HILLY: 'hilly',
  MOUNTAIN: 'mountain',
  ITT: 'itt',
  TTT: 'ttt',
  PROLOGUE: 'prologue',
};

// Internal to GraphQL enum mappings
const categoryToEnum: Record<RaceCategory, string> = {
  grand_tour: 'GRAND_TOUR',
  monument: 'MONUMENT',
  world_tour: 'WORLD_TOUR',
  pro_series: 'PRO_SERIES',
};

const genderToEnum: Record<Gender, string> = {
  men: 'MEN',
  women: 'WOMEN',
};

const stageTypeToEnum: Record<StageType, string> = {
  flat: 'FLAT',
  hilly: 'HILLY',
  mountain: 'MOUNTAIN',
  itt: 'ITT',
  ttt: 'TTT',
  prologue: 'PROLOGUE',
};

const statusToEnum: Record<string, string> = {
  upcoming: 'UPCOMING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  live: 'LIVE',
  rest_day: 'REST_DAY',
};

/**
 * Transform internal race to GraphQL response
 */
function transformRaceToGraphQL(race: CyclingRace) {
  return {
    ...race,
    category: categoryToEnum[race.category],
    gender: genderToEnum[race.gender],
    status: statusToEnum[race.status],
    startDate: race.startDate instanceof Date ? race.startDate.toISOString() : race.startDate,
    endDate: race.endDate instanceof Date ? race.endDate.toISOString() : race.endDate,
    stages: race.stages?.map(transformStageToGraphQL),
  };
}

/**
 * Transform internal stage to GraphQL response
 */
function transformStageToGraphQL(stage: CyclingStage) {
  return {
    ...stage,
    stageType: stageTypeToEnum[stage.stageType],
    status: statusToEnum[stage.status],
    date: stage.date instanceof Date ? stage.date.toISOString() : stage.date,
  };
}

/**
 * Query resolvers
 */
export const cyclingResolvers = {
  Query: {
    /**
     * Get cycling races with optional filters
     */
    cyclingRaces: async (
      _parent: unknown,
      args: {
        year?: number;
        category?: string;
        gender?: string;
        country?: string;
        status?: string;
      }
    ) => {
      const filters = {
        year: args.year,
        category: args.category ? raceCategoryMap[args.category] : undefined,
        gender: args.gender ? genderMap[args.gender] : undefined,
        country: args.country,
        status: args.status?.toLowerCase() as 'upcoming' | 'in_progress' | 'completed' | undefined,
      };

      const races = await scheduleService.getRaces(filters);
      return races.map(transformRaceToGraphQL);
    },

    /**
     * Get a single cycling race by ID
     */
    cyclingRace: async (_parent: unknown, args: { id: string }) => {
      const race = await scheduleService.getRace(args.id);
      return race ? transformRaceToGraphQL(race) : null;
    },

    /**
     * Get upcoming cycling stages across all races
     */
    upcomingCyclingStages: async (
      _parent: unknown,
      args: {
        limit?: number;
        minExcitement?: number;
        stageType?: string;
      }
    ) => {
      const filters = {
        stageType: args.stageType ? stageTypeMap[args.stageType] : undefined,
        minExcitement: args.minExcitement,
      };

      const stages = await scheduleService.getUpcomingStages(filters);
      const limitedStages = args.limit ? stages.slice(0, args.limit) : stages;
      return limitedStages.map(transformStageToGraphQL);
    },

    /**
     * Get stages for a specific race
     */
    cyclingStages: async (
      _parent: unknown,
      args: {
        raceId: string;
        stageType?: string;
      }
    ) => {
      const filters = {
        raceId: args.raceId,
        stageType: args.stageType ? stageTypeMap[args.stageType] : undefined,
      };

      const stages = await scheduleService.getStages(filters);
      return stages.map(transformStageToGraphQL);
    },

    /**
     * Get a single stage by ID
     */
    cyclingStage: async (_parent: unknown, args: { id: string }) => {
      // Stage ID format: RACECODE-S#
      const match = args.id.match(/^(.+)-S(\d+)$/);
      if (!match) return null;

      const [, raceId] = match;
      const stages = await scheduleService.getStages({ raceId });
      const stage = stages.find((s) => s.id === args.id);
      return stage ? transformStageToGraphQL(stage) : null;
    },

    /**
     * Get grand tours only
     */
    grandTours: async (
      _parent: unknown,
      args: { year?: number; gender?: string }
    ) => {
      const filters = {
        year: args.year,
        category: 'grand_tour' as RaceCategory,
        gender: args.gender ? genderMap[args.gender] : undefined,
      };

      const races = await scheduleService.getRaces(filters);
      return races.map(transformRaceToGraphQL);
    },

    /**
     * Get monuments only
     */
    monuments: async (
      _parent: unknown,
      args: { year?: number; gender?: string }
    ) => {
      const filters = {
        year: args.year,
        category: 'monument' as RaceCategory,
        gender: args.gender ? genderMap[args.gender] : undefined,
      };

      const races = await scheduleService.getRaces(filters);
      return races.map(transformRaceToGraphQL);
    },

    /**
     * Get most exciting upcoming stages
     */
    mustWatchStages: async (_parent: unknown, args: { limit?: number }) => {
      const stages = await scheduleService.getUpcomingStages({});

      // Filter for stages with high excitement
      const excitingStages = stages
        .filter((s) => s.predictedExcitement && s.predictedExcitement.score >= 60)
        .sort((a, b) => {
          const scoreA = a.predictedExcitement?.score ?? 0;
          const scoreB = b.predictedExcitement?.score ?? 0;
          return scoreB - scoreA;
        });

      const limitedStages = args.limit ? excitingStages.slice(0, args.limit) : excitingStages;
      return limitedStages.map(transformStageToGraphQL);
    },
  },

  /**
   * Field resolvers for CyclingRace
   */
  CyclingRace: {
    stages: async (parent: { id: string; stages?: unknown[] }) => {
      // If stages are already loaded, return them
      if (parent.stages && parent.stages.length > 0) {
        return parent.stages;
      }

      // Otherwise fetch stages
      const stages = await scheduleService.getStages({ raceId: parent.id });
      return stages.map(transformStageToGraphQL);
    },
  },

  /**
   * Field resolvers for CyclingStage
   */
  CyclingStage: {
    race: async (parent: { raceId: string }) => {
      const race = await scheduleService.getRace(parent.raceId);
      return race ? transformRaceToGraphQL(race) : null;
    },
  },
};
