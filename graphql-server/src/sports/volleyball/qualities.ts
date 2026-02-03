/**
 * Volleyball - Subjective Quality Factors
 *
 * What makes a volleyball match worth watching?
 */

export const VolleyballQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'fast',
  scoringFrequency: 'high', // Points on every rally
  physicalityLevel: 'medium',
  skillCeiling: 'very_high',
  comebackPotential: 'high', // Every point matters, momentum shifts common

  // What makes a volleyball match "must-watch"
  excitementFactors: [
    'five_set_thriller',
    'golden_set',
    'comeback_victory',
    'marathon_rally',
    'ace_barrage',
    'blocking_clinic',
    'defensive_heroics',
    'match_point_saves',
    'upset_special',
    'rivalry_match',
    'olympic_final',
    'world_championship',
    'individual_brilliance',
    'team_chemistry',
    'home_crowd_atmosphere',
  ],

  // Emotional tagging vocabulary
  emotionalTags: {
    tension: [
      'deuce-battles',
      'fifth-set-drama',
      'match-point-chaos',
      'momentum-swings',
      'tight-finish',
    ],
    excitement: [
      'high-flying',
      'kill-fest',
      'serving-aces',
      'offensive-display',
      'fast-tempo',
    ],
    drama: [
      'comeback-kings',
      'upset-alert',
      'rivalry-renewed',
      'olympic-drama',
      'championship-decider',
      'impossible-digs',
    ],
    skill: [
      'setting-masterclass',
      'blocking-wall',
      'defensive-clinic',
      'serving-showcase',
      'hitting-exhibition',
    ],
    athleticism: [
      'high-flyers',
      'incredible-digs',
      'athletic-display',
      'power-volleyball',
    ],
  },

  // Significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'first_in_history',
      'milestone_match',
      'dynasty_defining',
    ],
    stakes: [
      'olympic_medal_match',
      'world_championship_final',
      'nations_league_finals',
      'champions_league_final',
      'qualification_decider',
      'relegation_battle',
    ],
    individual: [
      'mvp_performance',
      'service_ace_record',
      'kill_record',
      'dig_record',
      'perfect_game',
    ],
  },

  // Watchability score factors
  watchabilityWeights: {
    closeScore: 0.25, // Sets decided by 2-3 points
    fifthSet: 0.20, // Going the distance
    momentumSwings: 0.15,
    stakesLevel: 0.15,
    rivalryFactor: 0.10,
    starPower: 0.10,
    crowdAtmosphere: 0.05,
  },

  // Competition prestige
  competitionPrestige: {
    tier1: [
      'Olympic Games',
      'FIVB World Championship',
      'FIVB Volleyball Nations League Finals',
    ],
    tier2: [
      'FIVB World Cup',
      'CEV Champions League',
      'Continental Championships',
    ],
    tier3: [
      'National Leagues (Italy, Poland, Russia, Brazil)',
      'CEV Cup',
      'FIVB World Tour (Beach)',
    ],
  },

  // National team powerhouses
  powerhouses: {
    mens: ['Brazil', 'Poland', 'Italy', 'Russia', 'USA', 'France', 'Japan'],
    womens: ['USA', 'Brazil', 'China', 'Italy', 'Turkey', 'Serbia', 'Japan'],
  },
} as const;

// TODO: Add beach volleyball specific excitement factors
// TODO: Add weather impact on beach volleyball watchability
// TODO: Add league atmosphere factors
// TODO: Add broadcast quality factors
// TODO: Add player personality/storyline factors
// TODO: Add team chemistry indicators
// TODO: Add home court advantage metrics

export type VolleyballQualitiesType = typeof VolleyballQualities;
