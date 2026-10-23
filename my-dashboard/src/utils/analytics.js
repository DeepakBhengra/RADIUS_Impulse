// ─── Analytics tracking (anonymous, best-effort) ───────────────────────────
// Failures here must never affect the actual app — every call is fire-and-
// forget with its own try/catch.

const API_BASE = import.meta.env.VITE_ORDER_API_BASE_URL?.replace(/\/api\/order$/, "") || "";
const SESSION_KEY = "radius_analytics_session_id";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function postEvent(payload) {
  try {
    await fetch(`${API_BASE}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silently ignore — analytics must never block or break the UI.
  }
}

export function trackTabView(tab) {
  postEvent({ sessionId: getSessionId(), eventType: "tab_view", tab, outcome: null });
}

export function trackOrderSearch(outcome) {
  postEvent({ sessionId: getSessionId(), eventType: "order_search", tab: null, outcome });
}