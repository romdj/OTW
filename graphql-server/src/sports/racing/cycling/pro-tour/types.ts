/**
 * Pro Cycling - TypeScript Types
 *
 * Types for UCI WorldTour professional road cycling schedule integration.
 * Includes GC movement tracking for grand tour excitement scoring.
 */

// Race categories
export type RaceCategory = 'grand_tour' | 'monument' | 'world_tour' | 'pro_series';

// Stage types for classification
export type StageType = 'flat' | 'hilly' | 'mountain' | 'itt' | 'ttt' | 'prologue';

// Gender classification
export type Gender = 'men' | 'women';

// Race status
export type RaceStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

// Stage status
export type StageStatus = 'upcoming' | 'live' | 'completed' | 'cancelled' | 'rest_day';

/**
 * General Classification (GC) Standing
 * Represents a rider's position in the overall standings
 */
export interface GCStanding {
  position: number;
  riderId: string;
  riderName: string;
  teamId: string;
  teamName: string;
  totalTime: number; // milliseconds from leader
  timeGap: string; // formatted gap e.g., "+2:45"
}

/**
 * GC Movement - Tracks changes between stages
 * Critical for identifying exciting grand tour stages
 */
export interface GCMovement {
  /** Did the race leader (yellow/pink/red jersey) change? */
  leaderChanged: boolean;

  /** Previous leader name (if changed) */
  previousLeader?: string;

  /** New leader name (if changed) */
  newLeader?: string;

  /** Number of position changes in the top 10 */
  top10Changes: number;

  /** Number of position changes in the top 20 */
  top20Changes: number;

  /** Biggest position gain (e.g., 15th to 8th = 7) */
  biggestGain: {
    riderName: string;
    positionsBefore: number;
    positionsAfter: number;
    positionsGained: number;
  } | null;

  /** Biggest position loss */
  biggestLoss: {
    riderName: string;
    positionsBefore: number;
    positionsAfter: number;
    positionsLost: number;
  } | null;

  /** Did time gaps between GC contenders change significantly (>30s)? */
  significantTimeGapsChanged: boolean;

  /** Detailed time changes for top contenders */
  timeChanges: Array<{
    riderName: string;
    previousGap: string;
    newGap: string;
    timeLost: number; // seconds, negative = gained time
  }>;

  /** GC standings after this stage */
  standingsAfter: GCStanding[];
}

/**
 * Community Rating for a stage
 * Aggregated user ratings indicating how exciting a stage was
 */
export interface CommunityRating {
  /** Overall excitement score (0-100) */
  excitementScore: number;

  /** Total number of user ratings */
  totalRatings: number;

  /** Distribution of ratings */
  distribution: {
    mustWatch: number; // 5 stars
    exciting: number; // 4 stars
    decent: number; // 3 stars
    skipable: number; // 2 stars
    boring: number; // 1 star
  };

  /** User-submitted emotional tags */
  tags: string[];

  /** Timestamp of last rating */
  lastRatedAt?: Date;
}

/**
 * Cycling Stage - Child of a multi-day race
 * e.g., Stage 17: Col du Galibier
 */
export interface CyclingStage {
  id: string;
  raceId: string;
  stageNumber: number;
  name: string;

  /** Stage date */
  date: Date;

  /** Scheduled start time (ISO format or HH:mm) */
  startTime?: string;

  /** Start location/city */
  startLocation: string;

  /** Finish location/city */
  finishLocation: string;

  /** Stage distance in kilometers */
  distance: number;

  /** Elevation gain in meters */
  elevationGain?: number;

  /** Stage classification */
  stageType: StageType;

  /** Current status */
  status: StageStatus;

  /** Categorized climbs in the stage */
  climbs?: Array<{
    name: string;
    category: 'HC' | '1' | '2' | '3' | '4';
    altitude: number;
    length: number;
    averageGradient: number;
    distanceFromStart: number;
  }>;

  /** Sprint points locations */
  sprints?: Array<{
    location: string;
    distanceFromStart: number;
  }>;

  /** Stage winner (after completion) */
  winner?: {
    riderId: string;
    riderName: string;
    teamName: string;
    finishTime?: string;
  };

  /**
   * GC Movement - Changes in overall standings after this stage
   * This is THE key excitement indicator for grand tours
   */
  gcMovement?: GCMovement;

