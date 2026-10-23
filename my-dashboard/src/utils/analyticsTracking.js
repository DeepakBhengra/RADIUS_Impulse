const API_BASE = (import.meta.env.VITE_ORDER_API_BASE_URL || "")
  .replace(/\/api\/order\/?$/, "")
  .replace(/\/$/, "");

const ANALYTICS_API = `${API_BASE}/api/analytics/events`;

const SESSION_STORAGE_KEY = "radius-analytics-session-id";

function createSessionId() {
  return `radius-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnalyticsSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!sessionId) {
      sessionId = createSessionId();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }

    return sessionId;
  } catch {
    // Fallback when sessionStorage is unavailable.
    return createSessionId();
  }
}

async function sendAnalyticsEvent(event) {
  try {
    const response = await fetch(ANALYTICS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: getAnalyticsSessionId(),
        ...event,
      }),
    });

    if (!response.ok) {
      console.warn(
        `Analytics event was not recorded. HTTP status: ${response.status}`
      );
    }
  } catch (error) {
    // Analytics failures should not interrupt the main application.
    console.warn("Unable to send analytics event:", error);
  }
}

/**
 * Track when a user views an analytics tab.
 * Example: trackTabView("Overview")
 */
export function trackTabView(tab) {
  if (!tab || typeof tab !== "string") {
    return;
  }

  void sendAnalyticsEvent({
    eventType: "tab_view",
    tab: tab.trim(),
  });
}

/**
 * Track the outcome of an order search.
 * Valid outcomes: "success" or "failure"
 * Example: trackOrderSearch("success")
 */
export function trackOrderSearch(outcome) {
  if (outcome !== "success" && outcome !== "failure") {
    console.warn(
      'Invalid order search outcome. Use "success" or "failure".'
    );
    return;
  }

  void sendAnalyticsEvent({
    eventType: "order_search",
    outcome,
  });
}