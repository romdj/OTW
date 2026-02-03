/**
 * Association Football (Soccer) - Positions
 *
 * Player positions and their roles in football.
 */

export const AssociationFootballPositions = {
  goalkeeper: {
    GK: {
      name: 'Goalkeeper',
      alternateNames: ['Keeper', 'Goalie', 'Netminder'],
      primaryRole: 'Shot stopping and organizing defense',
      modernRole: 'Sweeper-keeper, distribution, building from back',
    },
  },

  defenders: {
    CB: {
      name: 'Centre-Back',
      alternateNames: ['Central Defender', 'Stopper'],
      primaryRole: 'Marking, aerial duels, blocking shots',
      variations: ['ball_playing_cb', 'stopper', 'sweeper'],
    },
    LB: {
      name: 'Left-Back',
      alternateNames: ['Left Defender'],
      primaryRole: 'Defending left flank, supporting attacks',
      modernRole: 'Overlapping runs, crossing, inverted positioning',
    },
    RB: {
      name: 'Right-Back',
      alternateNames: ['Right Defender'],
      primaryRole: 'Defending right flank, supporting attacks',
      modernRole: 'Overlapping runs, crossing, inverted positioning',
    },
    LWB: {
      name: 'Left Wing-Back',
      primaryRole: 'Hybrid defender/winger in 3-back systems',
      formations: ['3-4-3', '3-5-2', '5-3-2'],
    },
    RWB: {
      name: 'Right Wing-Back',
      primaryRole: 'Hybrid defender/winger in 3-back systems',
      formations: ['3-4-3', '3-5-2', '5-3-2'],
    },
  },

  midfielders: {
    CDM: {
      name: 'Central Defensive Midfielder',
      alternateNames: ['Holding Midfielder', 'Anchor', 'Number 6'],
      primaryRole: 'Breaking up play, shielding defense, distribution',
      famousExamples: ['Busquets', 'Casemiro', 'Fabinho'],
    },
    CM: {
      name: 'Central Midfielder',
      alternateNames: ['Box-to-Box', 'Number 8'],
      primaryRole: 'Linking defense and attack, all-round contribution',
      variations: ['box_to_box', 'mezzala', 'carrilero'],
    },
    CAM: {
      name: 'Central Attacking Midfielder',
      alternateNames: ['Playmaker', 'Number 10', 'Trequartista'],
      primaryRole: 'Creating chances, final third play, scoring',
      famousExamples: ['Zidane', 'Iniesta', 'De Bruyne'],
    },
    LM: {
      name: 'Left Midfielder',
      primaryRole: 'Width on left side, crossing, tracking back',
    },
    RM: {
      name: 'Right Midfielder',
      primaryRole: 'Width on right side, crossing, tracking back',
    },
  },

  forwards: {
    LW: {
      name: 'Left Winger',
      alternateNames: ['Left Forward'],
      primaryRole: 'Attacking from left flank, cutting inside, crossing',
      variations: ['traditional_winger', 'inverted_winger', 'inside_forward'],
    },
    RW: {
      name: 'Right Winger',
      alternateNames: ['Right Forward'],
      primaryRole: 'Attacking from right flank, cutting inside, crossing',
      variations: ['traditional_winger', 'inverted_winger', 'inside_forward'],
    },
    CF: {
      name: 'Centre-Forward',
      alternateNames: ['Striker', 'Number 9'],
      primaryRole: 'Scoring goals, leading the line',
      variations: ['target_man', 'poacher', 'complete_forward', 'false_9'],
    },
    ST: {
      name: 'Striker',
      alternateNames: ['Forward', 'Attacker'],
      primaryRole: 'Primary goal scorer',
    },
    SS: {
      name: 'Second Striker',
      alternateNames: ['Support Striker', 'Shadow Striker'],
      primaryRole: 'Playing off main striker, link-up play, scoring',
    },
  },

  // Common formations
  formations: {
    classic: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '4-1-4-1'],
    modern: ['4-3-3', '4-2-3-1', '3-4-3', '4-1-2-1-2', '5-3-2'],
    attacking: ['4-3-3', '3-4-3', '4-2-4'],
    defensive: ['5-4-1', '5-3-2', '4-5-1', '6-3-1'],
  },

  // Positional flexibility
  positionalGroups: {
    defense: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB'],
    midfield: ['CDM', 'CM', 'CAM', 'LM', 'RM'],
    attack: ['LW', 'RW', 'CF', 'ST', 'SS'],
  },
} as const;

// TODO: Add position heat maps typical ranges
// TODO: Add position-specific key performance indicators
// TODO: Add tactical role variations (e.g., regista, mezzala, enganche)
// TODO: Add historical position evolution
// TODO: Add position versatility mappings
// TODO: Add formation transition patterns
// TODO: Add pressing trigger positions
// TODO: Add set piece responsibility positions

export type AssociationFootballPositionsType = typeof AssociationFootballPositions;
