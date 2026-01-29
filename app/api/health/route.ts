// Health check endpoint for uptime monitoring
// Used by external monitoring services (UptimeRobot, Pingdom, etc.)

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Use Node.js for process.memoryUsage()

export async function GET() {
  try {
    const start = Date.now();
    
    const hasDb = !!process.env.POSTGRES_URL;
    const hasAi = !!process.env.OPENAI_API_KEY;
    const status = hasDb && hasAi ? "healthy" : "degraded";

    return Response.json({
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: hasDb ? "ok" : "missing",
        ai: hasAi ? "ok" : "missing",
      },
      latency: Date.now() - start,
    }, {
      status: status === "healthy" ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json({ 
      status: "error", 
      error: String(error) 
    }, { status: 500 });
  }
}

// HEAD request for simple uptime pings
export async function HEAD() {
  return new Response(null, { status: 200 });
}
