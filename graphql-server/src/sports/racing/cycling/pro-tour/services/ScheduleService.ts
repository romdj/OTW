/**
 * Schedule Service - Manages cycling race schedules and data
 *
 * Provides cached access to race calendars, stage data, and GC standings.
 * Implements GC movement calculations for excitement scoring.
 */

import { UCIAdapter } from '../adapters/UCIAdapter.js';
import { UCIClassifications, mapUCIStageType } from '../adapters/types.js';
import type { UCIRaceData, UCIStageData } from '../adapters/types.js';
import type {
  CyclingRace,
  CyclingStage,
  RaceCategory,
  Gender,
  RaceFilters,
  StageFilters,
  GCStanding,
  GCMovement,
  StageType,
} from '../types.js';
import { calculateExcitementScore, isExcitingGCMovement } from '../types.js';

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Schedule Service for cycling races
 */
export class ScheduleService {
  private readonly adapter: UCIAdapter;
  private readonly cacheTTL: number; // milliseconds

  // In-memory caches
  private raceCache: Map<number, CacheEntry<CyclingRace[]>> = new Map();
  private stageCache: Map<string, CacheEntry<CyclingStage[]>> = new Map();

  constructor(adapter?: UCIAdapter, cacheTTLMinutes: number = 60 * 24) {
    this.adapter = adapter ?? new UCIAdapter();
    this.cacheTTL = cacheTTLMinutes * 60 * 1000;
  }

  /**
   * Get all races for a year with optional filters
   */
  async getRaces(filters: RaceFilters = {}): Promise<CyclingRace[]> {
    const year = filters.year ?? new Date().getFullYear();

    // Check cache
    const cached = this.raceCache.get(year);
    if (cached && Date.now() < cached.expiresAt) {
      return this.filterRaces(cached.data, filters);
    }

    // Fetch from adapter
    const rawRaces = await this.adapter.fetchCalendar(year);
    const races = rawRaces.map((raw) => this.transformRace(raw));

    // Cache result
    this.raceCache.set(year, {
      data: races,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheTTL,
    });

    return this.filterRaces(races, filters);
  }

