/**
 * Ice Hockey - Subjective Quality Factors
 *
 * What makes an ice hockey game worth watching?
 * These are the emotional and experiential elements that define
 * memorable hockey moments - the "IMDb of sports" quality metrics.
 */

export const IceHockeyQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'fast',
  scoringFrequency: 'low',        // 5-6 goals per game average
  physicalityLevel: 'high',
  skillCeiling: 'very_high',
  comebackPotential: 'medium',    // Low-scoring makes comebacks harder but more dramatic

  // What makes a hockey game "must-watch"
  excitementFactors: [
    'overtime_thriller',
    'shootout_drama',
    'goalie_duel',
    'rivalry_game',
    'playoff_elimination',
    'hat_trick',
    'comeback_victory',
    'first_nhl_goal',
    'milestone_moment',
    'fight_or_physical_game',
    'power_play_battle',
    'empty_net_drama',
  ],

  // Emotional tagging vocabulary for this sport
  emotionalTags: {
    tension: [
      'nail-biter',
      'one-goal-game',
      'defensive-battle',
      'goaltending-clinic',
    ],
    excitement: [
      'offensive-explosion',
      'high-scoring-affair',
      'end-to-end-action',
      'overtime-classic',
    ],
    physicality: [
      'physical-war',
      'hard-hitting',
      'chippy-game',
      'bad-blood',
    ],
    drama: [
      'comeback-victory',
      'buzzer-beater',
      'upset-special',
      'rivalry-renewed',
      'playoff-intensity',
    ],
    skill: [
      'highlight-reel',
      'sniper-showcase',
      'goalie-standing-on-head',
      'passing-clinic',
    ],
  },

  // Significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'milestone_game',
      'retirement_game',
      'first_in_franchise_history',
    ],
    stakes: [
      'playoff_clinching',
      'elimination_game',
      'stanley_cup_final',
      'outdoor_game',
      'rivalry_game',
    ],
    individual: [
      'hat_trick',
      'gordie_howe_hat_trick',
      'first_career_goal',
      '500th_goal',
      '1000th_point',
    ],
  },

  // Watchability score factors (weights for algorithm)
  watchabilityWeights: {
    closeScore: 0.25,           // Games decided by 1-2 goals
    overtime: 0.20,             // Extra time drama
    highEventCount: 0.15,       // Lots happening (goals, saves, hits)
    rivalryFactor: 0.15,        // Historical matchup significance
    stakesLevel: 0.15,          // Playoff implications
    starPower: 0.10,            // Elite players involved
  },
} as const;

export type IceHockeyQualitiesType = typeof IceHockeyQualities;
