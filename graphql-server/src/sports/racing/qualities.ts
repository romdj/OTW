/**
 * Racing - Watchability Qualities
 *
 * Emotional and entertainment factors that make motorsport races worth watching.
 * Applies across racing disciplines with discipline-specific extensions.
 */

export const RacingQualities = {
  // Emotional tags for racing events
  emotionalTags: {
    tension: [
      'title_decider',
      'final_lap_drama',
      'pit_stop_gamble',
      'fuel_strategy_tension',
      'weather_uncertainty',
      'mechanical_worry',
      'penalty_controversy',
      'points_permutations',
      'survival_mode',
      'photo_finish',
    ] as const,
    excitement: [
      'overtake_fest',
      'wheel_to_wheel',
      'multiple_leaders',
      'undercut_chaos',
      'restart_madness',
      'slipstream_battle',
      'drs_train_breaks',
      'pack_racing',
      'sprint_to_the_line',
      'flag_to_flag_battle',
    ] as const,
    drama: [
      'crash_recovery',
      'team_orders_controversy',
      'penalty_drama',
      'mechanical_failure',
      'pit_lane_incident',
      'safety_car_lottery',
      'red_flag_restart',
      'disqualification',
      'appeal_drama',
      'contract_tension',
    ] as const,
    skill: [
      'rain_masterclass',
      'tire_management_clinic',
      'qualifying_lap',
      'defensive_driving',
      'overtake_masterpiece',
      'restart_excellence',
      'fuel_saving_art',
      'track_limits_perfection',
      'late_braking_genius',
      'corner_exit_speed',
    ] as const,
    historic: [
      'record_breaking',
      'championship_clincher',
      'first_win',
      'milestone_race',
      'legendary_venue',
      'classic_rivalry_chapter',
      'retirement_race',
      'debut_podium',
      'home_race_glory',
      'generational_moment',
    ] as const,
  },

  // Race narrative archetypes
  narrativeTypes: {
    dominance: {
      description: 'One driver/team completely controls the race',
      watchabilityImpact: 'low_unless_historic',
      examples: ['Schumacher at Monza 2004', 'Hamilton at Silverstone 2020'],
    },
    duel: {
      description: 'Two drivers/teams battle throughout',
      watchabilityImpact: 'very_high',
      examples: ['Verstappen vs Hamilton 2021', 'Senna vs Prost'],
    },
    comeback: {
      description: 'Driver recovers from setback to succeed',
      watchabilityImpact: 'very_high',
      examples: ['Alonso at Valencia 2012', 'Button at Canada 2011'],
    },
    chaos: {
      description: 'Multiple incidents create unpredictable race',
      watchabilityImpact: 'high',
      examples: ['Germany 2019', 'Brazil 2003'],
    },
    strategy_battle: {
      description: 'Pit stops and strategy determine outcome',
      watchabilityImpact: 'medium_to_high',
      examples: ['Hungary 2019 undercut', 'China 2018'],
    },
    weather_drama: {
      description: 'Changing conditions create uncertainty',
      watchabilityImpact: 'very_high',
      examples: ['Germany 2019', 'Brazil 2016'],
    },
    last_lap_drama: {
      description: 'Race decided on final lap',
      watchabilityImpact: 'highest',
      examples: ['Abu Dhabi 2021', 'Brazil 2008'],
    },
  },

  // Factors that make a race worth watching
  watchabilityFactors: {
    primary: [
      'battle_for_lead',
      'championship_implications',
      'close_gaps',
      'overtaking_opportunities',
      'strategic_variety',
      'weather_variability',
      'safety_car_restarts',
      'tire_degradation_spread',
    ],
    secondary: [
      'midfield_battles',
      'points_positions_fight',
      'rookie_performance',
      'team_orders_drama',
      'mechanical_issues',
      'penalty_situations',
      'track_position_changes',
    ],
    contextual: [
      'rivalry_heat',
      'home_race_atmosphere',
      'night_race_spectacle',
      'street_circuit_walls',
      'historic_venue',
      'season_finale',
      'sprint_weekend',
    ],
  },

  // Track characteristics affecting watchability
  trackFactors: {
    overtaking: {
      easy: ['Monza', 'Spa', 'Shanghai', 'COTA'],
      moderate: ['Silverstone', 'Suzuka', 'Interlagos'],
      difficult: ['Monaco', 'Hungary', 'Singapore'],
    },
    weather_sensitivity: {
      high: ['Spa', 'Interlagos', 'Suzuka', 'Silverstone'],
      medium: ['Montreal', 'Melbourne', 'Shanghai'],
      low: ['Bahrain', 'Abu Dhabi', 'Las Vegas'],
    },
    safety_car_likelihood: {
      high: ['Monaco', 'Singapore', 'Baku', 'Jeddah'],
      medium: ['Monza', 'Spa', 'Melbourne'],
      low: ['Bahrain', 'Paul Ricard', 'Sochi'],
    },
  },

  // Discipline-specific quality factors
  disciplineFactors: {
    formula1: {
      unique: ['drs_battles', 'tire_compounds', 'team_radio', 'undercut_overcut'],
      spectacle: ['night_races', 'street_circuits', 'high_downforce_corners'],
    },
    motogp: {
      unique: ['lean_angles', 'slipstream_battles', 'class_variety', 'rider_physicality'],
      spectacle: ['last_corner_passes', 'group_battles', 'save_moments'],
    },
    indycar: {
      unique: ['oval_pack_racing', 'road_course_variety', 'push_to_pass'],
      spectacle: ['indy_500_drama', 'street_course_walls', 'restart_chaos'],
    },
    nascar: {
      unique: ['pack_racing', 'bump_drafting', 'playoff_format', 'caution_strategy'],
      spectacle: ['superspeedway_chaos', 'short_track_tempers', 'overtime_finishes'],
    },
    wrc: {
      unique: ['stage_drama', 'co_driver_calls', 'surface_variety', 'reliability'],
      spectacle: ['jump_sequences', 'night_stages', 'snow_driving', 'gravel_rooster_tails'],
    },
    wec: {
      unique: ['multi_class_racing', 'driver_changes', 'night_running', 'reliability'],
      spectacle: ['le_mans_24h', 'class_battles', 'strategic_depth'],
    },
    cycling: {
      unique: ['team_tactics', 'breakaway_dynamics', 'mountain_battles', 'sprint_trains'],
      spectacle: ['iconic_climbs', 'cobblestone_chaos', 'grand_tour_drama'],
    },
  },
} as const;

// TODO: Add qualifying session quality factors
// TODO: Add practice session watchability (testing new parts, track evolution)
// TODO: Add sprint race specific factors
// TODO: Add support race integration (F2, F3, W Series)
// TODO: Add historical comparisons for race quality
// TODO: Add broadcaster quality factors (commentary, coverage)
// TODO: Add viewing recommendation times (skip first X laps, watch final Y)
// TODO: Add pit stop entertainment value tracking
// TODO: Add team radio highlight potential
// TODO: Add post-race interview drama potential
// TODO: Add paddock drama/news integration
// TODO: Add fantasy sports implications
// TODO: Add betting odds movement as excitement indicator

export type RacingQualitiesType = typeof RacingQualities;
