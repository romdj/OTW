/**
 * F1 API Response Types
 *
 * Types for F1 data source responses.
 * Compatible with Ergast API structure (retiring 2025) and OpenF1.
 */

/**
 * Raw Grand Prix data from calendar API
 */
export interface F1RaceData {
  season: number;
  round: number;
  raceName: string;
  circuitId: string;
  circuitName: string;
  location: string;
  country: string;
  countryCode: string;
  date: string; // ISO date
  time?: string; // UTC time
  format: 'standard' | 'sprint';
  sessions: F1SessionData[];
}

/**
 * Raw session data
 */
export interface F1SessionData {
  type: string;
  date: string;
  time: string; // UTC
}

/**
 * Raw circuit data
 */
export interface F1CircuitData {
  circuitId: string;
  circuitName: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  length: number;
  turns: number;
  lapRecord?: {
    time: string;
    driver: string;
    year: number;
  };
}

/**
 * Raw driver data
 */
export interface F1DriverData {
  driverId: string;
  permanentNumber: number;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  constructorId: string;
}

/**
 * Raw constructor data
 */
export interface F1ConstructorData {
  constructorId: string;
  name: string;
  nationality: string;
  url?: string;
}

/**
 * Raw driver standing
 */
export interface F1DriverStandingData {
  position: number;
  positionText: string;
  points: number;
  wins: number;
  driver: F1DriverData;
  constructors: F1ConstructorData[];
}

/**
 * Raw constructor standing
 */
export interface F1ConstructorStandingData {
  position: number;
  positionText: string;
  points: number;
  wins: number;
  constructor: F1ConstructorData;
}

/**
 * Adapter interface for F1 data sources
 */
export interface F1DataAdapter {
  /**
   * Fetch race calendar for a season
   */
  fetchCalendar(season: number): Promise<F1RaceData[]>;

  /**
   * Fetch driver standings
   */
  fetchDriverStandings(season: number, round?: number): Promise<F1DriverStandingData[]>;

  /**
   * Fetch constructor standings
   */
  fetchConstructorStandings(season: number, round?: number): Promise<F1ConstructorStandingData[]>;

  /**
   * Fetch circuit details
   */
  fetchCircuit(circuitId: string): Promise<F1CircuitData | null>;

  /**
   * Get adapter source name
   */
  getSource(): string;
}
