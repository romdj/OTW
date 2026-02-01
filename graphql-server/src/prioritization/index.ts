/**
 * Prioritization Module - Public Exports
 *
 * The OTW Event Prioritization Engine - providing personalized
 * event recommendations based on emotional factors and user preferences.
 */

// Types
export * from './types/index.js';

// Services
export {
  EmotionalAnalyzer,
  emotionalAnalyzer,
  PriorityCalculator,
  priorityCalculator,
  TagService,
  tagService,
} from './services/index.js';

export type {
  UserTagInput,
  CuratorVerificationInput,
  AggregatedTags,
} from './services/index.js';

// Resolvers
export { priorityResolvers } from './resolvers/priorityResolvers.js';
