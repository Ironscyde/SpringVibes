interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache {
  private static storage = new Map<string, CacheItem<any>>();
  private static DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now() + ttl
    });
  }

  static get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.storage.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clear(): void {
    this.storage.clear();
  }
} 