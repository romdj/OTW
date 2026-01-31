/**
 * Tennis - Scoring System
 *
 * The unique love-15-30-40 scoring and set/match structure.
 */

export const TennisScoring = {
  // Point progression within a game
  gamePoints: {
    sequence: ['0', '15', '30', '40'],
    deuce: 'deuce',
    advantageServer: 'AD-in',
    advantageReceiver: 'AD-out',
  },

  // Set scoring
  setScoring: {
    gamesNeeded: 6,
    marginRequired: 2,
    maxGamesBeforeTiebreak: 12,  // 6-6 triggers tiebreak
  },

  // Ranking points (example - varies by tournament)
  rankingPoints: {
    grandSlam: {
      winner: 2000,
      finalist: 1200,
      semifinalist: 720,
      quarterfinalist: 360,
      round16: 180,
      round32: 90,
      round64: 45,
      round128: 10,
    },
    masters1000: {
      winner: 1000,
      finalist: 600,
      semifinalist: 360,
      quarterfinalist: 180,
    },
  },

  // Player statistics
  playerStats: [
    'aces',
    'doubleFaults',
    'firstServePercentage',
    'firstServePointsWon',
    'secondServePointsWon',
    'breakPointsConverted',
    'breakPointsSaved',
    'winners',
    'unforcedErrors',
    'netPointsWon',
    'returnPointsWon',
  ],

  // Match statistics
  matchStats: [
    'totalPointsWon',
    'totalGamesWon',
    'setsWon',
    'matchDuration',
    'longestRally',
  ],
} as const;

export type TennisScoringType = typeof TennisScoring;
