/**
 * F1 Adapter - Data source for Formula 1
 *
 * Uses BALLDONTLIE API with fallback to seed data.
 */

import got, { HTTPError } from 'got';
import { logger } from '../../../../utils/logger.js';
import { f1Cache, CACHE_TTL } from '../../../../utils/cache.js';
import { config } from '../../../../config/env.js';
import type {
  F1DataAdapter,
  F1RaceData,
  F1DriverStandingData,
  F1ConstructorStandingData,
  F1CircuitData,
} from './types.js';

// BALLDONTLIE API Configuration
const BALLDONTLIE_F1_API = {
  baseUrl: config.BALLDONTLIE_API_BASE_URL,
  endpoints: {
    races: '/formula1/races',
    drivers: '/formula1/drivers',
    constructors: '/formula1/constructors',
  },
  headers: () => ({
    'Authorization': config.BALLDONTLIE_API_KEY,
    'Content-Type': 'application/json',
  }),
} as const;

// BALLDONTLIE API Response Types
interface BallDontLieF1Race {
  id: number;
  season: number;
  round: number;
  name: string;
  circuit_id?: string;
  circuit_name?: string;
  location?: string;
  country?: string;
  country_code?: string;
  date?: string;
  time?: string;
  format?: string;
  sessions?: Array<{
    type: string;
    date: string;
    time: string;
  }>;
}

interface BallDontLieF1Driver {
  id: number;
  driver_id?: string;
  number?: number;
  code?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  nationality?: string;
  constructor_id?: string;
  constructor_name?: string;
  points?: number;
  wins?: number;
  position?: number;
}

interface BallDontLieF1Constructor {
  id: number;
  constructor_id?: string;
  name?: string;
  nationality?: string;
  points?: number;
  wins?: number;
  position?: number;
}

