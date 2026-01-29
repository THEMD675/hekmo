// Health check endpoint for uptime monitoring
// Used by external monitoring services (UptimeRobot, Pingdom, etc.)

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  const checks = {
    status: "healthy" as "healthy" | "degraded" | "down",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
    checks: {} as Record<string, { status: string; latency: number }>,
  };

  // Database check - config only (avoid DB import overhead in health check)
  try {
    const dbStart = Date.now();
    const hasDb = !!process.env.POSTGRES_URL;
    checks.checks.database = {
      status: hasDb ? "configured" : "missing_config",
      latency: Date.now() - dbStart,
    };
    if (!hasDb) checks.status = "degraded";
  } catch {
    checks.checks.database = { status: "error", latency: 0 };
    checks.status = "degraded";
  }

  // AI service check
  try {
    const aiStart = Date.now();
    const aiOk = !!process.env.OPENAI_API_KEY;
    checks.checks.ai = {
      status: aiOk ? "ok" : "missing_config",
      latency: Date.now() - aiStart,
    };
    if (!aiOk) checks.status = "degraded";
  } catch {
    checks.checks.ai = { status: "error", latency: 0 };
    checks.status = "degraded";
  }

  // Memory check
  const memUsage = process.memoryUsage();
  checks.checks.memory = {
    status: memUsage.heapUsed < 500 * 1024 * 1024 ? "ok" : "high",
    latency: 0,
  };

  const totalLatency = Date.now() - start;

  return Response.json(checks, {
    status: checks.status === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Response-Time": `${totalLatency}ms`,
    },
  });
}

// HEAD request for simple uptime pings
export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      "X-Uptime": String(process.uptime()),
    },
  });
}
