// ─── Audit & Logging (Functional Module) ───────────────────────────────────
// The dev plan calls for an "Audit & Logging" module that tracks tool usage.
// This in-memory implementation keeps the UI functional today. When a real
// backend exists, replace the body of `recordEvent` with a fetch() call to
// e.g. POST /api/audit — no call sites elsewhere need to change.

const MAX_EVENTS = 50;
let events = [];
const listeners = new Set();

export function recordEvent(type, payload = {}) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type, // e.g. "search", "export", "view-details"
    payload,
    timestamp: new Date().toISOString(),
  };
  events = [entry, ...events].slice(0, MAX_EVENTS);
  listeners.forEach((fn) => fn(events));
  return entry;
}

export function getEvents() {
  return events;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
