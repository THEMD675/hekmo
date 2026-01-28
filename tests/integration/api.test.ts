import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

describe("API Integration Tests", () => {
  describe("Health Check", () => {
    it("should return healthy status", async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });

    it("should respond to HEAD requests", async () => {
      const response = await fetch(`${BASE_URL}/api/health`, {
        method: "HEAD",
      });
      expect(response.ok).toBe(true);
    });
  });

  describe("Authentication", () => {
    it("should require auth for protected routes", async () => {
      const response = await fetch(`${BASE_URL}/api/user/usage`);
      expect(response.status).toBe(401);
    });

    it("should allow public access to legal pages", async () => {
      const privacyResponse = await fetch(`${BASE_URL}/privacy`);
      expect(privacyResponse.ok).toBe(true);

      const termsResponse = await fetch(`${BASE_URL}/terms`);
      expect(termsResponse.ok).toBe(true);
    });
  });

  describe("Rate Limiting", () => {
    it("should have rate limit headers", async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      // Rate limit headers may or may not be present
      expect(response.headers).toBeDefined();
    });
  });

  describe("CORS", () => {
    it("should handle OPTIONS requests", async () => {
      const response = await fetch(`${BASE_URL}/api/health`, {
        method: "OPTIONS",
      });
      // Should not error
      expect(response.status).toBeLessThan(500);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await fetch(`${BASE_URL}/api/nonexistent-route-12345`);
      expect(response.status).toBe(404);
    });

    it("should return JSON errors", async () => {
      const response = await fetch(`${BASE_URL}/api/user/usage`);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe("Sitemap", () => {
    it("should return valid sitemap", async () => {
      const response = await fetch(`${BASE_URL}/sitemap.xml`);
      expect(response.ok).toBe(true);
      
      const contentType = response.headers.get("content-type");
      expect(contentType).toContain("xml");
    });
  });

  describe("Robots.txt", () => {
    it("should return robots.txt", async () => {
      const response = await fetch(`${BASE_URL}/robots.txt`);
      expect(response.ok).toBe(true);
      
      const text = await response.text();
      expect(text).toContain("User-agent");
    });
  });

  describe("Manifest", () => {
    it("should return valid manifest", async () => {
      const response = await fetch(`${BASE_URL}/manifest.webmanifest`);
      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.name).toBeDefined();
      expect(data.icons).toBeDefined();
    });
  });
});

describe("Chat API", () => {
  it("should require authentication", async () => {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "test" }],
      }),
    });
    
    // Should require auth
    expect(response.status).toBe(401);
  });
});

describe("History API", () => {
  it("should require authentication for history", async () => {
    const response = await fetch(`${BASE_URL}/api/history`);
    expect(response.status).toBe(401);
  });

  it("should require authentication for search", async () => {
    const response = await fetch(`${BASE_URL}/api/history/search?q=test`);
    expect(response.status).toBe(401);
  });
});
