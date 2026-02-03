/**
 * Racing - Scoring Systems
 *
 * Points systems and statistics tracking across racing disciplines.
 */

export const RacingScoring = {
  // Formula 1 points system (2025)
  formula1: {
    race: {
      1: 25,
      2: 18,
      3: 15,
      4: 12,
      5: 10,
      6: 8,
      7: 6,
      8: 4,
      9: 2,
      10: 1,
    },
    fastestLap: 1, // Only if finishing in top 10
    sprint: {
      1: 8,
      2: 7,
      3: 6,
      4: 5,
      5: 4,
      6: 3,
      7: 2,
      8: 1,
    },
    constructors: 'both_drivers_points_combined',
    halfPoints: 'race_less_than_75_percent_distance',
  },

  // MotoGP points system
  motogp: {
    race: {
      1: 25,
      2: 20,
      3: 16,
      4: 13,
      5: 11,
      6: 10,
      7: 9,
      8: 8,
      9: 7,
      10: 6,
      11: 5,
      12: 4,
      13: 3,
      14: 2,
      15: 1,
    },
    sprint: {
      1: 12,
      2: 9,
      3: 7,
      4: 6,
      5: 5,
      6: 4,
      7: 3,
      8: 2,
      9: 1,
    },
    classes: ['MotoGP', 'Moto2', 'Moto3'],
  },

  // IndyCar points system
  indycar: {
    race: {
      1: 50,
      2: 40,
      3: 35,
      4: 32,
      5: 30,
      6: 28,
      7: 26,
      8: 24,
      9: 22,
      10: 20,
      // ... continues down
    },
    bonuses: {
      pole: 1,
      leading_lap: 1,
      most_laps_led: 2,
    },
    indy500Multiplier: 'double_points',
  },

  // NASCAR Cup Series
  nascar: {
    regularSeason: {
      win: 40,
      positions: 'decreasing_scale_to_40th',
      stage_wins: 10,
      stage_top10: 'decreasing_1_to_10',
    },
    playoffs: {
      rounds: ['round_of_16', 'round_of_12', 'round_of_8', 'championship_4'],
      elimination: 'bottom_4_each_round',
      reset_points: true,
    },
  },

  // World Rally Championship
  wrc: {
    rally: {
      1: 25,
      2: 18,
      3: 15,
      4: 12,
      5: 10,
      6: 8,
      7: 6,
      8: 4,
      9: 2,
      10: 1,
    },
    powerStage: {
      1: 5,
      2: 4,
      3: 3,
      4: 2,
      5: 1,
    },
    manufacturers: 'top_2_drivers_per_event',
  },

  // World Endurance Championship
  wec: {
    race: {
      1: 25,
      2: 18,
      3: 15,
      4: 12,
      5: 10,
      6: 8,
      7: 6,
      8: 4,
      9: 2,
      10: 1,
    },
    pole: 1,
    le_mans_multiplier: 1.5,
    classes: ['Hypercar', 'LMP2', 'LMGT3'],
  },

  // Pro Cycling (UCI points - simplified)
  cycling: {
    worldTour: {
      grandTour: {
        gc_winner: 1000,
        stage_win: 120,
        points_jersey: 500,
        mountains_jersey: 480,
      },
      monument: {
        winner: 600,
      },
      oneDay: {
        winner: 'varies_by_category',
      },
    },
    teamRankings: 'sum_of_top_riders',
  },

  // Statistics tracked
  statistics: {
    driver: [
      'wins',
      'podiums',
      'poles',
      'fastest_laps',
      'laps_led',
      'points',
      'dnfs',
      'penalties',
      'overtakes',
      'positions_gained',
      'positions_lost',
      'qualifying_average',
      'race_pace_average',
      'tire_management_rating',
      'wet_weather_performance',
    ],
    team: [
      'constructor_points',
      'wins',
      'podiums',
      '1_2_finishes',
      'pole_positions',
      'pit_stop_average',
      'reliability_rate',
      'development_pace',
    ],
    race: [
      'total_overtakes',
      'lead_changes',
      'safety_car_periods',
      'red_flag_stoppages',
      'retirements',
      'penalties_issued',
      'fastest_lap_time',
      'average_lap_time',
      'pit_stops_total',
    ],
  },

  // Qualifying formats
  qualifyingFormats: {
    formula1: {
      type: 'knockout',
      sessions: ['Q1', 'Q2', 'Q3'],
      elimination: [5, 5, 0],
      tire_rules: 'Q2_tire_starts_race_top10',
    },
    motogp: {
      type: 'practice_based',
      sessions: ['Q1', 'Q2'],
      advancement: 'top_2_from_Q1',
    },
    indycar: {
      type: 'varies',
      road_course: 'two_groups_plus_fast_six',
      oval: 'single_car_runs',
      indy500: 'last_row_shootout',
    },
    nascar: {
      type: 'single_lap',
      impound: true,
    },
    wrc: {
      type: 'shakedown',
      start_order: 'championship_order_reversed_day1',
    },
  },
} as const;

// TODO: Add historical points systems for comparison
// TODO: Add points projections and championship scenarios
// TODO: Add penalty point systems (license points, grid penalties)
// TODO: Add tire allocation and usage tracking
// TODO: Add fuel usage and efficiency metrics
// TODO: Add cost cap compliance tracking (F1)
// TODO: Add development token usage (F1)
// TODO: Add driver market value estimation
// TODO: Add team budget breakdowns
// TODO: Add prize money distribution
// TODO: Add TV revenue sharing models
// TODO: Add sponsorship value metrics
// TODO: Add social media engagement scores
// TODO: Add fantasy points systems integration
// TODO: Add esports crossover statistics

export type RacingScoringType = typeof RacingScoring;
