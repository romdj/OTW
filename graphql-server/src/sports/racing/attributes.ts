/**
 * Racing - Sport Attributes (Shared)
 *
 * Common attributes across racing disciplines.
 * Discipline-specific attributes are in subdirectories.
 */

export const RacingAttributes = {
  // Common racing characteristics
  common: {
    competitionType: 'time_based',
    individualVsTeam: 'hybrid', // Individual results, team championships
    simultaneousCompetitors: true,
    multiStage: 'varies', // Some have multiple stages/races per event
  },

  // Disciplines overview
  disciplines: {
    formula1: {
      name: 'Formula 1',
      type: 'circuit_racing',
      vehicle: 'open_wheel_car',
      surface: 'tarmac',
      seasonRaces: { typical: 23, min: 16, max: 24 },
    },
    motogp: {
      name: 'MotoGP',
      type: 'circuit_racing',
      vehicle: 'motorcycle',
      surface: 'tarmac',
      seasonRaces: { typical: 21, min: 18, max: 22 },
      classes: ['MotoGP', 'Moto2', 'Moto3'],
    },
    wrc: {
      name: 'World Rally Championship',
      type: 'rally',
      vehicle: 'rally_car',
      surface: 'mixed', // Gravel, tarmac, snow, mud
      seasonRounds: { typical: 13, min: 12, max: 14 },
    },
    cycling: {
      name: 'Pro Cycling',
      type: 'road_racing',
      vehicle: 'bicycle',
      surface: 'road',
      tourTypes: ['grand_tour', 'monument', 'stage_race', 'one_day'],
    },
    wec: {
      name: 'World Endurance Championship',
      type: 'endurance_racing',
      vehicle: 'prototype_car',
      surface: 'tarmac',
      raceLengths: ['6h', '8h', '24h'],
    },
    indycar: {
      name: 'IndyCar Series',
      type: 'circuit_racing',
      vehicle: 'open_wheel_car',
      surface: 'tarmac_and_oval',
      seasonRaces: { typical: 17, min: 15, max: 18 },
    },
    nascar: {
      name: 'NASCAR',
      type: 'stock_car_racing',
      vehicle: 'stock_car',
      surface: 'oval_and_road',
      seasonRaces: { typical: 36, min: 33, max: 40 },
    },
    wsbk: {
      name: 'World Superbike Championship',
      type: 'circuit_racing',
      vehicle: 'superbike',
      surface: 'tarmac',
      seasonRounds: { typical: 12, min: 10, max: 14 },
    },
  },

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
} as const;

// TODO: Add karting attributes
// TODO: Add drag racing attributes
// TODO: Add hill climb attributes
// TODO: Add touring car attributes (WTCR, DTM)
// TODO: Add off-road racing attributes (Dakar, Baja)
// TODO: Add electric racing attributes (Formula E)

export type RacingAttributesType = typeof RacingAttributes;
