/**
 * Main GraphQL resolvers - delegates to sport-specific resolvers
 */

import { sportRegistry } from '../../sports/index.js';
import { logger } from '../../utils/logger.js';

// Get merged resolvers from all registered sports
export const teamsStandings = sportRegistry.getMergedResolvers();

logger.info({ 
  registeredSports: sportRegistry.getRegisteredSports(),
  queryResolvers: Object.keys(teamsStandings.Query || {}).length 
}, 'Loaded GraphQL resolvers from sports registry');
