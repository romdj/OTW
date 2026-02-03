/**
 * Association Football (Soccer) - Scoring System
 *
 * How points and statistics are tracked in football.
 */

export const AssociationFootballScoring = {
  // Goal value
  goalValue: 1,
  awayGoalsRule: false, // Abolished by UEFA in 2021, varies by competition

  // Point systems for league standings
  standingsPoints: {
    // Standard 3-point system (adopted globally since 1990s)
    standard: {
      win: 3,
      draw: 1,
      loss: 0,
    },
    // Historical 2-point system (pre-1981 England, pre-1995 most leagues)
    historical: {
      win: 2,
      draw: 1,
      loss: 0,
    },
  },

  // Tiebreaker rules (varies by competition)
  tiebreakers: {
    // Most common order
    standard: [
      'goal_difference',
      'goals_scored',
      'head_to_head_points',
      'head_to_head_goal_difference',
      'away_goals_in_head_to_head',
      'playoff',
    ],
    // La Liga/Serie A style
    headToHeadFirst: [
      'head_to_head_points',
      'head_to_head_goal_difference',
      'goal_difference',
      'goals_scored',
      'playoff',
    ],
  },

  // Individual player statistics
  playerStats: {
    outfield: [
      'goals',
      'assists',
      'minutes_played',
      'appearances',
      'starts',
      'substitutions',
      'yellow_cards',
      'red_cards',
      'shots',
      'shots_on_target',
      'shot_accuracy',
      'passes_completed',
      'pass_accuracy',
      'key_passes',
      'crosses',
      'cross_accuracy',
      'dribbles_completed',
      'dribble_success_rate',
      'tackles_won',
      'tackle_success_rate',
      'interceptions',
      'blocks',
      'clearances',
      'aerial_duels_won',
      'fouls_committed',
      'fouls_won',
      'offsides',
      'distance_covered',
      'sprints',
      'top_speed',
    ],
    goalkeeper: [
      'appearances',
      'minutes_played',
      'clean_sheets',
      'goals_conceded',
      'saves',
      'save_percentage',
      'catches',
      'punches',
      'high_claims',
      'penalties_saved',
      'penalties_faced',
      'distribution_accuracy',
      'goal_kicks',
      'sweeper_keeper_actions',
      'errors_leading_to_goal',
    ],
  },

  // Team statistics
  teamStats: [
    'goals_for',
    'goals_against',
    'goal_difference',
    'clean_sheets',
    'shots_per_game',
    'shots_on_target_per_game',
    'possession_percentage',
    'pass_accuracy',
    'crosses_per_game',
    'tackles_per_game',
    'interceptions_per_game',
    'fouls_per_game',
    'offsides_per_game',
    'corners_per_game',
    'xG', // Expected Goals
    'xGA', // Expected Goals Against
    'xGD', // Expected Goal Difference
    'npxG', // Non-Penalty Expected Goals
    'ppda', // Passes Per Defensive Action (pressing intensity)
  ],

  // Advanced metrics
  advancedMetrics: {
    individual: [
      'xG', // Expected Goals
      'xA', // Expected Assists
      'npxG', // Non-Penalty xG
      'xGChain', // xG involvement
      'xGBuildup', // xG buildup contribution
      'progressive_passes',
      'progressive_carries',
      'shot_creating_actions',
      'goal_creating_actions',
    ],
    team: [
      'xG',
      'xGA',
      'xGD',
      'npxG',
      'npxGA',
      'ppda', // Pressing intensity
      'oppda', // Opposition pressing intensity
      'deep_completions',
      'buildup_attacks',
      'counter_attacks',
    ],
  },

  // Goal types for categorization
  goalTypes: [
    'open_play',
    'header',
    'penalty',
    'free_kick',
    'corner',
    'own_goal',
    'counter_attack',
    'set_piece',
    'long_range',
    'tap_in',
    'solo_goal',
    'team_goal',
    'bicycle_kick',
    'volley',
    'chip',
  ],
} as const;

// TODO: Add competition-specific scoring rules (e.g., MLS points per game)
// TODO: Add youth/academy statistics tracking
// TODO: Add historical statistics comparison
// TODO: Add inflation-adjusted goal comparisons
// TODO: Add position-specific advanced metrics
// TODO: Add set piece effectiveness metrics
// TODO: Add defensive action success rates
// TODO: Add pressing trigger statistics
// TODO: Add formation-specific metrics

export type AssociationFootballScoringType = typeof AssociationFootballScoring;
