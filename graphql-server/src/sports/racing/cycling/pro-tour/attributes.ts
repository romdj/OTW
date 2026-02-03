/**
 * Pro Cycling - Discipline-Specific Attributes
 *
 * Detailed attributes for UCI WorldTour professional road cycling.
 */

export const ProCyclingAttributes = {
  // Competition hierarchy
  hierarchy: {
    worldTour: {
      description: 'Top tier of professional cycling',
      teams: 18, // WorldTour teams
      races: 'mandatory_calendar',
    },
    proSeries: {
      description: 'Second tier races',
      access: 'invitation_based',
    },
    continentalCircuits: ['Europe', 'America', 'Asia', 'Africa', 'Oceania'],
  },

  // Race types
  raceTypes: {
    grandTour: {
      races: ['Tour de France', 'Giro d\'Italia', 'Vuelta a Espana'],
      duration: 21, // stages
      totalDays: 23, // including rest days
      jerseys: {
        yellow: 'Overall leader (Tour)',
        pink: 'Overall leader (Giro)',
        red: 'Overall leader (Vuelta)',
        green: 'Points classification',
        polkaDot: 'Mountains classification',
        white: 'Best young rider',
      },
      teamSize: 8,
    },
    monument: {
      races: [
        'Milan-San Remo',
        'Tour of Flanders',
        'Paris-Roubaix',
        'Liege-Bastogne-Liege',
        'Il Lombardia',
      ],
      prestige: 'highest_one_day',
      characteristics: {
        'Milan-San Remo': 'longest_one_day_300km',
        'Tour of Flanders': 'cobbled_hellingen',
        'Paris-Roubaix': 'hell_of_the_north_cobbles',
        'Liege-Bastogne-Liege': 'ardennes_climbs',
        'Il Lombardia': 'fall_classic_climbs',
      },
    },
    stageRace: {
      duration: '2_to_10_stages',
      examples: ['Paris-Nice', 'Tirreno-Adriatico', 'Tour de Suisse'],
    },
    oneDay: {
      classic: ['Strade Bianche', 'E3 Harelbeke', 'Gent-Wevelgem'],
      worldChampionships: 'annual_rainbow_jersey',
    },
  },

  // Rider classifications
  riderTypes: {
    gc_contender: {
      name: 'GC Contender / All-rounder',
      skills: ['climbing', 'time_trial', 'recovery'],
      role: 'Win overall classification',
      examples: ['Tadej Pogacar', 'Jonas Vingegaard', 'Primoz Roglic'],
    },
    climber: {
      name: 'Climber / Grimpeur',
      skills: ['mountain_climbing', 'acceleration', 'low_weight'],
      role: 'Attack on climbs, mountain stages',
      examples: ['Egan Bernal', 'Richard Carapaz', 'Nairo Quintana'],
    },
    sprinter: {
      name: 'Sprinter',
      skills: ['top_speed', 'positioning', 'timing'],
      role: 'Win flat stages in bunch sprint',
      examples: ['Jasper Philipsen', 'Fabio Jakobsen', 'Mark Cavendish'],
    },
    rouleur: {
      name: 'Rouleur / Classics specialist',
      skills: ['power', 'endurance', 'cobbles'],
      role: 'Win cobbled classics and hard one-day races',
      examples: ['Mathieu van der Poel', 'Wout van Aert', 'Mads Pedersen'],
    },
    time_trialist: {
      name: 'Time Trialist',
      skills: ['sustained_power', 'aerodynamics', 'pacing'],
      role: 'Win individual time trials',
      examples: ['Filippo Ganna', 'Stefan Kung', 'Joshua Tarling'],
    },
    domestique: {
      name: 'Domestique',
      skills: ['sacrifice', 'work_rate', 'versatility'],
      role: 'Support team leaders',
      examples: ['Most professional cyclists'],
    },
    breakaway_specialist: {
      name: 'Breakaway Specialist',
      skills: ['courage', 'timing', 'solo_power'],
      role: 'Attack from breakaways',
    },
  },

  // Team tactics
  tactics: {
    leadout_train: {
      description: 'Organized high-speed formation for sprinter',
      positions: ['last_man', 'penultimate', 'train_engine'],
    },
    tempo_control: {
      description: 'Team controls peloton pace',
      purpose: 'Protect leader, catch breakaway',
    },
    breakaway: {
      description: 'Attack from peloton',
      types: ['early_break', 'late_attack', 'solo_flyer'],
    },
    echelon: {
      description: 'Diagonal formation in crosswind',
      effect: 'Splits peloton, gains time',
    },
    domestique_work: {
      description: 'Support rider duties',
      tasks: ['fetching_bottles', 'pacing', 'positioning', 'sacrifice'],
    },
  },

  // Iconic climbs
  iconicClimbs: {
    tourDeFrance: {
      alpe_dhuez: { gradient: 8.1, length: 13.8, category: 'HC' },
      mont_ventoux: { gradient: 7.5, length: 21.5, category: 'HC' },
      col_du_tourmalet: { gradient: 7.4, length: 17.2, category: 'HC' },
      col_du_galibier: { gradient: 6.9, length: 17.7, category: 'HC' },
    },
    giro: {
      stelvio: { gradient: 7.4, length: 24.3, category: 'HC' },
      mortirolo: { gradient: 10.5, length: 12.4, category: 'HC' },
      zoncolan: { gradient: 11.9, length: 10.1, category: 'HC' },
    },
    vuelta: {
      angliru: { gradient: 9.9, length: 12.5, category: 'HC' },
      lagos_de_covadonga: { gradient: 7.3, length: 12.5, category: 'HC' },
    },
  },

  // Historical records
  records: {
    tourDefranceWins: { holder: 'Lance Armstrong* / Jacques Anquetil / Eddy Merckx / Bernard Hinault / Miguel Indurain', count: 5 },
    giroWins: { holder: 'Alfredo Binda / Fausto Coppi / Eddy Merckx', count: 5 },
    vueltaWins: { holder: 'Roberto Heras', count: 4 },
    monumentsWon: { holder: 'Eddy Merckx', count: 19 },
    worldChampionships: { holder: 'Alfredo Binda / Rik Van Steenbergen / Eddy Merckx / Oscar Freire / Peter Sagan', count: 3 },
    hourRecord: { holder: 'Filippo Ganna', distance: 56.792 }, // km
  },

  // Equipment
  equipment: {
    bikes: {
      road: 'standard_road_racing',
      tt: 'time_trial_aerodynamic',
      weight_limit: 6.8, // kg UCI minimum
    },
    clothing: {
      jersey: 'team_colors_or_classification',
      bibshorts: 'team_colors',
      helmet: 'mandatory',
    },
  },

  // Legends
  legends: [
    'Eddy Merckx',
    'Bernard Hinault',
    'Fausto Coppi',
    'Jacques Anquetil',
    'Miguel Indurain',
    'Marco Pantani',
    'Laurent Fignon',
    'Greg LeMond',
    'Alberto Contador',
    'Chris Froome',
  ],
} as const;

// TODO: Add WorldTour team rosters
// TODO: Add current UCI rankings integration
// TODO: Add race calendar by month
// TODO: Add climb gradient profiles
// TODO: Add power output benchmarks by category
// TODO: Add doping history and clean sport initiatives
// TODO: Add weather impact on race strategies
// TODO: Add nutrition and hydration data
// TODO: Add team bus and support vehicle data
// TODO: Add race radio communication rules
// TODO: Add time limit calculations
// TODO: Add sprint point locations
// TODO: Add mountain point categories
// TODO: Add intermediate sprint bonuses
// TODO: Add women's WorldTour integration
// TODO: Add development team pathways
// TODO: Add national team competitions

export type ProCyclingAttributesType = typeof ProCyclingAttributes;