interface BallDontLieResponse<T> {
  data: T[];
  meta?: {
    total_count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
}

/**
 * 2025 F1 Calendar Seed Data
 * Source: FIA official calendar
 */
const F1_CALENDAR_2025: F1RaceData[] = [
  {
    season: 2025,
    round: 1,
    raceName: 'Australian Grand Prix',
    circuitId: 'albert_park',
    circuitName: 'Albert Park Circuit',
    location: 'Melbourne',
    country: 'Australia',
    countryCode: 'AUS',
    date: '2025-03-16',
    time: '05:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-03-14', time: '01:30:00Z' },
      { type: 'FP2', date: '2025-03-14', time: '05:00:00Z' },
      { type: 'FP3', date: '2025-03-15', time: '01:30:00Z' },
      { type: 'qualifying', date: '2025-03-15', time: '05:00:00Z' },
      { type: 'race', date: '2025-03-16', time: '05:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 2,
    raceName: 'Chinese Grand Prix',
    circuitId: 'shanghai',
    circuitName: 'Shanghai International Circuit',
    location: 'Shanghai',
    country: 'China',
    countryCode: 'CHN',
    date: '2025-03-23',
    time: '07:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-03-21', time: '03:30:00Z' },
      { type: 'sprint_shootout', date: '2025-03-21', time: '07:30:00Z' },
      { type: 'sprint', date: '2025-03-22', time: '03:00:00Z' },
      { type: 'qualifying', date: '2025-03-22', time: '07:00:00Z' },
      { type: 'race', date: '2025-03-23', time: '07:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 3,
    raceName: 'Japanese Grand Prix',
    circuitId: 'suzuka',
    circuitName: 'Suzuka International Racing Course',
    location: 'Suzuka',
    country: 'Japan',
    countryCode: 'JPN',
    date: '2025-04-06',
    time: '05:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-04-04', time: '02:30:00Z' },
      { type: 'FP2', date: '2025-04-04', time: '06:00:00Z' },
      { type: 'FP3', date: '2025-04-05', time: '02:30:00Z' },
      { type: 'qualifying', date: '2025-04-05', time: '06:00:00Z' },
      { type: 'race', date: '2025-04-06', time: '05:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 4,
    raceName: 'Bahrain Grand Prix',
    circuitId: 'bahrain',
    circuitName: 'Bahrain International Circuit',
    location: 'Sakhir',
    country: 'Bahrain',
    countryCode: 'BHR',
    date: '2025-04-13',
    time: '15:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-04-11', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-04-11', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-04-12', time: '12:30:00Z' },
      { type: 'qualifying', date: '2025-04-12', time: '16:00:00Z' },
      { type: 'race', date: '2025-04-13', time: '15:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 5,
    raceName: 'Saudi Arabian Grand Prix',
    circuitId: 'jeddah',
    circuitName: 'Jeddah Corniche Circuit',
    location: 'Jeddah',
    country: 'Saudi Arabia',
    countryCode: 'SAU',
    date: '2025-04-20',
    time: '17:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-04-18', time: '13:30:00Z' },
      { type: 'FP2', date: '2025-04-18', time: '17:00:00Z' },
      { type: 'FP3', date: '2025-04-19', time: '13:30:00Z' },
      { type: 'qualifying', date: '2025-04-19', time: '17:00:00Z' },
      { type: 'race', date: '2025-04-20', time: '17:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 6,
    raceName: 'Miami Grand Prix',
    circuitId: 'miami',
    circuitName: 'Miami International Autodrome',
    location: 'Miami',
    country: 'United States',
    countryCode: 'USA',
    date: '2025-05-04',
    time: '20:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-05-02', time: '16:30:00Z' },
      { type: 'sprint_shootout', date: '2025-05-02', time: '20:30:00Z' },
      { type: 'sprint', date: '2025-05-03', time: '16:00:00Z' },
      { type: 'qualifying', date: '2025-05-03', time: '20:00:00Z' },
      { type: 'race', date: '2025-05-04', time: '20:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 7,
    raceName: 'Emilia Romagna Grand Prix',
    circuitId: 'imola',
    circuitName: 'Autodromo Enzo e Dino Ferrari',
    location: 'Imola',
    country: 'Italy',
    countryCode: 'ITA',
    date: '2025-05-18',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-05-16', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-05-16', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-05-17', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-05-17', time: '14:00:00Z' },
      { type: 'race', date: '2025-05-18', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 8,
    raceName: 'Monaco Grand Prix',
    circuitId: 'monaco',
    circuitName: 'Circuit de Monaco',
    location: 'Monte Carlo',
    country: 'Monaco',
    countryCode: 'MCO',
    date: '2025-05-25',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-05-23', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-05-23', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-05-24', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-05-24', time: '14:00:00Z' },
      { type: 'race', date: '2025-05-25', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 9,
    raceName: 'Spanish Grand Prix',
    circuitId: 'catalunya',
    circuitName: 'Circuit de Barcelona-Catalunya',
    location: 'Barcelona',
    country: 'Spain',
    countryCode: 'ESP',
    date: '2025-06-01',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-05-30', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-05-30', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-05-31', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-05-31', time: '14:00:00Z' },
      { type: 'race', date: '2025-06-01', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 10,
    raceName: 'Canadian Grand Prix',
    circuitId: 'montreal',
    circuitName: 'Circuit Gilles Villeneuve',
    location: 'Montreal',
    country: 'Canada',
    countryCode: 'CAN',
    date: '2025-06-15',
    time: '18:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-06-13', time: '17:30:00Z' },
      { type: 'FP2', date: '2025-06-13', time: '21:00:00Z' },
      { type: 'FP3', date: '2025-06-14', time: '16:30:00Z' },
      { type: 'qualifying', date: '2025-06-14', time: '20:00:00Z' },
      { type: 'race', date: '2025-06-15', time: '18:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 11,
    raceName: 'Austrian Grand Prix',
    circuitId: 'red_bull_ring',
    circuitName: 'Red Bull Ring',
    location: 'Spielberg',
    country: 'Austria',
    countryCode: 'AUT',
    date: '2025-06-29',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-06-27', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-06-27', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-06-28', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-06-28', time: '14:00:00Z' },
      { type: 'race', date: '2025-06-29', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 12,
    raceName: 'British Grand Prix',
    circuitId: 'silverstone',
    circuitName: 'Silverstone Circuit',
    location: 'Silverstone',
    country: 'United Kingdom',
    countryCode: 'GBR',
    date: '2025-07-06',
    time: '14:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-07-04', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-07-04', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-07-05', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-07-05', time: '14:00:00Z' },
      { type: 'race', date: '2025-07-06', time: '14:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 13,
    raceName: 'Belgian Grand Prix',
    circuitId: 'spa',
    circuitName: 'Circuit de Spa-Francorchamps',
    location: 'Spa',
    country: 'Belgium',
    countryCode: 'BEL',
    date: '2025-07-27',
    time: '13:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-07-25', time: '11:30:00Z' },
      { type: 'sprint_shootout', date: '2025-07-25', time: '15:30:00Z' },
      { type: 'sprint', date: '2025-07-26', time: '11:00:00Z' },
      { type: 'qualifying', date: '2025-07-26', time: '15:00:00Z' },
      { type: 'race', date: '2025-07-27', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 14,
    raceName: 'Hungarian Grand Prix',
    circuitId: 'hungaroring',
    circuitName: 'Hungaroring',
    location: 'Budapest',
    country: 'Hungary',
    countryCode: 'HUN',
    date: '2025-08-03',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-08-01', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-08-01', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-08-02', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-08-02', time: '14:00:00Z' },
      { type: 'race', date: '2025-08-03', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 15,
    raceName: 'Dutch Grand Prix',
    circuitId: 'zandvoort',
    circuitName: 'Circuit Zandvoort',
    location: 'Zandvoort',
    country: 'Netherlands',
    countryCode: 'NED',
    date: '2025-08-31',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-08-29', time: '10:30:00Z' },
      { type: 'FP2', date: '2025-08-29', time: '14:00:00Z' },
      { type: 'FP3', date: '2025-08-30', time: '09:30:00Z' },
      { type: 'qualifying', date: '2025-08-30', time: '13:00:00Z' },
      { type: 'race', date: '2025-08-31', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 16,
    raceName: 'Italian Grand Prix',
    circuitId: 'monza',
    circuitName: 'Autodromo Nazionale Monza',
    location: 'Monza',
    country: 'Italy',
    countryCode: 'ITA',
    date: '2025-09-07',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-09-05', time: '11:30:00Z' },
      { type: 'FP2', date: '2025-09-05', time: '15:00:00Z' },
      { type: 'FP3', date: '2025-09-06', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-09-06', time: '14:00:00Z' },
      { type: 'race', date: '2025-09-07', time: '13:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 17,
    raceName: 'Azerbaijan Grand Prix',
    circuitId: 'baku',
    circuitName: 'Baku City Circuit',
    location: 'Baku',
    country: 'Azerbaijan',
    countryCode: 'AZE',
    date: '2025-09-21',
    time: '11:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-09-19', time: '09:30:00Z' },
      { type: 'FP2', date: '2025-09-19', time: '13:00:00Z' },
      { type: 'FP3', date: '2025-09-20', time: '08:30:00Z' },
      { type: 'qualifying', date: '2025-09-20', time: '12:00:00Z' },
      { type: 'race', date: '2025-09-21', time: '11:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 18,
    raceName: 'Singapore Grand Prix',
    circuitId: 'singapore',
    circuitName: 'Marina Bay Street Circuit',
    location: 'Singapore',
    country: 'Singapore',
    countryCode: 'SGP',
    date: '2025-10-05',
    time: '12:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-10-03', time: '09:30:00Z' },
      { type: 'FP2', date: '2025-10-03', time: '13:00:00Z' },
      { type: 'FP3', date: '2025-10-04', time: '09:30:00Z' },
      { type: 'qualifying', date: '2025-10-04', time: '13:00:00Z' },
      { type: 'race', date: '2025-10-05', time: '12:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 19,
    raceName: 'United States Grand Prix',
    circuitId: 'austin',
    circuitName: 'Circuit of the Americas',
    location: 'Austin',
    country: 'United States',
    countryCode: 'USA',
    date: '2025-10-19',
    time: '19:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-10-17', time: '17:30:00Z' },
      { type: 'sprint_shootout', date: '2025-10-17', time: '21:30:00Z' },
      { type: 'sprint', date: '2025-10-18', time: '18:00:00Z' },
      { type: 'qualifying', date: '2025-10-18', time: '22:00:00Z' },
      { type: 'race', date: '2025-10-19', time: '19:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 20,
    raceName: 'Mexico City Grand Prix',
    circuitId: 'mexico',
    circuitName: 'Autodromo Hermanos Rodriguez',
    location: 'Mexico City',
    country: 'Mexico',
    countryCode: 'MEX',
    date: '2025-10-26',
    time: '20:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-10-24', time: '18:30:00Z' },
      { type: 'FP2', date: '2025-10-24', time: '22:00:00Z' },
      { type: 'FP3', date: '2025-10-25', time: '17:30:00Z' },
      { type: 'qualifying', date: '2025-10-25', time: '21:00:00Z' },
      { type: 'race', date: '2025-10-26', time: '20:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 21,
    raceName: 'Sao Paulo Grand Prix',
    circuitId: 'interlagos',
    circuitName: 'Autodromo Jose Carlos Pace',
    location: 'Sao Paulo',
    country: 'Brazil',
    countryCode: 'BRA',
    date: '2025-11-09',
    time: '17:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-11-07', time: '14:30:00Z' },
      { type: 'sprint_shootout', date: '2025-11-07', time: '18:30:00Z' },
      { type: 'sprint', date: '2025-11-08', time: '14:00:00Z' },
      { type: 'qualifying', date: '2025-11-08', time: '18:00:00Z' },
      { type: 'race', date: '2025-11-09', time: '17:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 22,
    raceName: 'Las Vegas Grand Prix',
    circuitId: 'las_vegas',
    circuitName: 'Las Vegas Strip Circuit',
    location: 'Las Vegas',
    country: 'United States',
    countryCode: 'USA',
    date: '2025-11-22',
    time: '06:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-11-20', time: '02:30:00Z' },
      { type: 'FP2', date: '2025-11-20', time: '06:00:00Z' },
      { type: 'FP3', date: '2025-11-21', time: '02:30:00Z' },
      { type: 'qualifying', date: '2025-11-21', time: '06:00:00Z' },
      { type: 'race', date: '2025-11-22', time: '06:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 23,
    raceName: 'Qatar Grand Prix',
    circuitId: 'qatar',
    circuitName: 'Lusail International Circuit',
    location: 'Lusail',
    country: 'Qatar',
    countryCode: 'QAT',
    date: '2025-11-30',
    time: '17:00:00Z',
    format: 'sprint',
    sessions: [
      { type: 'FP1', date: '2025-11-28', time: '13:30:00Z' },
      { type: 'sprint_shootout', date: '2025-11-28', time: '17:30:00Z' },
      { type: 'sprint', date: '2025-11-29', time: '14:00:00Z' },
      { type: 'qualifying', date: '2025-11-29', time: '18:00:00Z' },
      { type: 'race', date: '2025-11-30', time: '17:00:00Z' },
    ],
  },
  {
    season: 2025,
    round: 24,
    raceName: 'Abu Dhabi Grand Prix',
    circuitId: 'yas_marina',
    circuitName: 'Yas Marina Circuit',
    location: 'Abu Dhabi',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    date: '2025-12-07',
    time: '13:00:00Z',
    format: 'standard',
    sessions: [
      { type: 'FP1', date: '2025-12-05', time: '09:30:00Z' },
      { type: 'FP2', date: '2025-12-05', time: '13:00:00Z' },
      { type: 'FP3', date: '2025-12-06', time: '10:30:00Z' },
      { type: 'qualifying', date: '2025-12-06', time: '14:00:00Z' },
      { type: 'race', date: '2025-12-07', time: '13:00:00Z' },
    ],
  },
];

/**
 * Circuit data with characteristics
 */
const CIRCUITS: Record<string, F1CircuitData & { characteristics: Record<string, string> }> = {
  monaco: {
    circuitId: 'monaco',
    circuitName: 'Circuit de Monaco',
    location: 'Monte Carlo',
    country: 'Monaco',
    lat: 43.7347,
    lng: 7.4206,
    length: 3.337,
    turns: 19,
    lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
    characteristics: {
      overtakingDifficulty: 'very_difficult',
      weatherVariability: 'medium',
      tireWear: 'low',
      safetyCarLikelihood: 'high',
    },
  },
  silverstone: {
    circuitId: 'silverstone',
    circuitName: 'Silverstone Circuit',
    location: 'Silverstone',
    country: 'United Kingdom',
    lat: 52.0786,
    lng: -1.0169,
    length: 5.891,
    turns: 18,
    lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
    characteristics: {
      overtakingDifficulty: 'moderate',
      weatherVariability: 'high',
      tireWear: 'high',
      safetyCarLikelihood: 'medium',
    },
  },
  monza: {
    circuitId: 'monza',
    circuitName: 'Autodromo Nazionale Monza',
    location: 'Monza',
    country: 'Italy',
    lat: 45.6156,
    lng: 9.2811,
    length: 5.793,
    turns: 11,
    lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 },
    characteristics: {
      overtakingDifficulty: 'easy',
      weatherVariability: 'low',
      tireWear: 'low',
      safetyCarLikelihood: 'medium',
    },
  },
  spa: {
    circuitId: 'spa',
    circuitName: 'Circuit de Spa-Francorchamps',
    location: 'Spa',
    country: 'Belgium',
    lat: 50.4372,
    lng: 5.9714,
    length: 7.004,
    turns: 19,
    lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 },
    characteristics: {
      overtakingDifficulty: 'moderate',
      weatherVariability: 'high',
      tireWear: 'medium',
      safetyCarLikelihood: 'high',
    },
  },
  suzuka: {
    circuitId: 'suzuka',
    circuitName: 'Suzuka International Racing Course',
    location: 'Suzuka',
    country: 'Japan',
    lat: 34.8431,
    lng: 136.5406,
    length: 5.807,
    turns: 18,
    lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 },
    characteristics: {
      overtakingDifficulty: 'moderate',
      weatherVariability: 'high',
      tireWear: 'high',
      safetyCarLikelihood: 'medium',
    },
  },
};

/**
 * Sample driver standings (placeholder for 2025)
 */
const DRIVER_STANDINGS_2025: F1DriverStandingData[] = [
  {
    position: 1,
    positionText: '1',
    points: 0,
    wins: 0,
    driver: {
      driverId: 'max_verstappen',
      permanentNumber: 1,
      code: 'VER',
      givenName: 'Max',
      familyName: 'Verstappen',
      dateOfBirth: '1997-09-30',
      nationality: 'Dutch',
      constructorId: 'red_bull',
    },
    constructors: [{ constructorId: 'red_bull', name: 'Red Bull Racing', nationality: 'Austrian' }],
  },
  {
    position: 2,
    positionText: '2',
    points: 0,
    wins: 0,
    driver: {
      driverId: 'lando_norris',
      permanentNumber: 4,
      code: 'NOR',
      givenName: 'Lando',
      familyName: 'Norris',
      dateOfBirth: '1999-11-13',
      nationality: 'British',
      constructorId: 'mclaren',
    },
    constructors: [{ constructorId: 'mclaren', name: 'McLaren', nationality: 'British' }],
  },
  {
    position: 3,
    positionText: '3',
    points: 0,
    wins: 0,
    driver: {
      driverId: 'charles_leclerc',
      permanentNumber: 16,
      code: 'LEC',
      givenName: 'Charles',
      familyName: 'Leclerc',
      dateOfBirth: '1997-10-16',
      nationality: 'Monegasque',
      constructorId: 'ferrari',
    },
    constructors: [{ constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian' }],
  },
  {
    position: 4,
    positionText: '4',
    points: 0,
    wins: 0,
    driver: {
      driverId: 'lewis_hamilton',
      permanentNumber: 44,
      code: 'HAM',
      givenName: 'Lewis',
      familyName: 'Hamilton',
      dateOfBirth: '1985-01-07',
      nationality: 'British',
      constructorId: 'ferrari',
    },
    constructors: [{ constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian' }],
  },
  {
    position: 5,
    positionText: '5',
    points: 0,
    wins: 0,
    driver: {
      driverId: 'oscar_piastri',
      permanentNumber: 81,
      code: 'PIA',
      givenName: 'Oscar',
      familyName: 'Piastri',
      dateOfBirth: '2001-04-06',
      nationality: 'Australian',
      constructorId: 'mclaren',
    },
    constructors: [{ constructorId: 'mclaren', name: 'McLaren', nationality: 'British' }],
  },
];

/**
 * Sample constructor standings (placeholder for 2025)
 */
const CONSTRUCTOR_STANDINGS_2025: F1ConstructorStandingData[] = [
  {
    position: 1,
    positionText: '1',
    points: 0,
    wins: 0,
    constructor: { constructorId: 'mclaren', name: 'McLaren', nationality: 'British' },
  },
  {
    position: 2,
    positionText: '2',
    points: 0,
    wins: 0,
    constructor: { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian' },
  },
  {
    position: 3,
    positionText: '3',
    points: 0,
    wins: 0,
    constructor: { constructorId: 'red_bull', name: 'Red Bull Racing', nationality: 'Austrian' },
  },
  {
    position: 4,
    positionText: '4',
    points: 0,
    wins: 0,
    constructor: { constructorId: 'mercedes', name: 'Mercedes', nationality: 'German' },
  },
  {
    position: 5,
    positionText: '5',
    points: 0,
    wins: 0,
    constructor: { constructorId: 'aston_martin', name: 'Aston Martin', nationality: 'British' },
  },
];

/**
 * F1 Adapter Implementation
 */
export class F1Adapter implements F1DataAdapter {
  private readonly maxRetries = 3;
  private readonly requestTimeout = 10000;

  /**
   * Check if API is configured
   */
  private isApiConfigured(): boolean {
    return Boolean(config.BALLDONTLIE_API_KEY && config.BALLDONTLIE_API_KEY !== 'your_api_key_here');
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch calendar from BALLDONTLIE API
   */
  private async fetchCalendarFromApi(season: number): Promise<F1RaceData[]> {
    const url = `${BALLDONTLIE_F1_API.baseUrl}${BALLDONTLIE_F1_API.endpoints.races}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLieF1Race>>(url, {
          headers: BALLDONTLIE_F1_API.headers(),
          searchParams: {
            season,
            per_page: 30,
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformCalendarResponse(response.body.data, season);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE F1 calendar API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE F1 calendar API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API calendar response to F1RaceData format
   */
  private transformCalendarResponse(races: BallDontLieF1Race[], season: number): F1RaceData[] {
    return races.map(r => ({
      season: r.season ?? season,
      round: r.round,
      raceName: r.name,
      circuitId: r.circuit_id ?? '',
      circuitName: r.circuit_name ?? '',
      location: r.location ?? '',
      country: r.country ?? '',
      countryCode: r.country_code ?? '',
      date: r.date ?? '',
      time: r.time,
      format: (r.format === 'sprint' ? 'sprint' : 'standard') as 'standard' | 'sprint',
      sessions: r.sessions ?? [],
    }));
  }

  /**
   * Fetch race calendar for a season
   */
  async fetchCalendar(season: number): Promise<F1RaceData[]> {
    const cacheKey = `f1_calendar_${season}`;

    // Check cache first
    const cached = f1Cache.get<F1RaceData[]>(cacheKey);
    if (cached) {
      logger.debug({ season, source: 'cache' }, 'Returning cached F1 calendar');
      return cached;
    }

    // Try API if configured
    if (this.isApiConfigured()) {
      try {
        const races = await this.fetchCalendarFromApi(season);
        if (races.length > 0) {
          f1Cache.set(cacheKey, races, CACHE_TTL.LONG);
          logger.info({ season, count: races.length, source: 'api' }, 'Successfully fetched F1 calendar from API');
          return races;
        }
      } catch (error) {
        logger.warn({ season, error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to seed data');
      }
    }

    // Fallback to seed data
    if (season === 2025) {
      f1Cache.set(cacheKey, F1_CALENDAR_2025, CACHE_TTL.LONG);
      return F1_CALENDAR_2025;
    }

    // For 2026+, adapt 2025 data with updated years
    if (season >= 2026) {
      const adapted = F1_CALENDAR_2025.map(race => ({
        ...race,
        season,
        date: race.date.replace('2025', String(season)),
        sessions: race.sessions.map(s => ({
          ...s,
          date: s.date.replace('2025', String(season)),
        })),
      }));
      f1Cache.set(cacheKey, adapted, CACHE_TTL.LONG);
      return adapted;
    }

    logger.warn({ season }, 'No data available for F1 season');
    return [];
  }

  /**
   * Fetch driver standings from API
   */
  private async fetchDriverStandingsFromApi(season: number): Promise<F1DriverStandingData[]> {
    const url = `${BALLDONTLIE_F1_API.baseUrl}${BALLDONTLIE_F1_API.endpoints.drivers}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLieF1Driver>>(url, {
          headers: BALLDONTLIE_F1_API.headers(),
          searchParams: {
            season,
            per_page: 30,
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformDriverStandingsResponse(response.body.data);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE F1 driver standings API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE F1 driver standings API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API driver standings response
   */
  private transformDriverStandingsResponse(drivers: BallDontLieF1Driver[]): F1DriverStandingData[] {
    return drivers
      .filter(d => d.position !== undefined)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(d => ({
        position: d.position ?? 0,
        positionText: String(d.position ?? 0),
        points: d.points ?? 0,
        wins: d.wins ?? 0,
        driver: {
          driverId: d.driver_id ?? String(d.id),
          permanentNumber: d.number ?? 0,
          code: d.code ?? '',
          givenName: d.first_name ?? '',
          familyName: d.last_name ?? '',
          dateOfBirth: d.date_of_birth ?? '',
          nationality: d.nationality ?? '',
          constructorId: d.constructor_id ?? '',
        },
        constructors: d.constructor_name
          ? [{ constructorId: d.constructor_id ?? '', name: d.constructor_name, nationality: '' }]
          : [],
      }));
  }

  /**
   * Fetch driver standings
   */
  async fetchDriverStandings(season: number): Promise<F1DriverStandingData[]> {
    const cacheKey = `f1_driver_standings_${season}`;

    // Check cache first
    const cached = f1Cache.get<F1DriverStandingData[]>(cacheKey);
    if (cached) {
      logger.debug({ season, source: 'cache' }, 'Returning cached F1 driver standings');
      return cached;
    }

    // Try API if configured
    if (this.isApiConfigured()) {
      try {
        const standings = await this.fetchDriverStandingsFromApi(season);
        if (standings.length > 0) {
          f1Cache.set(cacheKey, standings, CACHE_TTL.MEDIUM);
          logger.info({ season, count: standings.length, source: 'api' }, 'Successfully fetched F1 driver standings from API');
          return standings;
        }
      } catch (error) {
        logger.warn({ season, error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to seed data');
      }
    }

    // Fallback to seed data
    if (season === 2025 || season >= 2026) {
      f1Cache.set(cacheKey, DRIVER_STANDINGS_2025, CACHE_TTL.MEDIUM);
      return DRIVER_STANDINGS_2025;
    }

    return [];
  }

  /**
   * Fetch constructor standings from API
   */
  private async fetchConstructorStandingsFromApi(season: number): Promise<F1ConstructorStandingData[]> {
    const url = `${BALLDONTLIE_F1_API.baseUrl}${BALLDONTLIE_F1_API.endpoints.constructors}`;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await got<BallDontLieResponse<BallDontLieF1Constructor>>(url, {
          headers: BALLDONTLIE_F1_API.headers(),
          searchParams: {
            season,
            per_page: 15,
          },
          timeout: { request: this.requestTimeout },
          responseType: 'json',
        });

        return this.transformConstructorStandingsResponse(response.body.data);
      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;

        if (error instanceof HTTPError) {
          logger.warn(
            { attempt, status: error.response.statusCode, url },
            'BALLDONTLIE F1 constructor standings API request failed'
          );
        } else {
          logger.warn(
            { attempt, error: error instanceof Error ? error.message : String(error) },
            'BALLDONTLIE F1 constructor standings API request error'
          );
        }

        if (isLastAttempt) {
          throw error;
        }

        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Transform API constructor standings response
   */
  private transformConstructorStandingsResponse(constructors: BallDontLieF1Constructor[]): F1ConstructorStandingData[] {
    return constructors
      .filter(c => c.position !== undefined)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(c => ({
        position: c.position ?? 0,
        positionText: String(c.position ?? 0),
        points: c.points ?? 0,
        wins: c.wins ?? 0,
        constructor: {
          constructorId: c.constructor_id ?? String(c.id),
          name: c.name ?? '',
          nationality: c.nationality ?? '',
        },
      }));
  }

  /**
   * Fetch constructor standings
   */
  async fetchConstructorStandings(season: number): Promise<F1ConstructorStandingData[]> {
    const cacheKey = `f1_constructor_standings_${season}`;

    // Check cache first
    const cached = f1Cache.get<F1ConstructorStandingData[]>(cacheKey);
    if (cached) {
      logger.debug({ season, source: 'cache' }, 'Returning cached F1 constructor standings');
      return cached;
    }

    // Try API if configured
    if (this.isApiConfigured()) {
      try {
        const standings = await this.fetchConstructorStandingsFromApi(season);
        if (standings.length > 0) {
          f1Cache.set(cacheKey, standings, CACHE_TTL.MEDIUM);
          logger.info({ season, count: standings.length, source: 'api' }, 'Successfully fetched F1 constructor standings from API');
          return standings;
        }
      } catch (error) {
        logger.warn({ season, error: error instanceof Error ? error.message : String(error) }, 'API failed, falling back to seed data');
      }
    }

    // Fallback to seed data
    if (season === 2025 || season >= 2026) {
      f1Cache.set(cacheKey, CONSTRUCTOR_STANDINGS_2025, CACHE_TTL.MEDIUM);
      return CONSTRUCTOR_STANDINGS_2025;
    }

    return [];
  }

  /**
   * Fetch circuit details
   */
  async fetchCircuit(circuitId: string): Promise<F1CircuitData | null> {
    return Promise.resolve(CIRCUITS[circuitId] || null);
  }

  /**
   * Get adapter source name
   */
  getSource(): string {
    return this.isApiConfigured() ? 'BALLDONTLIE API + Seed Data' : 'F1 Seed Data (2025)';
  }
}

// Export singleton instance
export const f1Adapter = new F1Adapter();
