/**
 * Handball - Sport Attributes
 *
 * Defines the structural elements that make handball unique.
 * Rules governed by IHF (International Handball Federation).
 */

export const HandballAttributes = {
  // Game structure
  halves: 2,
  halfLength: 30, // minutes
  halftimeLength: 10, // minutes (max 15 for international)

  // Overtime (knockout matches)
  overtime: {
    exists: true,
    periods: 2,
    periodLength: 5, // minutes
    breakBetween: 1, // minute
    secondOvertime: true, // If still tied
    penaltyShootout: true, // 7-meter throws if still tied
  },

  // Court dimensions
  courtDimensions: {
    length: 40,
    width: 20,
    unit: 'meters',
    goalArea: {
      radius: 6, // meters from goal
      onlyGoalkeeperAllowed: true,
    },
    freeThrowLine: 9, // meters from goal
    penaltyMark: 7, // meters from goal
  },

  // Goal dimensions
  goalDimensions: {
    width: 3,
    height: 2,
    unit: 'meters',
  },

  // Team composition
  playersOnCourt: 7, // Including goalkeeper
  substitutes: {
    unlimited: true,
    flyingSubstitution: true,
  },
  rosterSize: 16,

  // Ball specifications
  ball: {
    mens: { circumference: [58, 60], weight: [425, 475], unit: { circumference: 'cm', weight: 'g' } },
    womens: { circumference: [54, 56], weight: [325, 375], unit: { circumference: 'cm', weight: 'g' } },
    youth: { circumference: [50, 52], weight: [290, 330], unit: { circumference: 'cm', weight: 'g' } },
  },

  // Suspension rules
  suspensions: {
    twoMinute: true, // Most common
    redCard: true, // Direct disqualification
    blueCard: true, // Disqualification with report
    maxSuspensions: 3, // Third = disqualification
  },

  // Time rules
  timeRules: {
    passivePlay: {
      exists: true,
      warningSignal: true,
      attackMustShoot: true,
    },
    timeoutPerTeam: 3, // Per game
    timeoutDuration: 60, // seconds
    teamTimeoutSecondHalf: 2, // Max 2 in second half
  },

  // Goalkeeper rules
  goalkeeperRules: {
    canLeaveArea: true,
    becomesFieldPlayerOutsideArea: true,
    canScoreGoals: true,
    emptyNet: true, // Team can play without keeper
  },

  // Video proof (since 2016)
  videoProof: {
    exists: true,
    reviewableSituations: [
      'goal_decisions',
      'red_card_situations',
      'seven_meter_decisions',
      'last_30_seconds_decisions',
    ],
  },
} as const;

// TODO: Add beach handball rules
// TODO: Add wheelchair handball rules
// TODO: Add youth age group variations
// TODO: Add historical rule changes
// TODO: Add league-specific variations
// TODO: Add equipment specifications (shoes, resin)

export type HandballAttributesType = typeof HandballAttributes;
