/**
 * Handball - Positions
 *
 * Player positions and their roles in handball.
 */

export const HandballPositions = {
  goalkeeper: {
    GK: {
      name: 'Goalkeeper',
      alternateNames: ['Keeper', 'Goalie'],
      primaryRole: 'Shot stopping, starting fast breaks',
      keySkills: ['reflexes', 'positioning', 'shot_reading', 'distribution'],
      physicalRequirements: ['height', 'reach', 'agility'],
      description: 'Last line of defense, can become 7th field player',
    },
  },

  fieldPlayers: {
    LW: {
      name: 'Left Wing',
      alternateNames: ['Left Winger'],
      primaryRole: 'Scoring from acute angles, fast breaks',
      keySkills: ['shooting_accuracy', 'speed', 'agility', 'finishing'],
      typicalPhysique: 'Smaller, very fast',
      description: 'Specialists in scoring from wing positions',
    },
    RW: {
      name: 'Right Wing',
      alternateNames: ['Right Winger'],
      primaryRole: 'Scoring from acute angles, fast breaks',
      keySkills: ['shooting_accuracy', 'speed', 'agility', 'finishing'],
      typicalPhysique: 'Smaller, very fast',
      description: 'Mirror of left wing on opposite side',
    },
    LB: {
      name: 'Left Back',
      alternateNames: ['Left Backcourt Player'],
      primaryRole: 'Playmaking, long-range shooting, defense',
      keySkills: ['powerful_shot', 'playmaking', 'defense', 'passing'],
      typicalPhysique: 'Tall, powerful',
      description: 'Often the main playmaker and scorer',
    },
    CB: {
      name: 'Center Back',
      alternateNames: ['Playmaker', 'Center'],
      primaryRole: 'Organizing attack, distributing ball',
      keySkills: ['court_vision', 'passing', 'playmaking', 'decision_making'],
      typicalPhysique: 'Medium build, high IQ',
      description: 'The quarterback, orchestrates all attacking plays',
    },
    RB: {
      name: 'Right Back',
      alternateNames: ['Right Backcourt Player'],
      primaryRole: 'Long-range shooting, playmaking support',
      keySkills: ['powerful_shot', 'defense', 'passing'],
      typicalPhysique: 'Tall, powerful',
      description: 'Secondary playmaker, strong shooter',
    },
    PIV: {
      name: 'Pivot',
      alternateNames: ['Line Player', 'Circle Runner'],
      primaryRole: 'Creating space, close-range finishing, screening',
      keySkills: ['strength', 'body_positioning', 'finishing', 'screening'],
      typicalPhysique: 'Strong, physical',
      description: 'Operates on the 6-meter line, creates chaos in defense',
    },
  },

  // Defensive formations
  defensiveFormations: {
    '6-0': {
      description: 'All 6 defenders on the goal area line',
      strengths: ['compact', 'hard_to_penetrate'],
      weaknesses: ['vulnerable_to_long_shots'],
      usage: 'Most common formation',
    },
    '5-1': {
      description: '5 back, 1 defender advanced',
      strengths: ['pressure_on_playmaker', 'disrupts_rhythm'],
      weaknesses: ['gaps_behind_advanced_player'],
      usage: 'Against strong playmakers',
    },
    '3-2-1': {
      description: 'Three layers of defense',
      strengths: ['maximum_disruption', 'aggressive'],
      weaknesses: ['requires_high_fitness', 'risky'],
      usage: 'High-press situations',
    },
    '4-2': {
      description: '4 back, 2 advanced',
      strengths: ['balanced_pressure'],
      weaknesses: ['requires_coordination'],
      usage: 'Balanced approach',
    },
  },

  // Offensive formations
  offensiveFormations: {
    '3-3': {
      description: '3 backcourt, 3 frontcourt (wings + pivot)',
      usage: 'Most common',
    },
    '2-4': {
      description: '2 back, 4 front (double pivot)',
      usage: 'When opponents use 5-1 or 3-2-1',
    },
    'seven_players': {
      description: 'Empty net, 7 field players',
      usage: 'When trailing, power play',
      risk: 'high',
    },
  },
} as const;

// TODO: Add position-specific training requirements
// TODO: Add position evolution over time
// TODO: Add national team position preferences by country
// TODO: Add youth position development paths
// TODO: Add beach handball position differences

export type HandballPositionsType = typeof HandballPositions;
