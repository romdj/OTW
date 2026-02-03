/**
 * UCI Adapter - Data source for cycling races
 *
 * Currently uses seed data for 2025 WorldTour calendar.
 * TODO: Research UCI API availability or implement web scraping.
 */

import type { CyclingDataAdapter, UCIRaceData, UCIStageData } from './types.js';

/**
 * 2025 WorldTour Calendar Seed Data
 * Source: UCI official calendar
 */
const WORLDTOUR_2025: UCIRaceData[] = [
  // Grand Tours
  {
    uciCode: 'TDF2025',
    name: 'Tour de France',
    nameShort: 'Tour',
    category: '2.GT',
    class: 'ME',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-07-05',
    endDate: '2025-07-27',
    stages: 21,
    distance: 3320,
    website: 'https://www.letour.fr',
  },
  {
    uciCode: 'GIR2025',
    name: "Giro d'Italia",
    nameShort: 'Giro',
    category: '2.GT',
    class: 'ME',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-05-09',
    endDate: '2025-06-01',
    stages: 21,
    distance: 3400,
    website: 'https://www.giroditalia.it',
  },
  {
    uciCode: 'VUE2025',
    name: 'Vuelta a Espana',
    nameShort: 'Vuelta',
    category: '2.GT',
    class: 'ME',
    country: 'Spain',
    countryCode: 'ESP',
    startDate: '2025-08-23',
    endDate: '2025-09-14',
    stages: 21,
    distance: 3200,
    website: 'https://www.lavuelta.es',
  },

  // Monuments
  {
    uciCode: 'MSR2025',
    name: 'Milano-Sanremo',
    nameShort: 'Sanremo',
    category: '1.UWT',
    class: 'ME',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-03-22',
    endDate: '2025-03-22',
    distance: 294,
  },
  {
    uciCode: 'RVV2025',
    name: 'Ronde van Vlaanderen',
    nameShort: 'Flanders',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-06',
    endDate: '2025-04-06',
    distance: 270,
  },
  {
    uciCode: 'PRX2025',
    name: 'Paris-Roubaix',
    nameShort: 'Roubaix',
    category: '1.UWT',
    class: 'ME',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-04-13',
    endDate: '2025-04-13',
    distance: 260,
  },
  {
    uciCode: 'LBL2025',
    name: 'Liege-Bastogne-Liege',
    nameShort: 'LBL',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-27',
    endDate: '2025-04-27',
    distance: 260,
  },
  {
    uciCode: 'LOM2025',
    name: 'Il Lombardia',
    nameShort: 'Lombardia',
    category: '1.UWT',
    class: 'ME',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-10-11',
    endDate: '2025-10-11',
    distance: 245,
  },

  // Major Stage Races
  {
    uciCode: 'TDU2025',
    name: 'Tour Down Under',
    category: '2.UWT',
    class: 'ME',
    country: 'Australia',
    countryCode: 'AUS',
    startDate: '2025-01-21',
    endDate: '2025-01-26',
    stages: 6,
  },
  {
    uciCode: 'UAE2025',
    name: 'UAE Tour',
    category: '2.UWT',
    class: 'ME',
    country: 'UAE',
    countryCode: 'UAE',
    startDate: '2025-02-17',
    endDate: '2025-02-23',
    stages: 7,
  },
  {
    uciCode: 'PAN2025',
    name: 'Paris-Nice',
    nameShort: 'Paris-Nice',
    category: '2.UWT',
    class: 'ME',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-03-09',
    endDate: '2025-03-16',
    stages: 8,
  },
  {
    uciCode: 'TIR2025',
    name: 'Tirreno-Adriatico',
    category: '2.UWT',
    class: 'ME',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-03-10',
    endDate: '2025-03-16',
    stages: 7,
  },
  {
    uciCode: 'CAT2025',
    name: 'Volta a Catalunya',
    category: '2.UWT',
    class: 'ME',
    country: 'Spain',
    countryCode: 'ESP',
    startDate: '2025-03-24',
    endDate: '2025-03-30',
    stages: 7,
  },
  {
    uciCode: 'BAS2025',
    name: 'Itzulia Basque Country',
    category: '2.UWT',
    class: 'ME',
    country: 'Spain',
    countryCode: 'ESP',
    startDate: '2025-04-07',
    endDate: '2025-04-12',
    stages: 6,
  },
  {
    uciCode: 'TRO2025',
    name: 'Tour de Romandie',
    category: '2.UWT',
    class: 'ME',
    country: 'Switzerland',
    countryCode: 'SUI',
    startDate: '2025-04-29',
    endDate: '2025-05-04',
    stages: 6,
  },
  {
    uciCode: 'DAU2025',
    name: 'Criterium du Dauphine',
    category: '2.UWT',
    class: 'ME',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-06-08',
    endDate: '2025-06-15',
    stages: 8,
  },
  {
    uciCode: 'SUI2025',
    name: 'Tour de Suisse',
    category: '2.UWT',
    class: 'ME',
    country: 'Switzerland',
    countryCode: 'SUI',
    startDate: '2025-06-08',
    endDate: '2025-06-15',
    stages: 8,
  },

  // One-day WorldTour races
  {
    uciCode: 'STR2025',
    name: 'Strade Bianche',
    category: '1.UWT',
    class: 'ME',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-03-08',
    endDate: '2025-03-08',
    distance: 184,
  },
  {
    uciCode: 'E3H2025',
    name: 'E3 Saxo Classic',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-03-28',
    endDate: '2025-03-28',
    distance: 204,
  },
  {
    uciCode: 'GWE2025',
    name: 'Gent-Wevelgem',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-03-30',
    endDate: '2025-03-30',
    distance: 260,
  },
  {
    uciCode: 'DRA2025',
    name: 'Dwars door Vlaanderen',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-02',
    endDate: '2025-04-02',
    distance: 185,
  },
  {
    uciCode: 'AGV2025',
    name: 'Amstel Gold Race',
    category: '1.UWT',
    class: 'ME',
    country: 'Netherlands',
    countryCode: 'NED',
    startDate: '2025-04-20',
    endDate: '2025-04-20',
    distance: 254,
  },
  {
    uciCode: 'FLW2025',
    name: 'La Fleche Wallonne',
    category: '1.UWT',
    class: 'ME',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-23',
    endDate: '2025-04-23',
    distance: 194,
  },
  {
    uciCode: 'SFR2025',
    name: 'San Francisco Classic',
    category: '1.UWT',
    class: 'ME',
    country: 'United States',
    countryCode: 'USA',
    startDate: '2025-05-18',
    endDate: '2025-05-18',
    distance: 200,
  },

  // Women's WorldTour - Grand Tours and Monuments
  {
    uciCode: 'TDFF2025',
    name: 'Tour de France Femmes',
    nameShort: 'Tour Femmes',
    category: '2.WWT',
    class: 'WE',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-07-26',
    endDate: '2025-08-03',
    stages: 8,
  },
  {
    uciCode: 'GIRW2025',
    name: "Giro d'Italia Women",
    nameShort: 'Giro Women',
    category: '2.WWT',
    class: 'WE',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-07-06',
    endDate: '2025-07-13',
    stages: 8,
  },
  {
    uciCode: 'VUEW2025',
    name: 'Vuelta Espana Femenina',
    category: '2.WWT',
    class: 'WE',
    country: 'Spain',
    countryCode: 'ESP',
    startDate: '2025-05-04',
    endDate: '2025-05-11',
    stages: 7,
  },
  {
    uciCode: 'STRW2025',
    name: 'Strade Bianche Women',
    category: '1.WWT',
    class: 'WE',
    country: 'Italy',
    countryCode: 'ITA',
    startDate: '2025-03-08',
    endDate: '2025-03-08',
    distance: 136,
  },
  {
    uciCode: 'RVVW2025',
    name: 'Ronde van Vlaanderen Women',
    category: '1.WWT',
    class: 'WE',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-06',
    endDate: '2025-04-06',
    distance: 162,
  },
  {
    uciCode: 'PRXW2025',
    name: 'Paris-Roubaix Femmes',
    category: '1.WWT',
    class: 'WE',
    country: 'France',
    countryCode: 'FRA',
    startDate: '2025-04-12',
    endDate: '2025-04-12',
    distance: 149,
  },
  {
    uciCode: 'LBLW2025',
    name: 'Liege-Bastogne-Liege Femmes',
    category: '1.WWT',
    class: 'WE',
    country: 'Belgium',
    countryCode: 'BEL',
    startDate: '2025-04-27',
    endDate: '2025-04-27',
    distance: 142,
  },
];

