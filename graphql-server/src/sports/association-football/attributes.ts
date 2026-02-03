/**
 * Association Football (Soccer) - Sport Attributes
 *
 * Defines the structural elements that make football unique as a sport.
 * These are governed by the Laws of the Game (IFAB) and apply universally.
 */

export const AssociationFootballAttributes = {
  // Game structure
  halves: 2,
  halfLength: 45, // minutes
  halftimeLength: 15, // minutes

  // Added/Stoppage time
  stoppageTime: {
    exists: true,
    determinedBy: 'referee',
    typicalRange: { min: 1, max: 10 }, // minutes per half
  },

  // Extra time (knockout matches only)
  extraTime: {
    exists: true,
    periods: 2,
    periodLength: 15, // minutes
    goldenGoal: false, // Abolished in 2004
    silverGoal: false, // Abolished in 2004
  },

  // Penalty shootout
  penaltyShootout: {
    exists: true,
    roundsMinimum: 5,
    suddenDeath: true,
  },

  // Field dimensions (per FIFA)
  fieldDimensions: {
    length: { min: 100, max: 110, unit: 'meters' },
    width: { min: 64, max: 75, unit: 'meters' },
    penaltyArea: { length: 16.5, width: 40.3, unit: 'meters' },
    goalSize: { width: 7.32, height: 2.44, unit: 'meters' },
  },

  // Team composition
  playersOnField: 11,
  substitutes: {
    standard: 3,
    extended: 5, // Used in some competitions post-COVID
  },
  rosterSize: { min: 18, max: 25 }, // Varies by competition

  // Card system
  cards: ['yellow', 'red'],
  cardRules: {
    yellowAccumulation: 2, // Two yellows = red
    suspensionThreshold: 5, // Yellow cards in league play
  },

  // Offside rule
  offside: {
    exists: true,
    enforcedBy: 'assistant_referee',
    varAssisted: true,
  },

  // VAR (Video Assistant Referee)
  var: {
    introduced: 2018,
    reviewableDecisions: [
      'goals',
      'penalty_decisions',
      'direct_red_cards',
      'mistaken_identity',
    ],
  },
} as const;

// TODO: Add league-specific rule variations (e.g., MLS playoffs, different sub rules)
// TODO: Add youth/amateur variations
// TODO: Add futsal attributes as a variant
// TODO: Add beach soccer attributes as a variant
// TODO: Add historical rule changes timeline

export type AssociationFootballAttributesType = typeof AssociationFootballAttributes;
