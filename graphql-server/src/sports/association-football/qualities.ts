/**
 * Association Football (Soccer) - Subjective Quality Factors
 *
 * What makes a football match worth watching?
 * These are the emotional and experiential elements that define
 * memorable football moments - the "IMDb of sports" quality metrics.
 */

export const AssociationFootballQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'varied', // Ranges from slow build-up to lightning counters
  scoringFrequency: 'low', // 2-3 goals per match average
  physicalityLevel: 'medium_high',
  skillCeiling: 'very_high',
  comebackPotential: 'low_medium', // Low scoring makes comebacks rare but legendary

  // What makes a football match "must-watch"
  excitementFactors: [
    'last_minute_winner',
    'penalty_drama',
    'derby_match',
    'title_decider',
    'relegation_battle',
    'champions_league_night',
    'world_cup_knockout',
    'hat_trick',
    'goalkeeper_heroics',
    'red_card_chaos',
    'var_controversy',
    'underdog_giant_killing',
    'tactical_masterclass',
    'individual_brilliance',
    'free_kick_goal',
    'bicycle_kick',
    'long_range_screamer',
  ],

  // Emotional tagging vocabulary for this sport
  emotionalTags: {
    tension: [
      'nail-biter',
      'cagey-affair',
      'nervy-finish',
      'backs-to-the-wall',
      'squeaky-bum-time',
      'bus-parking',
    ],
    excitement: [
      'end-to-end',
      'goal-fest',
      'attacking-display',
      'counter-attack-thriller',
      'open-game',
    ],
    drama: [
      'last-gasp-winner',
      'comeback-kings',
      'smash-and-grab',
      'giant-killing',
      'heartbreak',
      'redemption',
      'title-winning-goal',
      'relegation-escape',
    ],
    skill: [
      'tiki-taka',
      'total-football',
      'passing-masterclass',
      'individual-brilliance',
      'wonder-goal',
      'world-class-performance',
    ],
    atmosphere: [
      'electric-atmosphere',
      'hostile-away-day',
      'cauldron',
      '12th-man',
      'european-night',
    ],
    controversy: [
      'var-drama',
      'referee-howler',
      'penalty-controversy',
      'offside-debate',
      'simulation-disgrace',
    ],
  },

  // Match significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'milestone_game',
      'farewell_match',
      'debut_game',
      'first_in_history',
      'historic_win',
    ],
    stakes: [
      'title_decider',
      'champions_league_final',
      'world_cup_final',
      'relegation_six_pointer',
      'promotion_playoff',
      'derby_match',
      'rivalry_game',
      'cup_final',
      'must_win',
    ],
    individual: [
      'hat_trick',
      'perfect_hat_trick', // Left foot, right foot, header
      'debut_goal',
      'milestone_goal',
      'golden_boot_clincher',
      'player_of_the_match',
      'clean_sheet',
    ],
  },

  // Watchability score factors (weights for algorithm)
  watchabilityWeights: {
    closeScore: 0.20, // Matches decided by 1 goal
    lateGoals: 0.20, // Goals in final 15 mins
    highEventCount: 0.15, // Goals, chances, cards
    rivalryFactor: 0.15, // Derby/historical matchup
    stakesLevel: 0.15, // League position implications
    starPower: 0.10, // Elite players/teams
    atmosphereFactor: 0.05, // Crowd intensity (where measurable)
  },

  // Competition prestige rankings
  competitionPrestige: {
    tier1: [
      'FIFA World Cup',
      'UEFA Champions League',
      'UEFA European Championship',
      'Copa America',
    ],
    tier2: [
      'UEFA Europa League',
      'Premier League',
      'La Liga',
      'Bundesliga',
      'Serie A',
      'Ligue 1',
      'Africa Cup of Nations',
    ],
    tier3: [
      'UEFA Conference League',
      'Eredivisie',
      'Primeira Liga',
      'MLS',
      'Championship',
    ],
    // TODO: Complete tier rankings for all major leagues
  },

  // Derby/rivalry classifications
  rivalryTypes: {
    city: 'Same city clubs (e.g., Manchester derby)',
    regional: 'Same region (e.g., North West derby)',
    historical: 'Long-standing competition (e.g., El Clásico)',
    political: 'Political/cultural significance (e.g., Old Firm)',
    promotion: 'Formed through repeated playoff meetings',
  },
} as const;

// TODO: Add league-specific excitement factors (e.g., MLS playoffs, English FA Cup magic)
// TODO: Add cultural context factors (e.g., ultras culture, away day atmosphere)
// TODO: Add weather/pitch condition factors
// TODO: Add managerial matchup factors
// TODO: Add transfer window drama factors
// TODO: Add historical head-to-head significance
// TODO: Add fan engagement metrics (social media, attendance)
// TODO: Add pundit/expert ratings integration

export type AssociationFootballQualitiesType = typeof AssociationFootballQualities;
