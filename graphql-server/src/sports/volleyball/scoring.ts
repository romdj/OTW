/**
 * Volleyball - Scoring System
 *
 * How points and statistics are tracked in volleyball.
 */

export const VolleyballScoring = {
  // Point values
  pointValue: 1, // Every rally ends with 1 point

  // Ways to score
  scoringActions: [
    'kill', // Unreturnable attack
    'service_ace', // Unreturnable serve
    'block', // Ball lands on opponent's side after block
    'opponent_error', // Attack error, service error, etc.
  ],

  // Win conditions
  winConditions: {
    indoor: {
      setsToWin: 3,
      pointsToWinSet: 25,
      pointsToWinFinalSet: 15,
      mustWinByTwo: true,
    },
    beach: {
      setsToWin: 2,
      pointsToWinSet: 21,
      pointsToWinFinalSet: 15,
      mustWinByTwo: true,
    },
  },

  // Individual statistics
  playerStats: {
    attacking: [
      'kills',
      'attack_attempts',
      'attack_errors',
      'kill_percentage', // Kills / Attempts
      'attack_efficiency', // (Kills - Errors) / Attempts
      'points_scored',
    ],
    serving: [
      'service_aces',
      'service_errors',
      'service_attempts',
      'ace_percentage',
      'serve_receive_errors_caused',
    ],
    blocking: [
      'blocks', // Solo blocks
      'block_assists',
      'total_blocks',
      'blocking_errors',
      'block_points',
    ],
    setting: [
      'assists',
      'setting_errors',
      'assist_percentage',
      'balls_handled',
      'excellent_sets',
    ],
    receiving: [
      'serve_receive_attempts',
      'serve_receive_errors',
      'positive_receptions',
      'excellent_receptions',
      'reception_efficiency',
    ],
    defense: [
      'digs',
      'dig_errors',
      'balls_over_returned',
      'defensive_saves',
    ],
    general: [
      'points_scored',
      'total_attempts',
      'efficiency_rating',
      'sets_played',
      'minutes_played',
    ],
  },

  // Team statistics
  teamStats: [
    'points_scored',
    'kills',
    'attack_efficiency',
    'service_aces',
    'service_errors',
    'blocks',
    'digs',
    'reception_efficiency',
    'setting_efficiency',
    'sideout_percentage', // Scoring when receiving
    'breakpoint_percentage', // Scoring when serving
    'first_ball_sideout', // Scoring on first attack after receive
  ],

  // Advanced metrics
  advancedMetrics: [
    'expected_sideout', // xSO
    'point_differential_per_set',
    'clutch_performance', // Performance in close situations
    'rotation_efficiency', // Performance by rotation
    'opponent_error_rate_induced',
  ],

  // Rally classification
  rallyTypes: [
    'short_rally', // 1-2 contacts per side
    'medium_rally', // 3-5 contacts per side
    'long_rally', // 6+ contacts, multiple attacks
    'transition_rally', // After initial receive attack fails
  ],

  // Error types
  errorTypes: {
    attack: ['into_net', 'out_of_bounds', 'blocked', 'violation'],
    serve: ['into_net', 'out_of_bounds', 'foot_fault', 'time_violation'],
    block: ['net_touch', 'centerline_violation', 'reach_over'],
    general: ['double_contact', 'lift', 'rotation_fault', 'four_contacts'],
  },
} as const;

// TODO: Add beach volleyball specific statistics
// TODO: Add wind/weather impact statistics for beach
// TODO: Add timeout effectiveness metrics
// TODO: Add substitution impact metrics
// TODO: Add libero-specific metrics
// TODO: Add historical comparison metrics
// TODO: Add position-specific metrics

export type VolleyballScoringType = typeof VolleyballScoring;
