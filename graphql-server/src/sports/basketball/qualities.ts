/**
 * Basketball - Subjective Quality Factors
 *
 * What makes a basketball game worth watching?
 * These are the emotional and experiential elements that define
 * memorable basketball moments.
 */

export const BasketballQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'very_fast',
  scoringFrequency: 'very_high', // 200+ points per game typical
  physicalityLevel: 'medium_high',
  skillCeiling: 'very_high',
  comebackPotential: 'high', // High scoring allows big swings

  // What makes a basketball game "must-watch"
  excitementFactors: [
    'buzzer_beater',
    'overtime_thriller',
    'triple_double',
    'scoring_explosion',
    'defensive_battle',
    'playoff_elimination',
    'rivalry_game',
    'superstar_duel',
    'comeback_victory',
    'poster_dunk',
    'game_winning_block',
    'clutch_free_throws',
    'historic_performance',
    'milestone_game',
    'playoff_atmosphere',
    'march_madness_upset',
    'conference_finals',
    'finals_game_7',
  ],

  // Emotional tagging vocabulary
  emotionalTags: {
    tension: [
      'nail-biter',
      'one-possession-game',
      'defensive-grind',
      'free-throw-battle',
      'fourth-quarter-drama',
    ],
    excitement: [
      'high-scoring-affair',
      'run-and-gun',
      'shootout',
      'highlight-factory',
      'fast-break-fest',
      'three-point-barrage',
    ],
    drama: [
      'buzzer-beater',
      'comeback-kings',
      'upset-alert',
      'rivalry-renewed',
      'playoff-intensity',
      'elimination-atmosphere',
      'overtime-classic',
    ],
    skill: [
      'offensive-masterclass',
      'dunk-contest',
      'triple-double',
      'shooting-clinic',
      'playmaking-display',
      'all-around-performance',
    ],
    physicality: [
      'physical-battle',
      'defensive-showcase',
      'paint-warfare',
      'rebounding-war',
      'gritty-contest',
    ],
  },

  // Significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'milestone_game',
      'jersey_retirement',
      'first_in_history',
      'consecutive_wins_record',
    ],
    stakes: [
      'playoff_game',
      'conference_finals',
      'nba_finals',
      'elimination_game',
      'game_7',
      'play_in_tournament',
      'march_madness',
      'final_four',
      'championship_game',
      'rivalry_game',
      'season_opener',
      'christmas_day',
    ],
    individual: [
      'triple_double',
      'quadruple_double',
      'fifty_point_game',
      'sixty_point_game',
      'career_high',
      'mvp_performance',
      'all_star_game',
      'slam_dunk_contest',
    ],
  },

  // Watchability score factors
  watchabilityWeights: {
    closeScore: 0.25, // Games decided by < 5 points
    fourthQuarterDrama: 0.20, // Lead changes/close in 4th
    highEventCount: 0.15, // Dunks, blocks, steals
    rivalryFactor: 0.12,
    stakesLevel: 0.15,
    starPower: 0.13, // Superstar players
  },

  // Star power tiers (for watchability calculation)
  starPowerTiers: {
    superstar: ['MVP candidates', 'All-NBA First Team', 'Global icons'],
    star: ['All-Stars', 'All-NBA selections'],
    rising: ['All-Rookie', 'Young phenoms', 'Breakout candidates'],
  },

  // Rivalry classifications
  rivalryTypes: {
    historic: 'Lakers-Celtics, Bulls-Pistons',
    geographic: 'Same-city (Lakers-Clippers, Knicks-Nets)',
    playoff: 'Created through playoff battles',
    personal: 'Player-driven rivalries',
  },

  // March Madness specific
  marchMadnessFactors: [
    'cinderella_run',
    'bracket_buster',
    'blue_blood_upset',
    'buzzer_beater',
    'one_shining_moment',
    'underdog_story',
    'coach_storyline',
  ],
} as const;

// TODO: Add era-specific excitement factors (hand-check era vs 3-point era)
// TODO: Add load management impact on watchability
// TODO: Add back-to-back game fatigue factors
// TODO: Add altitude/travel factors
// TODO: Add referee crew reputation factors
// TODO: Add playoff series context (down 3-1, etc.)
// TODO: Add international competition factors
// TODO: Add All-Star Weekend event factors
// TODO: Add fantasy basketball relevance

export type BasketballQualitiesType = typeof BasketballQualities;
