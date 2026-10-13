import { useCallback, useRef, useState } from "react";
import { searchOrder, ApiError } from "../services/api";
import { recordEvent } from "../utils/auditLog";

// Small in-memory cache so re-running an identical search (e.g. flipping
// back to a previous tab) doesn't re-hit the API layer. Bounded to avoid
// unbounded growth over a long-lived session.
const CACHE_LIMIT = 20;
const cache = new Map();

function cacheKey(params) {
  return JSON.stringify(params, Object.keys(params).sort());
}

export function useOrderSearch() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | empty
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const search = useCallback(async (params) => {
    // Cancel any in-flight request before starting a new one.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const key = cacheKey(params);
    if (cache.has(key)) {
      setData(cache.get(key));
      setStatus("success");
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const result = await searchOrder(params, controller.signal);
      recordEvent("search", { params });

      if (!result) {
        setData(null);
        setStatus("empty");
        return;
      }

      cache.set(key, result);
      if (cache.size > CACHE_LIMIT) {
        cache.delete(cache.keys().next().value);
      }

      setData(result);
      setStatus("success");
    } catch (err) {
      if (err.name === "AbortError") return; // superseded by a newer search
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { data, status, error, search, reset };
}
