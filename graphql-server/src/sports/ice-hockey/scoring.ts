/**
 * Ice Hockey - Scoring System
 *
 * How points and statistics are tracked in ice hockey.
 */

export const IceHockeyScoring = {
  // Goal value
  goalValue: 1,

  // Point systems for standings
  standingsPoints: {
    // Traditional NHL system
    nhl: {
      win: 2,
      otLoss: 1,
      loss: 0,
    },
    // IIHF/International 3-point system
    international: {
      regulationWin: 3,
      overtimeWin: 2,
      overtimeLoss: 1,
      regulationLoss: 0,
    },
  },

  // Individual player statistics
  playerStats: {
    skater: [
      'goals',
      'assists',
      'points',
      'plusMinus',
      'penaltyMinutes',
      'powerPlayGoals',
      'shortHandedGoals',
      'gameWinningGoals',
      'shots',
      'shootingPercentage',
      'timeOnIce',
      'faceoffPercentage',
      'hits',
      'blocks',
    ],
    goalie: [
      'wins',
      'losses',
      'overtimeLosses',
      'savePercentage',
      'goalsAgainstAverage',
      'shutouts',
      'saves',
      'shotsAgainst',
      'timeOnIce',
    ],
  },

  // Team statistics
  teamStats: [
    'goalsFor',
    'goalsAgainst',
    'goalDifferential',
    'powerPlayPercentage',
    'penaltyKillPercentage',
    'shotsPerGame',
    'shotsAgainstPerGame',
    'faceoffWinPercentage',
  ],
} as const;

export type IceHockeyScoringType = typeof IceHockeyScoring;
