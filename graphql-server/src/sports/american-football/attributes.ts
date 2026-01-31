/**
 * American Football - Sport Attributes
 *
 * Defines the structural elements unique to American football.
 */

export const AmericanFootballAttributes = {
  // Game structure
  quarters: 4,
  quarterLength: 15, // minutes
  halftimeLength: 20, // minutes (can be longer for Super Bowl)

  // Overtime rules
  overtime: {
    exists: true,
    suddenDeath: false, // Not since 2012 for NFL
    length: 10, // minutes per period
    format: 'modified_sudden_death', // Both teams get possession unless first scores TD
  },

  // Downs system
  downs: {
    total: 4,
    yardsRequired: 10,
    resetOnFirstDown: true,
  },

  // Field dimensions
  fieldDimensions: {
    length: 100, // yards (plus two 10-yard end zones)
    width: 53.33, // yards
    endZoneDepth: 10,
  },

  // Team composition
  playersOnField: 11,
  rosterSize: { active: 53, gameDay: 46 },

  // Time management
  playClock: 40, // seconds
  timeouts: { perHalf: 3, perOvertime: 2 },
  twoMinuteWarning: true,

  // Challenges
  coachesChallenge: {
    available: 2,
    requiresTimeout: true,
  },
} as const;

export type AmericanFootballAttributesType = typeof AmericanFootballAttributes;
