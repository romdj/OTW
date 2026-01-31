/**
 * Generic sports service interface for standardizing sports data operations
 */

/* eslint-disable no-unused-vars */
// Interface parameter names are for documentation and are not "used" in the traditional sense

export interface TeamStanding {
  teamName: string;
  teamAbbrev: string;
  teamLogo: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  points: number;
  winPercentage: number;
  sport: string;
  league: string;
  division?: string;
  conference?: string;
  date: string;
}

export interface StandingsQuery {
  date?: string;
  league?: string;
  division?: string;
  conference?: string;
}

export interface SportsService {
  /**
   * Get standings for the sport/league
   */
  getStandings(query?: StandingsQuery): Promise<TeamStanding[]>;

  /**
   * Get detailed team information
   */
  getTeamDetails(teamId: string): Promise<Record<string, unknown>>;

  /**
   * Get sport-specific statistics
   */
  getTeamStats(teamId: string, season?: string): Promise<Record<string, unknown> | null>;

  /**
   * Validate team identifier
   */
  isValidTeam(teamId: string): boolean;
  
  /**
   * Get sport/league metadata
   */
  getLeagueInfo(): {
    name: string;
    sport: string;
    country: string;
    founded?: number;
    teams: number;
  };
}

export interface SportResolver {
  /**
   * GraphQL query resolvers for the sport
   */
  Query: Record<string, unknown>;

  /**
   * GraphQL field resolvers for sport-specific types
   */
  [key: string]: Record<string, unknown>;
}

export interface SportConfig {
  name: string;
  sport: string;
  apiBaseUrl?: string;
  defaultSeason?: string;
  timezone?: string;
  country: string;
}