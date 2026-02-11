/**
 * UCI API Response Types
 *
 * Types for UCI data source responses.
 * Note: UCI doesn't have a public API, so these types are designed
 * for potential future scrapers or when data becomes available.
 */

/**
 * Raw race data from UCI calendar
 */
export interface UCIRaceData {
  uciCode: string;
  name: string;
  nameShort?: string;
  category: string; // "2.UWT", "2.Pro", "1.UWT", etc.
  class: string; // "ME" (men elite), "WE" (women elite)
  country: string;
  countryCode: string;
  startDate: string; // ISO date
  endDate: string;
  stages?: number;
  distance?: number;
  website?: string;
}

/**
 * Raw stage data from UCI
 */
export interface UCIStageData {
  raceCode: string;
  stageNumber: number;
  date: string;
  startCity: string;
  finishCity: string;
  distance: number;
  type: string; // "Flat", "Medium mountain", "High mountain", "ITT", "TTT"
  profile?: string; // URL to stage profile image
  startTime?: string;
  finishAltitude?: number;
  totalClimbing?: number;
}

/**
 * UCI Classification codes
 */
export const UCIClassifications = {
  // Men's WorldTour
  '2.UWT': { category: 'world_tour', gender: 'men', description: 'Stage race WorldTour' },
  '1.UWT': { category: 'world_tour', gender: 'men', description: 'One-day WorldTour' },
  // Women's WorldTour
  '2.WWT': { category: 'world_tour', gender: 'women', description: 'Stage race Women WorldTour' },
  '1.WWT': { category: 'world_tour', gender: 'women', description: 'One-day Women WorldTour' },
  // Pro Series
  '2.Pro': { category: 'pro_series', gender: 'men', description: 'Stage race Pro Series' },
  '1.Pro': { category: 'pro_series', gender: 'men', description: 'One-day Pro Series' },
  // Grand Tours
  '2.GT': { category: 'grand_tour', gender: 'men', description: 'Grand Tour' },
} as const;

/**
 * Map UCI stage type to our StageType
 */
export function mapUCIStageType(uciType: string): string {
  const mapping: Record<string, string> = {
    'Flat': 'flat',
    'Hilly': 'hilly',
    'Medium mountain': 'hilly',
    'High mountain': 'mountain',
    'Mountain': 'mountain',
    'ITT': 'itt',
    'Individual time trial': 'itt',
    'TTT': 'ttt',
    'Team time trial': 'ttt',
    'Prologue': 'prologue',
  };
  return mapping[uciType] || 'flat';
}

/**
 * Adapter interface for cycling data sources
 */
export interface CyclingDataAdapter {
  /**
   * Fetch race calendar for a given year
   */
  fetchCalendar(_year: number): Promise<UCIRaceData[]>;

  /**
   * Fetch stages for a specific race
   */
  fetchStages(_raceCode: string): Promise<UCIStageData[]>;

  /**
   * Fetch current GC standings for an in-progress race
   */
  fetchGCStandings?(_raceCode: string): Promise<unknown[]>;

  /**
   * Get adapter name/source
   */
  getSource(): string;
}
