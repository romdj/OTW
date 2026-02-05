/**
 * Racing - Sport-Level Types
 *
 * TypeScript types that apply across racing disciplines.
 */

import type { RacingAttributes } from './attributes.js';
import type { RacingQualities } from './qualities.js';
import type { RacingScoring } from './scoring.js';

// Discipline types
export type RacingDiscipline = keyof typeof RacingAttributes.disciplines;

// Flag types (motorsport flags)
export type RacingFlag = keyof typeof RacingAttributes.disciplines.motorsport.flags;

// Emotional tags
export type TensionTag = (typeof RacingQualities.emotionalTags.tension)[number];
export type ExcitementTag = (typeof RacingQualities.emotionalTags.excitement)[number];
export type DramaTag = (typeof RacingQualities.emotionalTags.drama)[number];
export type SkillTag = (typeof RacingQualities.emotionalTags.skill)[number];
export type HistoricTag = (typeof RacingQualities.emotionalTags.historic)[number];

export type EmotionalTag = TensionTag | ExcitementTag | DramaTag | SkillTag | HistoricTag;

// Race session types
export type SessionType =
  | 'practice_1'
  | 'practice_2'
  | 'practice_3'
  | 'qualifying'
  | 'sprint_qualifying'
  | 'sprint'
  | 'race'
  | 'warmup';

// Race status
export type RaceStatus =
  | 'scheduled'
  | 'delayed'
  | 'in_progress'
  | 'red_flagged'
  | 'safety_car'
  | 'virtual_safety_car'
  | 'completed'
  | 'cancelled'
  | 'postponed';

// Driver/Rider status in race
export type ParticipantStatus =
  | 'running'
  | 'pit_stop'
  | 'retired_mechanical'
  | 'retired_crash'
  | 'retired_other'
  | 'disqualified'
  | 'not_classified'
  | 'not_started';

// Race event types
export interface RaceEvent {
  type:
    | 'start'
    | 'overtake'
    | 'pit_stop'
    | 'incident'
    | 'penalty'
    | 'safety_car'
    | 'red_flag'
    | 'restart'
    | 'fastest_lap'
    | 'lead_change'
    | 'retirement'
    | 'finish';
  lap: number;
  timestamp?: Date;
  significance: 'routine' | 'notable' | 'highlight' | 'historic';
  description?: string;
  participantId?: string;
  teamId?: string;
  position?: number;
  details?: Record<string, unknown>;
}

// Pit stop data
export interface PitStop {
  lap: number;
  duration: number; // seconds
  participantId: string;
  teamId: string;
  tiresChanged: boolean;
  newTireCompound?: string;
  fuelAdded?: number;
  repairs?: string[];
  positionBefore: number;
  positionAfter: number;
}

// Lap data
export interface LapData {
  lapNumber: number;
  participantId: string;
  lapTime: number; // milliseconds
  sector1: number;
  sector2: number;
  sector3: number;
  position: number;
  gap: number; // to leader
  interval: number; // to car ahead
  tireCompound?: string;
  tireAge?: number;
  fuelLoad?: number;
  personalBest: boolean;
  overallBest: boolean;
}

// Race result
export interface RaceResult {
  position: number;
  participantId: string;
  participantName: string;
  teamId: string;
  teamName: string;
  lapsCompleted: number;
  totalTime?: number; // milliseconds
  gap?: string; // "+1 lap", "+12.345s"
  points: number;
  fastestLap?: boolean;
  gridPosition: number;
  positionsGained: number;
  status: ParticipantStatus;
  pitStops: number;
}

// Qualifying result
export interface QualifyingResult {
  position: number;
  participantId: string;
  participantName: string;
  teamId: string;
  teamName: string;
  q1Time?: number;
  q2Time?: number;
  q3Time?: number;
  bestTime: number;
  gap: string;
  lapsCompleted: number;
}

// Championship standing
export interface ChampionshipStanding {
  position: number;
  participantId: string;
  participantName: string;
  teamId?: string;
  teamName?: string;
  nationality: string;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  dnfs: number;
  pointsToLeader: number;
  theoreticalMax: number; // Can still win?
}

// Constructor/Team standing
export interface TeamStanding {
  position: number;
  teamId: string;
  teamName: string;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  oneTwos: number;
  reliability: number; // percentage
  pointsToLeader: number;
}

// Race weekend structure
export interface RaceWeekend {
  id: string;
  name: string;
  circuit: Circuit;
  discipline: RacingDiscipline;
  season: number;
  round: number;
  startDate: Date;
  endDate: Date;
  sessions: Session[];
  status: 'upcoming' | 'in_progress' | 'completed';
  weather?: WeatherConditions;
  watchability?: RaceWatchabilityScore;
}

// Circuit information
export interface Circuit {
  id: string;
  name: string;
  country: string;
  city: string;
  length: number; // meters
  turns: number;
  lapRecord?: {
    time: number;
    holder: string;
    year: number;
  };
  characteristics: {
    overtakingDifficulty: 'easy' | 'moderate' | 'difficult';
    weatherSensitivity: 'high' | 'medium' | 'low';
    safetyCarLikelihood: 'high' | 'medium' | 'low';
    type: 'permanent' | 'street' | 'semi_permanent';
  };
}

// Session information
export interface Session {
  id: string;
  type: SessionType;
  scheduledStart: Date;
  actualStart?: Date;
  duration?: number; // minutes or laps
  status: RaceStatus;
  results?: RaceResult[] | QualifyingResult[];
}

// Weather conditions
export interface WeatherConditions {
  temperature: number; // Celsius
  trackTemperature: number;
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: string;
  precipitation: 'none' | 'light' | 'moderate' | 'heavy';
  forecast: 'dry' | 'mixed' | 'wet';
}

// Watchability score for racing
export interface RaceWatchabilityScore {
  overall: number; // 0-100
  factors: {
    battleForLead: number;
    overtaking: number;
    strategyVariety: number;
    incidentDrama: number;
    championshipStakes: number;
    weatherFactor: number;
  };
  tags: EmotionalTag[];
  recommendedFor: ('casual_fan' | 'motorsport_enthusiast' | 'neutral_viewer')[];
  skipToLap?: number; // If race starts slow
  keyMoments?: { lap: number; description: string }[];
}

// TODO: Add tire compound types and strategies
// TODO: Add fuel strategy types
// TODO: Add aerodynamic configuration types
// TODO: Add team radio message types
// TODO: Add penalty types and severity
// TODO: Add steward decision types
// TODO: Add broadcast camera types
// TODO: Add telemetry data types
// TODO: Add car setup types
// TODO: Add wind tunnel/CFD data types
// TODO: Add simulator lap comparison types
// TODO: Add historical circuit lap records
// TODO: Add circuit-specific overtaking zones
// TODO: Add DRS zone definitions
// TODO: Add pit lane configuration types
// TODO: Add grid penalty tracking
// TODO: Add power unit component usage
// TODO: Add crash damage assessment types
// TODO: Add safety equipment types
// TODO: Add marshalling/flag types
// TODO: Add race control message types

export type RacingAttributesType = typeof RacingAttributes;
export type RacingQualitiesType = typeof RacingQualities;
export type RacingScoringType = typeof RacingScoring;
