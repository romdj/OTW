/**
 * Pro Cycling GraphQL API
 *
 * Provides type-safe queries for UCI WorldTour cycling data including
 * races, stages, GC standings, and excitement predictions.
 */

import { gql } from '@urql/svelte';
import { client } from './graphqlClient.js';

// ============================================================================
// Types
// ============================================================================

export type RaceCategory = 'GRAND_TOUR' | 'MONUMENT' | 'WORLD_TOUR' | 'PRO_SERIES';
export type StageType = 'FLAT' | 'HILLY' | 'MOUNTAIN' | 'ITT' | 'TTT' | 'PROLOGUE';
export type CyclingGender = 'MEN' | 'WOMEN';
export type RaceStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type StageStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'REST_DAY';

export interface GCStanding {
  position: number;
  riderId: string;
  riderName: string;
  teamId: string;
  teamName: string;
  totalTime: number;
  timeGap: string;
}

export interface StageClimb {
  name: string;
  category: string;
  altitude: number;
  length: number;
  averageGradient: number;
  distanceFromStart: number;
}

export interface StageWinner {
  riderId: string;
  riderName: string;
  teamName: string;
  finishTime?: string;
}

export interface ExcitementFactors {
  terrain: number;
  gcImportance: number;
  gcMovement: number;
  finaleProfile: number;
  historicLocation: number;
}

export interface ExcitementPrediction {
  score: number;
  factors: ExcitementFactors;
}

export interface CyclingStage {
  id: string;
  raceId: string;
  stageNumber: number;
  name: string;
  date: string;
  startTime?: string;
  startLocation: string;
  finishLocation: string;
  distance: number;
  elevationGain?: number;
  stageType: StageType;
  status: StageStatus;
  climbs?: StageClimb[];
  winner?: StageWinner;
  predictedExcitement?: ExcitementPrediction;
}

export interface ClassificationLeader {
  riderId: string;
  riderName: string;
  teamName: string;
  points?: number;
  totalTime?: number;
}

export interface RaceExcitement {
  averageStageExcitement: number;
  mostExcitingStages: string[];
  gcDramaScore: number;
  totalLeaderChanges: number;
}

export interface CyclingRace {
  id: string;
  name: string;
  slug: string;
  category: RaceCategory;
  gender: CyclingGender;
  startDate: string;
  endDate: string;
  country: string;
  countries?: string[];
  totalDistance?: number;
  totalStages?: number;
  totalElevation?: number;
  status: RaceStatus;
  stages?: CyclingStage[];
  uciCode?: string;
  website?: string;
  currentGC?: GCStanding[];
  pointsLeader?: ClassificationLeader;
  mountainsLeader?: ClassificationLeader;
  youthLeader?: ClassificationLeader;
  overallExcitement?: RaceExcitement;
}

// ============================================================================
// GraphQL Queries
// ============================================================================

const RACES_QUERY = gql`
  query CyclingRaces($year: Int, $category: RaceCategory, $gender: CyclingGender, $status: RaceStatus) {
    cyclingRaces(year: $year, category: $category, gender: $gender, status: $status) {
      id
      name
      slug
      category
      gender
      startDate
      endDate
      country
      countries
      totalDistance
      totalStages
      totalElevation
      status
      overallExcitement {
        averageStageExcitement
        mostExcitingStages
        gcDramaScore
        totalLeaderChanges
      }
    }
  }
`;

const RACE_QUERY = gql`
  query CyclingRace($id: ID!) {
    cyclingRace(id: $id) {
      id
      name
      slug
      category
      gender
      startDate
      endDate
      country
      countries
      totalDistance
      totalStages
      totalElevation
      status
      stages {
        id
        stageNumber
        name
        date
        startLocation
        finishLocation
        distance
        elevationGain
        stageType
        status
        predictedExcitement {
          score
          factors {
            terrain
            gcImportance
            finaleProfile
            historicLocation
          }
        }
      }
      currentGC {
        position
        riderName
        teamName
        timeGap
      }
      pointsLeader {
        riderName
        teamName
      }
      mountainsLeader {
        riderName
        teamName
      }
    }
  }
`;

const UPCOMING_STAGES_QUERY = gql`
  query UpcomingCyclingStages($limit: Int, $minExcitement: Float, $stageType: StageType) {
    upcomingCyclingStages(limit: $limit, minExcitement: $minExcitement, stageType: $stageType) {
      id
      raceId
      stageNumber
      name
      date
      startTime
      startLocation
      finishLocation
      distance
      elevationGain
      stageType
      status
      climbs {
        name
        category
        altitude
      }
      predictedExcitement {
        score
        factors {
          terrain
          gcImportance
          finaleProfile
          historicLocation
        }
      }
    }
  }
`;

