/**
 * Simple In-Memory Cache
 *
 * Provides basic caching functionality with TTL support to help manage
 * API rate limits and reduce redundant network requests.
 */

import { logger } from './logger.js';

interface CacheEntry<T> {
  data: T;
  expires: number;
  createdAt: number;
}

/**
 * Simple cache implementation with TTL support
 */
export class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly name: string;

  constructor(name: string = 'default') {
    this.name = name;
  }

  /**
   * Get a cached value by key
   * Returns null if the key doesn't exist or has expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      logger.debug({ cache: this.name, key }, 'Cache entry expired');
      return null;
    }

    logger.debug({ cache: this.name, key }, 'Cache hit');
    return entry.data;
  }

  /**
   * Set a value in the cache with a TTL
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlMs - Time to live in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const entry: CacheEntry<T> = {
      data,
      expires: Date.now() + ttlMs,
      createdAt: Date.now(),
    };

    this.cache.set(key, entry as CacheEntry<unknown>);
    logger.debug({ cache: this.name, key, ttlMs }, 'Cache entry set');
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug({ cache: this.name, key }, 'Cache entry invalidated');
    }
  }

  /**
   * Clear all entries in this cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    logger.debug({ cache: this.name, entriesCleared: size }, 'Cache cleared');
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; name: string } {
    return {
      name: this.name,
      size: this.cache.size,
    };
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get remaining TTL for a key in milliseconds
   * Returns -1 if key doesn't exist or is expired
   */
  ttl(key: string): number {
    const entry = this.cache.get(key);
    if (!entry) return -1;
    const remaining = entry.expires - Date.now();
    return remaining > 0 ? remaining : -1;
  }
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  /** 5 minutes - for frequently changing data like rankings */
  SHORT: 5 * 60 * 1000,
  /** 15 minutes - for moderately changing data */
  MEDIUM: 15 * 60 * 1000,
  /** 1 hour - for slowly changing data like race calendars */
  LONG: 60 * 60 * 1000,
  /** 24 hours - for static data */
  DAY: 24 * 60 * 60 * 1000,
} as const;

// Pre-configured cache instances for different sports
export const tennisCache = new SimpleCache('tennis');
export const f1Cache = new SimpleCache('f1');
export const apiCache = new SimpleCache('api');
