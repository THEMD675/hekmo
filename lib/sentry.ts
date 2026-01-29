// Sentry configuration for Hekmo
// Add SENTRY_DSN to .env to enable error tracking

const SENTRY_DSN = process.env.SENTRY_DSN;

interface SentryErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export function captureException(error: Error, context?: SentryErrorContext) {
  // Log to console in development
  console.error("[Sentry Error]:", error.message, {
    stack: error.stack,
    ...context,
  });

  // If Sentry DSN is configured, send to Sentry
  if (SENTRY_DSN) {
    // In a real implementation, you'd use @sentry/nextjs
    // This is a placeholder for the integration
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.captureException(error, { user: context?.user, tags: context?.tags, extra: context?.extra });
  }
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info"
) {
  console.log(`[Sentry ${level}]:`, message);

  if (SENTRY_DSN) {
    // Sentry.captureMessage(message, level);
  }
}

export function setUser(user: { id: string; email?: string } | null) {
  if (SENTRY_DSN) {
    // Sentry.setUser(user);
  }
}

// Performance monitoring
export function startTransaction(name: string, op: string) {
  const startTime = performance.now();

  return {
    finish: () => {
      const duration = performance.now() - startTime;
      console.log(`[Perf] ${op}:${name} - ${duration.toFixed(2)}ms`);
    },
    setData: (key: string, value: unknown) => {
      console.log(`[Perf] ${name} data:`, { [key]: value });
    },
  };
}
