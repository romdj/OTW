/**
 * F1 Service - Manages F1 calendar and championship data
 *
 * Provides cached access to race calendar, standings, and championship battle calculations.
 */

import { F1Adapter } from '../adapters/F1Adapter.js';
import type { F1RaceData, F1DriverStandingData, F1ConstructorStandingData } from '../adapters/types.js';
import type {
  GrandPrix,
  Session,
  Circuit,
  DriverStanding,
  ConstructorStanding,
  ChampionshipBattle,
  GrandPrixFilters,
  StandingsFilters,
  SessionType,
  WeekendFormat,
  RaceExcitement,
} from '../types.js';
import { calculateMaxPoints, canStillWinChampionship, calculateClosenessScore } from '../types.js';

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * F1 Service
 */
export class F1Service {
  private readonly adapter: F1Adapter;
  private readonly cacheTTL: number;

  // Caches
  private calendarCache: Map<number, CacheEntry<GrandPrix[]>> = new Map();
  private driverStandingsCache: Map<string, CacheEntry<DriverStanding[]>> = new Map();
  private constructorStandingsCache: Map<string, CacheEntry<ConstructorStanding[]>> = new Map();

  constructor(adapter?: F1Adapter, cacheTTLMinutes: number = 60) {
    this.adapter = adapter ?? new F1Adapter();
    this.cacheTTL = cacheTTLMinutes * 60 * 1000;
  }

  /**
   * Get F1 calendar for a season
   */
  async getCalendar(filters: GrandPrixFilters = {}): Promise<GrandPrix[]> {
    const season = filters.season ?? new Date().getFullYear();

    // Check cache
    const cached = this.calendarCache.get(season);
    if (cached && Date.now() < cached.expiresAt) {
      return this.filterGrandPrix(cached.data, filters);
    }

    // Fetch from adapter
    const rawRaces = await this.adapter.fetchCalendar(season);
    const grandPrix = rawRaces.map((raw) => this.transformGrandPrix(raw));

    // Calculate excitement predictions
    for (const gp of grandPrix) {
      gp.predictedExcitement = this.calculateRaceExcitement(gp);
    }

    // Cache result
    this.calendarCache.set(season, {
      data: grandPrix,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheTTL,
    });

    return this.filterGrandPrix(grandPrix, filters);
  }

  /**
   * Get a single Grand Prix by ID
   */
  async getGrandPrix(id: string): Promise<GrandPrix | null> {
    // Extract season from ID (format: season_round)
    const match = id.match(/^(\d{4})_(\d+)$/);
    if (!match) return null;

    const season = parseInt(match[1], 10);
    const round = parseInt(match[2], 10);

    const calendar = await this.getCalendar({ season });
    return calendar.find((gp) => gp.round === round) ?? null;
  }

  /**
   * Get upcoming sessions across all races
   */
  async getUpcomingSessions(limit: number = 10): Promise<Array<Session & { grandPrixName: string }>> {
    const now = new Date();
    const season = now.getFullYear();
    const calendar = await this.getCalendar({ season });

    const allSessions: Array<Session & { grandPrixName: string }> = [];

    for (const gp of calendar) {
      for (const session of gp.sessions) {
        if (new Date(session.date) >= now) {
          allSessions.push({
            ...session,
            grandPrixName: gp.name,
          });
        }
      }
    }

    // Sort by date
    allSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return allSessions.slice(0, limit);
  }

  /**
   * Get driver standings
   */
  async getDriverStandings(filters: StandingsFilters = {}): Promise<DriverStanding[]> {
    const season = filters.season ?? new Date().getFullYear();
    const cacheKey = `${season}_${filters.round ?? 'latest'}`;

    // Check cache
    const cached = this.driverStandingsCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Fetch from adapter
    const rawStandings = await this.adapter.fetchDriverStandings(season, filters.round);
    const standings = rawStandings.map((raw, index) => this.transformDriverStanding(raw, index, rawStandings));

    // Cache result
    this.driverStandingsCache.set(cacheKey, {
      data: standings,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheTTL,
    });

    return standings;
  }

