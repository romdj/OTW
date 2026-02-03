/**
 * Basketball - Scoring System
 *
 * How points and statistics are tracked in basketball.
 */

export const BasketballScoring = {
  // Point values
  pointValues: {
    freeThrow: 1,
    twoPointer: 2,
    threePointer: 3,
    // Four-point play (3-pointer plus foul free throw)
  },

  // Win conditions
  winCondition: 'most_points_at_end',
  overtime: {
    exists: true,
    unlimited: true, // Can have multiple OTs
  },

  // Standings points (varies by league)
  standingsPoints: {
    nba: {
      type: 'win_loss_percentage',
      tiebreakers: [
        'head_to_head',
        'division_record',
        'conference_record',
        'record_vs_playoff_teams',
        'point_differential',
      ],
    },
    euroleague: {
      type: 'win_loss_record',
      tiebreakers: [
        'head_to_head',
        'point_differential_h2h',
        'point_differential_overall',
      ],
    },
  },

  // Individual player statistics - Traditional
  playerStatsTraditional: [
    'points',
    'rebounds',
    'assists',
    'steals',
    'blocks',
    'turnovers',
    'field_goals_made',
    'field_goals_attempted',
    'field_goal_percentage',
    'three_pointers_made',
    'three_pointers_attempted',
    'three_point_percentage',
    'free_throws_made',
    'free_throws_attempted',
    'free_throw_percentage',
    'offensive_rebounds',
    'defensive_rebounds',
    'personal_fouls',
    'minutes_played',
    'plus_minus',
    'double_doubles',
    'triple_doubles',
  ],

  // Individual player statistics - Advanced
  playerStatsAdvanced: [
    'PER', // Player Efficiency Rating
    'TS%', // True Shooting Percentage
    'eFG%', // Effective Field Goal Percentage
    'ORB%', // Offensive Rebound Percentage
    'DRB%', // Defensive Rebound Percentage
    'TRB%', // Total Rebound Percentage
    'AST%', // Assist Percentage
    'STL%', // Steal Percentage
    'BLK%', // Block Percentage
    'TOV%', // Turnover Percentage
    'USG%', // Usage Percentage
    'OWS', // Offensive Win Shares
    'DWS', // Defensive Win Shares
    'WS', // Win Shares
    'WS/48', // Win Shares per 48 Minutes
    'OBPM', // Offensive Box Plus/Minus
    'DBPM', // Defensive Box Plus/Minus
    'BPM', // Box Plus/Minus
    'VORP', // Value Over Replacement Player
    'RAPTOR', // Robust Algorithm using Player Tracking and On/Off Ratings
    'EPM', // Estimated Plus-Minus
  ],

  // Team statistics
  teamStats: [
    'points_per_game',
    'points_allowed',
    'pace', // Possessions per game
    'offensive_rating',
    'defensive_rating',
    'net_rating',
    'field_goal_percentage',
    'three_point_percentage',
    'free_throw_percentage',
    'rebounds_per_game',
    'assists_per_game',
    'steals_per_game',
    'blocks_per_game',
    'turnovers_per_game',
  ],

  // Play-by-play tracked events
  playByPlayEvents: [
    'field_goal_attempt',
    'three_point_attempt',
    'free_throw_attempt',
    'offensive_rebound',
    'defensive_rebound',
    'assist',
    'steal',
    'block',
    'turnover',
    'foul',
    'timeout',
    'substitution',
    'jump_ball',
    'violation',
  ],

  // Shot types for tracking
  shotTypes: [
    'layup',
    'dunk',
    'hook_shot',
    'floater',
    'mid_range_jumper',
    'three_pointer',
    'corner_three',
    'above_the_break_three',
    'step_back',
    'pull_up',
    'catch_and_shoot',
    'fadeaway',
    'bank_shot',
    'tip_in',
    'alley_oop',
  ],

  // Shot zones
  shotZones: {
    restricted_area: 'Paint, near basket',
    paint_non_ra: 'Paint outside restricted area',
    mid_range: 'Inside three-point line, outside paint',
    corner_three: 'Corner three-pointer',
    above_break_three: 'Three-pointer above the break',
  },
} as const;

// TODO: Add clutch statistics definitions
// TODO: Add garbage time filtering rules
// TODO: Add tracking data metrics (speed, distance, touches)
// TODO: Add defensive matchup statistics
// TODO: Add lineup combination statistics
// TODO: Add transition vs half-court statistics
// TODO: Add shot quality metrics
// TODO: Add historical era comparisons (pace adjustments)
// TODO: Add college-specific statistics

export type BasketballScoringType = typeof BasketballScoring;
