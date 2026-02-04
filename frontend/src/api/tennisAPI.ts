/**
 * Tennis GraphQL API
 *
 * Provides type-safe queries for ATP tennis data including rankings,
 * tournaments, matches, and player profiles.
 */

import { gql } from '@urql/svelte';
import { client } from './graphqlClient.js';

// ============================================================================
// Types
// ============================================================================

export type TennisTour = 'ATP' | 'WTA';
export type TennisRankingType = 'SINGLES' | 'DOUBLES';
export type TennisSurface = 'HARD' | 'CLAY' | 'GRASS' | 'INDOOR_HARD';
export type TournamentCategory =
  | 'GRAND_SLAM'
  | 'MASTERS_1000'
  | 'WTA_1000'
  | 'ATP_500'
  | 'WTA_500'
  | 'ATP_250'
  | 'WTA_250'
  | 'ATP_FINALS'
  | 'WTA_FINALS';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface TennisPlayer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  country: string;
  countryCode: string;
  birthDate: string;
  birthPlace: string;
  height?: number;
  weight?: number;
  turnedPro: number;
  plays: string;
  backhand: string;
  coach?: string;
  currentRanking: number;
  highestRanking: number;
  highestRankingDate: string;
  careerTitles: number;
  careerWins: number;
  careerLosses: number;
  ytdWins: number;
  ytdLosses: number;
  prizeMoney: number;
}

export interface TennisRanking {
  rank: number;
  previousRank: number;
  movement: string;
  playerName: string;
  playerId: string;
  country: string;
  countryCode: string;
  points: number;
  tournamentsPlayed: number;
  pointsDropping: number;
  nextBestPoints: number;
  tour: TennisTour;
  type: TennisRankingType;
  player?: TennisPlayer;
}

export interface TournamentPoints {
  winner: number;
  finalist: number;
  semifinalist: number;
  quarterfinalist: number;
  round16: number;
  round32: number;
  round64?: number;
  round128?: number;
}

export interface TennisTournament {
  id: string;
  name: string;
  location: string;
  country: string;
  surface: TennisSurface;
  category: TournamentCategory;
  startDate: string;
  endDate: string;
  prizeMoney: number;
  currency: string;
  drawSize: number;
  points: TournamentPoints;
}

export interface MatchPlayer {
  id: string;
  name: string;
  seed?: number;
  countryCode: string;
}

export interface SetTiebreak {
  player1: number;
  player2: number;
}

export interface SetScore {
  player1: number;
  player2: number;
  tiebreak?: SetTiebreak;
}

export interface MatchScore {
  sets: SetScore[];
  winner?: string;
  retired?: boolean;
  walkover?: boolean;
}

export interface TennisMatch {
  id: string;
  tournamentId: string;
  tournamentName: string;
  round: string;
  surface: string;
  player1: MatchPlayer;
  player2: MatchPlayer;
  score?: MatchScore;
  formattedScore?: string;
  scheduledTime?: string;
  completedTime?: string;
  status: MatchStatus;
  court?: string;
  duration?: number;
  tournament?: TennisTournament;
}

// ============================================================================
// GraphQL Queries
// ============================================================================

const RANKINGS_QUERY = gql`
  query TennisRankings($tour: TennisTour, $type: TennisRankingType, $limit: Int) {
    tennisRankings(tour: $tour, type: $type, limit: $limit) {
      rank
      previousRank
      movement
      playerName
      playerId
      country
      countryCode
      points
      tournamentsPlayed
      pointsDropping
      nextBestPoints
      tour
      type
    }
  }
`;

const TOURNAMENTS_QUERY = gql`
  query TennisTournaments(
    $tour: TennisTour
    $year: Int
    $surface: TennisSurface
    $category: TournamentCategory
  ) {
    tennisTournaments(tour: $tour, year: $year, surface: $surface, category: $category) {
      id
      name
      location
      country
      surface
      category
      startDate
      endDate
      prizeMoney
      currency
      drawSize
      points {
        winner
        finalist
        semifinalist
        quarterfinalist
        round16
        round32
      }
    }
  }
`;

const MATCHES_QUERY = gql`
  query TennisMatches(
    $tournamentId: String
    $playerId: String
    $status: MatchStatus
    $date: String
  ) {
    tennisMatches(tournamentId: $tournamentId, playerId: $playerId, status: $status, date: $date) {
      id
      tournamentId
      tournamentName
      round
      surface
      player1 {
        id
        name
        seed
        countryCode
      }
      player2 {
        id
        name
        seed
        countryCode
      }
      score {
        sets {
          player1
          player2
          tiebreak {
            player1
            player2
          }
        }
        winner
        retired
        walkover
      }
      formattedScore
      scheduledTime
      completedTime
      status
      court
      duration
    }
  }
`;

const LIVE_MATCHES_QUERY = gql`
  query TennisLiveMatches {
    tennisLiveMatches {
      id
      tournamentId
      tournamentName
      round
      surface
      player1 {
        id
        name
        seed
        countryCode
      }
      player2 {
        id
        name
        seed
        countryCode
      }
      score {
        sets {
          player1
          player2
          tiebreak {
            player1
            player2
          }
        }
        winner
        retired
        walkover
      }
      formattedScore
      status
      court
    }
  }
`;