  /**
   * Get constructor standings
   */
  async getConstructorStandings(filters: StandingsFilters = {}): Promise<ConstructorStanding[]> {
    const season = filters.season ?? new Date().getFullYear();
    const cacheKey = `${season}_${filters.round ?? 'latest'}`;

    // Check cache
    const cached = this.constructorStandingsCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    // Fetch from adapter
    const rawStandings = await this.adapter.fetchConstructorStandings(season, filters.round);
    const standings = rawStandings.map((raw, index) => this.transformConstructorStanding(raw, index, rawStandings));

    // Cache result
    this.constructorStandingsCache.set(cacheKey, {
      data: standings,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheTTL,
    });

    return standings;
  }

  /**
   * Get championship battle analysis
   */
  async getChampionshipBattle(season?: number): Promise<ChampionshipBattle> {
    const targetSeason = season ?? new Date().getFullYear();

    const [calendar, driverStandings, constructorStandings] = await Promise.all([
      this.getCalendar({ season: targetSeason }),
      this.getDriverStandings({ season: targetSeason }),
      this.getConstructorStandings({ season: targetSeason }),
    ]);

    // Calculate races remaining
    const completedRaces = calendar.filter((gp) => gp.status === 'completed').length;
    const racesRemaining = calendar.length - completedRaces;

    // Count sprint weekends remaining
    const sprintsRemaining = calendar.filter(
      (gp) => gp.format === 'sprint' && gp.status !== 'completed'
    ).length;

    const maxPointsAvailable = calculateMaxPoints(racesRemaining, sprintsRemaining);

    // Analyze driver championship
    const driverLeader = driverStandings[0];
    const driverChallengers = driverStandings.filter((d) => d.canWinTitle && d.position !== 1);
    const driverEliminated = driverStandings.filter((d) => !d.canWinTitle);
    const driverGap = driverStandings.length > 1 ? driverLeader.points - driverStandings[1].points : 0;

    // Analyze constructor championship
    const constructorLeader = constructorStandings[0];
    const constructorChallengers = constructorStandings.filter((c) => c.canWinTitle && c.position !== 1);
    const constructorEliminated = constructorStandings.filter((c) => !c.canWinTitle);
    const constructorGap = constructorStandings.length > 1
      ? constructorLeader.points - constructorStandings[1].points
      : 0;

    // Generate narratives
    const narratives = this.generateChampionshipNarratives(
      driverStandings,
      constructorStandings,
      racesRemaining,
      driverGap,
      constructorGap
    );

    return {
      season: targetSeason,
      racesRemaining,
      maxPointsAvailable,
      isOpen: driverChallengers.length > 0 || constructorChallengers.length > 0,
      drivers: {
        leader: driverLeader,
        challengers: driverChallengers,
        eliminated: driverEliminated,
        gap: driverGap,
        closenessScore: calculateClosenessScore(driverGap, maxPointsAvailable, driverChallengers.length + 1),
      },
      constructors: {
        leader: constructorLeader,
        challengers: constructorChallengers,
        eliminated: constructorEliminated,
        gap: constructorGap,
        closenessScore: calculateClosenessScore(constructorGap, maxPointsAvailable, constructorChallengers.length + 1),
      },
      narratives,
    };
  }

