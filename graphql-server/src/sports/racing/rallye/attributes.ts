/**
 * World Rally Championship (WRC) - Discipline-Specific Attributes
 *
 * Detailed attributes for rally racing.
 */

export const WRCAttributes = {
  // Competition format
  format: {
    seasonLength: { typical: 13, min: 12, max: 14 },
    rallyFormat: {
      days: 3, // Friday-Sunday typically
      stages: { typical: '15_to_25', totalKm: '300_to_350' },
      serviceParks: 'limited_time_repairs',
    },
    classes: {
      rally1: { description: 'Top hybrid cars', power: '500hp' },
      rally2: { description: 'Customer R5 cars', power: '280hp' },
      wrc2: { description: 'Rally2 championship', access: 'privateer_teams' },
      wrc3: { description: 'Rally3 cars', access: 'national_champions' },
      junior: { description: 'Under-30 drivers', cars: 'Rally3' },
    },
    powerStage: {
      description: 'Final stage with bonus points',
      points: { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 },
    },
  },

  // Current manufacturer teams (2025)
  factoryTeams: {
    toyota: {
      fullName: 'Toyota Gazoo Racing WRT',
      car: 'GR Yaris Rally1',
      base: 'Puuppola, Finland',
      championships: { manufacturers: 5, drivers: 4 },
    },
    hyundai: {
      fullName: 'Hyundai Shell Mobis WRT',
      car: 'i20 N Rally1',
      base: 'Alzenau, Germany',
      championships: { manufacturers: 2, drivers: 1 },
    },
    ford: {
      fullName: 'M-Sport Ford WRT',
      car: 'Puma Rally1',
      base: 'Cockermouth, UK',
      championships: { manufacturers: 4, drivers: 4 },
    },
  },

  // Surface types
  surfaces: {
    gravel: {
      characteristics: 'loose_surface_dust_ruts',
      tireChoice: 'soft_medium_hard_gravel',
      sweeping: 'road_position_matters',
    },
    tarmac: {
      characteristics: 'grip_varies_with_weather',
      tireChoice: 'soft_medium_hard_slick_or_wet',
      technique: 'circuit_like_precision',
    },
    snow: {
      characteristics: 'studded_tires_required',
      tireChoice: 'studded_winter',
      technique: 'scandinavian_flick',
    },
    mixed: {
      characteristics: 'multiple_surfaces_per_stage',
      challenge: 'tire_compromise',
    },
  },

  // Car specifications (Rally1)
  carSpecs: {
    engine: '1.6L_turbocharged',
    power: '380hp_petrol_plus_hybrid',
    hybrid: {
      boost: '134hp_for_3_seconds',
      regeneration: 'braking_and_decel',
      battery: '3.9kWh',
    },
    transmission: '5_speed_sequential',
    drivetrain: 'four_wheel_drive',
    weight: 1260, // kg minimum
  },

  // Co-driver role
  coDriver: {
    role: 'Navigation and pace notes',
    paceNotes: {
      creation: 'recce_before_rally',
      content: 'corner_severity_distance_hazards',
      delivery: 'real_time_verbal',
    },
    numbers: {
      hairpin: 1,
      veryTight: 2,
      tight: 3,
      medium: 4,
      fast: 5,
      veryFast: 6,
      flat: 'flat_out',
    },
    modifiers: ['long', 'tightens', 'opens', 'dont_cut', 'caution'],
  },

  // Notable rallies
  rallies: {
    montecarlo: {
      country: 'Monaco',
      surface: 'mixed_tarmac_ice_snow',
      character: 'unpredictable_conditions',
      prestige: 'season_opener_crown_jewel',
    },
    sweden: {
      country: 'Sweden',
      surface: 'snow_and_ice',
      character: 'pure_snow_rally',
      prestige: 'only_true_winter_rally',
    },
    finland: {
      country: 'Finland',
      surface: 'gravel',
      character: 'high_speed_jumps_crests',
      prestige: 'rally_of_1000_lakes',
    },
    safari: {
      country: 'Kenya',
      surface: 'gravel_rough_terrain',
      character: 'endurance_test',
      prestige: 'legendary_african_rally',
    },
    wales: {
      country: 'UK',
      surface: 'gravel_mud',
      character: 'forests_rain_mud',
      prestige: 'british_classic',
    },
  },

  // Historical records
  records: {
    mostDriverChampionships: { holder: 'Sebastien Loeb', count: 9 },
    mostRallyWins: { holder: 'Sebastien Loeb', count: 80 },
    mostStageWins: { holder: 'Sebastien Loeb', count: 900+ },
    mostManufacturerTitles: { holder: 'Lancia', count: 10 },
    youngestChampion: { holder: 'Kalle Rovanpera', age: 22 },
  },

  // Legends
  legends: [
    'Sebastien Loeb',
    'Sebastien Ogier',
    'Tommi Makinen',
    'Colin McRae',
    'Carlos Sainz',
    'Juha Kankkunen',
    'Marcus Gronholm',
    'Ari Vatanen',
  ],

  // Service park regulations
  servicePark: {
    timeAllowed: {
      morning: 15, // minutes
      midday: 30, // minutes
      evening: 45, // minutes
    },
    penalties: 'time_added_for_overrun',
    remoteService: 'limited_in_some_rallies',
  },
} as const;

// TODO: Add detailed stage profiles
// TODO: Add historical rally results
// TODO: Add co-driver championship tracking
// TODO: Add team structure and personnel
// TODO: Add car development timeline
// TODO: Add safety improvements history
// TODO: Add spectator stage information
// TODO: Add WRC+ streaming data
// TODO: Add rally school information
// TODO: Add national championships integration
// TODO: Add historic rally car classes
// TODO: Add rallycross crossover data
// TODO: Add Dakar Rally module

export type WRCAttributesType = typeof WRCAttributes;
