import NodeCache from "node-cache";

// StdTTL in seconds (default: 60s)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

class CacheService {
  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    if (ttlSeconds) {
      return cache.set(key, value, ttlSeconds);
    }
    return cache.set(key, value);
  }

  del(key: string): number {
    return cache.del(key);
  }
  
  flush(): void {
    cache.flushAll();
  }

  getStats(): NodeCache.Stats {
    return cache.getStats();
  }

  // Request deduplication map
  private pendingRequests = new Map<string, Promise<any>>();

  async fetchWithCache<T>(key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) return cached;

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    const requestPromise = fetcher().then((result) => {
      this.set(key, result, ttlSeconds);
      this.pendingRequests.delete(key);
      return result;
    }).catch((err) => {
      this.pendingRequests.delete(key);
      throw err;
    });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }
}

export const cacheService = new CacheService();
