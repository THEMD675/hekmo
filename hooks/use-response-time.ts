"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook to track AI response time
 * Shows "answered in X.Xs" after response completes
 */
export function useResponseTime(status: string) {
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "streaming" && startTimeRef.current === null) {
      // Start timing when streaming begins
      startTimeRef.current = Date.now();
      setResponseTime(null);
    } else if (status === "ready" && startTimeRef.current !== null) {
      // Calculate time when streaming ends
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setResponseTime(elapsed);
      startTimeRef.current = null;
    }
  }, [status]);

  return responseTime;
}
