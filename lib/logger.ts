/**
 * Production-safe logger utility
 * Only logs in development or when explicitly enabled
 */

interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
}

const isDev = process.env.NODE_ENV === 'development';

// Check if logging is enabled via localStorage (for debugging in production)
const isLoggingEnabled = (): boolean => {
  try {
    return isDev || localStorage.getItem('DEBUG_LOGS') === 'true';
  } catch {
    return isDev;
  }
};

/**
 * Create a namespaced logger
 * In production: Only log if explicitly enabled (to pass Lighthouse)
 * In development: Log everything
 */
export const createLogger = (namespace: string, options: LoggerOptions = {}) => {
  const prefix = options.prefix || `[${namespace}]`;
  
  const shouldLog = (): boolean => {
    // In production, only log if explicitly enabled (DEBUG_LOGS=true)
    // This prevents console errors from failing Lighthouse
    if (!isDev && !options.enabled) {
      try {
        return localStorage.getItem('DEBUG_LOGS') === 'true';
      } catch {
        return false;
      }
    }
    return options.enabled ?? isLoggingEnabled();
  };

  return {
    debug: (...args: unknown[]) => {
      if (shouldLog()) {
        console.debug(prefix, ...args);
      }
    },
    info: (...args: unknown[]) => {
      if (shouldLog()) {
        console.info(prefix, ...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (shouldLog()) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args: unknown[]) => {
      if (shouldLog()) {
        console.error(prefix, ...args);
      }
    },
  };
};

// Pre-configured loggers for common use cases
export const cacheLogger = createLogger('Cache');
export const authLogger = createLogger('Auth');
export const apiLogger = createLogger('API');
export const realtimeLogger = createLogger('Realtime');
export const swLogger = createLogger('SW');
export const analyticsLogger = createLogger('Analytics');

// Default logger
const logger = createLogger('App');

export default logger;
