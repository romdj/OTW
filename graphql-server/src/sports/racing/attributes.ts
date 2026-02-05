/**
 * Racing - Sport Attributes (Shared)
 *
 * Common attributes across racing disciplines.
 * Discipline-specific attributes are in subdirectories.
 */

export const RacingAttributes = {
  // Common racing characteristics
  common: {
    competitionType: 'time_based', // TODO correct this, inaccurate for some racing types
    individualVsTeam: 'hybrid', // TODO should be an enum or some variety depending on discipline
    simultaneousCompetitors: true,
    multiStage: 'varies', // Some have multiple stages/races per event
  },

  // Disciplines overview
  disciplines: {
    motorsport: {

      // Flag system (common across motorsport)
      flags: {
        green: 'Race start / Clear',
        yellow: 'Caution / Slow down',
        red: 'Race stopped',
        blue: 'Let faster car pass (lapping)',
        white: 'Slow vehicle on track',
        black: 'Disqualification',
        checkered: 'Race finished',
        blackAndWhite: 'Unsportsmanlike conduct warning',
      },

      // Safety car / neutralization
      safetyCar: {
        formula1: { name: 'Safety Car', virtualExists: true },
        indycar: { name: 'Pace Car', virtualExists: true },
        nascar: { name: 'Pace Car', cautions: true },
        motogp: { name: 'Safety Car', redFlag: true },
      },
      vehicle: {
        motorcycle: {
          motogp: {
            name: 'MotoGP',
            type: 'circuit_racing',
            vehicle: 'motorcycle',
            surface: 'tarmac',
            seasonRaces: { typical: 21, min: 18, max: 22 },
            classes: ['MotoGP', 'Moto2', 'Moto3'],
          },
          wsbk: {
            name: 'World Superbike Championship',
            type: 'circuit_racing',
            vehicle: 'superbike',
            surface: 'tarmac',
            seasonRounds: { typical: 12, min: 10, max: 14 },
          }
        },
        car: {
          wrc: {
            name: 'World Rally Championship',
            type: 'rally',
            vehicle: 'rally_car',
            surface: 'mixed', // Gravel, tarmac, snow, mud
            seasonRounds: { typical: 13, min: 12, max: 14 },
          },
          formula1: {
            name: 'Formula 1',
            type: 'circuit_racing',
            vehicle: 'open_wheel_car',
            surface: 'tarmac',
            seasonRaces: { typical: 23, min: 16, max: 24 },
          },
        },
        // TODO: Add electric racing attributes (Formula E)
        formulaE: {
          name: 'Formula E',
          type: 'circuit_racing',
          vehicle: 'open_wheel_car',
          surface: 'tarmac',
          seasonRaces: { typical: 23, min: 16, max: 24 }, // TODO - confirm / update as Formula E grows
        },
      },
    },
    bicycle: {
      road_cycling: {
        name: 'Pro Cycling',
        type: 'road_racing',
        vehicle: 'bicycle',
        surface: 'road',
        raceType: ['tour', 'one_day'],
        tourTypes: ['grand_tour', 'week_long'],
        dayRaceType: ['monument', 'classics'],
      },
    },
  }
};


export type RacingAttributesType = typeof RacingAttributes;
