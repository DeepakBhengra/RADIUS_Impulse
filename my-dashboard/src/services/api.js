// ─── API / Middleware Layer (real backend) ─────────────────────────────────
// Calls your .NET GetOrder endpoint via services/orderApi.js and maps its
// response into the shape every component expects (services/mapOrderResponse.js).
// Set VITE_USE_MOCK_API=true in .env.local to fall back to mock data when
// the backend isn't reachable (e.g. off the corporate network/VPN).

import { getOrderDetails } from "./orderApi";
import { mapOrderResponse } from "./mapOrderResponse";
import { searchOrder as mockSearchOrder } from "./mockApi";

export class ApiError extends Error {
  constructor(message, code = "UNKNOWN") {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

/**
 * @param {Object} params
 * @param {string} [params.poNumber]
 * @param {string} [params.countryCode]
 * @param {string} [params.environment]
 * @param {AbortSignal} [signal]
 */
export async function searchOrder(params, signal) {
  if (USE_MOCK) return mockSearchOrder(params, signal);

  const {
    poNumber,
    countryCode,
    environment,
    orderNumber,
    partnerId,
    accountNumber,
    sku,
    transactionId,
  } = params || {};

  if (!poNumber || !countryCode || !environment) {
    // The live backend only supports lookup by PO Number + Country Code
    // today (see services/orderApi.js). Other search fields in the UI stay
    // disabled until the backend exposes them — see data/navigation.js.
    throw new ApiError(
      "PO Number and Country Code and Env are required.",
      "VALIDATION",
    );
  }

  try {
    const raw = await getOrderDetails(
      {
        poNumber,
        countryCode,
        environment,
        orderNumber,
        partnerId,
        accountNumber,
        sku,
        transactionId,
      },
      signal,
    );
    if (!raw) return null;
    return mapOrderResponse(raw);
  } catch (error) {
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      const abortErr = new Error("Aborted");
      abortErr.name = "AbortError";
      throw abortErr;
    }
    if (error.response?.status === 404) return null; // no matching order
    throw new ApiError(
      error.response?.data?.message || "Could not reach the order service.",
      "NETWORK",
    );
  }
}