  /**
   * Transform raw race data to GrandPrix
   */
  private transformGrandPrix(raw: F1RaceData): GrandPrix {
    const now = new Date();
    const raceDate = new Date(raw.date);
    const startDate = new Date(raw.sessions[0]?.date || raw.date);
    const endDate = raceDate;

    let status: 'upcoming' | 'in_progress' | 'completed' = 'upcoming';
    if (now > endDate) {
      status = 'completed';
    } else if (now >= startDate && now <= endDate) {
      status = 'in_progress';
    }

    const sessions: Session[] = raw.sessions.map((s) => ({
      id: `${raw.season}_${raw.round}_${s.type}`,
      grandPrixId: `${raw.season}_${raw.round}`,
      type: s.type as SessionType,
      name: this.formatSessionName(s.type),
      date: new Date(s.date),
      startTime: s.time,
      startTimeUTC: s.time,
      status: new Date(s.date) < now ? 'completed' : 'scheduled',
    }));

    return {
      id: `${raw.season}_${raw.round}`,
      name: raw.raceName,
      officialName: raw.raceName,
      slug: this.slugify(raw.raceName),
      round: raw.round,
      season: raw.season,
      circuit: {
        id: raw.circuitId,
        name: raw.circuitName,
        location: raw.location,
        country: raw.country,
        countryCode: raw.countryCode,
        length: 0, // Would come from circuit data
        turns: 0,
        type: 'permanent',
        drsZones: 2,
        characteristics: {
          overtakingDifficulty: 'moderate',
          weatherVariability: 'medium',
          tireWear: 'medium',
          safetyCarLikelihood: 'medium',
        },
      },
      format: raw.format as WeekendFormat,
      startDate,
      endDate,
      status,
      sessions,
    };
  }

  /**
   * Transform raw driver standing
   */
  private transformDriverStanding(
    raw: F1DriverStandingData,
    _index: number,
    allStandings: F1DriverStandingData[]
  ): DriverStanding {
    const leaderPoints = allStandings[0]?.points || 0;
    const nextPoints = allStandings[raw.position]?.points || 0;

    // Calculate theoretical max (assumes 24 races, 6 sprints remaining at season start)
    const theoreticalMax = raw.points + calculateMaxPoints(24, 6);

    return {
      position: raw.position,
      driver: {
        id: raw.driver.driverId,
        number: raw.driver.permanentNumber,
        code: raw.driver.code,
        firstName: raw.driver.givenName,
        lastName: raw.driver.familyName,
        fullName: `${raw.driver.givenName} ${raw.driver.familyName}`,
        nationality: raw.driver.nationality,
        nationalityCode: raw.driver.nationality.substring(0, 3).toUpperCase(),
        constructorId: raw.driver.constructorId,
        constructorName: raw.constructors[0]?.name || '',
      },
      points: raw.points,
      wins: raw.wins,
      podiums: 0, // Would need additional data
      poles: 0,
      fastestLaps: 0,
      dnfs: 0,
      pointsToLeader: leaderPoints - raw.points,
      pointsToNext: raw.position > 1 ? raw.points - nextPoints : 0,
      theoreticalMaxPoints: theoreticalMax,
      canWinTitle: canStillWinChampionship(raw.points, leaderPoints, calculateMaxPoints(24, 6)),
    };
  }

  /**
   * Transform raw constructor standing
   */
  private transformConstructorStanding(
    raw: F1ConstructorStandingData,
    _index: number,
    allStandings: F1ConstructorStandingData[]
  ): ConstructorStanding {
    const leaderPoints = allStandings[0]?.points || 0;
    const nextPoints = allStandings[raw.position]?.points || 0;

    // Constructor max is 2x driver max (2 drivers per team)
    const theoreticalMax = raw.points + calculateMaxPoints(24, 6) * 2;

    return {
      position: raw.position,
      constructor: {
        id: raw.constructor.constructorId,
        name: raw.constructor.name,
        fullName: raw.constructor.name,
        nationality: raw.constructor.nationality,
        nationalityCode: raw.constructor.nationality.substring(0, 3).toUpperCase(),
        base: '',
        powerUnit: '',
        drivers: [],
      },
      points: raw.points,
      wins: raw.wins,
      podiums: 0,
      poles: 0,
      oneTwo: 0,
      pointsToLeader: leaderPoints - raw.points,
      pointsToNext: raw.position > 1 ? raw.points - nextPoints : 0,
      theoreticalMaxPoints: theoreticalMax,
      canWinTitle: canStillWinChampionship(raw.points, leaderPoints, calculateMaxPoints(24, 6) * 2),
    };
  }

