/**
 * F1 API Response Types
 *
 * Types for F1 data source responses.
 * Provider-neutral normalized records. Provider DTOs must not escape adapters.
 */

export interface F1Provenance {
  source: string;
  fetchedAt: string;
  isStale: boolean;
}

/**
 * Raw Grand Prix data from calendar API
 */
export interface F1RaceData {
  providerId?: string;
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
  status?: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  provenance: F1Provenance;
}

/**
 * Raw session data
 */
export interface F1SessionData {
  type: string;
  date: string;
  time: string;
  localTime?: string;
  status?: 'scheduled' | 'live' | 'completed' | 'delayed' | 'cancelled' | 'red_flagged';
  providerId?: string;
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
  provenance: F1Provenance;
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
  provenance: F1Provenance;
}

/**
 * Adapter interface for F1 data sources
 */
export interface F1DataAdapter {
  /**
   * Fetch race calendar for a season
   */
  fetchCalendar(_season: number): Promise<F1RaceData[]>;

  /**
   * Fetch driver standings
   */
  fetchDriverStandings(_season: number, _round?: number): Promise<F1DriverStandingData[]>;

  /**
   * Fetch constructor standings
   */
  fetchConstructorStandings(_season: number, _round?: number): Promise<F1ConstructorStandingData[]>;

  /**
   * Fetch circuit details
   */
  fetchCircuit(_circuitId: string): Promise<F1CircuitData | null>;

  /**
   * Get adapter source name
   */
  getSource(): string;
}
