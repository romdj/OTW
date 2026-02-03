import { teamsStandings } from './resolvers/queryResolvers.js';
import { typeDefs } from './schemas/querySchema.js';
import { priorityResolvers } from '../prioritization/index.js';
import { cyclingResolvers } from '../sports/racing/cycling/index.js';

// Merge all resolvers from registered sports and modules
export const resolvers = {
  Query: {
    ...teamsStandings.Query,
    ...priorityResolvers.Query,
    ...cyclingResolvers.Query,
  },
  Mutation: {
    ...priorityResolvers.Mutation,
  },
  // Type-specific resolvers
  Team: teamsStandings.Team,
  TennisRanking: teamsStandings.TennisRanking,
  TennisMatch: teamsStandings.TennisMatch,
  // Prioritization type resolvers
  PrioritizedEventList: priorityResolvers.PrioritizedEventList,
  EventPriority: priorityResolvers.EventPriority,
  EventTag: priorityResolvers.EventTag,
  UserPreferences: priorityResolvers.UserPreferences,
  PriorityReason: priorityResolvers.PriorityReason,
  // Cycling type resolvers
  CyclingRace: cyclingResolvers.CyclingRace,
  CyclingStage: cyclingResolvers.CyclingStage,
};

export const schema = typeDefs;
