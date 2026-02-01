/**
 * Prioritization Types - Public Exports
 *
 * Core type definitions for the OTW Event Prioritization Engine.
 */

// Emotional Factors
export type {
  EmotionalProfile,
  SuspenseFactors,
  StakesFactors,
  VolatilityFactors,
  UnderdogFactors,
  TranscendenceFactors,
  EmotionalAnalysisInput,
  EmotionalAnalysisResult,
  EmotionalMoment,
  EmotionalMomentType,
  EmotionalIntensity,
} from './emotional-factors.js';

export {
  EMOTIONAL_THRESHOLDS,
  getEmotionalIntensity,
  getDominantFactor,
} from './emotional-factors.js';

// User Preferences
export type {
  UserFollow,
  FollowStrength,
  SportFamiliarity,
  ComprehensionLevel,
  WatchFrequency,
  EmotionalPreferences,
  PreferenceLevel,
  ViewingContext,
  ViewingMood,
  SpoilerTolerance,
  UserPreferences,
  UserPreferencesInput,
} from './user-preferences.js';

export {
  DEFAULT_EMOTIONAL_PREFERENCES,
  calculateFollowRelevance,
  getSportComprehension,
} from './user-preferences.js';

// Event Priority
export type {
  PriorityTier,
  SpoilerLevel,
  EventTag,
  TagCategory,
  TagSource,
  PriorityReason,
  PriorityReasonType,
  EventPriority,
  PriorityScoreBreakdown,
  PriorityCalculationInput,
  PrioritizedEventList,
  PriorityFilters,
  PriorityListSummary,
} from './event-priority.js';

export {
  PRIORITY_TIER_THRESHOLDS,
  getPriorityTier,
  createDefaultPriority,
} from './event-priority.js';
