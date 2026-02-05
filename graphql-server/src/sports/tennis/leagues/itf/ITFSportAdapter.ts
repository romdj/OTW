/**
 * ITF Sport Adapter - handles international tennis team events
 *
 * Covers:
 * - Davis Cup (men's team)
 * - Billie Jean King Cup (women's team)
 * - Olympic Tennis Tournament
 * - United Cup (mixed team)
 */

import type { SportsService, TeamStanding, StandingsQuery, SportConfig } from '../../../shared/interfaces/SportsService.js';
import { itfEventService } from './services/eventService.js';
import type { EventType, DavisCupTie, OlympicMatch } from './types/itf-api.types.js';
import { ITF_NATION_CODES } from './constants/index.js';

export class ITFSportAdapter implements SportsService {
  private config: SportConfig = {
    name: 'ITF',
    sport: 'Tennis',
    country: 'International',
  };

  private currentEventId: string = 'dc-2024';

  /**
   * Set the active event for queries
   */
  setActiveEvent(eventId: string): void {
    this.currentEventId = eventId;
  }

  /**
   * For ITF team events, returns participating nations
   */
  async getStandings(_query?: StandingsQuery): Promise<TeamStanding[]> {
    const event = await itfEventService.getEventById(this.currentEventId);

    if (!event) {
      return [];
    }

    // For Davis Cup, get participating teams from ties
    if (event.type === 'davis_cup') {
      const ties = await itfEventService.getDavisCupTies(this.currentEventId);
      const teams = new Map<string, { name: string; wins: number; losses: number }>();

      for (const tie of ties) {
        // Track home team
        if (!teams.has(tie.homeTeam.code)) {
          teams.set(tie.homeTeam.code, { name: tie.homeTeam.name, wins: 0, losses: 0 });
        }
        // Track away team
        if (!teams.has(tie.awayTeam.code)) {
          teams.set(tie.awayTeam.code, { name: tie.awayTeam.name, wins: 0, losses: 0 });
        }

        // Count wins/losses
        if (tie.score && tie.status === 'completed') {
          const homeTeam = teams.get(tie.homeTeam.code)!;
          const awayTeam = teams.get(tie.awayTeam.code)!;

          if (tie.score.home > tie.score.away) {
            homeTeam.wins++;
            awayTeam.losses++;
          } else {
            awayTeam.wins++;
            homeTeam.losses++;
          }
        }
      }

      return Array.from(teams.entries()).map(([code, data]): TeamStanding => ({
        teamName: data.name,
        teamAbbrev: code,
        teamLogo: `https://itf.com/flags/${code.toLowerCase()}.svg`,
        gamesPlayed: data.wins + data.losses,
        wins: data.wins,
        losses: data.losses,
        points: data.wins * 2,
        winPercentage: data.wins + data.losses > 0 ? data.wins / (data.wins + data.losses) : 0,
        sport: 'Tennis',
        league: event.name,
        division: undefined,
        conference: undefined,
        date: new Date().toISOString().split('T')[0],
      }));
    }

    return [];
  }

  async getTeamDetails(teamId: string): Promise<Record<string, unknown>> {
    const event = await itfEventService.getEventById(this.currentEventId);

    if (!event) {
      return {
        id: teamId,
        league: 'ITF',
        sport: 'Tennis',
        error: 'Event not found',
      };
    }

    // For Davis Cup, get team info from ties
    if (event.type === 'davis_cup') {
      const ties = await itfEventService.getDavisCupTies(this.currentEventId);

      for (const tie of ties) {
        if (tie.homeTeam.code === teamId.toUpperCase()) {
          return {
            id: tie.homeTeam.code,
            name: tie.homeTeam.name,
            flag: tie.homeTeam.flag,
            captain: tie.homeTeam.captain,
            players: tie.homeTeam.players.map(p => p.fullName),
            league: 'ITF',
            event: event.name,
            sport: 'Tennis',
          };
        }
        if (tie.awayTeam.code === teamId.toUpperCase()) {
          return {
            id: tie.awayTeam.code,
            name: tie.awayTeam.name,
            flag: tie.awayTeam.flag,
            captain: tie.awayTeam.captain,
            players: tie.awayTeam.players.map(p => p.fullName),
            league: 'ITF',
            event: event.name,
            sport: 'Tennis',
          };
        }
      }
    }

    return {
      id: teamId,
      league: 'ITF',
      sport: 'Tennis',
      error: 'Team not found in event',
    };
  }

  async getTeamStats(teamId: string, _season?: string): Promise<Record<string, unknown> | null> {
    const standings = await this.getStandings();
    const team = standings.find(s => s.teamAbbrev === teamId.toUpperCase());

    if (!team) {
      return null;
    }

    return {
      nationCode: team.teamAbbrev,
      nationName: team.teamName,
      tiesPlayed: team.gamesPlayed,
      tiesWon: team.wins,
      tiesLost: team.losses,
    };
  }

  isValidTeam(teamId: string): boolean {
    return (ITF_NATION_CODES as readonly string[]).includes(teamId.toUpperCase());
  }

  getLeagueInfo() {
    return {
      name: 'International Tennis Federation',
      sport: 'Tennis',
      country: 'International',
      founded: 1913,
      teams: 213, // ITF member nations
    };
  }

  // ITF-specific methods

  /**
   * Get all ITF events of a specific type
   */
  async getEvents(type?: EventType) {
    return itfEventService.getEvents(type);
  }

  /**
   * Get Davis Cup events
   */
  async getDavisCup(year?: number) {
    const events = await itfEventService.getEvents('davis_cup');
    if (year) {
      return events.find(e => e.year === year);
    }
    return events;
  }

  /**
   * Get Davis Cup ties for an event
   */
  async getDavisCupTies(eventId: string): Promise<DavisCupTie[]> {
    return itfEventService.getDavisCupTies(eventId);
  }

  /**
   * Get Davis Cup final
   */
  async getDavisCupFinal(eventId: string): Promise<DavisCupTie | null> {
    return itfEventService.getDavisCupFinal(eventId);
  }

  /**
   * Get Billie Jean King Cup events
   */
  async getBJKCup(year?: number) {
    const events = await itfEventService.getEvents('bjk_cup');
    if (year) {
      return events.find(e => e.year === year);
    }
    return events;
  }

  /**
   * Get Olympic tennis events
   */
  async getOlympics(year?: number) {
    const events = await itfEventService.getEvents('olympics');
    if (year) {
      return events.find(e => e.year === year);
    }
    return events;
  }

  /**
   * Get Olympic medal matches
   */
  async getOlympicMedalMatches(eventId: string): Promise<OlympicMatch[]> {
    return itfEventService.getOlympicMedalMatches(eventId);
  }

  /**
   * Get Olympic matches by draw
   */
  async getOlympicMatches(eventId: string, draw?: string): Promise<OlympicMatch[]> {
    return itfEventService.getOlympicMatches(eventId, draw);
  }
}

export const itfSportAdapter = new ITFSportAdapter();
