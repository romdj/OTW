/**
 * Formula 1 GraphQL API
 *
 * Provides type-safe queries for F1 data including calendar,
 * sessions, standings, and championship battles.
 */

import { gql } from '@urql/svelte';
import { client } from './graphqlClient.js';

// ============================================================================
// Types
// ============================================================================

export type F1SessionType = 'FP1' | 'FP2' | 'FP3' | 'QUALIFYING' | 'SPRINT_SHOOTOUT' | 'SPRINT' | 'RACE';
export type F1WeekendFormat = 'STANDARD' | 'SPRINT';
export type F1GrandPrixStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type F1SessionStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'DELAYED' | 'CANCELLED' | 'RED_FLAGGED';
export type F1CircuitType = 'PERMANENT' | 'STREET' | 'SEMI_PERMANENT';

export interface F1CircuitCharacteristics {
  overtakingDifficulty: string;
  weatherVariability: string;
  tireWear: string;
  safetyCarLikelihood: string;
}

export interface F1LapRecord {
  time: string;
  driver: string;
  year: number;
}

export interface F1Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  length: number;
  turns: number;
  lapRecord?: F1LapRecord;
  type: F1CircuitType;
  drsZones: number;
  characteristics: F1CircuitCharacteristics;
}

export interface F1Session {
  id: string;
  grandPrixId: string;
  type: F1SessionType;
  name: string;
  date: string;
  startTime?: string;
  startTimeUTC?: string;
  status: F1SessionStatus;
  grandPrixName?: string;
}

export interface F1RaceExcitementFactors {
  trackFactor: number;
  weatherFactor: number;
  titleFactor: number;
  prestigeFactor: number;
  gridFactor: number;
}

export interface F1RaceExcitement {
  score: number;
  factors: F1RaceExcitementFactors;
  tags: string[];
}

export interface F1TireAllocation {
  soft: string;
  medium: string;
  hard: string;
}

export interface F1ChampionshipContext {
  driversLeader: string;
  constructorsLeader: string;
  titleDecider: boolean;
  pointsGapToSecond: number;
}

export interface F1GrandPrix {
  id: string;
  name: string;
  officialName: string;
  slug: string;
  round: number;
  season: number;
  circuit: F1Circuit;
  format: F1WeekendFormat;
  startDate: string;
  endDate: string;
  status: F1GrandPrixStatus;
  sessions: F1Session[];
  tireCompounds?: F1TireAllocation;
  championshipContext?: F1ChampionshipContext;
  predictedExcitement?: F1RaceExcitement;
}

export interface F1Driver {
  id: string;
  number: number;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nationality: string;
  nationalityCode: string;
  dateOfBirth?: string;
  constructorId: string;
  constructorName: string;
}

export interface F1Constructor {
  id: string;
  name: string;
  fullName: string;
  nationality: string;
  nationalityCode: string;
  base?: string;
  powerUnit?: string;
  drivers: string[];
}

