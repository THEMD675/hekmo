/**
 * Circuit Breaker Pattern for API Resilience
 * Prevents cascading failures by tracking error rates and temporarily blocking requests
 */

import { createLogger } from './logger';

const log = createLogger('CircuitBreaker');

export type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerConfig {
  failureThreshold: number;     // Number of failures before opening
  resetTimeout: number;         // Time in ms before attempting to close
  halfOpenRequests: number;     // Number of test requests in half-open state
}

interface CircuitBreakerState {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: number;
  nextAttempt: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  halfOpenRequests: 3,
};

// In-memory circuit breaker states per service
const circuits = new Map<string, CircuitBreakerState>();

export function getCircuitState(service: string): CircuitBreakerState {
  if (!circuits.has(service)) {
    circuits.set(service, {
      state: 'closed',
      failures: 0,
      successes: 0,
      lastFailure: 0,
      nextAttempt: 0,
    });
  }
  return circuits.get(service)!;
}

export function isCircuitOpen(service: string): boolean {
  const circuit = getCircuitState(service);
  const now = Date.now();

  // Check if we should transition from open to half-open
  if (circuit.state === 'open' && now >= circuit.nextAttempt) {
    circuit.state = 'half-open';
    circuit.successes = 0;
    log.info(`${service}: open -> half-open`);
  }

  return circuit.state === 'open';
}

export function recordSuccess(service: string, config: CircuitBreakerConfig = DEFAULT_CONFIG): void {
  const circuit = getCircuitState(service);

  if (circuit.state === 'half-open') {
    circuit.successes++;
    if (circuit.successes >= config.halfOpenRequests) {
      circuit.state = 'closed';
      circuit.failures = 0;
      circuit.successes = 0;
      log.info(`${service}: half-open -> closed (recovered)`);
    }
  } else if (circuit.state === 'closed') {
    // Reset failure count on success in closed state
    circuit.failures = Math.max(0, circuit.failures - 1);
  }
}

export function recordFailure(service: string, config: CircuitBreakerConfig = DEFAULT_CONFIG): void {
  const circuit = getCircuitState(service);
  const now = Date.now();

  circuit.failures++;
  circuit.lastFailure = now;

  if (circuit.state === 'half-open') {
    // Immediately open on failure in half-open state
    circuit.state = 'open';
    circuit.nextAttempt = now + config.resetTimeout;
    log.warn(`${service}: half-open -> open (failure during recovery)`);
  } else if (circuit.state === 'closed' && circuit.failures >= config.failureThreshold) {
    circuit.state = 'open';
    circuit.nextAttempt = now + config.resetTimeout;
    log.warn(`${service}: closed -> open (threshold reached: ${circuit.failures})`);
  }
}

export function resetCircuit(service: string): void {
  circuits.set(service, {
    state: 'closed',
    failures: 0,
    successes: 0,
    lastFailure: 0,
    nextAttempt: 0,
  });
  log.info(`${service}: reset to closed`);
}

/**
 * Higher-order function to wrap async operations with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  service: string,
  operation: () => Promise<T>,
  fallback?: () => T | Promise<T>,
  config: CircuitBreakerConfig = DEFAULT_CONFIG
): Promise<T> {
  // Check if circuit is open
  if (isCircuitOpen(service)) {
    log.warn(`${service}: circuit open, using fallback`);
    if (fallback) {
      return fallback();
    }
    throw new Error(`Service ${service} is temporarily unavailable`);
  }

  try {
    const result = await operation();
    recordSuccess(service, config);
    return result;
  } catch (error) {
    recordFailure(service, config);
    
    // Check if circuit just opened and we have a fallback
    if (isCircuitOpen(service) && fallback) {
      log.warn(`${service}: operation failed, using fallback`);
      return fallback();
    }
    
    throw error;
  }
}

/**
 * Get all circuit breaker statuses for monitoring
 */
export function getAllCircuitStatuses(): Record<string, CircuitBreakerState> {
  const statuses: Record<string, CircuitBreakerState> = {};
  circuits.forEach((state, service) => {
    statuses[service] = { ...state };
  });
  return statuses;
}

/**
 * Pre-defined circuit breakers for common services
 */
export const CircuitBreakers = {
  OPENAI: 'openai',
  AI_COACH: 'ai-coach',
  WHOOP_API: 'whoop-api',
  STRIPE: 'stripe',
  VOICE_BRIEF: 'voice-brief',
  SMART_INTERVENTIONS: 'smart-interventions',
  PERPLEXITY: 'perplexity',
  ELEVENLABS: 'elevenlabs',
  FIRECRAWL: 'firecrawl',
} as const;
