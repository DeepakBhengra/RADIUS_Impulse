export const analyticsMockData = {
  totalTabViews: 1248,
  uniqueSessions: 342,
  mostUsedTab: "order_details",
  totalOrderSearches: 186,

  tabBreakdown: [
    { tab: "order_details", views: 356, uniqueSessions: 124 },
    { tab: "line_items", views: 298, uniqueSessions: 98 },
    { tab: "processing_flow", views: 189, uniqueSessions: 72 },
    { tab: "flow_trace_status", views: 156, uniqueSessions: 61 },
    { tab: "setup_configuration", views: 112, uniqueSessions: 48 },
    { tab: "logs_export", views: 87, uniqueSessions: 39 },
    { tab: "po_switch", views: 50, uniqueSessions: 25 }
  ],

  dailyTrend: [
    { date: "Oct 08", views: 112 },
    { date: "Oct 09", views: 145 },
    { date: "Oct 10", views: 128 },
    { date: "Oct 11", views: 176 },
    { date: "Oct 12", views: 193 },
    { date: "Oct 13", views: 211 },
    { date: "Oct 14", views: 283 }
  ],

  recentActivity: [
    {
      eventType: "tab_view",
      tab: "order_details",
      sessionId: "session-a81f",
      timestampUtc: "2026-10-14T08:45:12Z",
      outcome: null
    },
    {
      eventType: "tab_view",
      tab: "line_items",
      sessionId: "session-b92e",
      timestampUtc: "2026-10-14T08:43:05Z",
      outcome: null
    },
    {
      eventType: "order_search",
      tab: null,
      sessionId: "session-a81f",
      timestampUtc: "2026-10-14T08:41:20Z",
      outcome: "success"
    },
    {
      eventType: "tab_view",
      tab: "processing_flow",
      sessionId: "session-c73d",
      timestampUtc: "2026-10-14T08:38:44Z",
      outcome: null
    },
    {
      eventType: "tab_view",
      tab: "setup_configuration",
      sessionId: "session-b92e",
      timestampUtc: "2026-10-14T08:35:10Z",
      outcome: null
    }
  ]
};