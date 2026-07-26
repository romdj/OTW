import got from 'got';
import { config } from '../../../config/env.js';
import { tennisCache, CACHE_TTL } from '../../../utils/cache.js';
import {
  stableTennisId,
  TennisProviderUnavailableError,
  type TennisEvent,
  type TennisMatch,
  type TennisMatchStatus,
  type TennisSetScore,
  type TennisSurface,
  type TennisTour,
} from '../domain.js';

interface Page<T> {
  data: T[];
  meta?: { next_cursor?: number | null; per_page?: number };
}

interface BdlPlayer {
  id: number;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  country_code?: string | null;
}

interface BdlTournament {
  id: number;
  name?: string | null;
  location?: string | null;
  surface?: string | null;
  category?: string | null;
  season?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}

interface BdlRanking {
  id: number;
  player: BdlPlayer;
  rank: number;
  points: number;
  movement?: number | null;
  ranking_date: string;
}

export interface TennisRankingRecord {
  rank: number;
  previousRank: number;
  playerName: string;
  playerId: string;
  country: string;
  countryCode: string;
  points: number;
  tournamentsPlayed: number;
  pointsDropping: number;
  nextBestPoints: number;
}

export interface BdlMatch {
  id: number;
  tournament: BdlTournament;
  season: number;
  round?: string | null;
  player1: BdlPlayer;
  player2: BdlPlayer;
  winner?: BdlPlayer | null;
  score?: string | null;
  set_scores?: Array<{
    set_number: number;
    player1_games: number;
    player2_games: number;
    player1_tiebreak?: number | null;
    player2_tiebreak?: number | null;
  }>;
  match_status?: string | null;
  is_live?: boolean;
}

export interface TennisProviderQuery {
  season?: number;
  tournamentId?: string;
  playerId?: string;
  status?: TennisMatchStatus;
  date?: string;
  limit?: number;
}

export function normalizeBdlStatus(match: Pick<BdlMatch, 'match_status' | 'is_live'>): TennisMatchStatus {
  if (match.is_live) return 'LIVE';
  switch (match.match_status?.toLowerCase()) {
    case 'finished': return 'COMPLETED';
    case 'in_progress': return 'LIVE';
    case 'walkover': return 'WALKOVER';
    case 'retired': return 'RETIRED';
    case 'defaulted': return 'DEFAULTED';
    case 'postponed': return 'POSTPONED';
    case 'cancelled':
    case 'canceled': return 'CANCELLED';
    default: return 'SCHEDULED';
  }
}

function surface(value?: string | null): TennisSurface {
  const normalized = value?.toLowerCase() ?? '';
  if (normalized.includes('hard')) return 'HARD';
  if (normalized.includes('clay')) return 'CLAY';
  if (normalized.includes('grass')) return 'GRASS';
  if (normalized.includes('carpet')) return 'CARPET';
  return 'UNKNOWN';
}

function atUtcBoundary(date?: string | null, end = false): string | undefined {
  if (!date) return undefined;
  return `${date}T${end ? '23:59:59' : '00:00:00'}Z`;
}

export function normalizeBdlTournament(tour: Exclude<TennisTour, 'ITF'>, item: BdlTournament, fetchedAt: string): TennisEvent {
  const now = Date.parse(fetchedAt);
  const startsAt = atUtcBoundary(item.start_date);
  const endsAt = atUtcBoundary(item.end_date, true);
  const status = startsAt && now < Date.parse(startsAt)
    ? 'UPCOMING'
    : endsAt && now > Date.parse(endsAt)
      ? 'COMPLETED'
      : startsAt && endsAt
        ? 'ACTIVE'
        : 'UPCOMING';
  return {
    otwId: stableTennisId(`bdl-${tour}`, 'event', item.id),
    providerId: String(item.id),
    tour,
    organizer: tour,
    name: item.name ?? 'Unnamed tournament',
    season: item.season ?? 0,
    edition: item.season ? String(item.season) : undefined,
    category: item.category ?? undefined,
    surface: surface(item.surface),
    environment: item.surface?.toLowerCase().includes('indoor') ? 'INDOOR' : 'UNKNOWN',
    location: item.location ?? undefined,
    timezone: 'UTC',
    startsAt,
    endsAt,
    status,
    provenance: { provider: 'BALLDONTLIE', providerId: String(item.id), fetchedAt, isStale: false },
  };
}

export function normalizeBdlMatch(tour: Exclude<TennisTour, 'ITF'>, item: BdlMatch, fetchedAt: string): TennisMatch {
  const provider = `bdl-${tour}`;
  const player = (value: BdlPlayer) => ({
    otwId: stableTennisId(provider, 'player', value.id),
    providerId: String(value.id),
    name: value.full_name ?? ([value.first_name, value.last_name].filter(Boolean).join(' ') || 'Unknown player'),
    countryCode: value.country_code ?? undefined,
  });
  const sets: TennisSetScore[] = (item.set_scores ?? []).map(set => ({
    setNumber: set.set_number,
    player1Games: set.player1_games,
    player2Games: set.player2_games,
    player1Tiebreak: set.player1_tiebreak ?? undefined,
    player2Tiebreak: set.player2_tiebreak ?? undefined,
  }));
  return {
    otwId: stableTennisId(provider, 'match', item.id),
    providerId: String(item.id),
    eventId: stableTennisId(provider, 'event', item.tournament.id),
    tour,
    organizer: tour,
    season: item.season,
    round: item.round ?? undefined,
    timezone: 'UTC',
    status: normalizeBdlStatus(item),
    competitors: [player(item.player1), player(item.player2)],
    winnerId: item.winner ? stableTennisId(provider, 'player', item.winner.id) : undefined,
    scoreText: item.score ?? undefined,
    sets,
    provenance: { provider: 'BALLDONTLIE', providerId: String(item.id), fetchedAt, isStale: false },
  };
}

