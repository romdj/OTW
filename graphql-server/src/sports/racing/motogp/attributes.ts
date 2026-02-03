/**
 * MotoGP - Discipline-Specific Attributes
 *
 * Detailed attributes specific to MotoGP motorcycle racing.
 */

export const MotoGPAttributes = {
  // Competition format
  format: {
    seasonLength: { typical: 21, min: 18, max: 22 },
    weekendFormat: {
      standard: ['FP1', 'Practice', 'Sprint Qualifying', 'Sprint', 'Warmup', 'Race'],
    },
    raceLength: {
      laps: 'varies_by_circuit', // ~45 minutes
      maxDuration: 45, // minutes (approximately)
    },
    classes: {
      motogp: { engines: '1000cc_4_cylinder', gridSize: 22 },
      moto2: { engines: '765cc_triumph', gridSize: 30 },
      moto3: { engines: '250cc_single', gridSize: 28 },
    },
    pointsPositions: 15,
  },

  // Current factory teams (2025 MotoGP class)
  factoryTeams: {
    ducati: {
      fullName: 'Ducati Lenovo Team',
      manufacturer: 'Ducati',
      base: 'Bologna, Italy',
      championships: { riders: 4, constructors: 7 },
      currentBike: 'Desmosedici GP',
    },
    aprilia: {
      fullName: 'Aprilia Racing',
      manufacturer: 'Aprilia',
      base: 'Noale, Italy',
      championships: { riders: 0, constructors: 0 },
      currentBike: 'RS-GP',
    },
    ktm: {
      fullName: 'Red Bull KTM Factory Racing',
      manufacturer: 'KTM',
      base: 'Mattighofen, Austria',
      championships: { riders: 0, constructors: 0 },
      currentBike: 'RC16',
    },
    honda: {
      fullName: 'Repsol Honda Team',
      manufacturer: 'Honda',
      base: 'Tokyo, Japan',
      championships: { riders: 15, constructors: 22 },
      currentBike: 'RC213V',
    },
    yamaha: {
      fullName: 'Monster Energy Yamaha MotoGP',
      manufacturer: 'Yamaha',
      base: 'Iwata, Japan',
      championships: { riders: 9, constructors: 6 },
      currentBike: 'YZR-M1',
    },
  },

  // Tire supplier
  tires: {
    supplier: 'Michelin',
    frontCompounds: ['soft', 'medium', 'hard'],
    rearCompounds: ['soft', 'medium', 'hard'],
    rainTires: ['wet', 'intermediate'],
    allocation: {
      front: { slicks: 10, wets: 5 },
      rear: { slicks: 12, wets: 5 },
    },
    asymmetric: true, // Different compounds left/right side
  },

  // Bike specifications
  bikeSpecs: {
    motogp: {
      engine: '1000cc V4 or inline-4',
      maxRpm: 18000,
      power: '290+ hp',
      weight: 157, // kg minimum
      topSpeed: '360+ km/h',
      electronics: {
        tractionControl: true,
        wheelieControl: true,
        launchControl: true,
        engineBrake: true,
        quickshifter: true,
      },
    },
  },

  // Unique racing elements
  uniqueElements: {
    leanAngles: {
      typical: 63, // degrees
      extreme: 68, // degrees
    },
    ridingStyles: {
      smooth: 'Traditional technique',
      aggressive: 'Hard braking, late entry',
      leg_dangle: 'Modern aerodynamic/balance technique',
    },
    raceStart: 'Standing start from grid',
    flagToFlag: 'Bike swap allowed during rain changes',
    concessionRules: 'Engine development for struggling manufacturers',
  },

  // Sprint race format
  sprint: {
    introduced: 2023,
    length: 'half_race_distance',
    points: { 1: 12, 2: 9, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 },
    tireAllocation: 'no_additional_tires',
  },

  // Notable circuits
  circuits: {
    mugello: {
      name: 'Mugello Circuit',
      country: 'Italy',
      length: 5.245,
      turns: 15,
      character: 'high_speed_flowing',
      atmosphere: 'best_in_world',
    },
    phillip_island: {
      name: 'Phillip Island Circuit',
      country: 'Australia',
      length: 4.448,
      turns: 12,
      character: 'fast_flowing_coastal',
      atmosphere: 'spectacular_scenery',
    },
    assen: {
      name: 'TT Circuit Assen',
      country: 'Netherlands',
      length: 4.542,
      turns: 18,
      character: 'cathedral_of_speed',
      atmosphere: 'historic',
    },
    motegi: {
      name: 'Twin Ring Motegi',
      country: 'Japan',
      length: 4.801,
      turns: 14,
      character: 'stop_start',
      atmosphere: 'honda_home',
    },
    qatar: {
      name: 'Lusail International Circuit',
      country: 'Qatar',
      length: 5.380,
      turns: 16,
      character: 'night_race',
      atmosphere: 'spectacular_lighting',
    },
  },

  // Historical records
  records: {
    mostChampionships: { holder: 'Giacomo Agostini', count: 8 },
    mostPremierClassWins: { holder: 'Giacomo Agostini', count: 68 },
    mostMotoGPWins: { holder: 'Valentino Rossi', count: 89 },
    mostPolePositions: { holder: 'Marc Marquez', count: 62 },
    youngestChampion: { holder: 'Marc Marquez', age: 20 },
    consecutiveWins: { holder: 'Marc Marquez', count: 10 },
  },

  // Legendary riders
  legends: [
    'Giacomo Agostini',
    'Mike Hailwood',
    'Kenny Roberts',
    'Wayne Rainey',
    'Mick Doohan',
    'Valentino Rossi',
    'Casey Stoner',
    'Marc Marquez',
  ],
} as const;

// TODO: Add satellite team data
// TODO: Add rider career statistics
// TODO: Add manufacturer concession rules detail
// TODO: Add historical bike specifications
// TODO: Add crash data and safety stats
// TODO: Add rider academies data (VR46, Aspar, etc.)
// TODO: Add Moto2 specific attributes
// TODO: Add Moto3 specific attributes
// TODO: Add MotoE attributes
// TODO: Add rider physical requirements
// TODO: Add training regime data
// TODO: Add helmet/leathers specifications
// TODO: Add airbag system data
// TODO: Add medical requirements
// TODO: Add grid girl/umbrella person policies
// TODO: Add fan experience data by circuit
// TODO: Add broadcast schedule by region

export type MotoGPAttributesType = typeof MotoGPAttributes;
