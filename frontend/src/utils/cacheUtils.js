/**
 * SWR (Stale-While-Revalidate) Cache Utilities
 * Uses localStorage to cache API responses for resilient frontend rendering.
 */

const DEFAULT_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Get cached data from localStorage.
 * @param {string} key - Cache key
 * @returns {{ data: any, timestamp: number } | null}
 */
export const getCachedData = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Store data in localStorage with a timestamp.
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    // localStorage full or unavailable — silently ignore
    console.warn("SWR cache write failed:", e.message);
  }
};

/**
 * Check if a cache entry is stale.
 * @param {number} timestamp - When the data was cached
 * @param {number} [maxAgeMs] - Max age in ms (default: 10 min)
 * @returns {boolean}
 */
export const isCacheStale = (timestamp, maxAgeMs = DEFAULT_MAX_AGE_MS) => {
  return Date.now() - timestamp > maxAgeMs;
};

/**
 * Remove a single cache entry.
 * @param {string} key
 */
export const clearCacheEntry = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};
