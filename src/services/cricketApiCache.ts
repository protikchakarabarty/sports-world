interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}

const PREFIX = 'cricket_api_cache';
const DEFAULT_TTL = 5 * 60 * 1000;

export function getCachedResponse<T>(key: string, ttlMs: number = DEFAULT_TTL): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.cachedAt < entry.ttl) {
      return entry.data;
    }
    localStorage.removeItem(`${PREFIX}_${key}`);
  } catch {
    /**/
  }
  return null;
}

export function setCachedResponse<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL): void {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now(), ttl: ttlMs };
    localStorage.setItem(`${PREFIX}_${key}`, JSON.stringify(entry));
  } catch {
    /**/
  }
}

export function getStaleResponse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}

const inFlightMap = new Map<string, Promise<unknown>>();

export function getInFlight<T>(key: string): Promise<T> | null {
  return (inFlightMap.get(key) as Promise<T>) || null;
}

export function setInFlight<T>(key: string, promise: Promise<T>): void {
  inFlightMap.set(key, promise);
}

export function clearInFlight(key: string): void {
  inFlightMap.delete(key);
}