export interface F1DriverStanding {
  position: number;
  driver: F1Driver;
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

export interface F1ConstructorStanding {
  position: number;
  constructor: F1Constructor;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  oneTwo: number;
  pointsToLeader: number;
  pointsToNext: number;
  theoreticalMaxPoints: number;
  canWinTitle: boolean;
}

export interface F1DriverChampionshipBattle {
  leader: F1DriverStanding;
  challengers: F1DriverStanding[];
  eliminated: F1DriverStanding[];
  gap: number;
  closenessScore: number;
}

export interface F1ConstructorChampionshipBattle {
  leader: F1ConstructorStanding;
  challengers: F1ConstructorStanding[];
  eliminated: F1ConstructorStanding[];
  gap: number;
  closenessScore: number;
}

export interface F1ChampionshipBattle {
  season: number;
  racesRemaining: number;
  maxPointsAvailable: number;
  isOpen: boolean;
  earliestDecider?: number;
  drivers: F1DriverChampionshipBattle;
  constructors: F1ConstructorChampionshipBattle;
  narratives: string[];
}

// ============================================================================
// GraphQL Queries
// ============================================================================

const CALENDAR_QUERY = gql`
  query F1Calendar($season: Int, $status: F1GrandPrixStatus, $format: F1WeekendFormat) {
    f1Calendar(season: $season, status: $status, format: $format) {
      id
      name
      officialName
      slug
      round
      season
      circuit {
        id
        name
        location
        country
        countryCode
        length
        turns
        type
        drsZones
        characteristics {
          overtakingDifficulty
          weatherVariability
          tireWear
          safetyCarLikelihood
        }
      }
      format
      startDate
      endDate
      status
      sessions {
        id
        type
        name
        date
        startTime
        status
      }
      predictedExcitement {
        score
        factors {
          trackFactor
          weatherFactor
          titleFactor
          prestigeFactor
          gridFactor
        }
        tags
      }
    }
  }
`;

const NEXT_RACE_QUERY = gql`
  query F1NextRace {
    f1NextRace {
      id
      name
      officialName
      slug
      round
      season
      circuit {
        id
        name
        location
        country
        countryCode
        length
        turns
        type
        drsZones
      }
      format
      startDate
      endDate
      status
      sessions {
        id
        type
        name
        date
        startTime
        status
      }
      predictedExcitement {
        score
        tags
      }
    }
  }
`;

const UPCOMING_SESSIONS_QUERY = gql`
  query F1UpcomingSessions($limit: Int) {
    f1UpcomingSessions(limit: $limit) {
      id
      grandPrixId
      type
      name
      date
      startTime
      startTimeUTC
      status
      grandPrixName
    }
  }
`;

const DRIVER_STANDINGS_QUERY = gql`
  query F1DriverStandings($season: Int) {
    f1DriverStandings(season: $season) {
      position
      driver {
        id
        number
        code
        firstName
        lastName
        fullName
        nationality
        nationalityCode
        constructorId
        constructorName
      }
      points
      wins
      podiums
      poles
      fastestLaps
      dnfs
      pointsToLeader
      pointsToNext
      canWinTitle
    }
  }
`;

const CONSTRUCTOR_STANDINGS_QUERY = gql`
  query F1ConstructorStandings($season: Int) {
    f1ConstructorStandings(season: $season) {
      position
      constructor {
        id
        name
        fullName
        nationality
        nationalityCode
      }
      points
      wins
      podiums
      poles
      oneTwo
      pointsToLeader
      pointsToNext
      canWinTitle
    }
  }
`;

const CHAMPIONSHIP_BATTLE_QUERY = gql`
  query F1ChampionshipBattle($season: Int) {
    f1ChampionshipBattle(season: $season) {
      season
      racesRemaining
      maxPointsAvailable
      isOpen
      earliestDecider
      drivers {
        leader {
          position
          driver {
            code
            fullName
            constructorName
          }
          points
          wins
        }
        challengers {
          position
          driver {
            code
            fullName
            constructorName
          }
          points
          pointsToLeader
          canWinTitle
        }
        gap
        closenessScore
      }
      constructors {
        leader {
          position
          constructor {
            name
          }
          points
          wins
        }
        challengers {
          position
          constructor {
            name
          }
          points
          pointsToLeader
          canWinTitle
        }
        gap
        closenessScore
      }
      narratives
    }
  }
`;

// ============================================================================
// API Functions
// ============================================================================

export interface CalendarQueryArgs {
  season?: number;
  status?: F1GrandPrixStatus;
  format?: F1WeekendFormat;
}

export async function fetchCalendar(args: CalendarQueryArgs = {}): Promise<F1GrandPrix[]> {
  const result = await client.query(CALENDAR_QUERY, args).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch F1 calendar: ${result.error.message}`);
  }
  return result.data?.f1Calendar ?? [];
}

export async function fetchNextRace(): Promise<F1GrandPrix | null> {
  const result = await client.query(NEXT_RACE_QUERY, {}).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch next race: ${result.error.message}`);
  }
  return result.data?.f1NextRace ?? null;
}