  /**
   * Get a single race by ID
   */
  async getRace(raceId: string): Promise<CyclingRace | null> {
    // Extract year from race ID (format: XXX2025)
    const yearMatch = raceId.match(/(\d{4})$/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    const races = await this.getRaces({ year });
    const race = races.find((r) => r.id === raceId);

    if (race) {
      // Load stages for this race
      race.stages = await this.getStages({ raceId });
    }

    return race ?? null;
  }

  /**
   * Get stages with optional filters
   */
  async getStages(filters: StageFilters = {}): Promise<CyclingStage[]> {
    if (!filters.raceId) {
      // Return upcoming stages from all races
      return this.getUpcomingStages(filters);
    }

    // Check cache
    const cached = this.stageCache.get(filters.raceId);
    if (cached && Date.now() < cached.expiresAt) {
      return this.filterStages(cached.data, filters);
    }

    // Fetch from adapter
    const rawStages = await this.adapter.fetchStages(filters.raceId);
    const stages = rawStages.map((raw) => this.transformStage(raw));

    // Calculate predicted excitement for each stage
    for (const stage of stages) {
      stage.predictedExcitement = this.calculatePredictedExcitement(stage, stages.length);
    }

    // Cache result
    this.stageCache.set(filters.raceId, {
      data: stages,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheTTL,
    });

    return this.filterStages(stages, filters);
  }

  /**
   * Get upcoming stages across all races
   */
  async getUpcomingStages(filters: StageFilters = {}): Promise<CyclingStage[]> {
    const now = new Date();
    const fromDate = filters.fromDate ?? now;
    const toDate =
      filters.toDate ?? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const year = fromDate.getFullYear();
    const races = await this.getRaces({ year });

    const allStages: CyclingStage[] = [];

    for (const race of races) {
      // Only check races that might have stages in our window
      if (new Date(race.endDate) < fromDate || new Date(race.startDate) > toDate) {
        continue;
      }

      const stages = await this.getStages({ raceId: race.id });
      allStages.push(...stages);
    }

    // Filter by date range
    const upcomingStages = allStages.filter((stage) => {
      const stageDate = new Date(stage.date);
      return stageDate >= fromDate && stageDate <= toDate;
    });

    // Sort by date
    upcomingStages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Apply additional filters
    return this.filterStages(upcomingStages, filters);
  }

  /**
   * Calculate GC movement between two stages
   * This is the key method for identifying exciting grand tour stages
   */
  calculateGCMovement(standingsBefore: GCStanding[], standingsAfter: GCStanding[]): GCMovement {
    const movement: GCMovement = {
      leaderChanged: false,
      top10Changes: 0,
      top20Changes: 0,
      biggestGain: null,
      biggestLoss: null,
      significantTimeGapsChanged: false,
      timeChanges: [],
      standingsAfter,
    };

    // Check if leader changed
    const previousLeader = standingsBefore[0];
    const newLeader = standingsAfter[0];

    if (previousLeader && newLeader && previousLeader.riderId !== newLeader.riderId) {
      movement.leaderChanged = true;
      movement.previousLeader = previousLeader.riderName;
      movement.newLeader = newLeader.riderName;
    }

    // Calculate position changes
    const beforePositions = new Map(standingsBefore.map((s) => [s.riderId, s.position]));

    let biggestGain = 0;
    let biggestLoss = 0;

    for (const after of standingsAfter) {
      const beforePos = beforePositions.get(after.riderId);
      if (beforePos !== undefined) {
        const change = beforePos - after.position;

        // Track top 10/20 changes
        if (after.position <= 10 || beforePos <= 10) {
          if (change !== 0) movement.top10Changes++;
        }
        if (after.position <= 20 || beforePos <= 20) {
          if (change !== 0) movement.top20Changes++;
        }

        // Track biggest gain
        if (change > biggestGain) {
          biggestGain = change;
          movement.biggestGain = {
            riderName: after.riderName,
            positionsBefore: beforePos,
            positionsAfter: after.position,
            positionsGained: change,
          };
        }

        // Track biggest loss
        if (change < biggestLoss) {
          biggestLoss = change;
          movement.biggestLoss = {
            riderName: after.riderName,
            positionsBefore: beforePos,
            positionsAfter: after.position,
            positionsLost: Math.abs(change),
          };
        }
      }
    }

    // Check for significant time gap changes (>30s for top 10)
    const beforeTimes = new Map(standingsBefore.slice(0, 10).map((s) => [s.riderId, s.totalTime]));

    for (const after of standingsAfter.slice(0, 10)) {
      const beforeTime = beforeTimes.get(after.riderId);
      if (beforeTime !== undefined) {
        const timeDiff = after.totalTime - beforeTime;
        if (Math.abs(timeDiff) > 30000) {
          // 30 seconds in ms
          movement.significantTimeGapsChanged = true;
        }

        const beforeStanding = standingsBefore.find((s) => s.riderId === after.riderId);
        if (beforeStanding) {
          movement.timeChanges.push({
            riderName: after.riderName,
            previousGap: beforeStanding.timeGap,
            newGap: after.timeGap,
            timeLost: Math.round(timeDiff / 1000),
          });
        }
      }
    }

    return movement;
  }

  /**
   * Transform UCI race data to our internal format
   */
  private transformRace(raw: UCIRaceData): CyclingRace {
    const classification =
      UCIClassifications[raw.category as keyof typeof UCIClassifications];

    // Determine category
    let category: RaceCategory = 'world_tour';
    if (raw.category === '2.GT') {
      category = 'grand_tour';
    } else if (raw.name.includes('Roubaix') || raw.name.includes('Lombardia') ||
               raw.name.includes('Sanremo') || raw.name.includes('Vlaanderen') ||
               raw.name.includes('Liege')) {
      category = 'monument';
    } else if (raw.category.includes('Pro')) {
      category = 'pro_series';
    } else if (classification) {
      category = classification.category as RaceCategory;
    }

    // Determine gender
    let gender: Gender = 'men';
    if (raw.class === 'WE' || raw.category.includes('WWT')) {
      gender = 'women';
    }

    // Determine status
    const now = new Date();
    const startDate = new Date(raw.startDate);
    const endDate = new Date(raw.endDate);
    let status: 'upcoming' | 'in_progress' | 'completed' = 'upcoming';
    if (now > endDate) {
      status = 'completed';
    } else if (now >= startDate && now <= endDate) {
      status = 'in_progress';
    }

    return {
      id: raw.uciCode,
      name: raw.name,
      slug: this.slugify(raw.name),
      category,
      gender,
      startDate,
      endDate,
      country: raw.country,
      totalDistance: raw.distance,
      totalStages: raw.stages,
      status,
      uciCode: raw.uciCode,
      website: raw.website,
    };
  }

  /**
   * Transform UCI stage data to our internal format
   */
  private transformStage(raw: UCIStageData): CyclingStage {
    const now = new Date();
    const stageDate = new Date(raw.date);
    let status: 'upcoming' | 'live' | 'completed' = 'upcoming';

    // Simple status determination (would need live data for accurate "live" status)
    if (stageDate < now) {
      status = 'completed';
    }

    return {
      id: `${raw.raceCode}-S${raw.stageNumber}`,
      raceId: raw.raceCode,
      stageNumber: raw.stageNumber,
      name: `Stage ${raw.stageNumber}: ${raw.startCity} - ${raw.finishCity}`,
      date: stageDate,
      startTime: raw.startTime,
      startLocation: raw.startCity,
      finishLocation: raw.finishCity,
      distance: raw.distance,
      elevationGain: raw.totalClimbing,
      stageType: mapUCIStageType(raw.type) as StageType,
      status,
    };
  }

  /**
   * Calculate predicted excitement for a stage before it happens
   */
  private calculatePredictedExcitement(
    stage: CyclingStage,
    totalStages: number
  ): CyclingStage['predictedExcitement'] {
    // Terrain factor
    const terrainScores: Record<StageType, number> = {
      mountain: 85,
      hilly: 60,
      itt: 70,
      ttt: 55,
      prologue: 50,
      flat: 40,
    };

    // Stage position factor (final week more exciting)
    const positionFactor =
      stage.stageNumber > totalStages * 0.7
        ? 80
        : stage.stageNumber > totalStages * 0.5
          ? 60
          : 40;

    // Finale profile (summit finishes more exciting)
    const finaleFactor = stage.stageType === 'mountain' ? 80 : 50;

    // Historic location (would need climb data for accuracy)
    const heritageFactor = stage.finishLocation.toLowerCase().includes('huez') ||
                          stage.finishLocation.toLowerCase().includes('ventoux') ||
                          stage.finishLocation.toLowerCase().includes('galibier')
      ? 90
      : 40;

    const factors = {
      terrain: terrainScores[stage.stageType] || 50,
      gcImportance: positionFactor,
      gcMovement: 0, // Unknown before stage
      finaleProfile: finaleFactor,
      historicLocation: heritageFactor,
    };

    return {
      score: calculateExcitementScore({
        terrain: factors.terrain,
        racePosition: factors.gcImportance,
        finale: factors.finaleProfile,
        heritage: factors.historicLocation,
      }),
      factors,
    };
  }

  /**
   * Filter races by criteria
   */
  private filterRaces(races: CyclingRace[], filters: RaceFilters): CyclingRace[] {
    return races.filter((race) => {
      if (filters.category && race.category !== filters.category) return false;
      if (filters.gender && race.gender !== filters.gender) return false;
      if (filters.country && race.country !== filters.country) return false;
      if (filters.status && race.status !== filters.status) return false;
      return true;
    });
  }

  /**
   * Filter stages by criteria
   */
  private filterStages(stages: CyclingStage[], filters: StageFilters): CyclingStage[] {
    return stages.filter((stage) => {
      if (filters.stageType && stage.stageType !== filters.stageType) return false;
      if (filters.status && stage.status !== filters.status) return false;
      if (filters.minExcitement && stage.predictedExcitement) {
        if (stage.predictedExcitement.score < filters.minExcitement) return false;
      }
      return true;
    });
  }

  /**
   * Create URL-safe slug from race name
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Clear all caches (useful for testing or forcing refresh)
   */
  clearCache(): void {
    this.raceCache.clear();
    this.stageCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { races: number; stages: number } {
    return {
      races: this.raceCache.size,
      stages: this.stageCache.size,
    };
  }
}

// Export singleton instance
export const scheduleService = new ScheduleService();
