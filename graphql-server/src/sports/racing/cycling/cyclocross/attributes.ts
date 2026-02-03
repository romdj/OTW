/**
 * Cyclocross - Discipline-Specific Attributes
 *
 * Detailed attributes for cyclocross racing.
 */

export const CyclocrossAttributes = {
  // Competition format
  format: {
    raceLength: {
      elite_men: 60, // minutes
      elite_women: 50, // minutes
      duration: 'time_based_with_laps',
    },
    lapLength: { typical: '2.5_to_3.5_km' },
    courseElements: [
      'mud_sections',
      'sand_pits',
      'barriers',
      'stairs',
      'run_ups',
      'off_camber',
      'steep_descents',
      'technical_turns',
    ],
    seasonTiming: 'September_to_February',
  },

  // Competition hierarchy
  hierarchy: {
    worldCup: {
      rounds: 14, // approximately
      points: 'UCI_ranking_points',
    },
    worldChampionships: {
      frequency: 'annual_January_February',
      categories: ['Elite Men', 'Elite Women', 'U23 Men', 'U23 Women', 'Juniors'],
    },
    superPrestige: {
      description: 'Belgian prestige series',
      rounds: 8,
    },
    x2o_trofee: {
      description: 'Belgian series (formerly Bpost)',
      rounds: 8,
    },
  },

  // Bike specifications
  bikeSpecs: {
    frame: 'cyclocross_specific_geometry',
    tires: {
      width: '33mm_max_UCI',
      tread: 'varies_by_conditions',
      pressure: 'low_for_grip',
    },
    brakes: 'disc_brakes_standard',
    gearing: 'single_chainring_common',
    weight: 'heavier_than_road',
  },

  // Course conditions
  conditions: {
    mud: {
      levels: ['light', 'moderate', 'heavy', 'extreme'],
      impact: 'bike_changes_essential',
    },
    sand: {
      technique: 'momentum_and_power',
      famous: 'Koksijde',
    },
    frozen: {
      danger: 'high',
      technique: 'careful_tire_choice',
    },
    dry: {
      speed: 'highest',
      technique: 'road_like_racing',
    },
  },

  // Pit zone
  pitZone: {
    bikeChanges: 'unlimited',
    mechanics: 'team_provided',
    washing: 'pressure_washers',
    strategy: 'pre_planned_laps',
  },

  // Notable venues
  venues: {
    koksijde: {
      country: 'Belgium',
      feature: 'sand_dunes',
      atmosphere: 'beach_party',
    },
    zolder: {
      country: 'Belgium',
      feature: 'motor_circuit',
      atmosphere: 'fast_technical',
    },
    namur: {
      country: 'Belgium',
      feature: 'citadel_climbs',
      atmosphere: 'spectacular_views',
    },
    tabor: {
      country: 'Czech Republic',
      feature: 'world_championship_host',
      atmosphere: 'eastern_european_passion',
    },
    hoogerheide: {
      country: 'Netherlands',
      feature: 'often_world_champs',
      atmosphere: 'orange_army',
    },
  },

  // Dominant nations
  nations: {
    belgium: { status: 'heartland', worldChamps: 'most' },
    netherlands: { status: 'rising_power', worldChamps: 'many_recent' },
    usa: { status: 'growing', worldChamps: 'few' },
    czechRepublic: { status: 'traditional', worldChamps: 'several' },
  },

  // Legends and current stars
  legends: [
    'Sven Nys',
    'Bart Wellens',
    'Richard Groenendaal',
    'Zdenek Stybar',
    'Niels Albert',
  ],
  currentStars: [
    'Mathieu van der Poel',
    'Wout van Aert',
    'Tom Pidcock',
    'Eli Iserbyt',
    'Fem van Empel',
    'Puck Pieterse',
  ],

  // Crossover with road cycling
  crossover: {
    description: 'Top riders compete in both road and CX',
    benefits: ['handling_skills', 'base_fitness', 'mental_toughness'],
    schedule_conflict: 'limits_full_season_participation',
  },
} as const;

// TODO: Add detailed course profiles
// TODO: Add historical World Championship results
// TODO: Add UCI ranking system details
// TODO: Add equipment sponsor data
// TODO: Add TV coverage information
// TODO: Add betting markets
// TODO: Add weather impact analysis
// TODO: Add tire selection strategy
// TODO: Add running technique differences
// TODO: Add bike setup specifications
// TODO: Add women's scene growth data
// TODO: Add US scene development
// TODO: Add gravel racing crossover

export type CyclocrossAttributesType = typeof CyclocrossAttributes;
