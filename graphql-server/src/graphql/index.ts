import { teamsStandings } from './resolvers/queryResolvers.js';
import { typeDefs } from './schemas/querySchema.js';

// Merge all resolvers from registered sports
export const resolvers = {
  Query: {
    ...teamsStandings.Query,
  },
  // Type-specific resolvers
  Team: teamsStandings.Team,
  TennisRanking: teamsStandings.TennisRanking,
  TennisMatch: teamsStandings.TennisMatch,
};

export const schema = typeDefs;