  /**
   * Calculate race excitement prediction
   */
  private calculateRaceExcitement(gp: GrandPrix): RaceExcitement {
    const factors = {
      trackFactor: this.getTrackExcitementFactor(gp.circuit),
      weatherFactor: this.getWeatherFactor(gp.circuit),
      titleFactor: 50, // Would be calculated based on championship state
      prestigeFactor: this.getPrestigeFactor(gp),
      gridFactor: 50, // Would be calculated post-qualifying
    };

    const score = Object.values(factors).reduce((sum, f) => sum + f, 0) / 5;

    const tags: string[] = [];
    if (factors.trackFactor >= 70) tags.push('overtaking-fest');
    if (factors.weatherFactor >= 70) tags.push('weather-lottery');
    if (factors.prestigeFactor >= 80) tags.push('crown-jewel');

    return { score, factors, tags };
  }

  /**
   * Get track excitement factor based on overtaking potential
   */
  private getTrackExcitementFactor(circuit: Circuit): number {
    const overtakingScores: Record<string, number> = {
      easy: 80,
      moderate: 60,
      difficult: 40,
      very_difficult: 30,
    };
    return overtakingScores[circuit.characteristics.overtakingDifficulty] || 50;
  }

  /**
   * Get weather factor based on variability
   */
  private getWeatherFactor(circuit: Circuit): number {
    const weatherScores: Record<string, number> = {
      high: 75,
      medium: 50,
      low: 30,
    };
    return weatherScores[circuit.characteristics.weatherVariability] || 50;
  }

  /**
   * Get prestige factor for historic races
   */
  private getPrestigeFactor(gp: GrandPrix): number {
    const prestigeRaces: Record<string, number> = {
      monaco: 95,
      silverstone: 85,
      monza: 90,
      spa: 85,
      suzuka: 80,
    };
    return prestigeRaces[gp.circuit.id] || 50;
  }

  /**
   * Generate championship narratives
   */
  private generateChampionshipNarratives(
    drivers: DriverStanding[],
    constructors: ConstructorStanding[],
    racesRemaining: number,
    driverGap: number,
    constructorGap: number
  ): string[] {
    const narratives: string[] = [];

    if (driverGap < 25 && racesRemaining > 0) {
      narratives.push(`Driver's championship could swing in a single race (gap: ${driverGap} points)`);
    }

    if (drivers.filter((d) => d.canWinTitle).length >= 3) {
      narratives.push(`${drivers.filter((d) => d.canWinTitle).length}-way title fight still possible`);
    }

    if (constructorGap < 50 && racesRemaining > 0) {
      narratives.push(`Constructor battle heating up (gap: ${constructorGap} points)`);
    }

    if (racesRemaining <= 3 && driverGap > 0) {
      narratives.push(`Championship decider approaching - ${racesRemaining} races remaining`);
    }

    return narratives;
  }

  /**
   * Filter Grand Prix by criteria
   */
  private filterGrandPrix(grandPrix: GrandPrix[], filters: GrandPrixFilters): GrandPrix[] {
    return grandPrix.filter((gp) => {
      if (filters.status && gp.status !== filters.status) return false;
      if (filters.format && gp.format !== filters.format) return false;
      if (filters.country && gp.circuit.country !== filters.country) return false;
      return true;
    });
  }

  /**
   * Format session type to display name
   */
  private formatSessionName(type: string): string {
    const names: Record<string, string> = {
      FP1: 'Free Practice 1',
      FP2: 'Free Practice 2',
      FP3: 'Free Practice 3',
      qualifying: 'Qualifying',
      sprint_shootout: 'Sprint Shootout',
      sprint: 'Sprint Race',
      race: 'Grand Prix',
    };
    return names[type] || type;
  }

  /**
   * Create URL-safe slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.calendarCache.clear();
    this.driverStandingsCache.clear();
    this.constructorStandingsCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { calendar: number; driverStandings: number; constructorStandings: number } {
    return {
      calendar: this.calendarCache.size,
      driverStandings: this.driverStandingsCache.size,
      constructorStandings: this.constructorStandingsCache.size,
    };
  }
}

// Export singleton instance
export const f1Service = new F1Service();
