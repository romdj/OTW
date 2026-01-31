/**
 * American Football - Sport Level
 *
 * Defines the essence of American football:
 * - Game structure (quarters, downs, timeouts)
 * - Scoring mechanics (TD, FG, safety)
 * - Player positions
 * - Subjective quality factors
 */

export * from './attributes.js';
export * from './scoring.js';
export * from './positions.js';
export * from './qualities.js';
export * from './types.js';

// League-level exports
export * from './leagues/index.js';
