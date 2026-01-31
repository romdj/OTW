/**
 * Tennis Leagues - Index
 *
 * Re-exports all tennis league adapters.
 */

export { ATPLeagueAdapter, atpAdapter } from './atp/ATPLeagueAdapter.js';
export { WTALeagueAdapter, wtaAdapter } from './wta/WTALeagueAdapter.js';
export { ITFLeagueAdapter, itfAdapter } from './itf/ITFLeagueAdapter.js';

export type { ATPTournament, ATPPlayer } from './atp/ATPLeagueAdapter.js';
export type { WTATournament, WTAPlayer } from './wta/WTALeagueAdapter.js';
export type { ITFEvent, ITFTeam } from './itf/ITFLeagueAdapter.js';
