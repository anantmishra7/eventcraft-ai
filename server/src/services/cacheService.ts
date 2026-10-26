import { LRUCache } from 'lru-cache';
import crypto from 'crypto';
import { config } from '../config/env';
import { logger } from '../utils/logger';

class CacheService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: LRUCache<string, any>;

  constructor() {
    this.cache = new LRUCache({
      max: config.cache.maxItems,
      ttl: config.cache.ttlMs,
      updateAgeOnGet: true,
    });
    logger.info('LRU Cache initialized', {
      maxItems: config.cache.maxItems,
      ttlMs: config.cache.ttlMs,
    });
  }

  /**
   * Generates a deterministic hash key from arbitrary data
   */
  public generateKey(prefix: string, data: unknown): string {
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(serialized).digest('hex').slice(0, 16);
    return `${prefix}:${hash}`;
  }

  /**
   * Retrieves an item from the cache
   */
  public get<T>(key: string): T | undefined {
    const item = this.cache.get(key) as T | undefined;
    if (item !== undefined) {
      logger.debug(`Cache HIT for key: ${key}`);
    } else {
      logger.debug(`Cache MISS for key: ${key}`);
    }
    return item;
  }

  /**
   * Stores an item in the cache
   */
  public set(key: string, value: unknown, customTtlMs?: number): void {
    this.cache.set(key, value as object, { ttl: customTtlMs });
    logger.debug(`Cached item stored for key: ${key}`);
  }

  /**
   * Clears all items in the cache
   */
  public clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