export async function fetchUpcomingSessions(limit = 10): Promise<F1Session[]> {
  const result = await client.query(UPCOMING_SESSIONS_QUERY, { limit }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch upcoming sessions: ${result.error.message}`);
  }
  return result.data?.f1UpcomingSessions ?? [];
}

export async function fetchDriverStandings(season?: number): Promise<F1DriverStanding[]> {
  const result = await client.query(DRIVER_STANDINGS_QUERY, { season }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch driver standings: ${result.error.message}`);
  }
  return result.data?.f1DriverStandings ?? [];
}

export async function fetchConstructorStandings(season?: number): Promise<F1ConstructorStanding[]> {
  const result = await client.query(CONSTRUCTOR_STANDINGS_QUERY, { season }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch constructor standings: ${result.error.message}`);
  }
  return result.data?.f1ConstructorStandings ?? [];
}

export async function fetchChampionshipBattle(season?: number): Promise<F1ChampionshipBattle | null> {
  const result = await client.query(CHAMPIONSHIP_BATTLE_QUERY, { season }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch championship battle: ${result.error.message}`);
  }
  return result.data?.f1ChampionshipBattle ?? null;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getSessionTypeDisplay(type: F1SessionType): string {
  const displays: Record<F1SessionType, string> = {
    FP1: 'Free Practice 1',
    FP2: 'Free Practice 2',
    FP3: 'Free Practice 3',
    QUALIFYING: 'Qualifying',
    SPRINT_SHOOTOUT: 'Sprint Shootout',
    SPRINT: 'Sprint Race',
    RACE: 'Grand Prix',
  };
  return displays[type] ?? type;
}

export function getSessionTypeShort(type: F1SessionType): string {
  const shorts: Record<F1SessionType, string> = {
    FP1: 'FP1',
    FP2: 'FP2',
    FP3: 'FP3',
    QUALIFYING: 'Quali',
    SPRINT_SHOOTOUT: 'SS',
    SPRINT: 'Sprint',
    RACE: 'Race',
  };
  return shorts[type] ?? type;
}

export function getStatusColor(status: F1GrandPrixStatus | F1SessionStatus): string {
  const colors: Record<string, string> = {
    UPCOMING: 'text-blue-600',
    SCHEDULED: 'text-blue-600',
    IN_PROGRESS: 'text-red-600',
    LIVE: 'text-red-600',
    COMPLETED: 'text-base-content/50',
    CANCELLED: 'text-base-content/30',
    DELAYED: 'text-orange-600',
    RED_FLAGGED: 'text-red-600',
  };
  return colors[status] ?? 'text-base-content';
}

export function getCircuitTypeDisplay(type: F1CircuitType): string {
  const displays: Record<F1CircuitType, string> = {
    PERMANENT: 'Permanent Circuit',
    STREET: 'Street Circuit',
    SEMI_PERMANENT: 'Semi-Permanent',
  };
  return displays[type] ?? type;
}

export function formatRaceDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const month = start.toLocaleDateString('en-US', { month: 'short' });
  return `${month} ${start.getDate()}-${end.getDate()}`;
}

export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length < 2) return '';
  const code = countryCode.substring(0, 2).toUpperCase();
  const base = 0x1f1e6;
  const offset = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    base + code.charCodeAt(0) - offset,
    base + code.charCodeAt(1) - offset
  );
}

export function getExcitementLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Must Watch', color: 'text-red-600' };
  if (score >= 60) return { label: 'High', color: 'text-orange-600' };
  if (score >= 40) return { label: 'Medium', color: 'text-yellow-600' };
  return { label: 'Standard', color: 'text-base-content/60' };
}
