/**
 * Racing - Sport Module
 *
 * Exports all racing-related definitions.
 * Covers multiple disciplines: F1, MotoGP, WRC, IndyCar, NASCAR, WEC, Cycling, etc.
 */

export { RacingAttributes } from './attributes.js';
export { RacingQualities } from './qualities.js';
export { RacingScoring } from './scoring.js';

export type {
  RacingDiscipline,
  RacingFlag,
  EmotionalTag,
  TensionTag,
  ExcitementTag,
  DramaTag,
  SkillTag,
  HistoricTag,
  SessionType,
  RaceStatus,
  ParticipantStatus,
  RaceEvent,
  PitStop,
  LapData,
  RaceResult,
  QualifyingResult,
  ChampionshipStanding,
  TeamStanding,
  RaceWeekend,
  Circuit,
  Session,
  WeatherConditions,
  RaceWatchabilityScore,
} from './types.js';

// TODO: Export Formula 1 specific module when implemented
// export * from './formula1/index.js';

// TODO: Export MotoGP specific module when implemented
// export * from './motogp/index.js';

// TODO: Export WRC specific module when implemented
// export * from './rallye/index.js';

// TODO: Export IndyCar specific module when implemented
// export * from './indycar/index.js';

// TODO: Export NASCAR specific module when implemented
// export * from './nascar/index.js';

// TODO: Export WEC specific module when implemented
// export * from './wec/index.js';

// TODO: Export Cycling Pro Tour module when implemented
// export * from './cycling/pro-tour/index.js';

// TODO: Export Cyclocross module when implemented
// export * from './cycling/cyclocross/index.js';

// TODO: Export World Superbike module when implemented
// export * from './superbike/index.js';

// TODO: Export Formula E module when implemented
// TODO: Export DTM module when implemented
// TODO: Export IMSA module when implemented
// TODO: Export Super GT module when implemented
// TODO: Export Dakar Rally module when implemented
