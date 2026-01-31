/**
 * Ice Hockey - Sport Attributes
 *
 * Defines the structural elements that make ice hockey unique as a sport.
 * These are universal across all ice hockey leagues (NHL, KHL, SHL, etc.)
 */

export const IceHockeyAttributes = {
  // Game structure
  periods: 3,
  periodLength: 20, // minutes
  intermissionLength: 18, // minutes

  // Overtime rules (vary by league, these are common patterns)
  overtime: {
    exists: true,
    sudden_death: true,
    reducedPlayers: true, // 3-on-3 in many leagues
  },

  shootout: {
    exists: true,
    roundsMinimum: 3,
  },

  // Physical characteristics
  rinkDimensions: {
    nhl: { length: 200, width: 85, unit: 'feet' },
    international: { length: 60, width: 30, unit: 'meters' },
  },

  // Team composition
  playersOnIce: 6, // including goalie
  rosterSize: { min: 18, max: 23 },

  // Penalties
  penaltyTypes: ['minor', 'major', 'misconduct', 'game_misconduct', 'match'],
  penaltyDurations: {
    minor: 2,
    major: 5,
    misconduct: 10,
  },

  // Power play situations
  specialTeams: ['power_play', 'penalty_kill', 'even_strength', '4_on_4', '3_on_3'],
} as const;

export type IceHockeyAttributesType = typeof IceHockeyAttributes;
