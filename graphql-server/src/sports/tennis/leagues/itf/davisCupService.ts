import { stableTennisId, TennisProviderUnavailableError, type TennisMatchStatus, type TennisProvenance } from '../../domain.js';

export interface DavisCupNation {
  code: string;
  name: string;
}

export interface DavisCupRubber {
  otwId: string;
  providerId: string;
  order: number;
  matchType: 'SINGLES' | 'DOUBLES';
  status: TennisMatchStatus;
  homeCompetitors: string[];
  awayCompetitors: string[];
  winnerSide?: 'HOME' | 'AWAY';
  scoreText?: string;
  provenance: TennisProvenance;
}

export interface DavisCupTie {
  otwId: string;
  providerId: string;
  eventId: string;
  stage: string;
  group?: string;
  knockout: boolean;
  home: DavisCupNation;
  away: DavisCupNation;
  neutralVenue: boolean;
  venue?: string;
  scheduledAt?: string;
  status: TennisMatchStatus;
  homeScore?: number;
  awayScore?: number;
  rubbers: DavisCupRubber[];
  provenance: TennisProvenance;
}

export interface DavisCupEvent {
  otwId: string;
  providerId: string;
  organizer: 'ITF';
  name: string;
  season: number;
  status: 'UNAVAILABLE';
  ties: DavisCupTie[];
  provenance: TennisProvenance;
  availabilityMessage: string;
}

export function mapDavisCupTie(
  eventProviderId: string,
  raw: Omit<DavisCupTie, 'otwId' | 'eventId'>,
): DavisCupTie {
  return {
    ...raw,
    otwId: stableTennisId('itf', 'tie', raw.providerId),
    eventId: stableTennisId('itf', 'event', eventProviderId),
    rubbers: raw.rubbers.map(rubber => ({
      ...rubber,
      otwId: stableTennisId('itf', 'rubber', rubber.providerId),
    })),
  };
}

class DavisCupService {
  async getEvent(season: number): Promise<DavisCupEvent> {
    const fetchedAt = new Date().toISOString();
    return {
      otwId: stableTennisId('itf', 'event', String(season)),
      providerId: String(season),
      organizer: 'ITF',
      name: `${season} Davis Cup`,
      season,
      status: 'UNAVAILABLE',
      ties: [],
      provenance: {
        provider: 'UNCONFIGURED',
        providerId: String(season),
        fetchedAt,
        isStale: true,
      },
      availabilityMessage: 'No licensed, documented Davis Cup results provider is configured.',
    };
  }

  async getTies(_season: number): Promise<DavisCupTie[]> {
    throw new TennisProviderUnavailableError(
      'ITF',
      'Davis Cup live ties are unavailable because no licensed provider is configured',
    );
  }
}

export const davisCupService = new DavisCupService();
