
import { useState, useEffect, useCallback } from "react";
import { getAnalyticsSessionId } from "../../utils/analyticsTracking";
import {
  ChartNoAxesColumnIncreasing,
  Eye,
  Users,
  TrendingUp,
  Search,
  RefreshCw,
  Loader2,
  CalendarDays,
  Activity,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDot,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_ORDER_API_BASE_URL || ""
)
  .replace(/\/api\/order\/?$/, "")
  .replace(/\/$/, "");

const DAYS_BY_RANGE = {
  today: 1,
  "7d": 7,
  "30d": 30,
};

const TAB_LABELS = {
  order_details: "Order Details",
  line_items: "Line Items",
  processing_flow: "Processing Flow",
  flow_trace_status: "Flow Trace Status",
  po_switch: "PO Switch",
  setup_configuration: "Setup & Configuration",
  logs_export: "Logs & Export",
};

const TAB_COLORS = {
  order_details: "#1687F8",
  line_items: "#08BFA5",
  processing_flow: "#9B51F5",
  flow_trace_status: "#F59E0B",
  setup_configuration: "#16B8E8",
  po_switch: "#F04475",
  logs_export: "#6F9FCB",
};

const RANGES = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-US");

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayDate = () => toDateInputValue(new Date());
const daysAgoDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
};

async function fetchAnalyticsJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      details || `Analytics API request failed (${response.status})`
    );
  }

  return response.json();
}

