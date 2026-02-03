/**
 * Basketball - Positions
 *
 * Player positions and their roles in basketball.
 */

export const BasketballPositions = {
  traditional: {
    PG: {
      name: 'Point Guard',
      alternateNames: ['The 1', 'Floor General', 'Lead Guard'],
      primaryRole: 'Ball handling, playmaking, organizing offense',
      typicalHeight: { min: '5\'10"', max: '6\'4"' },
      keySkills: ['passing', 'ball_handling', 'court_vision', 'perimeter_defense'],
    },
    SG: {
      name: 'Shooting Guard',
      alternateNames: ['The 2', 'Off Guard', 'Two-Guard'],
      primaryRole: 'Scoring, perimeter shooting, secondary ball handling',
      typicalHeight: { min: '6\'2"', max: '6\'6"' },
      keySkills: ['shooting', 'scoring', 'perimeter_defense', 'off_ball_movement'],
    },
    SF: {
      name: 'Small Forward',
      alternateNames: ['The 3', 'Wing', 'Swingman'],
      primaryRole: 'Versatile scoring, rebounding, defense',
      typicalHeight: { min: '6\'5"', max: '6\'9"' },
      keySkills: ['versatility', 'athleticism', 'wing_defense', 'transition'],
    },
    PF: {
      name: 'Power Forward',
      alternateNames: ['The 4', 'Stretch Four', 'Combo Forward'],
      primaryRole: 'Rebounding, interior scoring, post defense',
      typicalHeight: { min: '6\'7"', max: '6\'11"' },
      keySkills: ['rebounding', 'post_play', 'mid_range', 'screen_setting'],
    },
    C: {
      name: 'Center',
      alternateNames: ['The 5', 'Big Man', 'Pivot'],
      primaryRole: 'Rim protection, rebounding, interior scoring',
      typicalHeight: { min: '6\'9"', max: '7\'4"' },
      keySkills: ['rim_protection', 'rebounding', 'screen_setting', 'post_scoring'],
    },
  },

  modern: {
    PG: {
      modernRole: 'Primary ball handler, often scores heavily too',
      evolution: 'More scoring responsibility, can play off-ball',
      examples: ['Stephen Curry', 'Luka Dončić', 'Damian Lillard'],
    },
    WING: {
      modernRole: 'Combines SG/SF skills, positional flexibility',
      evolution: '3-and-D specialists, two-way players',
      examples: ['Kawhi Leonard', 'Jayson Tatum', 'Paul George'],
    },
    STRETCH_BIG: {
      modernRole: 'PF/C who shoots threes, spaces floor',
      evolution: 'Traditional post play declining, shooting essential',
      examples: ['Kristaps Porziņģis', 'Karl-Anthony Towns', 'Anthony Davis'],
    },
    RIM_RUNNER: {
      modernRole: 'Athletic big who finishes at rim, defends',
      evolution: 'Pick-and-roll finisher, lob threat',
      examples: ['Clint Capela', 'Robert Williams', 'Jarrett Allen'],
    },
    POINT_FORWARD: {
      modernRole: 'Forward who handles ball and runs offense',
      evolution: 'Positionless basketball, versatile playmakers',
      examples: ['LeBron James', 'Ben Simmons', 'Draymond Green'],
    },
  },

  // Positional groupings
  positionalGroups: {
    guards: ['PG', 'SG'],
    forwards: ['SF', 'PF'],
    bigs: ['PF', 'C'],
    wings: ['SG', 'SF'],
    perimeter: ['PG', 'SG', 'SF'],
    frontcourt: ['SF', 'PF', 'C'],
    backcourt: ['PG', 'SG'],
  },

  // Common lineup configurations
  lineupTypes: {
    traditional: 'PG-SG-SF-PF-C',
    small_ball: 'PG-SG-SF-SF-PF or smaller',
    big_ball: 'PG-SG-PF-PF-C or PG-PF-PF-C-C',
    death_lineup: 'Warriors-style small, switching lineup',
  },

  // Position flexibility (how easily players switch positions)
  positionVersatility: {
    combo_guard: ['PG', 'SG'],
    swingman: ['SG', 'SF'],
    combo_forward: ['SF', 'PF'],
    stretch_five: ['PF', 'C'],
    point_forward: ['PG', 'SF'],
  },
} as const;

// TODO: Add position-specific defensive matchup rules
// TODO: Add position scarcity/value analysis
// TODO: Add historical position evolution
// TODO: Add position-specific injury risk profiles
// TODO: Add position-specific advanced metrics
// TODO: Add international position differences
// TODO: Add women's basketball position specifics

export type BasketballPositionsType = typeof BasketballPositions;