const GRAND_TOURS_QUERY = gql`
  query GrandTours($year: Int, $gender: CyclingGender) {
    grandTours(year: $year, gender: $gender) {
      id
      name
      slug
      category
      gender
      startDate
      endDate
      country
      totalDistance
      totalStages
      status
      overallExcitement {
        averageStageExcitement
        gcDramaScore
      }
    }
  }
`;

const MONUMENTS_QUERY = gql`
  query Monuments($year: Int, $gender: CyclingGender) {
    monuments(year: $year, gender: $gender) {
      id
      name
      slug
      category
      gender
      startDate
      endDate
      country
      totalDistance
      status
    }
  }
`;

// ============================================================================
// API Functions
// ============================================================================

export interface RacesQueryArgs {
  year?: number;
  category?: RaceCategory;
  gender?: CyclingGender;
  status?: RaceStatus;
}

export interface UpcomingStagesArgs {
  limit?: number;
  minExcitement?: number;
  stageType?: StageType;
}

export async function fetchRaces(args: RacesQueryArgs = {}): Promise<CyclingRace[]> {
  const result = await client.query(RACES_QUERY, args).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch races: ${result.error.message}`);
  }
  return result.data?.cyclingRaces ?? [];
}

export async function fetchRace(id: string): Promise<CyclingRace | null> {
  const result = await client.query(RACE_QUERY, { id }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch race: ${result.error.message}`);
  }
  return result.data?.cyclingRace ?? null;
}

export async function fetchUpcomingStages(args: UpcomingStagesArgs = {}): Promise<CyclingStage[]> {
  const result = await client.query(UPCOMING_STAGES_QUERY, args).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch upcoming stages: ${result.error.message}`);
  }
  return result.data?.upcomingCyclingStages ?? [];
}

export async function fetchGrandTours(year?: number, gender?: CyclingGender): Promise<CyclingRace[]> {
  const result = await client.query(GRAND_TOURS_QUERY, { year, gender }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch grand tours: ${result.error.message}`);
  }
  return result.data?.grandTours ?? [];
}

export async function fetchMonuments(year?: number, gender?: CyclingGender): Promise<CyclingRace[]> {
  const result = await client.query(MONUMENTS_QUERY, { year, gender }).toPromise();
  if (result.error) {
    throw new Error(`Failed to fetch monuments: ${result.error.message}`);
  }
  return result.data?.monuments ?? [];
}

// ============================================================================
// Utility Functions
// ============================================================================

export function getCategoryDisplay(category: RaceCategory): string {
  const displays: Record<RaceCategory, string> = {
    GRAND_TOUR: 'Grand Tour',
    MONUMENT: 'Monument',
    WORLD_TOUR: 'WorldTour',
    PRO_SERIES: 'Pro Series',
  };
  return displays[category] ?? category;
}

export function getCategoryColor(category: RaceCategory): string {
  const colors: Record<RaceCategory, string> = {
    GRAND_TOUR: 'text-pink-600',
    MONUMENT: 'text-yellow-600',
    WORLD_TOUR: 'text-blue-600',
    PRO_SERIES: 'text-base-content/60',
  };
  return colors[category] ?? 'text-base-content';
}

export function getStageTypeDisplay(type: StageType): string {
  const displays: Record<StageType, string> = {
    FLAT: 'Flat',
    HILLY: 'Hilly',
    MOUNTAIN: 'Mountain',
    ITT: 'Individual TT',
    TTT: 'Team TT',
    PROLOGUE: 'Prologue',
  };
  return displays[type] ?? type;
}

export function getStageTypeIcon(type: StageType): string {
  const icons: Record<StageType, string> = {
    FLAT: '➡️',
    HILLY: '〰️',
    MOUNTAIN: '⛰️',
    ITT: '⏱️',
    TTT: '👥',
    PROLOGUE: '🏁',
  };
  return icons[type] ?? '🚴';
}

export function getStatusColor(status: RaceStatus | StageStatus): string {
  const colors: Record<string, string> = {
    UPCOMING: 'text-blue-600',
    IN_PROGRESS: 'text-red-600',
    LIVE: 'text-red-600',
    COMPLETED: 'text-base-content/50',
    CANCELLED: 'text-base-content/30',
    REST_DAY: 'text-yellow-600',
  };
  return colors[status] ?? 'text-base-content';
}

export function formatRaceDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  }
  return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}

export function getExcitementLevel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Must Watch', color: 'text-red-600' };
  if (score >= 60) return { label: 'High Drama', color: 'text-orange-600' };
  if (score >= 40) return { label: 'Interesting', color: 'text-yellow-600' };
  return { label: 'Standard', color: 'text-base-content/60' };
}
