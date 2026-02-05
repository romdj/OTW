/**
 * Ice Hockey - Sport Level
 *
 * Defines the essence of ice hockey as a sport:
 * - Game structure (periods, overtime, shootout)
 * - Scoring mechanics
 * - Player positions
 * - Subjective quality factors that make games exciting
 */

export * from './attributes.js';
export * from './scoring.js';
export * from './positions.js';
export * from './qualities.js';
export * from './types.js';

// Re-export leagues
export * from './leagues/nhl/index.js';
export * from './leagues/pwhl/index.js';
export * from './leagues/iihf/index.js';