/**
 * Sample Tour de France 2025 stage data
 * This would normally come from UCI/race organizer
 */
const TDF_2025_STAGES: UCIStageData[] = [
  {
    raceCode: 'TDF2025',
    stageNumber: 1,
    date: '2025-07-05',
    startCity: 'Lille',
    finishCity: 'Lille',
    distance: 185,
    type: 'Flat',
    startTime: '12:30',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 2,
    date: '2025-07-06',
    startCity: 'Lille',
    finishCity: 'Boulogne-sur-Mer',
    distance: 198,
    type: 'Hilly',
    startTime: '12:15',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 3,
    date: '2025-07-07',
    startCity: 'Boulogne-sur-Mer',
    finishCity: 'Rouen',
    distance: 205,
    type: 'Flat',
    startTime: '12:00',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 4,
    date: '2025-07-08',
    startCity: 'Rouen',
    finishCity: 'Chartres',
    distance: 178,
    type: 'ITT',
    startTime: '13:00',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 5,
    date: '2025-07-09',
    startCity: 'Chartres',
    finishCity: 'Tours',
    distance: 192,
    type: 'Flat',
    startTime: '12:30',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 6,
    date: '2025-07-10',
    startCity: 'Tours',
    finishCity: 'Limoges',
    distance: 215,
    type: 'Hilly',
    startTime: '11:45',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 7,
    date: '2025-07-11',
    startCity: 'Limoges',
    finishCity: 'Puy de Dome',
    distance: 175,
    type: 'High mountain',
    startTime: '12:00',
    finishAltitude: 1465,
    totalClimbing: 3200,
  },
  // Rest day July 12
  {
    raceCode: 'TDF2025',
    stageNumber: 8,
    date: '2025-07-13',
    startCity: 'Aurillac',
    finishCity: 'Rodez',
    distance: 168,
    type: 'Medium mountain',
    startTime: '12:30',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 9,
    date: '2025-07-14',
    startCity: 'Rodez',
    finishCity: 'Toulouse',
    distance: 195,
    type: 'Hilly',
    startTime: '12:00',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 10,
    date: '2025-07-15',
    startCity: 'Toulouse',
    finishCity: 'Saint-Lary-Soulan',
    distance: 165,
    type: 'High mountain',
    startTime: '12:15',
    finishAltitude: 1680,
    totalClimbing: 4100,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 11,
    date: '2025-07-16',
    startCity: 'Saint-Lary-Soulan',
    finishCity: 'Luchon',
    distance: 148,
    type: 'High mountain',
    startTime: '12:30',
    totalClimbing: 4500,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 12,
    date: '2025-07-17',
    startCity: 'Luchon',
    finishCity: 'Plateau de Beille',
    distance: 172,
    type: 'High mountain',
    startTime: '11:30',
    finishAltitude: 1790,
    totalClimbing: 4200,
  },
  // Rest day July 18
  {
    raceCode: 'TDF2025',
    stageNumber: 13,
    date: '2025-07-19',
    startCity: 'Carcassonne',
    finishCity: 'Montpellier',
    distance: 190,
    type: 'Flat',
    startTime: '12:30',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 14,
    date: '2025-07-20',
    startCity: 'Montpellier',
    finishCity: 'Mont Ventoux',
    distance: 185,
    type: 'High mountain',
    startTime: '11:00',
    finishAltitude: 1909,
    totalClimbing: 3800,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 15,
    date: '2025-07-21',
    startCity: 'Carpentras',
    finishCity: 'Gap',
    distance: 198,
    type: 'Medium mountain',
    startTime: '12:00',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 16,
    date: '2025-07-22',
    startCity: 'Gap',
    finishCity: 'Isola 2000',
    distance: 168,
    type: 'High mountain',
    startTime: '12:15',
    finishAltitude: 2024,
    totalClimbing: 4800,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 17,
    date: '2025-07-23',
    startCity: 'Nice',
    finishCity: 'Col de la Bonette',
    distance: 155,
    type: 'High mountain',
    startTime: '11:30',
    finishAltitude: 2802,
    totalClimbing: 5100,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 18,
    date: '2025-07-24',
    startCity: 'Nice',
    finishCity: 'Briancon',
    distance: 178,
    type: 'High mountain',
    startTime: '11:00',
    totalClimbing: 5200,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 19,
    date: '2025-07-25',
    startCity: 'Briancon',
    finishCity: "Alpe d'Huez",
    distance: 135,
    type: 'High mountain',
    startTime: '12:00',
    finishAltitude: 1850,
    totalClimbing: 4600,
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 20,
    date: '2025-07-26',
    startCity: 'Bourg-en-Bresse',
    finishCity: 'Bourg-en-Bresse',
    distance: 34,
    type: 'ITT',
    startTime: '13:30',
  },
  {
    raceCode: 'TDF2025',
    stageNumber: 21,
    date: '2025-07-27',
    startCity: 'Montargis',
    finishCity: 'Paris Champs-Elysees',
    distance: 125,
    type: 'Flat',
    startTime: '15:00',
  },
];

