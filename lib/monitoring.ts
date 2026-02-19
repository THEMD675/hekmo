// Monitoring and Performance Metrics for Hekmo
// Tracks uptime, response times, and system health

export interface HealthCheck {
  service: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number;
  lastChecked: Date;
  details?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

// Web Vitals tracking
export function trackWebVitals(metric: {
  name: string;
  value: number;
  id: string;
}): void {
  const vitals = ["CLS", "FID", "FCP", "LCP", "TTFB", "INP"];

  if (vitals.includes(metric.name)) {
    // Send to analytics
    if (
      typeof window !== "undefined" &&
      (
        window as unknown as {
          posthog?: {
            capture: (name: string, data: Record<string, unknown>) => void;
          };
        }
      ).posthog
    ) {
      (
        window as unknown as {
          posthog: {
            capture: (name: string, data: Record<string, unknown>) => void;
          };
        }
      ).posthog.capture("web_vitals", {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vital] ${metric.name}: ${metric.value}`);
    }
  }
}

// Server-side health checks
export async function checkServiceHealth(
  serviceName: string,
  checkFn: () => Promise<void>
): Promise<HealthCheck> {
  const start = Date.now();
  let status: HealthCheck["status"] = "healthy";
  let details: string | undefined;

  try {
    await checkFn();
  } catch (error) {
    status = "down";
    details = error instanceof Error ? error.message : "Unknown error";
  }

  const responseTime = Date.now() - start;

  // Mark as degraded if slow
  if (status === "healthy" && responseTime > 3000) {
    status = "degraded";
    details = `Slow response: ${responseTime}ms`;
  }

  return {
    service: serviceName,
    status,
    responseTime,
    lastChecked: new Date(),
    details,
  };
}

// Database health check
export async function checkDatabaseHealth(): Promise<HealthCheck> {
  return checkServiceHealth("database", async () => {
    // Simple query to check database connectivity
    const response = await fetch("/api/health/db");
    if (!response.ok) {
      throw new Error(`Database check failed: ${response.status}`);
    }
  });
}

// AI service health check
export async function checkAIHealth(): Promise<HealthCheck> {
  return checkServiceHealth("ai", async () => {
    const response = await fetch("/api/health/ai");
    if (!response.ok) {
      throw new Error(`AI service check failed: ${response.status}`);
    }
  });
}

// Aggregate health status
export async function getSystemHealth(): Promise<{
  overall: HealthCheck["status"];
  services: HealthCheck[];
}> {
  const services = await Promise.all([checkDatabaseHealth(), checkAIHealth()]);

  // Determine overall status
  let overall: HealthCheck["status"] = "healthy";

  if (services.some((s) => s.status === "down")) {
    overall = "down";
  } else if (services.some((s) => s.status === "degraded")) {
    overall = "degraded";
  }

  return { overall, services };
}

// Performance timing utilities
export function measureTiming<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();

  return fn().finally(() => {
    const duration = performance.now() - start;

    // Log to console
    if (process.env.NODE_ENV === "development") {
      console.log(`[Timing] ${name}: ${duration.toFixed(2)}ms`);
    }

    // Send to monitoring
    recordMetric({
      name: `timing.${name}`,
      value: duration,
      unit: "ms",
      timestamp: new Date(),
    });
  });
}

// Metric recording
const metricsBuffer: PerformanceMetric[] = [];

export function recordMetric(metric: PerformanceMetric): void {
  metricsBuffer.push(metric);

  // Flush buffer periodically
  if (metricsBuffer.length >= 50) {
    flushMetrics();
  }
}

async function flushMetrics(): Promise<void> {
  if (metricsBuffer.length === 0) {
    return;
  }

  const metrics = [...metricsBuffer];
  metricsBuffer.length = 0;

  try {
    await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metrics }),
    });
  } catch (error) {
    console.error("Failed to flush metrics:", error);
    // Add back to buffer for retry
    metricsBuffer.push(...metrics);
  }
}

// Report errors to monitoring
export function reportError(
  error: Error,
  context?: Record<string, unknown>
): void {
  console.error("[Error]", error, context);

  // Send to Sentry or other error tracking
  if (
    typeof window !== "undefined" &&
    (
      window as unknown as {
        Sentry?: {
          captureException: (
            error: Error,
            options: Record<string, unknown>
          ) => void;
        };
      }
    ).Sentry
  ) {
    (
      window as unknown as {
        Sentry: {
          captureException: (
            error: Error,
            options: Record<string, unknown>
          ) => void;
        };
      }
    ).Sentry.captureException(error, { extra: context });
  }
}

// Request timing middleware for API routes
export function withTiming<T>(
  handler: (req: Request) => Promise<T>
): (req: Request) => Promise<T> {
  return async (req: Request) => {
    const start = Date.now();
    const url = new URL(req.url);

    try {
      const result = await handler(req);

      recordMetric({
        name: `api.${url.pathname.replace(/\//g, ".")}`,
        value: Date.now() - start,
        unit: "ms",
        timestamp: new Date(),
      });

      return result;
    } catch (error) {
      recordMetric({
        name: `api.error.${url.pathname.replace(/\//g, ".")}`,
        value: 1,
        unit: "count",
        timestamp: new Date(),
      });
      throw error;
    }
  };
}
