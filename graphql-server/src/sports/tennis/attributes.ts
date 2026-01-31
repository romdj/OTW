/**
 * Tennis - Sport Attributes
 *
 * Defines the structural elements that make tennis unique.
 * Universal across ATP, WTA, Grand Slams, etc.
 */

export const TennisAttributes = {
  // Match structure
  matchFormats: {
    bestOfThree: { sets: 3, tiebreakAt: 6 },
    bestOfFive: { sets: 5, tiebreakAt: 6 },  // Grand Slam men's
  },

  // Game structure
  gamesPerSet: { min: 6, tiebreakThreshold: 6 },
  pointsPerGame: ['0', '15', '30', '40', 'deuce', 'advantage'],

  // Tiebreak rules
  tiebreak: {
    pointsToWin: 7,
    marginRequired: 2,
    finalSetRules: {
      usOpen: 'tiebreak_at_6',
      wimbledon: 'tiebreak_at_12',
      australianOpen: 'super_tiebreak_at_6',
      frenchOpen: 'tiebreak_at_6',
    },
  },

  // Serve rules
  serving: {
    servesPerPoint: 2,  // First serve, second serve
    sidesAlternate: true,
    doublesFaultRules: true,
  },

  // Court dimensions
  courtDimensions: {
    length: 78,  // feet
    widthSingles: 27,
    widthDoubles: 36,
  },

  // Match types
  matchTypes: ['singles', 'doubles', 'mixed_doubles'],

  // Player equipment
  equipment: ['racket', 'balls'],
} as const;

export type TennisAttributesType = typeof TennisAttributes;