/**
 * Sample Giro d'Italia 2025 stages (abbreviated)
 */
const GIRO_2025_STAGES: UCIStageData[] = [
  {
    raceCode: 'GIR2025',
    stageNumber: 1,
    date: '2025-05-09',
    startCity: 'Durres',
    finishCity: 'Tirana',
    distance: 164,
    type: 'Hilly',
    startTime: '12:00',
  },
  {
    raceCode: 'GIR2025',
    stageNumber: 2,
    date: '2025-05-10',
    startCity: 'Tirana',
    finishCity: 'Tirana',
    distance: 13,
    type: 'ITT',
    startTime: '14:00',
  },
  // ... more stages would be added
  {
    raceCode: 'GIR2025',
    stageNumber: 21,
    date: '2025-06-01',
    startCity: 'Rome',
    finishCity: 'Rome',
    distance: 125,
    type: 'Flat',
    startTime: '15:00',
  },
];

// Index stages by race code for quick lookup
const STAGES_BY_RACE: Record<string, UCIStageData[]> = {
  TDF2025: TDF_2025_STAGES,
  GIR2025: GIRO_2025_STAGES,
};

/**
 * UCI Adapter Implementation
 *
 * Currently uses static seed data.
 * TODO: Implement actual data fetching when UCI API/scraping is available.
 */