export function tennisQueryCacheKey(tour: TennisTour, resource: string, query: TennisProviderQuery): string {
  const ordered = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return `tennis:${tour}:${resource}:${JSON.stringify(Object.fromEntries(ordered))}`;
}

class BallDontLieTennisProvider {
  private assertConfigured(): void {
    if (!config.BALLDONTLIE_API_KEY) {
      throw new TennisProviderUnavailableError('BALLDONTLIE', 'BALLDONTLIE_API_KEY is not configured');
    }
  }

  private async allPages<T>(path: string, searchParams: Record<string, string | number>): Promise<T[]> {
    this.assertConfigured();
    const result: T[] = [];
    let cursor: number | undefined;
    do {
      const response = await got<Page<T>>(`${config.BALLDONTLIE_API_BASE_URL}${path}`, {
        headers: { Authorization: config.BALLDONTLIE_API_KEY },
        searchParams: { ...searchParams, per_page: 100, ...(cursor ? { cursor } : {}) },
        timeout: { request: 10000 },
        retry: { limit: 2, statusCodes: [408, 429, 500, 502, 503, 504] },
        responseType: 'json',
      });
      if (!Array.isArray(response.body.data)) throw new Error(`Invalid BALLDONTLIE response for ${path}`);
      result.push(...response.body.data);
      cursor = response.body.meta?.next_cursor ?? undefined;
    } while (cursor && result.length < 1000);
    return result;
  }

  async events(tour: Exclude<TennisTour, 'ITF'>, query: TennisProviderQuery): Promise<TennisEvent[]> {
    const key = tennisQueryCacheKey(tour, 'events', query);
    const cached = tennisCache.get<TennisEvent[]>(key);
    if (cached) return cached;
    const prefix = tour.toLowerCase();
    const raw = await this.allPages<BdlTournament>(`/${prefix}/v1/tournaments`, {
      ...(query.season ? { season: query.season } : {}),
    });
    const fetchedAt = new Date().toISOString();
    const normalized = raw.map(item => normalizeBdlTournament(tour, item, fetchedAt));
    tennisCache.set(key, normalized, CACHE_TTL.LONG);
    return normalized;
  }

  async rankings(tour: Exclude<TennisTour, 'ITF'>, limit = 100): Promise<TennisRankingRecord[]> {
    const query = { limit };
    const key = tennisQueryCacheKey(tour, 'rankings', query);
    const cached = tennisCache.get<TennisRankingRecord[]>(key);
    if (cached) return cached;
    const prefix = tour.toLowerCase();
    const raw = await this.allPages<BdlRanking>(`/${prefix}/v1/rankings`, {});
    const rankings = raw.slice(0, limit).map(item => ({
      rank: item.rank,
      previousRank: item.rank + (item.movement ?? 0),
      playerName: item.player.full_name
        ?? ([item.player.first_name, item.player.last_name].filter(Boolean).join(' ') || 'Unknown player'),
      playerId: String(item.player.id),
      country: item.player.country_code ?? '',
      countryCode: item.player.country_code ?? '',
      points: item.points,
      tournamentsPlayed: 0,
      pointsDropping: 0,
      nextBestPoints: 0,
    }));
    tennisCache.set(key, rankings, CACHE_TTL.SHORT);
    return rankings;
  }

  async matches(tour: Exclude<TennisTour, 'ITF'>, query: TennisProviderQuery): Promise<TennisMatch[]> {
    if (query.date) {
      throw new Error('BALLDONTLIE ATP/WTA matches do not expose a documented date filter or scheduled timestamp');
    }
    const key = tennisQueryCacheKey(tour, 'matches', query);
    const cached = tennisCache.get<TennisMatch[]>(key);
    if (cached) return cached;
    const prefix = tour.toLowerCase();
    const raw = await this.allPages<BdlMatch>(`/${prefix}/v1/matches`, {
      ...(query.season ? { season: query.season } : {}),
      ...(query.tournamentId ? { tournament_ids: query.tournamentId } : {}),
      ...(query.playerId ? { 'player_ids[]': query.playerId } : {}),
      ...(query.status === 'LIVE' ? { is_live: 'true' } : {}),
    });
    const fetchedAt = new Date().toISOString();
    let normalized = raw.map(item => normalizeBdlMatch(tour, item, fetchedAt));
    if (query.status) normalized = normalized.filter(match => match.status === query.status);
    if (query.limit && query.limit > 0) normalized = normalized.slice(0, query.limit);
    tennisCache.set(key, normalized, CACHE_TTL.SHORT);
    return normalized;
  }
}

export const ballDontLieTennisProvider = new BallDontLieTennisProvider();
