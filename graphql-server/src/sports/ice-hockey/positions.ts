/**
 * Ice Hockey - Player Positions
 *
 * Defines the roles and positions in ice hockey.
 */

export const IceHockeyPositions = {
  forwards: {
    center: {
      abbrev: 'C',
      description: 'Plays in the middle, takes faceoffs, plays both ends',
      keyStats: ['faceoffPercentage', 'points', 'plusMinus'],
    },
    leftWing: {
      abbrev: 'LW',
      description: 'Plays on the left side, typically offensive-minded',
      keyStats: ['goals', 'shots', 'hits'],
    },
    rightWing: {
      abbrev: 'RW',
      description: 'Plays on the right side, typically offensive-minded',
      keyStats: ['goals', 'shots', 'hits'],
    },
  },

  defensemen: {
    leftDefense: {
      abbrev: 'LD',
      description: 'Defensive player on the left side',
      keyStats: ['blocks', 'hits', 'timeOnIce', 'plusMinus'],
    },
    rightDefense: {
      abbrev: 'RD',
      description: 'Defensive player on the right side',
      keyStats: ['blocks', 'hits', 'timeOnIce', 'plusMinus'],
    },
  },

  goaltender: {
    goalie: {
      abbrev: 'G',
      description: 'Last line of defense, prevents goals',
      keyStats: ['savePercentage', 'goalsAgainstAverage', 'wins', 'shutouts'],
    },
  },

  // Line combinations
  lines: {
    forwardLines: ['first', 'second', 'third', 'fourth'],
    defensePairs: ['first', 'second', 'third'],
  },

  // Special teams roles
  specialTeamsRoles: [
    'powerPlayQuarterback',  // D-man running the PP
    'netFrontPresence',      // Forward in front of net
    'pointShooter',          // One-timer specialist
    'penaltyKiller',         // Short-handed specialist
  ],
} as const;

export type IceHockeyPositionsType = typeof IceHockeyPositions;