  /** Community ratings (Phase 2) */
  communityRating?: CommunityRating;

  /** Generated excitement score based on stage characteristics and GC movement */
  predictedExcitement?: {
    score: number; // 0-100
    factors: {
      terrain: number; // Mountain stages score higher
      gcImportance: number; // Late grand tour stages
      gcMovement: number; // Actual GC changes (post-stage)
      finaleProfile: number; // Summit finish vs flat
      historicLocation: number; // Famous climbs
    };
  };
}

/**
 * Cycling Race - Parent entity
 * e.g., Tour de France 2025
 */
export interface CyclingRace {
  id: string;
  name: string;
  slug: string;

  /** Race category */
  category: RaceCategory;

  /** Men's or women's race */
  gender: Gender;

  /** Race start date */
  startDate: Date;

  /** Race end date */
  endDate: Date;

  /** Primary country (can span multiple) */
  country: string;

  /** Countries visited (for multi-country races) */
  countries?: string[];

  /** Total race distance in kilometers */
  totalDistance?: number;

  /** Total number of stages */
  totalStages?: number;

  /** Total elevation gain */
  totalElevation?: number;

  /** Current race status */
  status: RaceStatus;

  /** Stages (tree structure for multi-day races) */
  stages?: CyclingStage[];

  /** UCI race code */
  uciCode?: string;

  /** Race website */
  website?: string;

  /** Current GC standings (for in-progress races) */
  currentGC?: GCStanding[];

  /** Points classification leader (green jersey etc) */
  pointsLeader?: {
    riderId: string;
    riderName: string;
    teamName: string;
    points: number;
  };

  /** Mountains classification leader (polka dot jersey etc) */
  mountainsLeader?: {
    riderId: string;
    riderName: string;
    teamName: string;
    points: number;
  };

  /** Young rider classification leader */
  youthLeader?: {
    riderId: string;
    riderName: string;
    teamName: string;
    totalTime: number;
  };

  /** Overall excitement metrics for the race */
  overallExcitement?: {
    averageStageExcitement: number;
    mostExcitingStages: string[]; // stage IDs
    gcDramaScore: number; // Based on leader changes, close gaps
    totalLeaderChanges: number;
  };
}

/**
 * Query filters for races
 */
export interface RaceFilters {
  year?: number;
  category?: RaceCategory;
  gender?: Gender;
  country?: string;
  status?: RaceStatus;
}

/**
 * Query filters for stages
 */
export interface StageFilters {
  raceId?: string;
  stageType?: StageType;
  status?: StageStatus;
  fromDate?: Date;
  toDate?: Date;
  minExcitement?: number;
}

/**
 * Helper type for excitement calculation
 */
export interface ExcitementFactors {
  /** Base terrain excitement (mountain > hilly > flat) */
  terrain: number;

  /** Position in race (final week more important) */
  racePosition: number;

  /** GC movement after stage */
  gcMovement: number;

  /** Finale profile (summit finish, steep finale) */
  finale: number;

  /** Historic climb or location */
  heritage: number;

  /** Weather conditions */
  weather: number;

  /** Community rating */
  community: number;
}

/**
 * Calculate excitement score from factors
 */
export function calculateExcitementScore(factors: Partial<ExcitementFactors>): number {
  const weights = {
    terrain: 0.15,
    racePosition: 0.1,
    gcMovement: 0.35, // GC movement is most important
    finale: 0.15,
    heritage: 0.1,
    weather: 0.05,
    community: 0.1,
  };

  let score = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const value = factors[key as keyof ExcitementFactors];
    if (value !== undefined) {
      score += value * weight;
      totalWeight += weight;
    }
  }

  // Normalize if not all factors present
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) / 100 : 0;
}

/**
 * Determine if GC movement indicates an exciting stage
 */
export function isExcitingGCMovement(movement: GCMovement): boolean {
  return (
    movement.leaderChanged ||
    movement.top10Changes >= 3 ||
    movement.significantTimeGapsChanged ||
    (movement.biggestGain?.positionsGained ?? 0) >= 5
  );
}

// Type exports for external use
export type {
  RaceCategory as CyclingRaceCategory,
  StageType as CyclingStageType,
  Gender as CyclingGender,
};
