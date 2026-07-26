import got, { HTTPError } from 'got';
import { config } from '../../../../config/env.js';
import { f1Cache, CACHE_TTL } from '../../../../utils/cache.js';
import type {
  F1CircuitData,
  F1ConstructorStandingData,
  F1DataAdapter,
  F1DriverStandingData,
  F1Provenance,
  F1RaceData,
  F1SessionData,
} from './types.js';

const SOURCE = 'balldontlie-f1';
type JsonObject = Record<string, unknown>;

interface CircuitDto {
  id: number; name: string; country_code: string; country_name: string;
}
interface EventDto {
  id: number; name: string; season: number; start_date: string; end_date: string;
  status: string; circuit: CircuitDto; location: string; country_code: string;
  country_name: string;
}
interface SessionDto {
  id: number; event: EventDto; type: string; name: string; date: string; status: string;
}
interface TeamDto { id: number; name: string; display_name?: string }
export class F1ProviderUnavailableError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'F1ProviderUnavailableError';
  }
}

function object(value: unknown, context: string): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`Invalid BALLDONTLIE ${context}: expected object`);
  }
  return value as JsonObject;
}

function string(value: unknown, context: string): string {
  if (typeof value !== 'string' || !value) {
    throw new TypeError(`Invalid BALLDONTLIE ${context}: expected string`);
  }
  return value;
}

