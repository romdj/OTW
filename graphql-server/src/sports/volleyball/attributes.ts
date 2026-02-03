/**
 * Volleyball - Sport Attributes
 *
 * Defines the structural elements that make volleyball unique.
 * Indoor volleyball rules (FIVB) - Beach volleyball has variations.
 */

export const VolleyballAttributes = {
  // Game structure - Indoor
  indoor: {
    setsToWin: 3, // Best of 5 sets
    pointsPerSet: 25,
    finalSetPoints: 15, // Fifth set
    winByTwo: true,
    maxPoints: null, // No cap, must win by 2
    timeouts: {
      perSet: 2,
      duration: 30, // seconds
      technicalTimeouts: true, // At 8 and 16 points
    },
  },

  // Game structure - Beach
  beach: {
    setsToWin: 2, // Best of 3 sets
    pointsPerSet: 21,
    finalSetPoints: 15,
    winByTwo: true,
    maxPoints: null,
    timeouts: {
      perSet: 1,
      duration: 30, // seconds
    },
    sideSwitches: {
      pointInterval: 7, // Switch sides every 7 points
      finalSet: 5, // Every 5 points in third set
    },
  },

  // Court dimensions
  courtDimensions: {
    indoor: {
      length: 18,
      width: 9,
      unit: 'meters',
      attackLine: 3, // meters from net
    },
    beach: {
      length: 16,
      width: 8,
      unit: 'meters',
    },
  },

  // Net heights
  netHeight: {
    mens: 2.43, // meters
    womens: 2.24,
    unit: 'meters',
  },

  // Team composition
  players: {
    indoor: {
      onCourt: 6,
      libero: 2, // Defensive specialists
      roster: 14,
    },
    beach: {
      onCourt: 2,
      roster: 2,
    },
  },

  // Rotation and position rules
  rotation: {
    exists: true,
    clockwise: true,
    positions: 6,
    servingPosition: 1, // Back right
    liberoRestrictions: ['cannot_serve', 'cannot_attack_above_net', 'back_row_only'],
  },

  // Contact rules
  contactRules: {
    maxTouches: 3,
    blockNotCounted: true, // Block doesn't count as touch
    doubleContactOnFirstTouch: true, // Allowed on reception
    carryingAllowed: false,
    footContact: true, // Allowed since rule change
  },

  // Challenge/Review system
  challengeSystem: {
    indoor: {
      exists: true,
      challengesPerSet: 2,
      unsuccessfulKeep: false, // Lose challenge if wrong
    },
    beach: {
      exists: true,
      challengesPerMatch: 1,
    },
  },

  // Scoring system evolution
  scoringHistory: {
    rallyScoring: {
      introducedIndoor: 1999,
      introducedBeach: 2001,
      description: 'Point on every rally regardless of serve',
    },
    sideoutScoring: {
      description: 'Old system: Only serving team could score',
      abolished: 1999,
    },
  },
} as const;

// TODO: Add sitting volleyball attributes
// TODO: Add snow volleyball attributes
// TODO: Add youth/junior rule variations
// TODO: Add league-specific variations (AVP, CEV, etc.)
// TODO: Add historical rule changes timeline
// TODO: Add equipment specifications

export type VolleyballAttributesType = typeof VolleyballAttributes;
