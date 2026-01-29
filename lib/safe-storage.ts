// Safe localStorage/sessionStorage wrapper with error handling for private browsing and quota issues
// ENTERPRISE GRADE: All storage access must go through these functions to prevent app crashes

interface StorageError {
  type: 'quota' | 'private' | 'unavailable' | 'parse';
  message: string;
}

const memoryFallback = new Map<string, string>();
const sessionMemoryFallback = new Map<string, string>();

/**
 * Safe module-level storage migration helper
 * Use this for migrating old keys to new keys at module load time
 */
export const safeMigrateKey = (oldKey: string, newKey: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, oldValue);
      localStorage.removeItem(oldKey);
    }
  } catch {
    // Storage unavailable - migration not possible, but app continues
  }
};

// === SESSION STORAGE SAFE WRAPPERS ===

/**
 * Safely get a raw string from sessionStorage
 */
export const safeSessionGetItem = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key) ?? sessionMemoryFallback.get(key) ?? null;
  } catch {
    return sessionMemoryFallback.get(key) ?? null;
  }
};

/**
 * Safely set a raw string in sessionStorage
 */
export const safeSessionSetItem = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, value);
    sessionMemoryFallback.set(key, value);
  } catch {
    sessionMemoryFallback.set(key, value);
  }
};

/**
 * Safely remove an item from sessionStorage
 */
export const safeSessionRemoveItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
  sessionMemoryFallback.delete(key);
};

/**
 * Safely clear sessionStorage
 */
export const safeSessionClear = (): void => {
  try {
    sessionStorage.clear();
  } catch {
    // Ignore errors
  }
  sessionMemoryFallback.clear();
};

/**
 * Check if localStorage is available and working
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely get an item from localStorage with fallback
 */
export const safeGetItem = <T>(
  key: string, 
  defaultValue: T,
  validator?: (value: unknown) => value is T
): T => {
  try {
    const item = localStorage.getItem(key) ?? memoryFallback.get(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    const parsed = JSON.parse(item);
    
    // Validate if validator provided
    if (validator && !validator(parsed)) {
      return defaultValue;
    }
    
    return parsed as T;
  } catch (error) {
    if (process.env.DEV) {
      console.warn(`[SafeStorage] Failed to get "${key}":`, error);
    }
    return defaultValue;
  }
};

/**
 * Safely get a raw string from localStorage
 */
export const safeGetRawItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key) ?? memoryFallback.get(key) ?? null;
  } catch {
    return memoryFallback.get(key) ?? null;
  }
};

/**
 * Safely set an item in localStorage with fallback to memory
 */
export const safeSetItem = <T>(key: string, value: T): StorageError | null => {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    memoryFallback.set(key, stringValue);
    return null;
  } catch (error) {
    const err = error as Error;
    
    // Handle quota exceeded
    if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
      // Try to clear old items and retry
      try {
        clearOldItems();
        const stringValue = JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        memoryFallback.set(key, stringValue);
        return null;
      } catch {
        // Fall back to memory only
        memoryFallback.set(key, JSON.stringify(value));
        return { type: 'quota', message: 'Storage quota exceeded, using memory fallback' };
      }
    }
    
    // Handle private browsing
    if (err.name === 'SecurityError' || err.message?.includes('access')) {
      memoryFallback.set(key, JSON.stringify(value));
      return { type: 'private', message: 'Private browsing mode, using memory fallback' };
    }
    
    // Handle unavailable storage
    memoryFallback.set(key, JSON.stringify(value));
    return { type: 'unavailable', message: 'Storage unavailable, using memory fallback' };
  }
};

/**
 * Safely set a raw string in localStorage
 */
export const safeSetRawItem = (key: string, value: string): StorageError | null => {
  try {
    localStorage.setItem(key, value);
    memoryFallback.set(key, value);
    return null;
  } catch (error) {
    memoryFallback.set(key, value);
    const err = error as Error;
    return {
      type: err.name === 'QuotaExceededError' ? 'quota' : 'unavailable',
      message: err.message,
    };
  }
};

/**
 * Safely remove an item from localStorage
 */
export const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
  memoryFallback.delete(key);
};

/**
 * Clear old cached items to free up space
 */
const clearOldItems = (): void => {
  const keysToCheck = [
    'morning_brief_cache',
    'recovery_coach_recommendations',
    'saved_recommendations_local',
    'whoop_data_cache',
    'health_insights_cache',
  ];
  
  for (const key of keysToCheck) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        const timestamp = parsed.timestamp || parsed.createdAt;
        if (timestamp) {
          const age = Date.now() - new Date(timestamp).getTime();
          // Remove items older than 24 hours
          if (age > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch {
      // Remove corrupted items
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }
  }
};

/**
 * Get all keys from localStorage
 */
export const getStorageKeys = (): string[] => {
  try {
    return Object.keys(localStorage);
  } catch {
    return Array.from(memoryFallback.keys());
  }
};

/**
 * Clear all items from localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch {
    // Ignore
  }
  memoryFallback.clear();
};

// Named exports for convenience
export {
  safeGetItem as safeLocalStorageGet,
  safeSetItem as safeLocalStorageSet,
};

export default {
  isStorageAvailable,
  safeGetItem,
  safeGetRawItem,
  safeSetItem,
  safeSetRawItem,
  safeRemoveItem,
  getStorageKeys,
  clearStorage,
  // Session storage
  safeSessionGetItem,
  safeSessionSetItem,
  safeSessionRemoveItem,
  safeSessionClear,
  // Migration helper
  safeMigrateKey,
};
