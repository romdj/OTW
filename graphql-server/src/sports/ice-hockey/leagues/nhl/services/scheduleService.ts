/**
 * NHL Schedule Service
 *
 * Fetches the NHL schedule week containing an ISO calendar date and normalizes
 * provider-specific games into the shared ice-hockey calendar domain.
 */

import got from 'got';
import { API_TIMEOUTS, RETRY_LIMITS } from '../../../../../constants/shared.js';
import { apiCache, CACHE_TTL } from '../../../../../utils/cache.js';
import { logger, PerformanceLogger } from '../../../../../utils/logger.js';
import type {
  HockeyCalendar,
  HockeyCalendarGame,
  HockeyCalendarGameStatus,
} from '../../../types.js';
import { NHL_API_ENDPOINTS, NHL_ERROR_MESSAGES } from '../constants/index.js';
import type {
  NHLApiScheduleGame,
  NHLApiScheduleResponse,
  NHLApiScheduleTeam,
} from '../types/nhl-api.types.js';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SCORE_VISIBLE_STATUSES: ReadonlySet<HockeyCalendarGameStatus> = new Set(['live', 'final']);

export function validateNhlScheduleDate(date: string): void {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error('NHL schedule date must use YYYY-MM-DD format');
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('NHL schedule date is not a valid calendar date');
  }
}

export function normalizeNhlGameStatus(
  gameState: string,
  gameScheduleState?: string,
): HockeyCalendarGameStatus {
  const scheduleState = gameScheduleState?.toUpperCase();
  if (scheduleState === 'CNCL' || scheduleState === 'CANCELLED') return 'cancelled';
  if (scheduleState === 'PPD' || scheduleState === 'POSTPONED') return 'postponed';

  switch (gameState.toUpperCase()) {
    case 'FUT':
      return 'scheduled';
    case 'PRE':
      return 'pregame';
    case 'LIVE':
    case 'CRIT':
      return 'live';
    case 'FINAL':
    case 'OFF':
      return 'final';
    default:
      return 'unknown';
  }
}

function getTeamName(team: NHLApiScheduleTeam): string {
  const place = team.placeName?.default;
  const commonName = team.commonName?.default;
  return [place, commonName].filter(Boolean).join(' ') || team.abbrev;
}

function transformTeam(
  team: NHLApiScheduleTeam,
  includeScore: boolean,
): HockeyCalendarGame['homeTeam'] {
  return {
    providerId: String(team.id),
    abbreviation: team.abbrev,
    name: getTeamName(team),
    ...(team.logo ? { logo: team.logo } : {}),
    ...(includeScore && typeof team.score === 'number' ? { score: team.score } : {}),
  };
}

export function transformNhlScheduleGame(game: NHLApiScheduleGame): HockeyCalendarGame {
  const status = normalizeNhlGameStatus(game.gameState, game.gameScheduleState);
  const includeScore = SCORE_VISIBLE_STATUSES.has(status);

  return {
    providerId: String(game.id),
    provider: 'NHL',
    league: 'NHL',
    season: String(game.season),
    gameType: game.gameType,
    startTime: new Date(game.startTimeUTC).toISOString(),
    status,
    providerStatus: game.gameScheduleState
      ? `${game.gameState}:${game.gameScheduleState}`
      : game.gameState,
    ...(game.venue?.default ? { venue: game.venue.default } : {}),
    neutralSite: game.neutralSite ?? false,
    awayTeam: transformTeam(game.awayTeam, includeScore),
    homeTeam: transformTeam(game.homeTeam, includeScore),
  };
}

function assertScheduleResponse(value: NHLApiScheduleResponse): void {
  if (!value || !Array.isArray(value.gameWeek)) {
    throw new Error('NHL schedule response did not contain a gameWeek array');
  }

  for (const day of value.gameWeek) {
    if (!day || typeof day.date !== 'string' || !Array.isArray(day.games)) {
      throw new Error('NHL schedule response contained an invalid schedule day');
    }
  }
}

export class NHLScheduleService {
  async getSchedule(anchorDate: string): Promise<HockeyCalendar> {
    validateNhlScheduleDate(anchorDate);
    const url = NHL_API_ENDPOINTS.SCHEDULE(anchorDate);
    const cacheKey = `nhl_schedule_${anchorDate}`;
    const cached = apiCache.get<HockeyCalendar>(cacheKey);

    if (cached) {
      return {
        ...cached,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    logger.info({ anchorDate, url }, 'Fetching NHL schedule');

    return PerformanceLogger.measureAsync('nhl-schedule-api-request', async () => {
      try {
        const response = await got.get(url, {
          responseType: 'json',
          timeout: { request: API_TIMEOUTS.DEFAULT_REQUEST },
          retry: {
            limit: RETRY_LIMITS.API_REQUESTS,
            methods: ['GET'],
          },
        }).json<NHLApiScheduleResponse>();

        assertScheduleResponse(response);
        const games = response.gameWeek.flatMap(day => day.games.map(transformNhlScheduleGame));
        const dates = response.gameWeek.map(day => day.date).sort();
        const calendar: HockeyCalendar = {
          anchorDate,
          rangeStart: dates[0] ?? null,
          rangeEnd: dates.length > 0 ? dates[dates.length - 1] : null,
          games,
          metadata: {
            provider: 'NHL',
            source: url,
            fetchedAt: new Date().toISOString(),
            cached: false,
          },
        };

        apiCache.set(cacheKey, calendar, CACHE_TTL.SHORT);
        logger.info({ anchorDate, gameCount: games.length }, 'Successfully fetched NHL schedule');
        return calendar;
      } catch (error) {
        logger.error({
          anchorDate,
          url,
          error: error instanceof Error ? error.message : String(error),
        }, NHL_ERROR_MESSAGES.FETCH_SCHEDULE_FAILED);
        throw new Error(`${NHL_ERROR_MESSAGES.FETCH_SCHEDULE_FAILED} for ${anchorDate}`);
      }
    }, { anchorDate });
  }
}

export const nhlScheduleService = new NHLScheduleService();
