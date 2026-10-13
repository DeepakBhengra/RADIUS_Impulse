// ─── Mock API (fallback / offline UI dev) ──────────────────────────────────
// This was the original stand-in for the real backend, kept so the UI can
// still be built/demoed without network access to the .NET service — set
// VITE_USE_MOCK_API=true in .env.local to use this path (see api.js).

import { buildConsolidatedResponse } from "../data/mockData";

const SIMULATED_LATENCY_MS = 500;

/**
 * @param {Object} params
 * @param {string} [params.orderNumber]
 * @param {string} [params.sku]
 * @param {string} [params.accountNumber]
 * @param {string} [params.partnerId]
 * @param {string} [params.poNumber]
 * @param {string} [params.transactionId]
 * @param {AbortSignal} [signal] - reserved for real fetch() cancellation
 * @returns {Promise<import("../data/mockData").buildConsolidatedResponse>}
 */
export async function searchOrder(params, signal) {
  const hasAnyValue = Object.values(params || {}).some((v) => v && v.trim());
  if (!hasAnyValue) {
    throw new ApiError("Enter at least one search value.", "VALIDATION");
  }

  await delay(SIMULATED_LATENCY_MS, signal);

  // Simulated "not found" path so the UI's empty state is exercised too.
  const notFoundTrigger = Object.values(params).some(
    (v) => v && v.toUpperCase().includes("NOTFOUND")
  );
  if (notFoundTrigger) {
    return null;
  }

  return buildConsolidatedResponse();
}

export class ApiError extends Error {
  constructor(message, code = "UNKNOWN") {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}
