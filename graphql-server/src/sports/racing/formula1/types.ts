/**
 * Formula 1 - TypeScript Types
 *
 * Types for F1 race calendar and championship tracking.
 * Includes championship battle calculations for excitement scoring.
 */

// Session types within a Grand Prix weekend
export type SessionType = 'FP1' | 'FP2' | 'FP3' | 'qualifying' | 'sprint_shootout' | 'sprint' | 'race';

// Weekend format
export type WeekendFormat = 'standard' | 'sprint';

// Grand Prix status
export type GrandPrixStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

// Session status
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'delayed' | 'cancelled' | 'red_flagged';

// Circuit type
export type CircuitType = 'permanent' | 'street' | 'semi_permanent';

// Tire compound
export type TireCompound = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';

/**
 * Circuit information
 */
export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  length: number; // km
  turns: number;
  lapRecord?: {
    time: string;
    driver: string;
    year: number;
  };
  type: CircuitType;
  drsZones: number;
  characteristics: {
    overtakingDifficulty: 'easy' | 'moderate' | 'difficult' | 'very_difficult';
    weatherVariability: 'low' | 'medium' | 'high';
    tireWear: 'low' | 'medium' | 'high';
    safetyCarLikelihood: 'low' | 'medium' | 'high';
  };
}

/**
 * Session within a Grand Prix weekend
 */
export interface Session {
  id: string;
  grandPrixId: string;
  type: SessionType;
  name: string;
  date: Date;
  startTime: string; // Local time
  startTimeUTC: string;
  duration?: number; // minutes (for practice/quali) or laps (for race)
  status: SessionStatus;
  results?: SessionResult[];
  weather?: WeatherConditions;
}

/**
 * Weather conditions for a session
 */
export interface WeatherConditions {
  airTemp: number; // Celsius
  trackTemp: number;
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: string;
  rainfall: boolean;
  conditions: 'dry' | 'damp' | 'wet' | 'mixed';
}

/**
 * Result for a driver in a session
 */
export interface SessionResult {
  position: number;
  driverId: string;
  driverName: string;
  driverNumber: number;
  constructorId: string;
  constructorName: string;
  time?: string; // For qualifying/race
  gap?: string; // Gap to leader
  laps?: number;
  points: number;
  status: 'finished' | 'dnf' | 'dsq' | 'dns' | 'nc';
  fastestLap?: boolean;
  fastestLapTime?: string;
  gridPosition?: number;
  positionsGained?: number;
  pitStops?: number;
}

/**
 * Grand Prix - A race weekend
 */
export interface GrandPrix {
  id: string;
  name: string;
  officialName: string;
  slug: string;
  round: number;
  season: number;
  circuit: Circuit;
  format: WeekendFormat;
  startDate: Date;
  endDate: Date;
  status: GrandPrixStatus;
  sessions: Session[];

  // Tire allocation for the weekend
  tireCompounds?: {
    soft: string; // e.g., 'C4'
    medium: string; // e.g., 'C3'
    hard: string; // e.g., 'C2'
  };

  // Championship context at this race
  championshipContext?: {
    driversLeader: string;
    constructorsLeader: string;
    titleDecider: boolean; // Can championship be won this race?
    pointsGapToSecond: number;
  };

  // Predicted excitement factors
  predictedExcitement?: RaceExcitement;
}

/**
 * Race excitement prediction
 */
export interface RaceExcitement {
  score: number; // 0-100
  factors: {
    /** Track characteristics (overtaking potential) */
    trackFactor: number;
    /** Weather unpredictability */
    weatherFactor: number;
    /** Championship implications */
    titleFactor: number;
    /** Historic race (Monaco, Monza, etc.) */
    prestigeFactor: number;
    /** Grid position drama (penalties, quali chaos) */
    gridFactor: number;
  };
  tags: string[];
}

/**
 * Driver in the championship
 */
export interface Driver {
  id: string;
  number: number;
  code: string; // e.g., 'VER', 'HAM'
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  nationalityCode: string;
  dateOfBirth?: string;
  constructorId: string;
  constructorName: string;
}

