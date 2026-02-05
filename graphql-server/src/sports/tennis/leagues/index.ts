/**
 * Tennis Leagues - Index
 *
 * Re-exports all tennis league adapters.
 */

// ATP
export { ATPLeagueAdapter, atpAdapter } from './atp/ATPLeagueAdapter.js';
export { TennisSportAdapter, tennisSportAdapter } from './atp/TennisSportAdapter.js';
export * from './atp/index.js';

// WTA
export { WTASportAdapter, wtaSportAdapter } from './wta/WTASportAdapter.js';
export * from './wta/index.js';

// ITF (Davis Cup, BJK Cup, Olympics)
export { ITFSportAdapter, itfSportAdapter } from './itf/ITFSportAdapter.js';
export * from './itf/index.js';

// Legacy exports for backwards compatibility
export { WTALeagueAdapter, wtaAdapter } from './wta/WTALeagueAdapter.js';
export { ITFLeagueAdapter, itfAdapter } from './itf/ITFLeagueAdapter.js';

export type { ATPTournament, ATPPlayer } from './atp/ATPLeagueAdapter.js';
