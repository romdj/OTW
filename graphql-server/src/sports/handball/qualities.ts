/**
 * Handball - Subjective Quality Factors
 *
 * What makes a handball match worth watching?
 */

export const HandballQualities = {
  // Intrinsic sport characteristics
  paceOfPlay: 'very_fast',
  scoringFrequency: 'high', // 50-70 goals per game typical
  physicalityLevel: 'high',
  skillCeiling: 'very_high',
  comebackPotential: 'high', // Fast pace allows big swings

  // What makes a handball match "must-watch"
  excitementFactors: [
    'overtime_thriller',
    'comeback_victory',
    'goalkeeper_heroics',
    'fast_break_fest',
    'last_second_winner',
    'penalty_shootout',
    'defensive_battle',
    'high_scoring_affair',
    'rivalry_match',
    'championship_final',
    'olympic_drama',
    'individual_brilliance',
    'tactical_masterclass',
    'hostile_atmosphere',
    'underdog_upset',
  ],

  // Emotional tagging vocabulary
  emotionalTags: {
    tension: [
      'nail-biter',
      'one-goal-game',
      'final-attack',
      'save-fest',
      'defensive-war',
    ],
    excitement: [
      'goal-fest',
      'fast-break-festival',
      'end-to-end',
      'high-octane',
      'attacking-showcase',
    ],
    drama: [
      'last-gasp',
      'comeback-kings',
      'upset-alert',
      'overtime-classic',
      'shootout-drama',
      'championship-decider',
    ],
    skill: [
      'goalkeeper-masterclass',
      'shooting-clinic',
      'passing-perfection',
      'wing-wizardry',
      'pivot-power',
    ],
    physicality: [
      'physical-battle',
      'hard-fought',
      'defensive-intensity',
      'contact-sport',
    ],
  },

  // Significance markers
  significanceIndicators: {
    historical: [
      'record_breaking',
      'first_in_history',
      'milestone_match',
      'dynasty_defining',
    ],
    stakes: [
      'world_championship_final',
      'european_championship_final',
      'champions_league_final',
      'olympic_medal_match',
      'elimination_game',
      'group_stage_decider',
    ],
    individual: [
      'mvp_performance',
      'scoring_record',
      'save_record',
      'perfect_game_goalkeeper',
      'hat_trick_of_penalties',
    ],
  },

  // Watchability score factors
  watchabilityWeights: {
    closeScore: 0.25,
    overtime: 0.20,
    momentumSwings: 0.15,
    stakesLevel: 0.15,
    rivalryFactor: 0.10,
    goalkeeperDuel: 0.10,
    crowdAtmosphere: 0.05,
  },

  // National team powerhouses
  powerhouses: {
    mens: ['Denmark', 'France', 'Germany', 'Spain', 'Norway', 'Sweden', 'Croatia', 'Egypt'],
    womens: ['Norway', 'France', 'Denmark', 'Netherlands', 'Sweden', 'Russia', 'Spain'],
  },

  // Club powerhouses
  clubPowerhouses: {
    mens: ['Barcelona', 'PSG', 'THW Kiel', 'Veszprém', 'Flensburg', 'Magdeburg'],
    womens: ['Győr', 'Brest', 'Vipers Kristiansand', 'CSM București'],
  },

  // Competition prestige
  competitionPrestige: {
    tier1: [
      'Olympic Games',
      'IHF World Championship',
      'EHF European Championship',
      'EHF Champions League',
    ],
    tier2: [
      'EHF European League',
      'Top national leagues (Bundesliga, LNH, Liga ASOBAL)',
    ],
  },
} as const;

// TODO: Add beach handball specific factors
// TODO: Add referee influence factors
// TODO: Add travel/schedule impact
// TODO: Add weather/venue factors
// TODO: Add national team vs club distinction
// TODO: Add youth development storylines

export type HandballQualitiesType = typeof HandballQualities;