export class UCIAdapter implements CyclingDataAdapter {
  private readonly year: number;

  constructor(year: number = new Date().getFullYear()) {
    this.year = year;
  }

  /**
   * Fetch race calendar for a given year
   */
  async fetchCalendar(year: number): Promise<UCIRaceData[]> {
    // Currently only 2025 seed data available
    if (year === 2025) {
      return Promise.resolve(WORLDTOUR_2025);
    }

    // Return empty for other years until we have more data
    console.warn(`No seed data available for year ${year}, returning empty calendar`);
    return Promise.resolve([]);
  }

  /**
   * Fetch stages for a specific race
   */
  async fetchStages(raceCode: string): Promise<UCIStageData[]> {
    const stages = STAGES_BY_RACE[raceCode];
    if (stages) {
      return Promise.resolve(stages);
    }

    // No stages available for this race
    console.warn(`No stage data available for race ${raceCode}`);
    return Promise.resolve([]);
  }

  /**
   * Fetch current GC standings (placeholder for future implementation)
   */
  async fetchGCStandings(_raceCode: string): Promise<unknown[]> {
    // TODO: Implement GC standings fetch from live data source
    console.warn('GC standings fetch not yet implemented');
    return Promise.resolve([]);
  }

  /**
   * Get adapter source name
   */
  getSource(): string {
    return 'UCI Seed Data (2025)';
  }
}

// Export singleton instance
export const uciAdapter = new UCIAdapter();