/**
 * Constructor (team) in the championship
 */
export interface Constructor {
  id: string;
  name: string;
  fullName: string;
  nationality: string;
  nationalityCode: string;
  base: string;
  powerUnit: string;
  drivers: string[]; // driver IDs
}

/**
 * Driver championship standing
 */
export interface DriverStanding {
  position: number;
  driver: Driver;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  dnfs: number;
  pointsToLeader: number;
  pointsToNext: number;
  theoreticalMaxPoints: number;
  canWinTitle: boolean;
}

/**
 * Constructor championship standing
 */
export interface ConstructorStanding {
  position: number;
  constructor: Constructor;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  oneTwo: number; // 1-2 finishes
  pointsToLeader: number;
  pointsToNext: number;
  theoreticalMaxPoints: number;
  canWinTitle: boolean;
}

/**
 * Championship battle - tracks the title fight
 * Key excitement indicator for F1
 */
export interface ChampionshipBattle {
  /** Season year */
  season: number;

  /** Races remaining */
  racesRemaining: number;

  /** Maximum points still available */
  maxPointsAvailable: number;

  /** Is the championship still mathematically open? */
  isOpen: boolean;

  /** Earliest round title can be decided */
  earliestDecider?: number;

  /** Drivers championship battle */
  drivers: {
    leader: DriverStanding;
    challengers: DriverStanding[]; // Those who can still win
    eliminated: DriverStanding[]; // Mathematically out
    gap: number; // Points between 1st and 2nd
    closenessScore: number; // 0-100, how close the battle is
  };

  /** Constructors championship battle */
  constructors: {
    leader: ConstructorStanding;
    challengers: ConstructorStanding[];
    eliminated: ConstructorStanding[];
    gap: number;
    closenessScore: number;
  };

  /** Key storylines for the championship */
  narratives: string[];
}

/**
 * Query filters for Grand Prix
 */
export interface GrandPrixFilters {
  season?: number;
  status?: GrandPrixStatus;
  format?: WeekendFormat;
  country?: string;
}

/**
 * Query filters for standings
 */
export interface StandingsFilters {
  season?: number;
  round?: number; // Get standings after specific round
}

/**
 * Calculate points for a race finish position
 */
export function getPointsForPosition(position: number, isSprint: boolean = false): number {
  if (isSprint) {
    const sprintPoints: Record<number, number> = {
      1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1,
    };
    return sprintPoints[position] || 0;
  }

  const racePoints: Record<number, number> = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1,
  };
  return racePoints[position] || 0;
}

/**
 * Calculate maximum possible points for remaining races
 */
export function calculateMaxPoints(racesRemaining: number, sprintsRemaining: number = 0): number {
  // Max per race: 25 (win) + 1 (fastest lap) = 26
  // Max per sprint: 8
  return (racesRemaining * 26) + (sprintsRemaining * 8);
}

/**
 * Determine if a driver can still win the championship
 */
export function canStillWinChampionship(
  currentPoints: number,
  leaderPoints: number,
  maxPointsAvailable: number
): boolean {
  return currentPoints + maxPointsAvailable >= leaderPoints;
}

/**
 * Calculate championship closeness score
 * Higher = closer battle = more exciting
 */
export function calculateClosenessScore(
  gap: number,
  maxPointsAvailable: number,
  numContenders: number
): number {
  if (maxPointsAvailable === 0) return 0;

  // Gap as percentage of remaining points
  const gapPercent = gap / maxPointsAvailable;

  // More contenders = more exciting
  const contenderBonus = Math.min(numContenders * 10, 30);

  // Base score inversely proportional to gap
  const baseScore = Math.max(0, 100 - (gapPercent * 200));

  return Math.min(100, baseScore + contenderBonus);
}

// Type exports
export type {
  SessionType as F1SessionType,
  WeekendFormat as F1WeekendFormat,
  GrandPrixStatus as F1GrandPrixStatus,
  CircuitType as F1CircuitType,
};
