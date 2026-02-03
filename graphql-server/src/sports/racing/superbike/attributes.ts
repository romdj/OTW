/**
 * World Superbike Championship (WSBK) - Discipline-Specific Attributes
 *
 * Detailed attributes for production-based motorcycle racing.
 */

export const WSBKAttributes = {
  // Competition format
  format: {
    seasonLength: { typical: 12, min: 10, max: 14 },
    roundFormat: {
      races: 3, // Two full races + Superpole Race
      superpoleRace: {
        laps: 10,
        gridFor: 'race_2',
        points: { 1: 12, 2: 9, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 },
      },
      fullRace: {
        distance: 'varies_by_circuit',
        points: 'motogp_style_1_to_15',
      },
    },
    weekendSchedule: ['FP1', 'FP2', 'Superpole', 'Race 1', 'Superpole Race', 'Race 2'],
  },

  // Bike regulations (production-based)
  regulations: {
    homologation: 'minimum_production_numbers',
    engine: {
      twins: { maxCC: 1200 },
      inline4_v4: { maxCC: 1000 },
    },
    modifications: {
      allowed: ['suspension', 'brakes', 'fairings', 'exhaust'],
      restricted: ['engine_internals', 'frame_geometry'],
    },
    weight: {
      inline4: 168, // kg minimum
      twin: 170, // kg minimum
    },
  },

  // Current manufacturers
  manufacturers: {
    ducati: {
      model: 'Panigale V4 R',
      engineType: 'V4',
      displacement: 998,
      championships: { riders: 14, manufacturers: 17 },
    },
    kawasaki: {
      model: 'ZX-10RR',
      engineType: 'Inline-4',
      displacement: 998,
      championships: { riders: 6, manufacturers: 6 },
    },
    yamaha: {
      model: 'YZF-R1',
      engineType: 'Inline-4',
      displacement: 998,
      championships: { riders: 2, manufacturers: 1 },
    },
    honda: {
      model: 'CBR1000RR-R',
      engineType: 'Inline-4',
      displacement: 999,
      championships: { riders: 3, manufacturers: 2 },
    },
    bmw: {
      model: 'M 1000 RR',
      engineType: 'Inline-4',
      displacement: 999,
      championships: { riders: 0, manufacturers: 0 },
    },
  },

  // Support classes
  supportClasses: {
    worldSSP: {
      name: 'World Supersport',
      bikes: '600cc_inline4_or_equivalent',
      races: 2, // per round
    },
    worldSSP300: {
      name: 'World Supersport 300',
      bikes: '300cc_production',
      races: 2, // per round
      purpose: 'entry_level_world_championship',
    },
  },

  // Tire supplier
  tires: {
    supplier: 'Pirelli',
    compounds: {
      front: ['SC1', 'SC2'],
      rear: ['SCX', 'SC0', 'SC1', 'SC2'],
    },
    allocation: 'specific_per_weekend',
    development: 'production_bike_relevant',
  },

  // Notable circuits
  circuits: {
    phillip_island: {
      country: 'Australia',
      character: 'fast_flowing_coastal',
      laps: 22,
    },
    assen: {
      country: 'Netherlands',
      character: 'technical_historic',
      laps: 21,
    },
    laguna_seca: {
      country: 'USA',
      character: 'corkscrew_iconic',
      laps: 25,
    },
    portimao: {
      country: 'Portugal',
      character: 'elevation_changes',
      laps: 20,
    },
    misano: {
      country: 'Italy',
      character: 'ducati_territory',
      laps: 21,
    },
  },

  // Difference from MotoGP
  vsMotogp: {
    bikes: 'Production-based vs prototype',
    budget: 'Much lower',
    accessibility: 'Bikes available to public',
    racing: 'Often closer, more overtaking',
    weekend: 'Three races vs two',
  },

  // Historical records
  records: {
    mostChampionships: { holder: 'Jonathan Rea', count: 6 },
    mostWins: { holder: 'Jonathan Rea', count: 117 },
    mostPoles: { holder: 'Jonathan Rea', count: 38 },
    mostPodiums: { holder: 'Jonathan Rea', count: 250+ },
  },

  // Legends
  legends: [
    'Carl Fogarty',
    'Troy Bayliss',
    'Colin Edwards',
    'Troy Corser',
    'Ben Spies',
    'Jonathan Rea',
    'Alvaro Bautista',
    'Max Biaggi',
  ],
} as const;

// TODO: Add detailed circuit data
// TODO: Add rider statistics
// TODO: Add team structure data
// TODO: Add concession/balance of performance rules
// TODO: Add wildcard entry system
// TODO: Add MotoGP crossover rider data
// TODO: Add BSB (British Superbike) integration
// TODO: Add national superbike championships
// TODO: Add Endurance World Championship integration
// TODO: Add electronic regulations details
// TODO: Add aero regulations (winglets)

export type WSBKAttributesType = typeof WSBKAttributes;
