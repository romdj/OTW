/**
 * Central registry for managing multiple sports and their services
 */

import type { SportsService, SportResolver, SportConfig } from '../interfaces/SportsService.js';
import { logger } from '../../../utils/logger.js';

export class SportRegistry {
  private static instance: SportRegistry;
  private services: Map<string, SportsService> = new Map();
  private resolvers: Map<string, SportResolver> = new Map();
  private configs: Map<string, SportConfig> = new Map();

  private constructor() {}

  public static getInstance(): SportRegistry {
    if (!SportRegistry.instance) {
      SportRegistry.instance = new SportRegistry();
    }
    return SportRegistry.instance;
  }

  /**
   * Register a sport with its service, resolvers, and configuration
   */
  registerSport(
    sportKey: string, 
    service: SportsService, 
    resolvers: SportResolver, 
    config: SportConfig
  ): void {
    logger.info({ sportKey, sport: config.sport, league: config.name }, 'Registering sport');
    
    this.services.set(sportKey, service);
    this.resolvers.set(sportKey, resolvers);
    this.configs.set(sportKey, config);
  }

  /**
   * Get service for a specific sport
   */
  getService(sportKey: string): SportsService | null {
    return this.services.get(sportKey) || null;
  }

  /**
   * Get resolvers for a specific sport
   */
  getResolvers(sportKey: string): SportResolver | null {
    return this.resolvers.get(sportKey) || null;
  }

  /**
   * Get configuration for a specific sport
   */
  getConfig(sportKey: string): SportConfig | null {
    return this.configs.get(sportKey) || null;
  }

  /**
   * Get all registered sports
   */
  getRegisteredSports(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get all registered sport configurations
   */
  getAllConfigs(): SportConfig[] {
    return Array.from(this.configs.values());
  }

  /**
   * Merge all sport resolvers into a single resolver object
   */
  getMergedResolvers(): Record<string, any> {
    const mergedResolvers: Record<string, any> = {
      Query: {},
    };

    for (const [sportKey, resolver] of this.resolvers) {
      logger.debug({ sportKey }, 'Merging resolvers for sport');
      
      // Merge Query resolvers
      if (resolver.Query) {
        Object.assign(mergedResolvers.Query, resolver.Query);
      }

      // Merge type-specific resolvers (Team, Event, etc.)
      for (const [typeName, typeResolvers] of Object.entries(resolver)) {
        if (typeName !== 'Query') {
          if (!mergedResolvers[typeName]) {
            mergedResolvers[typeName] = {};
          }
          Object.assign(mergedResolvers[typeName], typeResolvers);
        }
      }
    }

    logger.info({ 
      sportsCount: this.resolvers.size,
      queryResolvers: Object.keys(mergedResolvers.Query).length 
    }, 'Merged resolvers from all sports');

    return mergedResolvers;
  }

  /**
   * Get standings from all registered sports
   */
  async getAllStandings(date?: string): Promise<Array<{ sport: string; league: string; standings: any[] }>> {
    const results = [];

    for (const [sportKey, service] of this.services) {
      const config = this.configs.get(sportKey);
      if (!config) continue;

      try {
        logger.info({ sportKey, sport: config.sport }, 'Fetching standings for sport');
        const standings = await service.getStandings({ date });
        
        results.push({
          sport: config.sport,
          league: config.name,
          standings
        });
      } catch (error) {
        logger.error({ 
          sportKey, 
          error: error instanceof Error ? error.message : String(error) 
        }, 'Failed to fetch standings for sport');
      }
    }

    return results;
  }

  /**
   * Health check for all registered sports services
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    for (const [sportKey, service] of this.services) {
      try {
        // Try to fetch a small sample of data
        await service.getStandings({ date: new Date().toISOString().split('T')[0] });
        health[sportKey] = true;
      } catch (error) {
        logger.warn({ 
          sportKey, 
          error: error instanceof Error ? error.message : String(error) 
        }, 'Sport service health check failed');
        health[sportKey] = false;
      }
    }

    return health;
  }
}

export const sportRegistry = SportRegistry.getInstance();