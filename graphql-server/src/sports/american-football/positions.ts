/**
 * American Football - Player Positions
 */

export const AmericanFootballPositions = {
  offense: {
    quarterback: { abbrev: 'QB', role: 'Passes and leads offense' },
    runningBack: { abbrev: 'RB', role: 'Carries the ball, catches passes' },
    fullback: { abbrev: 'FB', role: 'Blocking back, short yardage' },
    wideReceiver: { abbrev: 'WR', role: 'Catches passes downfield' },
    tightEnd: { abbrev: 'TE', role: 'Blocks and catches passes' },
    offensiveTackle: { abbrev: 'OT', role: 'Protects QB from edge' },
    offensiveGuard: { abbrev: 'OG', role: 'Interior blocking' },
    center: { abbrev: 'C', role: 'Snaps ball, calls protections' },
  },

  defense: {
    defensiveEnd: { abbrev: 'DE', role: 'Edge rusher, run stopper' },
    defensiveTackle: { abbrev: 'DT', role: 'Interior pass rush, run stop' },
    linebacker: { abbrev: 'LB', role: 'Run support, pass coverage' },
    cornerback: { abbrev: 'CB', role: 'Covers wide receivers' },
    safety: { abbrev: 'S', role: 'Deep coverage, run support' },
  },

  specialTeams: {
    kicker: { abbrev: 'K', role: 'Field goals, extra points, kickoffs' },
    punter: { abbrev: 'P', role: 'Punts on fourth down' },
    longSnapper: { abbrev: 'LS', role: 'Snaps for punts and kicks' },
    kickReturner: { abbrev: 'KR', role: 'Returns kickoffs' },
    puntReturner: { abbrev: 'PR', role: 'Returns punts' },
  },

  // Formation types
  formations: {
    offense: ['shotgun', 'under_center', 'pistol', 'wildcat', 'goal_line'],
    defense: ['4-3', '3-4', 'nickel', 'dime', 'goal_line'],
  },
} as const;

export type AmericanFootballPositionsType = typeof AmericanFootballPositions;