function normalizeAnalyticsData(summary, dailyRows) {
  const tabs = Array.isArray(summary.tabs) ? summary.tabs : [];

  const tabBreakdown = tabs.map((item) => ({
    tab: item.tab,
    views: Number(item.views) || 0,
    uniqueSessions: Number(item.uniqueSessions) || 0,
  }));

  const mostUsedTab = [...tabBreakdown]
    .filter((item) => item.views > 0)
    .sort((a, b) => b.views - a.views)[0]?.tab ?? null;

  const dailyTrend = Array.isArray(dailyRows)
    ? dailyRows.map((day) => ({
        date: day.date,
        views: Number(day.totalTabViews) || 0,
        viewsByTab: day.tabs || {},
      }))
    : [];

  return {
    totalTabViews: Number(summary.totalTabViews) || 0,
    totalOrderSearches: Number(summary.totalSearches) || 0,
    successfulSearches: Number(summary.successfulSearches) || 0,
    failedSearches: Number(summary.failedSearches) || 0,
    tabBreakdown,
    mostUsedTab,
    dailyTrend,
  };
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E3EDF9] bg-white/95 shadow-[0_4px_18px_rgba(31,91,155,0.055)] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelTitle({ icon: Icon, children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[#092F72]">
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0878E8]">
            <Icon size={16} strokeWidth={2.4} />
          </span>
        )}
        {children}
      </h2>
      {action}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  tint,
  subtext,
}) {
  return (
    <Panel className="relative min-w-0 overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,91,155,0.10)] md:p-5">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}22)`,
        }}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: tint, color }}
        >
          <Icon size={23} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#6480A7] md:text-[11px]">
            {label}
          </p>

          <p className="mt-1 truncate text-xl font-extrabold leading-tight text-[#082F70] md:text-[25px]">
            {value ?? "—"}
          </p>

          <p className="mt-1.5 text-[10px] text-[#7890B2]">
            {subtext || "In selected period"}
          </p>
        </div>
      </div>
    </Panel>
  );
}

function TabBreakdownBars({ items = [] }) {
  if (!items.length) {
    return (
      <p className="py-8 text-center text-xs text-[#8AA0BE]">
        No tab views recorded in this range yet.
      </p>
    );
  }

  const max = Math.max(
    ...items.map((item) => Number(item.views) || 0),
    1
  );

  const total = items.reduce(
    (sum, item) => sum + (Number(item.views) || 0),
    0
  );

  return (
    <div className="space-y-[13px]">
      {items.map((item) => {
        const color = TAB_COLORS[item.tab] || "#1687F8";

        const percent = total
          ? ((Number(item.views || 0) / total) * 100).toFixed(1)
          : "0.0";

        return (
          <div key={item.tab}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] md:text-xs">
              <span className="flex min-w-0 items-center gap-2 font-medium text-[#35547F]">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">
                  {TAB_LABELS[item.tab] || item.tab}
                </span>
              </span>

              <span className="flex-shrink-0 text-[#6782A8]">
                <strong className="font-semibold text-[#244A7E]">
                  {formatNumber(item.views)}
                </strong>
                <span className="ml-1.5 text-[#8AA0BE]">
                  ({percent}%)
                </span>
              </span>
            </div>

            <div className="h-[10px] overflow-hidden rounded-full bg-[#EEF4FB]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(Number(item.views || 0) / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyTrendChart({ dailyTrend = [], tabBreakdown = [] }) {
  if (!dailyTrend.length) {
    return (
      <p className="py-8 text-center text-xs text-[#8AA0BE]">
        No daily usage data available yet.
      </p>
    );
  }

  const width = 700;
  const height = 205;
  const left = 38;
  const right = 12;
  const top = 12;
  const bottom = 31;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const maxDataValue = Math.max(
    ...dailyTrend.map((day) => Number(day.views) || 0),
    1
  );

  const maxY = Math.max(1, Math.ceil(maxDataValue / 10) * 10);

  const xAt = (index) =>
    left +
    (dailyTrend.length === 1
      ? plotW / 2
      : (index / (dailyTrend.length - 1)) * plotW);

  const yAt = (value) =>
    top + plotH - ((Number(value) || 0) / maxY) * plotH;

  // Only show per-tab series when the daily API has real counts for those tabs.
  const series = tabBreakdown
    .filter((tab) =>
      dailyTrend.some(
        (day) => Number(day.viewsByTab?.[tab.tab] || 0) > 0
      )
    )
    .map((tab) => ({
      tab: tab.tab,
      label: TAB_LABELS[tab.tab] || tab.tab,
      color: TAB_COLORS[tab.tab] || "#1687F8",
      values: dailyTrend.map(
        (day) => Number(day.viewsByTab?.[tab.tab] || 0)
      ),
    }));

  // Fall back to actual total views, not estimated tab distributions.
  if (!series.length) {
    series.push({
      tab: "total",
      label: "Total views",
      color: "#1687F8",
      values: dailyTrend.map((day) => Number(day.views) || 0),
    });
  }

  const gridValues = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="min-w-0">
      <div className="h-[218px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Daily RADIUS tab usage trend"
        >
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.tab}
                id={`area-${item.tab}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={item.color}
                  stopOpacity="0.16"
                />
                <stop
                  offset="100%"
                  stopColor={item.color}
                  stopOpacity="0"
                />
              </linearGradient>
            ))}
          </defs>

          {gridValues.map((part, index) => {
            const y = top + (plotH * index) / 4;
            const value = Math.round(maxY * (1 - part));

            return (
              <g key={`${value}-${index}`}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#EAF1F9"
                  strokeWidth="1"
                />
                <text
                  x={left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#8AA0BE"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {series.map((item) => {
            const points = item.values
              .map(
                (value, index) =>
                  `${xAt(index)},${yAt(value)}`
              )
              .join(" ");

            const area = `${left},${top + plotH} ${points} ${xAt(
              item.values.length - 1
            )},${top + plotH}`;

            return (
              <g key={item.tab}>
                <polygon
                  points={area}
                  fill={`url(#area-${item.tab})`}
                />

                <polyline
                  points={points}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {item.values.map((value, index) => (
                  <circle
                    key={`${item.tab}-${index}`}
                    cx={xAt(index)}
                    cy={yAt(value)}
                    r="2.8"
                    fill={item.color}
                    stroke="#fff"
                    strokeWidth="1.1"
                  >
                    <title>
                      {`${item.label}: ${value} views`}
                    </title>
                  </circle>
                ))}
              </g>
            );
          })}

          {dailyTrend.map((day, index) => (
            <text
              key={`${day.date}-${index}`}
              x={xAt(index)}
              y={height - 7}
              textAnchor="middle"
              fontSize="10"
              fill="#8AA0BE"
            >
              {(day.date || "").slice(5)}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0F4FA] pt-3">
        {series.map((item) => (
          <span
            key={item.tab}
            className="inline-flex items-center gap-1.5 text-[10px] text-[#5E789D]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatActivityTime(value) {
  if (!value) return "Time unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function RecentActivity({ activities = [], loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#6480A7]">
        <Loader2 size={16} className="animate-spin text-[#1687F8]" />
        Loading recent activity…
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs font-medium text-[#A33B3B]">
          Couldn't load recent activity.
        </p>
        <p className="mt-1 break-words text-[11px] text-[#8AA0BE]">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg border border-[#DDE9F8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2269B3] hover:bg-[#F5FAFF]"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="py-8 text-center">
        <Clock3 size={22} className="mx-auto mb-2 text-[#9AB0CD]" />
        <p className="text-xs font-medium text-[#526F96]">
          No recent tab activity found.
        </p>
        <p className="mt-1 text-[11px] text-[#8AA0BE]">
          Activity will appear here when RADIUS records tab views.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((item, index) => {
        const color = TAB_COLORS[item.tab] || "#1687F8";
        const label = TAB_LABELS[item.tab] || item.tab || "Unknown activity";

        return (
          <div
            key={`${item.sessionId || "session"}-${item.timestampUtc || index}-${index}`}
            className="flex items-start gap-3 rounded-xl px-2.5 py-3 transition hover:bg-[#F5F9FE]"
          >
            <span
              className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}18`, color }}
            >
              <Activity size={17} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#244A7E]">
                Viewed {label}
              </p>
              <p className="mt-1 truncate font-mono text-[10px] text-[#8298B6]">
                {item.sessionId || "Anonymous session"}
              </p>
            </div>

            <span className="flex-shrink-0 whitespace-nowrap pt-0.5 text-[10px] text-[#8298B6]">
              {formatActivityTime(item.timestampUtc)}
            </span>
          </div>
        );
      })}
    </div>
  );
}


function CustomDatePicker({ label, value, onChange, minDate, maxDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = value ? new Date(`${value}T12:00:00`) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayDate();
  const formatDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const disabled = (date) => Boolean((minDate && date < minDate) || (maxDate && date > maxDate));
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="relative flex min-w-0 flex-col gap-1.5">
      <span className="text-[10px] font-semibold text-[#6480A7]">{label}</span>
      <button type="button" onClick={() => setIsOpen((open) => !open)} className="flex h-10 w-[158px] items-center justify-between gap-2 rounded-xl border border-[#DDE9F8] bg-white px-3 text-left text-xs text-[#244A7E] shadow-sm transition hover:border-[#91BFF3] focus:outline-none focus:ring-2 focus:ring-[#1687F8]/20">
        <span>{value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Select date"}</span>
        <CalendarDays size={15} className="shrink-0 text-[#1687F8]" />
      </button>
      {isOpen && <>
        <button type="button" aria-label="Close date picker" className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
        <div className="absolute left-0 top-full z-50 mt-2 w-[292px] rounded-2xl border border-[#E0EAF7] bg-white p-4 shadow-[0_12px_40px_rgba(29,69,123,0.18)]">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-sm font-bold text-[#173B70]">{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p><p className="mt-0.5 text-[10px] text-[#8AA0BE]">Select a date</p></div>
            <div className="flex gap-1">
              <button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(new Date(year, month - 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4EDF8] text-[#4770A5] hover:bg-[#F0F6FF]"><ChevronLeft size={16} /></button>
              <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(year, month + 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E4EDF8] text-[#4770A5] hover:bg-[#F0F6FF]"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <div key={day} className="flex h-8 items-center justify-center text-[11px] font-semibold text-[#8AA0BE]">{day}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">{cells.map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="h-8" />;
            const dateString = formatDate(new Date(year, month, day));
            const selected = dateString === value;
            const isToday = dateString === today;
            const isDateDisabled = disabled(dateString);
            return <button key={dateString} type="button" disabled={isDateDisabled} onClick={() => { onChange(dateString); setIsOpen(false); }} className={`flex h-8 items-center justify-center rounded-lg text-xs transition ${selected ? "bg-[#0878E8] font-semibold text-white shadow-sm" : isToday ? "border border-[#A9CEF8] font-semibold text-[#0878E8]" : "text-[#34577F] hover:bg-[#EDF5FF] hover:text-[#0878E8]"} ${isDateDisabled ? "cursor-not-allowed opacity-30" : ""}`}>{day}</button>;
          })}</div>
          <div className="mt-4 flex items-center justify-between border-t border-[#EDF2F8] pt-3">
            <button type="button" onClick={() => { onChange(""); setIsOpen(false); }} className="rounded-lg px-2 py-1.5 text-xs font-medium text-[#6480A7] hover:bg-[#F3F7FC]">Clear</button>
            <button type="button" disabled={disabled(today)} onClick={() => { onChange(today); setIsOpen(false); }} className="rounded-lg bg-[#EDF5FF] px-3 py-1.5 text-xs font-semibold text-[#0878E8] hover:bg-[#DDEEFF] disabled:cursor-not-allowed disabled:opacity-40">Today</button>
          </div>
        </div>
      </>}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState("7d");
  const [startDate, setStartDate] = useState(() => daysAgoDate(6));
  const [endDate, setEndDate] = useState(() => todayDate());
  const [appliedCustomRange, setAppliedCustomRange] = useState(null);
  const [dateRangeError, setDateRangeError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [recentActivities, setRecentActivities] = useState([]);
  const [recentActivityLoading, setRecentActivityLoading] = useState(true);
  const [recentActivityError, setRecentActivityError] = useState(null);

  const load = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      const query = range === "custom" && appliedCustomRange
        ? `startDate=${encodeURIComponent(appliedCustomRange.startDate)}&endDate=${encodeURIComponent(appliedCustomRange.endDate)}`
        : `days=${DAYS_BY_RANGE[range] ?? 7}`;

      try {
        const [summary, dailyRows] = await Promise.all([
          fetchAnalyticsJson(
            `${API_BASE}/api/analytics/summary?${query}`,
            controller.signal
          ),
          fetchAnalyticsJson(
            `${API_BASE}/api/analytics/daily?${query}`,
            controller.signal
          ),
        ]);

        if (!controller.signal.aborted) {
          setData(normalizeAnalyticsData(summary, dailyRows));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setData(null);
          setError(
            err.message || "Unable to load analytics from the server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, [range, appliedCustomRange, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecentActivity() {
      setRecentActivityLoading(true);
      setRecentActivityError(null);

      try {
        const result = await fetchAnalyticsJson(
          `${API_BASE}/api/analytics/recent-tabs?sessionId=${encodeURIComponent(getAnalyticsSessionId())}`,
          controller.signal
        );

        if (!controller.signal.aborted) {
          const rows = Array.isArray(result)
            ? result
            : Array.isArray(result?.recentTabs)
              ? result.recentTabs
              : [];

          setRecentActivities(rows);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setRecentActivities([]);
          setRecentActivityError(
            err.message || "Unable to load recent activity."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setRecentActivityLoading(false);
        }
      }
    }

    loadRecentActivity();
    return () => controller.abort();
  }, [refreshKey]);

  const breakdown = data?.tabBreakdown || [];

  const totalBreakdown = breakdown.reduce(
    (sum, item) => sum + Number(item.views || 0),
    0
  );

  const mostUsedViews =
    breakdown.find((item) => item.tab === data?.mostUsedTab)?.views;

  const mostUsedPercent =
    mostUsedViews != null && totalBreakdown
      ? `${((mostUsedViews / totalBreakdown) * 100).toFixed(1)}% of total`
      : "No tab views yet";

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top_left,_#EAF4FF_0%,_#F5F9FF_38%,_#F8FBFF_100%)] p-4 md:p-6 xl:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#073783] md:text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0878E8] shadow-sm ring-1 ring-[#DCEBFC]">
                <ChartNoAxesColumnIncreasing
                  size={21}
                  strokeWidth={2.5}
                />
              </span>
              Usage Analytics
            </h1>

            <p className="ml-0.5 mt-1.5 text-sm text-[#6480A7]">
              Understand how RADIUS is being used across features.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-[#DDE9F8] bg-white p-1 shadow-sm">
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition md:px-4 ${
                    range === item.id
                      ? "bg-gradient-to-r from-[#1687F8] to-[#0867CE] text-white shadow-[0_3px_8px_rgba(8,103,206,0.25)]"
                      : "text-[#5C7599] hover:bg-[#F1F7FF] hover:text-[#0C64C2]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDE9F8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2269B3] shadow-sm transition hover:border-[#A9CEF8] hover:bg-[#F5FAFF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <div className="relative z-30 flex flex-wrap items-end gap-2 rounded-2xl border border-[#DDE9F8] bg-white p-3 shadow-sm">
              <CustomDatePicker label="Start date" value={startDate} onChange={setStartDate} maxDate={endDate || todayDate()} />
              <CustomDatePicker label="End date" value={endDate} onChange={setEndDate} minDate={startDate} maxDate={todayDate()} />
              <button
                type="button"
                onClick={() => {
                  if (!startDate || !endDate) {
                    setDateRangeError("Select both a start date and an end date.");
                    return;
                  }
                  if (startDate > endDate) {
                    setDateRangeError("Start date must be on or before end date.");
                    return;
                  }
                  if (startDate > todayDate() || endDate > todayDate()) {
                    setDateRangeError("Future dates are not supported.");
                    return;
                  }
                  const span = Math.round((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000) + 1;
                  if (span > 365) {
                    setDateRangeError("Choose a date range of 365 days or less.");
                    return;
                  }
                  setDateRangeError("");
                  setAppliedCustomRange({ startDate, endDate });
                  setRange("custom");
                }}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1687F8] to-[#0867CE] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-95"
              >
                <CalendarDays size={14} />
                Apply
              </button>
            </div>
          </div>
        </div>

        {dateRangeError && (
          <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {dateRangeError}
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E3EDF9] bg-white/90 py-16 text-sm text-[#6480A7]">
            <Loader2
              size={17}
              className="animate-spin text-[#1687F8]"
            />
            Loading analytics…
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">
              Couldn't load analytics
            </p>
            <p className="mt-1 break-words">{error}</p>

            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {data && !loading && !error && (
          <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                label="Total Tab Views"
                value={formatNumber(data.totalTabViews)}
                icon={Eye}
                color="#1687F8"
                tint="#E1F3FF"
                subtext="In selected period"
              />

              <StatCard
                label="Successful Searches"
                value={formatNumber(data.successfulSearches)}
                icon={Search}
                color="#08BFA5"
                tint="#DDFBF4"
                subtext="Searches with success outcome"
              />

              <StatCard
                label="Most Used Tab"
                value={
                  TAB_LABELS[data.mostUsedTab] ||
                  data.mostUsedTab ||
                  "—"
                }
                icon={TrendingUp}
                color="#9955F5"
                tint="#F0E6FF"
                subtext={
                  mostUsedViews != null
                    ? `${formatNumber(mostUsedViews)} views (${mostUsedPercent})`
                    : mostUsedPercent
                }
              />

              <StatCard
                label="Total Order Searches"
                value={formatNumber(data.totalOrderSearches)}
                icon={Search}
                color="#F59E0B"
                tint="#FFF2DE"
                subtext="In selected period"
              />
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 2xl:grid-cols-[0.92fr_1.08fr]">
              <Panel className="p-4 md:p-5">
                <PanelTitle icon={ChartNoAxesColumnIncreasing}>
                  Tab Usage Breakdown
                </PanelTitle>

                <TabBreakdownBars items={breakdown} />
              </Panel>

              <Panel className="min-w-0 p-4 md:p-5">
                <PanelTitle icon={TrendingUp}>
                  Tab Usage Trend
                </PanelTitle>

                <DailyTrendChart
                  dailyTrend={data.dailyTrend || []}
                  tabBreakdown={breakdown}
                />
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              <Panel className="min-w-0 overflow-hidden p-4 md:p-5">
                <PanelTitle
                  icon={Clock3}
                  action={
                    <span className="rounded-full bg-[#EEF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#2674C4]">
                      Latest events
                    </span>
                  }
                >
                  Recent Activity
                </PanelTitle>

                <RecentActivity
                  activities={recentActivities}
                  loading={recentActivityLoading}
                  error={recentActivityError}
                  onRetry={load}
                />
              </Panel>

              {/* <Panel className="min-w-0 overflow-hidden p-4 md:p-5">
                <PanelTitle icon={Activity}>
                  Tab Usage Details
                </PanelTitle>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-[11px]">
                    <thead>
                      <tr className="border-y border-[#E8F0FA] bg-[#F5F9FE] text-[#6E86A8]">
                        <th className="px-2.5 py-2.5 font-semibold">
                          Tab Name
                        </th>
                        <th className="px-2.5 py-2.5 font-semibold">
                          Identifier
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          Total Views
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          Unique Sessions
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          % Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {!breakdown.length ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-8 text-center text-[#8AA0BE]"
                          >
                            No usage data yet.
                          </td>
                        </tr>
                      ) : (
                        breakdown.map((item) => {
                          const color =
                            TAB_COLORS[item.tab] || "#1687F8";

                          const percent = totalBreakdown
                            ? (
                                (Number(item.views || 0) /
                                  totalBreakdown) *
                                100
                              ).toFixed(1)
                            : "0.0";

                          return (
                            <tr
                              key={item.tab}
                              className="border-b border-[#EFF4FA] transition last:border-0 hover:bg-[#F8FBFF]"
                            >
                              <td className="whitespace-nowrap px-2.5 py-2.5">
                                <span className="flex items-center gap-2 font-medium text-[#294C7A]">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: color,
                                    }}
                                  />
                                  {TAB_LABELS[item.tab] || item.tab}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-2.5 py-2.5 font-mono text-[10px] text-[#7A91B0]">
                                {item.tab}
                              </td>

                              <td className="px-2.5 py-2.5 text-right font-bold text-[#234A7E]">
                                {formatNumber(item.views)}
                              </td>

                              <td className="px-2.5 py-2.5 text-right text-[#5F7A9F]">
                                {formatNumber(item.uniqueSessions)}
                              </td>

                              <td className="px-2.5 py-2.5 text-right">
                                <span className="rounded-full bg-[#EFF7FF] px-2 py-1 font-semibold text-[#2875C2]">
                                  {percent}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel> */}
            </div>

            <p className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-[#91A5C0]">
              <CircleDot size={10} className="text-[#08BFA5]" />
              Analytics based on recorded usage events
            </p>
          </>
        )}
      </div>
    </div>
  );
}
