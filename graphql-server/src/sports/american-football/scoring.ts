/**
 * American Football - Scoring System
 */

export const AmericanFootballScoring = {
  // Point values
  pointValues: {
    touchdown: 6,
    extraPoint: 1,
    twoPointConversion: 2,
    fieldGoal: 3,
    safety: 2,
  },

  // After touchdown options
  afterTouchdown: ['extra_point', 'two_point_conversion'],

  // Standings (simple W-L-T)
  standingsPoints: {
    win: 1,
    loss: 0,
    tie: 0.5,
  },

  // Playoff tiebreakers
  tiebreakers: [
    'head_to_head',
    'division_record',
    'common_games',
    'conference_record',
    'strength_of_victory',
    'strength_of_schedule',
    'point_differential',
    'points_scored',
  ],

  // Player statistics - Offense
  offenseStats: {
    quarterback: [
      'passingYards',
      'passingTouchdowns',
      'interceptions',
      'completionPercentage',
      'quarterbackRating',
      'rushingYards',
    ],
    runningBack: [
      'rushingYards',
      'rushingTouchdowns',
      'yardsPerCarry',
      'receptions',
      'receivingYards',
    ],
    receiver: [
      'receptions',
      'receivingYards',
      'receivingTouchdowns',
      'yardsPerReception',
      'targets',
    ],
  },

  // Player statistics - Defense
  defenseStats: [
    'tackles',
    'sacks',
    'interceptions',
    'forcedFumbles',
    'fumblesRecovered',
    'passesDefended',
    'defensiveTouchdowns',
  ],

  // Team statistics
  teamStats: [
    'totalYards',
    'passingYards',
    'rushingYards',
    'turnovers',
    'timeOfPossession',
    'thirdDownConversion',
    'redZoneEfficiency',
  ],
} as const;

export type AmericanFootballScoringType = typeof AmericanFootballScoring;
