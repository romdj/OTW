/**
 * Basketball - Sport Attributes
 *
 * Defines the structural elements that make basketball unique.
 * Rules vary between leagues (NBA, FIBA, NCAA, etc.)
 */

export const BasketballAttributes = {
  // Game structure - NBA
  nba: {
    quarters: 4,
    quarterLength: 12, // minutes
    halftimeLength: 15, // minutes (can be longer for events)
    shotClock: 24, // seconds
    overtimeLength: 5, // minutes
  },

  // Game structure - FIBA/International
  fiba: {
    quarters: 4,
    quarterLength: 10, // minutes
    halftimeLength: 15, // minutes
    shotClock: 24, // seconds
    overtimeLength: 5, // minutes
  },

  // Game structure - NCAA
  ncaa: {
    halves: 2,
    halfLength: 20, // minutes (men's), 10-minute quarters (women's)
    halftimeLength: 20, // minutes
    shotClock: 30, // seconds (was 35 until 2015)
    overtimeLength: 5, // minutes
  },

  // Court dimensions
  courtDimensions: {
    nba: { length: 94, width: 50, unit: 'feet' },
    fiba: { length: 28, width: 15, unit: 'meters' },
    ncaa: { length: 94, width: 50, unit: 'feet' },
  },

  // Three-point line distance
  threePointLine: {
    nba: { corner: 22, arc: 23.75, unit: 'feet' },
    fiba: { corner: 6.6, arc: 6.75, unit: 'meters' },
    ncaa: { corner: 21.65, arc: 22.15, unit: 'feet' }, // Changed in 2019
  },

  // Team composition
  playersOnCourt: 5,
  rosterSize: {
    nba: { active: 15, gameday: 13 },
    fiba: { active: 12, gameday: 12 },
    ncaa: { scholarship: 13, roster: 15 },
  },

  // Foul rules
  fouls: {
    nba: {
      personalFoulLimit: 6,
      teamFoulBonus: 5, // per quarter
      technicalFouls: true,
      flagrantFouls: true,
    },
    fiba: {
      personalFoulLimit: 5,
      teamFoulBonus: 5, // per quarter
      technicalFouls: true,
      unsportsmanlikeFouls: true,
    },
    ncaa: {
      personalFoulLimit: 5,
      teamFoulBonus: 7, // 1-and-1
      doubleBonus: 10,
      technicalFouls: true,
    },
  },

  // Timeout rules
  timeouts: {
    nba: {
      full: 7, // per game, 75 seconds each
      mandatory: 2, // per half for TV
    },
    fiba: {
      total: 5, // 2 first half, 3 second half
      duration: 60, // seconds
    },
    ncaa: {
      full: 4, // 30 seconds each
      thirtySecond: 2,
      mediaTimeouts: true,
    },
  },

  // Game clock rules
  gameClock: {
    stoppedOnMadeBasket: false, // Only last 2 minutes in NBA
    stoppedOnFreeThrow: true,
    advanceRule: true, // NBA: can advance ball with timeout
  },

  // Replay review
  replayReview: {
    nba: {
      exists: true,
      coachChallenge: true,
      lastTwoMinutes: true,
      reviewablePlays: [
        'out_of_bounds',
        'shot_clock_violations',
        'goaltending',
        'flagrant_fouls',
        'clock_malfunctions',
      ],
    },
    fiba: {
      exists: true,
      instantReplaySystem: true,
    },
  },
} as const;

// TODO: Add EuroLeague specific rules
// TODO: Add WNBA specific rules
// TODO: Add G-League/minor league rules
// TODO: Add 3x3 basketball rules
// TODO: Add high school rules
// TODO: Add historical rule changes (e.g., hand-checking era)
// TODO: Add international tournament rules (FIBA World Cup, Olympics)

export type BasketballAttributesType = typeof BasketballAttributes;
