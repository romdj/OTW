/**
 * User Preferences - Personalization Model
 *
 * Captures what users care about to enable personalized event prioritization.
 * This includes teams they follow, sports they prefer, and what emotional
 * experiences they value most in sporting events.
 */

/**
 * A team, player, or league that a user follows
 */
export interface UserFollow {
  /** Unique identifier for the followed entity */
  id: string;
  /** Type of entity being followed */
  type: 'team' | 'player' | 'league' | 'competition';
  /** Display name */
  name: string;
  /** Sport this entity belongs to */
  sport: string;
  /** League/competition context */
  league?: string;
  /** How strongly the user follows this (1-5) */
  followStrength: FollowStrength;
  /** When the user started following */
  followedSince?: Date;
}

/**
 * Strength of user's connection to a followed entity
 */
export type FollowStrength =
  | 1  // Casual interest
  | 2  // Regular follower
  | 3  // Dedicated fan
  | 4  // Die-hard supporter
  | 5; // Obsessed (never miss a game)

/**
 * User's familiarity and engagement with a sport
 */
export interface SportFamiliarity {
  /** Sport identifier */
  sport: string;
  /** How well the user understands the sport */
  comprehensionLevel: ComprehensionLevel;
  /** How often they watch this sport */
  watchFrequency: WatchFrequency;
  /** Preferred leagues/competitions within this sport */
  preferredLeagues: string[];
}

/**
 * How well a user understands a sport's rules and nuances
 */
export type ComprehensionLevel =
  | 'novice'      // Knows basic rules
  | 'casual'      // Understands gameplay, misses nuances
  | 'informed'    // Gets most strategies and context
  | 'expert';     // Deep understanding of tactics/history

/**
 * How often a user watches a particular sport
 */
export type WatchFrequency =
  | 'rarely'      // Only major events
  | 'occasionally'// A few times per month
  | 'regularly'   // Weekly
  | 'frequently'; // Multiple times per week

/**
 * What emotional experiences the user values in sporting events
 */
export interface EmotionalPreferences {
  /** Love nail-biters and close finishes */
  nailBiters: PreferenceLevel;
  /** Love dominant performances and masterclasses */
  dominance: PreferenceLevel;
  /** Love upsets and underdog stories */
  upsets: PreferenceLevel;
  /** Love historic moments and records */
  historicMoments: PreferenceLevel;
  /** Love pure skill and athleticism displays */
  skillDisplay: PreferenceLevel;
  /** Love physical/intense contests */
  intensity: PreferenceLevel;
  /** Love drama and storylines */
  drama: PreferenceLevel;
}

/**
 * How much a user values a particular type of experience
 */
export type PreferenceLevel =
  | 0  // Don't care / actively avoid
  | 1  // Slight preference
  | 2  // Moderate preference
  | 3  // Strong preference
  | 4  // Love it
  | 5; // Must-have

/**
 * Default emotional preferences for new users
 */
export const DEFAULT_EMOTIONAL_PREFERENCES: EmotionalPreferences = {
  nailBiters: 3,
  dominance: 2,
  upsets: 3,
  historicMoments: 4,
  skillDisplay: 3,
  intensity: 2,
  drama: 3,
};

/**
 * User's viewing context and constraints
 */
export interface ViewingContext {
  /** How much time the user has available */
  availableTime?: number; // in minutes
  /** Current mood/what they're looking for */
  currentMood?: ViewingMood;
  /** Spoiler tolerance for this session */
  spoilerTolerance: SpoilerTolerance;
  /** Events already watched (to filter out) */
  alreadyWatched: string[];
}

/**
 * What mood the user is in for watching sports
 */
export type ViewingMood =
  | 'casual'       // Background viewing, not deeply invested
  | 'engaged'      // Want to pay attention, be entertained
  | 'intense'      // Want edge-of-seat experience
  | 'discovery';   // Open to new sports/teams

/**
 * User's tolerance for spoilers
 */
export type SpoilerTolerance =
  | 'none'         // Absolute spoiler-free
  | 'mild'         // Can know game was "exciting" but no results
  | 'moderate'     // Can know outcome, not details
  | 'full';        // Spoil away

/**
 * Complete user preferences model
 */
export interface UserPreferences {
  /** Unique user identifier */
  userId: string;
  /** Teams, players, leagues the user follows */
  follows: UserFollow[];
  /** Sport familiarity levels */
  sportFamiliarity: SportFamiliarity[];
  /** Emotional experience preferences */
  emotionalPreferences: EmotionalPreferences;
  /** Current viewing context (optional, session-specific) */
  viewingContext?: ViewingContext;
  /** When preferences were last updated */
  lastUpdated: Date;
}

/**
 * Input for creating or updating user preferences
 */
export interface UserPreferencesInput {
  follows?: Omit<UserFollow, 'followedSince'>[];
  sportFamiliarity?: SportFamiliarity[];
  emotionalPreferences?: Partial<EmotionalPreferences>;
  viewingContext?: Partial<ViewingContext>;
}

/**
 * Calculate relevance score for a user's connection to an event
 * based on their follows
 */
export function calculateFollowRelevance(
  follows: UserFollow[],
  eventTeams: string[],
  eventLeague: string,
  eventSport: string
): number {
  let relevance = 0;

  for (const follow of follows) {
    // Direct team match
    if (follow.type === 'team' && eventTeams.includes(follow.id)) {
      relevance += follow.followStrength * 20; // 20-100 points
    }
    // League match
    else if (follow.type === 'league' && follow.id === eventLeague) {
      relevance += follow.followStrength * 10; // 10-50 points
    }
    // Sport match (weakest connection)
    else if (follow.sport === eventSport) {
      relevance += follow.followStrength * 2; // 2-10 points
    }
  }

  return Math.min(100, relevance);
}

/**
 * Get the user's comprehension level for a given sport
 */
export function getSportComprehension(
  familiarity: SportFamiliarity[],
  sport: string
): ComprehensionLevel {
  const sportFam = familiarity.find(f => f.sport === sport);
  return sportFam?.comprehensionLevel ?? 'novice';
}
