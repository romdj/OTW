/**
 * Handball - Scoring System
 *
 * How points and statistics are tracked in handball.
 */

export const HandballScoring = {
  // Goal value
  goalValue: 1,

  // Win conditions
  winConditions: {
    mostGoals: true,
    overtime: true, // In knockout matches
    penaltyShootout: true, // If still tied after overtime
  },

  // League standings points
  standingsPoints: {
    win: 2,
    draw: 1,
    loss: 0,
  },

  // Goal types
  goalTypes: [
    'field_goal',
    'fast_break',
    'seven_meter', // Penalty
    'empty_net',
    'goalkeeper_goal',
    'in_flight', // Jumping shot
    'spin_shot',
    'hip_shot',
    'kempa_trick', // Alley-oop style
  ],

  // Individual statistics
  playerStats: {
    fieldPlayers: [
      'goals',
      'assists',
      'shots_attempted',
      'shots_on_target',
      'shooting_percentage',
      'fast_break_goals',
      'seven_meter_goals',
      'seven_meter_attempts',
      'technical_fouls',
      'two_minute_suspensions',
      'red_cards',
      'steals',
      'blocked_shots',
      'turnovers',
      'minutes_played',
    ],
    goalkeepers: [
      'saves',
      'goals_conceded',
      'save_percentage',
      'saves_seven_meter',
      'fast_break_saves',
      'goals_scored', // Yes, goalkeepers can score
      'minutes_played',
    ],
  },

  // Team statistics
  teamStats: [
    'goals_scored',
    'goals_conceded',
    'goal_difference',
    'shooting_percentage',
    'save_percentage',
    'fast_breaks',
    'fast_break_efficiency',
    'seven_meter_efficiency',
    'turnovers',
    'turnovers_forced',
    'two_minute_suspensions',
    'attack_efficiency', // Goals per 100 attacks
    'defense_efficiency', // Goals conceded per 100 opponent attacks
  ],

  // Advanced metrics
  advancedMetrics: [
    'six_zero_defense_efficiency',
    'five_one_defense_efficiency',
    'power_play_efficiency', // When opponent has suspension
    'short_handed_efficiency',
    'first_half_performance',
    'second_half_performance',
    'clutch_performance', // Last 5 minutes
  ],

  // Suspension tracking
  suspensionStats: [
    'two_minute_suspensions_received',
    'two_minute_suspensions_caused',
    'goals_during_power_play',
    'goals_conceded_short_handed',
    'power_play_time',
  ],
} as const;

// TODO: Add position-specific statistics
// TODO: Add throw type success rates
// TODO: Add goalkeeper save zones
// TODO: Add tactical formation statistics
// TODO: Add counter-attack success rates
// TODO: Add historical comparison metrics

export type HandballScoringType = typeof HandballScoring;
