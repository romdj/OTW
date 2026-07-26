/**
 * Provider-neutral tennis domain. Provider payloads must be normalized into
 * these records before they reach GraphQL or prioritization code.
 */
export type TennisTour = 'ATP' | 'WTA' | 'ITF';
export type TennisOrganizer = 'ATP' | 'WTA' | 'ITF';
export type TennisSurface = 'HARD' | 'CLAY' | 'GRASS' | 'CARPET' | 'UNKNOWN';
export type TennisMatchStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'COMPLETED'
  | 'RETIRED'
  | 'WALKOVER'
  | 'DEFAULTED'
  | 'POSTPONED'
  | 'CANCELLED';

export interface TennisProvenance {
  provider: string;
  providerId: string;
  fetchedAt: string;
  isStale: boolean;
}

export interface TennisCompetitor {
  otwId: string;
  providerId: string;
  name: string;
  countryCode?: string;
  seed?: number;
}

export interface TennisSetScore {
  setNumber: number;
  player1Games: number;
  player2Games: number;
  player1Tiebreak?: number;
  player2Tiebreak?: number;
}

export interface TennisEvent {
  otwId: string;
  providerId: string;
  tour: TennisTour;
  organizer: TennisOrganizer;
  name: string;
  season: number;
  edition?: string;
  category?: string;
  surface: TennisSurface;
  environment: 'INDOOR' | 'OUTDOOR' | 'UNKNOWN';
  location?: string;
  timezone: string;
  startsAt?: string;
  endsAt?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'UNAVAILABLE';
  provenance: TennisProvenance;
}

export interface TennisMatch {
  otwId: string;
  providerId: string;
  eventId: string;
  tour: TennisTour;
  organizer: TennisOrganizer;
  season: number;
  round?: string;
  scheduledAt?: string;
  timezone: string;
  status: TennisMatchStatus;
  competitors: [TennisCompetitor, TennisCompetitor];
  winnerId?: string;
  scoreText?: string;
  sets: TennisSetScore[];
  provenance: TennisProvenance;
}

export class TennisProviderUnavailableError extends Error {
  constructor(public readonly provider: string, message: string) {
    super(message);
    this.name = 'TennisProviderUnavailableError';
  }
}

export function stableTennisId(
  provider: string,
  entity: 'player' | 'event' | 'match' | 'tie' | 'rubber',
  providerId: string | number,
): string {
  return `tennis:${provider.toLowerCase()}:${entity}:${providerId}`;
}