const PLAYER_QUERY = gql`
  query TennisPlayer($playerId: String!) {
    tennisPlayer(playerId: $playerId) {
      id
      firstName
      lastName
      fullName
      country
      countryCode
      birthDate
      birthPlace
      height
      weight
      turnedPro
      plays
      backhand
      coach
      currentRanking
      highestRanking
      highestRankingDate
      careerTitles
      careerWins
      careerLosses
      ytdWins
      ytdLosses
      prizeMoney
    }
  }
`;

// ============================================================================
// API Functions
// ============================================================================

export interface RankingsQueryArgs {
  tour?: TennisTour;
  type?: TennisRankingType;
  limit?: number;
}

export interface TournamentsQueryArgs {
  tour?: TennisTour;
  year?: number;
  surface?: TennisSurface;
  category?: TournamentCategory;
}

export interface MatchesQueryArgs {
  tournamentId?: string;
  playerId?: string;
  status?: MatchStatus;
  date?: string;
}

/**
 * Fetch tennis rankings
 */
export async function fetchRankings(args: RankingsQueryArgs = {}): Promise<TennisRanking[]> {
  const result = await client.query(RANKINGS_QUERY, args).toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch rankings: ${result.error.message}`);
  }

  return result.data?.tennisRankings ?? [];
}

/**
 * Fetch tennis tournaments
 */
export async function fetchTournaments(args: TournamentsQueryArgs = {}): Promise<TennisTournament[]> {
  const result = await client.query(TOURNAMENTS_QUERY, args).toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch tournaments: ${result.error.message}`);
  }

  return result.data?.tennisTournaments ?? [];
}

/**
 * Fetch tennis matches
 */
export async function fetchMatches(args: MatchesQueryArgs = {}): Promise<TennisMatch[]> {
  const result = await client.query(MATCHES_QUERY, args).toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch matches: ${result.error.message}`);
  }

  return result.data?.tennisMatches ?? [];
}

/**
 * Fetch live tennis matches
 */
export async function fetchLiveMatches(): Promise<TennisMatch[]> {
  const result = await client.query(LIVE_MATCHES_QUERY, {}).toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch live matches: ${result.error.message}`);
  }

  return result.data?.tennisLiveMatches ?? [];
}

/**
 * Fetch tennis player profile
 */
export async function fetchPlayer(playerId: string): Promise<TennisPlayer | null> {
  const result = await client.query(PLAYER_QUERY, { playerId }).toPromise();

  if (result.error) {
    throw new Error(`Failed to fetch player: ${result.error.message}`);
  }

  return result.data?.tennisPlayer ?? null;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get display name for tournament category
 */
export function getCategoryDisplayName(category: TournamentCategory): string {
  const names: Record<TournamentCategory, string> = {
    GRAND_SLAM: 'Grand Slam',
    MASTERS_1000: 'Masters 1000',
    WTA_1000: 'WTA 1000',
    ATP_500: 'ATP 500',
    WTA_500: 'WTA 500',
    ATP_250: 'ATP 250',
    WTA_250: 'WTA 250',
    ATP_FINALS: 'ATP Finals',
    WTA_FINALS: 'WTA Finals',
  };
  return names[category] ?? category;
}

/**
 * Get display name for surface
 */
export function getSurfaceDisplayName(surface: TennisSurface | string): string {
  const names: Record<string, string> = {
    HARD: 'Hard',
    CLAY: 'Clay',
    GRASS: 'Grass',
    INDOOR_HARD: 'Indoor Hard',
  };
  return names[surface] ?? surface;
}

/**
 * Get surface color class
 */
export function getSurfaceColor(surface: TennisSurface | string): string {
  const colors: Record<string, string> = {
    HARD: 'text-blue-600',
    CLAY: 'text-orange-600',
    GRASS: 'text-green-600',
    INDOOR_HARD: 'text-purple-600',
  };
  return colors[surface] ?? 'text-base-content';
}

/**
 * Get movement indicator
 */
export function getMovementIndicator(movement: string): { icon: string; color: string } {
  if (movement.startsWith('+')) {
    return { icon: '▲', color: 'text-green-600' };
  } else if (movement.startsWith('-')) {
    return { icon: '▼', color: 'text-red-600' };
  } else {
    return { icon: '—', color: 'text-base-content/40' };
  }
}

/**
 * Format prize money
 */
export function formatPrizeMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 3) return '';

  // Convert 3-letter to 2-letter (simplified mapping for common tennis countries)
  const mapping: Record<string, string> = {
    USA: 'US',
    ESP: 'ES',
    SRB: 'RS',
    RUS: 'RU',
    ITA: 'IT',
    GER: 'DE',
    GBR: 'GB',
    FRA: 'FR',
    AUS: 'AU',
    CAN: 'CA',
    GRE: 'GR',
    NOR: 'NO',
    POL: 'PL',
    DEN: 'DK',
    ARG: 'AR',
    CHI: 'CL',
    BRA: 'BR',
    JPN: 'JP',
    CHN: 'CN',
    SUI: 'CH',
    AUT: 'AT',
    BEL: 'BE',
    NED: 'NL',
    CZE: 'CZ',
    CRO: 'HR',
  };

  const twoLetter = mapping[countryCode] ?? countryCode.substring(0, 2);

  // Convert to regional indicator symbols
  const base = 0x1f1e6;
  const offset = 'A'.charCodeAt(0);
  const flag = String.fromCodePoint(
    base + twoLetter.charCodeAt(0) - offset,
    base + twoLetter.charCodeAt(1) - offset
  );

  return flag;
}
