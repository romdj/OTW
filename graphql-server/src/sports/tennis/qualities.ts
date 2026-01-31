/**
 * Tennis - Subjective Quality Factors
 *
 * What makes a tennis match worth watching?
 * Individual sport dynamics - no team, pure head-to-head drama.
 */

export const TennisQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'variable',         // Point-by-point with breaks
  scoringFrequency: 'high',       // Points every 30 seconds
  physicalityLevel: 'medium',     // Endurance > contact
  skillCeiling: 'very_high',
  comebackPotential: 'very_high', // Can come back from 0-2 sets down

  // What makes a tennis match "must-watch"
  excitementFactors: [
    'five_set_thriller',
    'tiebreak_drama',
    'break_point_saved',
    'comeback_from_match_point',
    'rivalry_match',
    'grand_slam_final',
    'upset_special',
    'marathon_match',
    'retirement_farewell',
    'first_major_title',
    'record_chase',
  ],

  // Emotional tagging vocabulary
  emotionalTags: {
    tension: [
      'tiebreak-thriller',
      'match-point-saved',
      'break-point-drama',
      'fifth-set-decider',
    ],
    excitement: [
      'shot-making-exhibition',
      'aggressive-tennis',
      'serve-fest',
      'rally-heavy',
    ],
    endurance: [
      'marathon-match',
      'physical-battle',
      'heat-struggle',
      'grueling-baseline',
    ],
    drama: [
      'comeback-victory',
      'upset-alert',
      'rivalry-renewed',
      'changing-of-guard',
      'emotional-victory',
    ],
    skill: [
      'shot-of-the-year',
      'return-masterclass',
      'net-wizard',
      'baseline-artistry',
    ],
  },

  // Head-to-head dynamics (unique to individual sports)
  rivalryIndicators: {
    historicRivalries: [
      'federer_nadal',
      'djokovic_nadal',
      'federer_djokovic',
      'serena_venus',
    ],
    rivalryFactors: [
      'close_head_to_head',
      'contrasting_styles',
      'ranking_proximity',
      'major_final_history',
    ],
  },

  // Watchability score factors
  watchabilityWeights: {
    closeMatch: 0.25,           // Sets/games margin
    tiebreaks: 0.20,            // Number of tiebreaks
    breakPointDrama: 0.15,      // Break points saved/converted
    matchLength: 0.10,          // Epic matches score higher
    rivalryFactor: 0.15,        // Historical matchup significance
    stakesLevel: 0.10,          // Tournament significance
    starPower: 0.05,            // Player rankings/fame
  },
} as const;

export type TennisQualitiesType = typeof TennisQualities;
