/**
 * Tennis - Sport Level
 *
 * Defines the essence of tennis as a sport:
 * - Match structure (sets, games, tiebreaks)
 * - Scoring mechanics (love, 15, 30, 40, deuce)
 * - Surface impacts
 * - Subjective quality factors
 */

export * from './attributes.js';
export * from './scoring.js';
export * from './surfaces.js';
export * from './qualities.js';
export * from './types.js';

// League-level exports
export * from './leagues/index.js';
