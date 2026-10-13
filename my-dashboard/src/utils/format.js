// ─── Formatting Utilities ──────────────────────────────────────────────────
// Centralizing formatting logic here means presentation rules (currency,
// dates, status colors) only need to change in one place as the tool grows.

export function formatCurrency(amount, currency = "USD") {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return value; // already-formatted string
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// Maps a wide variety of backend status strings to one of the Badge
// component's known color tokens, so new statuses added by DB2/ODS/MQ/
// Datadog integrations degrade gracefully instead of breaking styling.
const STATUS_COLOR_MAP = {
  completed: "green",
  success: "green",
  active: "green",
  ok: "green",
  processed: "green",
  pending: "blue",
  processing: "blue",
  queued: "blue",
  info: "blue",
  failed: "red",
  error: "red",
  missing: "red",
  timeout: "red",
  critical: "red",
  found: "green",
  rejected: "red",
  "on hold": "amber",
  backordered: "amber",
  high: "red",
  warning: "amber",
  delay: "amber",
  medium: "amber",
  "queue delay": "amber",
};

export function statusToColor(status) {
  if (!status) return "gray";
  return STATUS_COLOR_MAP[String(status).toLowerCase()] || "gray";
}
