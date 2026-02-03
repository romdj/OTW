/**
 * Volleyball - Positions
 *
 * Player positions and their roles in volleyball.
 */

export const VolleyballPositions = {
  indoor: {
    setter: {
      name: 'Setter',
      abbreviation: 'S',
      courtPositions: [1, 2], // Typical starting rotations
      primaryRole: 'Orchestrating offense, setting attackers',
      keySkills: ['setting_accuracy', 'court_vision', 'quick_hands', 'decision_making'],
      description: 'The quarterback of volleyball, touches ball on second contact',
    },
    outsideHitter: {
      name: 'Outside Hitter',
      abbreviation: 'OH',
      alternateNames: ['Left Side Hitter', 'Wing Spiker'],
      courtPositions: [4, 5],
      primaryRole: 'Primary attacker, serve receive, back row attack',
      keySkills: ['attacking', 'serve_receive', 'back_row_attack', 'blocking'],
      description: 'Most complete player, involved in all phases',
    },
    oppositeHitter: {
      name: 'Opposite Hitter',
      abbreviation: 'OPP',
      alternateNames: ['Right Side Hitter', 'Opposite'],
      courtPositions: [1, 2],
      primaryRole: 'Secondary attacker, blocking left side',
      keySkills: ['attacking', 'blocking', 'back_row_attack'],
      description: 'Often highest scorer, opposite the setter',
    },
    middleBlocker: {
      name: 'Middle Blocker',
      abbreviation: 'MB',
      alternateNames: ['Middle Hitter', 'Center'],
      courtPositions: [3, 6],
      primaryRole: 'First line of defense at net, quick attacks',
      keySkills: ['blocking', 'quick_attacks', 'read_blocking', 'serving'],
      description: 'Dominant at the net, runs quick offensive plays',
    },
    libero: {
      name: 'Libero',
      abbreviation: 'L',
      alternateNames: ['Defensive Specialist'],
      courtPositions: [5, 6], // Back row only
      primaryRole: 'Serve receive, back row defense',
      keySkills: ['passing', 'digging', 'court_coverage', 'leadership'],
      restrictions: ['cannot_attack_above_net', 'cannot_serve', 'back_row_only', 'different_jersey'],
      description: 'Defensive specialist, unlimited substitutions',
    },
    defensiveSpecialist: {
      name: 'Defensive Specialist',
      abbreviation: 'DS',
      courtPositions: [5, 6],
      primaryRole: 'Back row defense and serve receive',
      keySkills: ['passing', 'digging', 'serving'],
      description: 'Substitutes for weaker back row players',
    },
  },

  beach: {
    blocker: {
      name: 'Blocker',
      primaryRole: 'Net defense, setting when partner receives',
      keySkills: ['blocking', 'setting', 'shot_defending'],
    },
    defender: {
      name: 'Defender',
      primaryRole: 'Serve receive, court defense, attacking',
      keySkills: ['passing', 'digging', 'attacking', 'serving'],
    },
    note: 'Beach players must be versatile - both play all roles',
  },

  // Court positions (numbered 1-6)
  courtPositions: {
    1: { name: 'Right Back', zone: 'back_right', servingPosition: true },
    2: { name: 'Right Front', zone: 'front_right' },
    3: { name: 'Middle Front', zone: 'front_center' },
    4: { name: 'Left Front', zone: 'front_left' },
    5: { name: 'Left Back', zone: 'back_left' },
    6: { name: 'Middle Back', zone: 'back_center' },
  },

  // Common formations
  formations: {
    '5-1': {
      description: 'One setter, always sets when in back row',
      setters: 1,
      attackers: 5,
      mostCommon: true,
    },
    '6-2': {
      description: 'Two setters, only set from back row',
      setters: 2,
      attackers: 6, // All players attack when in front row
      advantages: 'Always 3 attackers in front row',
    },
    '4-2': {
      description: 'Two setters, set from front row',
      setters: 2,
      attackers: 4,
      level: 'Beginner/intermediate',
    },
  },
} as const;

// TODO: Add position-specific training focuses
// TODO: Add physical requirements by position
// TODO: Add position-specific injury risks
// TODO: Add historical position evolution
// TODO: Add youth development pathways by position

export type VolleyballPositionsType = typeof VolleyballPositions;
