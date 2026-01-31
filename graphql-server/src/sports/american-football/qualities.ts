/**
 * American Football - Subjective Quality Factors
 *
 * What makes an American football game worth watching?
 */

export const AmericanFootballQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'deliberate',       // Strategic, stop-start
  scoringFrequency: 'medium',     // Multiple scores but not constant
  physicalityLevel: 'very_high',
  skillCeiling: 'very_high',
  comebackPotential: 'high',      // Scoring in bunches possible

  // What makes a game "must-watch"
  excitementFactors: [
    'fourth_quarter_comeback',
    'game_winning_drive',
    'overtime_thriller',
    'defensive_battle',
    'shootout',
    'rivalry_game',
    'playoff_elimination',
    'super_bowl',
    'hail_mary',
    'pick_six',
    'goal_line_stand',
    'special_teams_heroics',
  ],

  // Emotional tagging vocabulary
  emotionalTags: {
    tension: [
      'one-score-game',
      'fourth-quarter-drama',
      'clock-management',
      'goal-line-stand',
    ],
    excitement: [
      'shootout',
      'offensive-explosion',
      'big-play-fest',
      'back-and-forth',
    ],
    physicality: [
      'hard-hitting',
      'defensive-battle',
      'ground-and-pound',
      'physical-war',
    ],
    drama: [
      'comeback-victory',
      'game-winning-drive',
      'upset-special',
      'playoff-intensity',
      'super-bowl-moment',
    ],
    skill: [
      'qb-masterclass',
      'defensive-dominance',
      'special-teams-magic',
      'coaching-clinic',
    ],
  },

  // Significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'milestone_game',
      'retirement_game',
      'franchise_history',
    ],
    stakes: [
      'playoff_clinching',
      'elimination_game',
      'super_bowl',
      'conference_championship',
      'division_showdown',
      'primetime_game',
    ],
  },

  // Watchability score factors
  watchabilityWeights: {
    closeScore: 0.25,
    fourthQuarterDrama: 0.20,
    bigPlays: 0.15,
    rivalryFactor: 0.15,
    stakesLevel: 0.15,
    starPower: 0.10,
  },
} as const;

export type AmericanFootballQualitiesType = typeof AmericanFootballQualities;
