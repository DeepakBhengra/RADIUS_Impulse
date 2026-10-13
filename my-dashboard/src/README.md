# Unified Impulse — Order/Transaction Search

Refactored from a single 880-line `App.jsx` prototype into a modular
structure aligned with the **Impulse Tools Development Plan**. Same visual
design and dependencies (React, Tailwind, lucide-react) — no new packages.

## What changed vs. the prototype

**Wired up, not just decorative**
- The search bar now actually calls a search function and the page shows
  real loading / empty / error / idle states instead of always rendering
  the same static order.
- Line-item pagination buttons work.
- Failure Reason / Retry-Recovery are now *derived* from flow-trace data
  instead of being hardcoded to "no failures."

**New sections added, matching the doc's "Result Screen" mockup**
- `components/flow/FlowTraceStatus.jsx` — per-system Flow Trace table
  (System / Status / Timestamp / Remarks), with tabs for the doc's three
  order flows: EDI, XEDI+MQ, X4C.
- `components/setup/SetupValidation.jsx` — Setup Type / Status table
  (DB2 Mapping, TBX Mapping, ODS Setup).
- `components/monitoring/DatadogPanel.jsx` — adds an Alerts tab
  (Alert / Severity / Details) alongside the existing raw log stream.
- `utils/auditLog.js` — minimal client-side "Audit & Logging" module per
  the doc's functional-module list; swap for a real POST /api/audit call
  when a backend exists.

## Structure

```
src/
  services/api.js       ← the ONE file to change when a real backend exists
  data/mockData.js       ← mock "Consolidated JSON Response" (doc's architecture)
  data/navigation.js     ← nav items, search fields, flow-type definitions
  hooks/useOrderSearch.js← search state machine: idle/loading/success/empty/error
  utils/                 ← formatting, status-color mapping, audit log
  components/
    common/     - Badge, SectionCard, DetailRow, loading/empty/error states
    layout/     - Header, Sidebar
    search/     - SearchBar
    order/      - OrderSummaryBanner, OrderHeaderDetails, LineItemDetails
    flow/       - FlowTraceStatus
    setup/      - SetupConfigDetails, SetupValidation
    monitoring/ - DatadogPanel, MQQueueStatus, FailureReason, RetryRecovery
  App.jsx                ← thin orchestration only, no business logic
```

## Why this shape (long-run reasoning)

Per the doc's architecture diagram (`Web UI -> API/Middleware Layer ->
DB2/ODS/TBX/MQ/Datadog -> Consolidated JSON -> Web Display`), the UI should
only ever need to know about one thing: the shape of the consolidated
response. `services/api.js` is the single seam between mock data and a real
backend — every component and hook consumes it through `useOrderSearch`, so
connecting real DB2/ODS/TBX/MQ/Datadog calls later is a one-file change.

- **Presentational components take props, not globals** — each panel
  (`OrderHeaderDetails`, `MQQueueStatus`, etc.) is now reusable and testable
  in isolation, and will keep working unmodified as more flow types, queues,
  or alert types are added — they just map over whatever array they're
  given.
- **Status colors are computed, not hardcoded** — `statusToColor()` maps any
  backend status string to a badge color, so a new status value (e.g. a new
  MQ or Datadog severity) degrades gracefully to gray instead of needing a
  code change in every component that renders a badge.
- **A request-scoped `AbortController` + tiny result cache** in
  `useOrderSearch` avoids race conditions from fast repeated searches and
  avoids redundant calls — relevant once search debouncing or type-ahead is
  added, and cheap to keep even now.
- **Audit logging has a home** (`utils/auditLog.js`) so the doc's "Audit &
  Logging" module doesn't get bolted on awkwardly later — searches are
  already recorded, ready to point at a real endpoint.

## Connecting to the real .NET backend

The app now calls your `.NET` `GetOrder` endpoint by default.

1. Copy `.env.example` to `.env.local` and set `VITE_ORDER_API_BASE_URL` if
   your backend isn't at `http://10.129.180.117:5000/api/order`.
2. Your backend must allow CORS from `http://localhost:5173` (Vite's dev
   server origin) or the browser will block the request even though the
   endpoint works fine from Postman.
3. The search bar currently only accepts **PO Number + Country Code**,
   because that's what `GetOrder` accepts today (`orderApi.js`). The other
   fields (Order Number, SKU, Account, Partner ID, Transaction ID) are shown
   but disabled — flip `supported: true` in `data/navigation.js` once the
   backend adds those lookups.
4. **Field mapping is a best guess.** I don't yet know your exact response
   DTO, so `services/mapOrderResponse.js` tries several common field-name
   casings (`orderNumber` / `OrderNumber`, etc.) and falls back to `"—"` for
   anything it can't find, rather than crashing. Run a real search, open the
   **"Raw API Response (debug)"** panel at the bottom of the results, and
   compare it against what's showing in the UI above it — then send me
   either that raw JSON or your C# DTO/controller and I'll tighten the
   mapping to exact field names.
5. Don't have backend access right now? Set `VITE_USE_MOCK_API=true` in
   `.env.local` to fall back to the original mock data (`services/mockApi.js`)
   so you can keep working on the UI.

## Next steps toward the doc's Phase 2/3
  Datadog; keep the same return shape as `buildConsolidatedResponse()`.
- Add a debounce + type-ahead to `SearchBar` once real search-by-partial-SKU
  is available.
- `FailureReason` / `RetryRecovery` already derive from flow-trace data —
  Phase 3's "failure analytics" / "retry recommendation" features can extend
  the `useMemo` in `App.jsx` rather than rewriting these components.