function number(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Invalid BALLDONTLIE ${context}: expected number`);
  }
  return value;
}

function team(value: unknown): TeamDto {
  const dto = object(value, 'team');
  return {
    id: number(dto.id, 'team.id'),
    name: string(dto.name, 'team.name'),
    display_name: typeof dto.display_name === 'string' ? dto.display_name : undefined,
  };
}

function circuit(value: unknown): CircuitDto {
  const dto = object(value, 'circuit');
  return {
    id: number(dto.id, 'circuit.id'),
    name: string(dto.name, 'circuit.name'),
    country_code: string(dto.country_code, 'circuit.country_code'),
    country_name: string(dto.country_name, 'circuit.country_name'),
  };
}

export function parseEvent(value: unknown): EventDto {
  const dto = object(value, 'event');
  return {
    id: number(dto.id, 'event.id'),
    name: string(dto.name, 'event.name'),
    season: number(dto.season, 'event.season'),
    start_date: string(dto.start_date, 'event.start_date'),
    end_date: string(dto.end_date, 'event.end_date'),
    status: string(dto.status, 'event.status'),
    circuit: circuit(dto.circuit),
    location: string(dto.location, 'event.location'),
    country_code: string(dto.country_code, 'event.country_code'),
    country_name: string(dto.country_name, 'event.country_name'),
  };
}

function session(value: unknown): SessionDto {
  const dto = object(value, 'session');
  return {
    id: number(dto.id, 'session.id'),
    event: parseEvent(dto.event),
    type: string(dto.type, 'session.type'),
    name: string(dto.name, 'session.name'),
    date: string(dto.date, 'session.date'),
    status: string(dto.status, 'session.status'),
  };
}

function status(value: string): NonNullable<F1RaceData['status']> {
  const normalized = value.toLowerCase();
  if (['final', 'completed'].includes(normalized)) return 'completed';
  if (['live', 'in_progress', 'in progress'].includes(normalized)) return 'in_progress';
  if (['cancelled', 'canceled'].includes(normalized)) return 'cancelled';
  return 'upcoming';
}

function sessionStatus(value: string): NonNullable<F1SessionData['status']> {
  const normalized = value.toLowerCase();
  if (['final', 'completed'].includes(normalized)) return 'completed';
  if (['live', 'in_progress', 'in progress'].includes(normalized)) return 'live';
  if (normalized === 'delayed') return 'delayed';
  if (['cancelled', 'canceled'].includes(normalized)) return 'cancelled';
  return 'scheduled';
}

function sessionType(value: string): string {
  const key = value.toLowerCase().replace(/[\s-]+/g, '_');
  const types: Record<string, string> = {
    fp1: 'FP1', fp2: 'FP2', fp3: 'FP3',
    practice_1: 'FP1', practice_2: 'FP2', practice_3: 'FP3',
    qualifying: 'qualifying', sprint_qualifying: 'sprint_shootout',
    sprint_shootout: 'sprint_shootout', sprint: 'sprint', race: 'race',
  };
  if (!types[key]) throw new TypeError(`Unsupported BALLDONTLIE session type: ${value}`);
  return types[key];
}

export class BallDontLieF1Adapter implements F1DataAdapter {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly clock: () => Date;

  constructor(options: { baseUrl?: string; apiKey?: string; clock?: () => Date } = {}) {
    this.baseUrl = `${options.baseUrl ?? config.BALLDONTLIE_API_BASE_URL}/f1/v1`.replace(/([^:]\/)\/+/g, '$1');
    this.apiKey = options.apiKey ?? config.BALLDONTLIE_API_KEY;
    this.clock = options.clock ?? (() => new Date());
  }

  private provenance(): F1Provenance {
    return { source: SOURCE, fetchedAt: this.clock().toISOString(), isStale: false };
  }

  private async allPages<T>(
    path: string,
    params: Record<string, string | number | readonly number[]>,
    parse: (value: unknown) => T
  ): Promise<T[]> {
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      throw new F1ProviderUnavailableError('BALLDONTLIE F1 API key is not configured');
    }
    const items: T[] = [];
    let cursor: string | number | undefined;
    do {
      let body: unknown;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const searchParams = new URLSearchParams();
          for (const [key, value] of Object.entries(params)) {
            if (Array.isArray(value)) {
              for (const item of value) searchParams.append(key, String(item));
            } else {
              searchParams.set(key, String(value));
            }
          }
          searchParams.set('per_page', '100');
          if (cursor !== undefined) searchParams.set('cursor', String(cursor));
          body = (await got(`${this.baseUrl}${path}`, {
            headers: { Authorization: this.apiKey },
            searchParams,
            timeout: { request: 10000 },
            responseType: 'json',
          })).body;
          break;
        } catch (error) {
          const code = error instanceof HTTPError ? error.response.statusCode : undefined;
          if ((code !== undefined && code < 500 && code !== 429) || attempt === 2) {
            throw new F1ProviderUnavailableError(
              `BALLDONTLIE F1 request failed for ${path}${code ? ` (${code})` : ''}`,
              error
            );
          }
          const retryAfter = error instanceof HTTPError
            ? Number(error.response.headers['retry-after'])
            : NaN;
          await new Promise(resolve => setTimeout(
            resolve,
            Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt
          ));
        }
      }
      const envelope = object(body, `${path} response`);
      if (!Array.isArray(envelope.data)) {
        throw new TypeError(`Invalid BALLDONTLIE ${path}: expected data array`);
      }
      items.push(...envelope.data.map(parse));
      const meta = envelope.meta ? object(envelope.meta, `${path} meta`) : {};
      cursor = typeof meta.next_cursor === 'string' || typeof meta.next_cursor === 'number'
        ? meta.next_cursor
        : undefined;
    } while (cursor !== undefined);
    return items;
  }

  async fetchCalendar(season: number): Promise<F1RaceData[]> {
    const cacheKey = `${SOURCE}:calendar:${season}`;
    const cached = f1Cache.get<F1RaceData[]>(cacheKey);
    if (cached) return cached;
    const events = (await this.allPages('/events', { season }, parseEvent))
      .filter(event => event.season === season)
      .sort((a, b) => Date.parse(a.start_date) - Date.parse(b.start_date));
    if (!events.length) return [];

    const wanted = new Set(events.map(event => event.id));
    const sessions = await this.allPages(
      '/sessions',
      { 'event_ids[]': events.map(event => event.id) },
      session
    );
    const byEvent = new Map<number, SessionDto[]>();
    for (const item of sessions) {
      if (!wanted.has(item.event.id)) continue;
      byEvent.set(item.event.id, [...(byEvent.get(item.event.id) ?? []), item]);
    }
    const provenance = this.provenance();
    const calendar = events.map((event, index): F1RaceData => {
      const eventSessions = (byEvent.get(event.id) ?? [])
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
      return {
        providerId: String(event.id), season, round: index + 1, raceName: event.name,
        circuitId: String(event.circuit.id), circuitName: event.circuit.name,
        location: event.location, country: event.country_name, countryCode: event.country_code,
        date: event.end_date, time: event.end_date.slice(11, 19) + 'Z',
        format: eventSessions.some(item => item.type.toLowerCase().includes('sprint'))
          ? 'sprint'
          : 'standard',
        status: status(event.status), provenance,
        sessions: eventSessions.map(item => ({
          providerId: String(item.id), type: sessionType(item.type), date: item.date,
          time: item.date.slice(11, 19) + 'Z', status: sessionStatus(item.status),
        })),
      };
    });
    f1Cache.set(cacheKey, calendar, CACHE_TTL.MEDIUM);
    return calendar;
  }

  async fetchDriverStandings(season: number, round?: number): Promise<F1DriverStandingData[]> {
    if (round !== undefined) {
      throw new F1ProviderUnavailableError('BALLDONTLIE does not expose round-specific standings');
    }
    const cacheKey = `${SOURCE}:drivers:${season}:latest`;
    const cached = f1Cache.get<F1DriverStandingData[]>(cacheKey);
    if (cached) return cached;
    const provenance = this.provenance();
    const standings = (await this.allPages('/driver_standings', { season }, value => {
      const dto = object(value, 'driver standing');
      const rawDriver = object(dto.driver, 'driver');
      const rawTeam = rawDriver.team ? team(rawDriver.team) : undefined;
      return {
        season: number(dto.season, 'driver_standing.season'),
        position: number(dto.position, 'driver_standing.position'),
        points: number(dto.points, 'driver_standing.points'),
        driver: {
          id: number(rawDriver.id, 'driver.id'),
          firstName: string(rawDriver.first_name, 'driver.first_name'),
          lastName: string(rawDriver.last_name, 'driver.last_name'),
          countryCode: typeof rawDriver.country_code === 'string' ? rawDriver.country_code : '',
          countryName: typeof rawDriver.country_name === 'string' ? rawDriver.country_name : '',
          racingNumber: typeof rawDriver.racing_number === 'string' ? rawDriver.racing_number : '',
          team: rawTeam,
        },
      };
    })).filter(item => item.season === season).sort((a, b) => a.position - b.position)
      .map(item => ({
        position: item.position, positionText: String(item.position),
        points: item.points, wins: 0, provenance,
        driver: {
          driverId: String(item.driver.id), permanentNumber: Number(item.driver.racingNumber) || 0,
          code: '', givenName: item.driver.firstName, familyName: item.driver.lastName,
          dateOfBirth: '', nationality: item.driver.countryName || item.driver.countryCode,
          constructorId: item.driver.team ? String(item.driver.team.id) : '',
        },
        constructors: item.driver.team ? [{
          constructorId: String(item.driver.team.id),
          name: item.driver.team.display_name ?? item.driver.team.name,
          nationality: '',
        }] : [],
      }));
    f1Cache.set(cacheKey, standings, CACHE_TTL.MEDIUM);
    return standings;
  }

  async fetchConstructorStandings(season: number, round?: number): Promise<F1ConstructorStandingData[]> {
    if (round !== undefined) {
      throw new F1ProviderUnavailableError('BALLDONTLIE does not expose round-specific standings');
    }
    const cacheKey = `${SOURCE}:constructors:${season}:latest`;
    const cached = f1Cache.get<F1ConstructorStandingData[]>(cacheKey);
    if (cached) return cached;
    const provenance = this.provenance();
    const standings = (await this.allPages('/team_standings', { season }, value => {
      const dto = object(value, 'team standing');
      return {
        season: number(dto.season, 'team_standing.season'),
        position: number(dto.position, 'team_standing.position'),
        points: number(dto.points, 'team_standing.points'),
        team: team(dto.team),
      };
    })).filter(item => item.season === season).sort((a, b) => a.position - b.position)
      .map(item => ({
        position: item.position, positionText: String(item.position),
        points: item.points, wins: 0, provenance,
        constructor: {
          constructorId: String(item.team.id),
          name: item.team.display_name ?? item.team.name,
          nationality: '',
        },
      }));
    f1Cache.set(cacheKey, standings, CACHE_TTL.MEDIUM);
    return standings;
  }

  fetchCircuit(_circuitId: string): Promise<F1CircuitData | null> {
    return Promise.resolve(null);
  }

  getSource(): string { return SOURCE; }
}

export const f1Adapter = new BallDontLieF1Adapter();
