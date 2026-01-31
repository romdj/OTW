/**
 * American Football Leagues - Index
 *
 * Re-exports all American football league adapters.
 */

export { NFLLeagueAdapter, nflAdapter } from './nfl/NFLLeagueAdapter.js';
export { NCAALeagueAdapter, ncaaAdapter } from './ncaa/NCAALeagueAdapter.js';

export type { NFLTeam, NFLStandings, NFLSchedule } from './nfl/NFLLeagueAdapter.js';
export type { NCAATeam, NCAAConference, NCAAStandings, CFPRanking } from './ncaa/NCAALeagueAdapter.js';
