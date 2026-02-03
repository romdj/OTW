/**
 * Formula 1 - Discipline-Specific Attributes
 *
 * Detailed attributes specific to Formula 1 racing.
 */

export const Formula1Attributes = {
  // Competition format
  format: {
    seasonLength: { typical: 23, min: 16, max: 24 },
    weekendFormat: {
      standard: ['FP1', 'FP2', 'FP3', 'Qualifying', 'Race'],
      sprint: ['FP1', 'Qualifying', 'Sprint Shootout', 'Sprint', 'Race'],
    },
    raceLength: {
      distance: 305, // km minimum (except Monaco ~260km)
      maxDuration: 120, // minutes (2 hours)
      laps: 'varies_by_circuit',
    },
    pointsPositions: 10,
    gridSize: 20,
  },

  // Current teams (2025)
  teams: {
    red_bull: {
      fullName: 'Oracle Red Bull Racing',
      base: 'Milton Keynes, UK',
      powerUnit: 'Honda RBPT',
      established: 2005,
      championships: { constructors: 6, drivers: 7 },
    },
    mercedes: {
      fullName: 'Mercedes-AMG PETRONAS F1 Team',
      base: 'Brackley, UK',
      powerUnit: 'Mercedes',
      established: 2010,
      championships: { constructors: 8, drivers: 8 },
    },
    ferrari: {
      fullName: 'Scuderia Ferrari',
      base: 'Maranello, Italy',
      powerUnit: 'Ferrari',
      established: 1950,
      championships: { constructors: 16, drivers: 15 },
    },
    mclaren: {
      fullName: 'McLaren F1 Team',
      base: 'Woking, UK',
      powerUnit: 'Mercedes',
      established: 1966,
      championships: { constructors: 8, drivers: 12 },
    },
    aston_martin: {
      fullName: 'Aston Martin Aramco F1 Team',
      base: 'Silverstone, UK',
      powerUnit: 'Mercedes',
      established: 2021, // as Aston Martin
      championships: { constructors: 0, drivers: 0 },
    },
    alpine: {
      fullName: 'BWT Alpine F1 Team',
      base: 'Enstone, UK',
      powerUnit: 'Renault',
      established: 2021, // as Alpine
      championships: { constructors: 2, drivers: 2 }, // as Renault
    },
    williams: {
      fullName: 'Williams Racing',
      base: 'Grove, UK',
      powerUnit: 'Mercedes',
      established: 1977,
      championships: { constructors: 9, drivers: 7 },
    },
    haas: {
      fullName: 'MoneyGram Haas F1 Team',
      base: 'Kannapolis, USA',
      powerUnit: 'Ferrari',
      established: 2016,
      championships: { constructors: 0, drivers: 0 },
    },
    kick_sauber: {
      fullName: 'Stake F1 Team Kick Sauber',
      base: 'Hinwil, Switzerland',
      powerUnit: 'Ferrari',
      established: 1993, // as Sauber
      championships: { constructors: 0, drivers: 0 },
    },
    rb: {
      fullName: 'Visa Cash App RB F1 Team',
      base: 'Faenza, Italy',
      powerUnit: 'Honda RBPT',
      established: 2006, // as Toro Rosso
      championships: { constructors: 0, drivers: 0 },
    },
  },

  // Tire compounds
  tires: {
    supplier: 'Pirelli',
    dryCompounds: {
      C1: { name: 'Hardest', color: 'white', degradation: 'lowest' },
      C2: { name: 'Hard', color: 'white', degradation: 'low' },
      C3: { name: 'Medium', color: 'yellow', degradation: 'medium' },
      C4: { name: 'Soft', color: 'red', degradation: 'high' },
      C5: { name: 'Softest', color: 'red', degradation: 'highest' },
    },
    wetCompounds: {
      intermediate: { name: 'Intermediate', color: 'green', use: 'damp_track' },
      wet: { name: 'Full Wet', color: 'blue', use: 'heavy_rain' },
    },
    allocationPerWeekend: {
      standard: { sets: 13, compounds: 3 },
      sprint: { sets: 12, compounds: 3 },
    },
  },

  // DRS (Drag Reduction System)
  drs: {
    zones: 'varies_by_circuit', // 1-3 zones typically
    activation: {
      gap: 1.0, // seconds to car ahead
      detectionPoint: 'before_zone',
      disabledConditions: ['rain', 'safety_car', 'first_2_laps'],
    },
    effect: 'reduces_drag_increases_top_speed',
  },

  // Power unit regulations
  powerUnit: {
    components: {
      ice: { name: 'Internal Combustion Engine', allocation: 4 },
      tc: { name: 'Turbocharger', allocation: 4 },
      mgu_h: { name: 'MGU-H', allocation: 4 },
      mgu_k: { name: 'MGU-K', allocation: 4 },
      es: { name: 'Energy Store', allocation: 2 },
      ce: { name: 'Control Electronics', allocation: 2 },
    },
    penaltyForExcess: 'grid_penalty',
    fuelLimit: 110, // kg per race
  },

  // Sprint weekend format
  sprint: {
    races: 6, // per season (2024)
    length: '100km_or_30_minutes',
    format: {
      friday: ['FP1', 'Sprint Qualifying'],
      saturday: ['Sprint Race', 'Qualifying'],
      sunday: ['Race'],
    },
    points: { 1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1 },
  },

  // Cost cap (2024)
  costCap: {
    base: 135_000_000, // USD
    excludes: [
      'driver_salaries',
      'top_3_personnel',
      'marketing',
      'heritage_activities',
    ],
    penalties: ['financial', 'sporting', 'constructors_points_deduction'],
  },

  // Notable circuits
  circuits: {
    monaco: {
      name: 'Circuit de Monaco',
      type: 'street',
      length: 3.337,
      turns: 19,
      overtaking: 'very_difficult',
      prestige: 'crown_jewel',
    },
    silverstone: {
      name: 'Silverstone Circuit',
      type: 'permanent',
      length: 5.891,
      turns: 18,
      overtaking: 'moderate',
      prestige: 'home_of_f1',
    },
    monza: {
      name: 'Autodromo Nazionale Monza',
      type: 'permanent',
      length: 5.793,
      turns: 11,
      overtaking: 'easy',
      prestige: 'temple_of_speed',
    },
    spa: {
      name: 'Circuit de Spa-Francorchamps',
      type: 'permanent',
      length: 7.004,
      turns: 19,
      overtaking: 'moderate',
      prestige: 'driver_favorite',
    },
    suzuka: {
      name: 'Suzuka International Racing Course',
      type: 'permanent',
      length: 5.807,
      turns: 18,
      overtaking: 'moderate',
      prestige: 'figure_eight_classic',
    },
  },

  // Historical records
  records: {
    mostDriverChampionships: { holder: 'Michael Schumacher / Lewis Hamilton', count: 7 },
    mostConstructorChampionships: { holder: 'Ferrari', count: 16 },
    mostRaceWins: { holder: 'Lewis Hamilton', count: 104 },
    mostPolePositions: { holder: 'Lewis Hamilton', count: 104 },
    mostFastestLaps: { holder: 'Michael Schumacher', count: 77 },
    mostGrandPrixStarts: { holder: 'Fernando Alonso', count: 400 },
  },
} as const;

// TODO: Add detailed circuit data for all current circuits
// TODO: Add driver career statistics
// TODO: Add historical team name changes
// TODO: Add regulation change timeline
// TODO: Add famous rivalries data
// TODO: Add wet weather specialist ratings
// TODO: Add qualifying specialist ratings
// TODO: Add overtaking specialist ratings
// TODO: Add team principal data
// TODO: Add technical director data
// TODO: Add power unit development timeline
// TODO: Add aero regulation timeline
// TODO: Add broadcast rights by region
// TODO: Add ticket pricing data by circuit
// TODO: Add attendance records by circuit
// TODO: Add safety improvement timeline
// TODO: Add famous incidents data (safely)
// TODO: Add championship decider races history

export type Formula1AttributesType = typeof Formula1Attributes;
