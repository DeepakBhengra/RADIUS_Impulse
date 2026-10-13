import { useState } from "react";
import {
  FileText,
  ListOrdered,
  Activity,
  Settings,
  GitBranch,
  Terminal,
  ToggleRight,
  Download,
} from "lucide-react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import DashboardSearch from "./components/search/DashboardSearch";
import "./components/search/DashboardSearch.css";
import radiusWatermark from "./assets/RADIUS_Watermark.png";

import OrderSummaryBanner from "./components/order/OrderSummaryBanner";
import OrderHeaderDetails from "./components/order/header/OrderHeaderDetails";
import LineItemDetails from "./components/order/lineitem/LineItemDetails";

import FlowTraceStatus from "./components/flow/FlowTraceStatus";
import SetupConfigDetails from "./components/PartnerSetup/SetupConfigDetails";

import DatadogPanel from "./components/monitoring/DatadogPanel";

import PoSwitchSection from "./components/order/PoSwitchSection";
import ProcessFlowSection from "./components/order/ProcessFlowSection";

import {
  LoadingState,
  EmptyState,
  ErrorState,
  IdleState,
} from "./components/common/StatusStates";

import { useOrderSearch } from "./hooks/useOrderSearch";

// ============================================================
// EXPORT HELPERS
// ============================================================

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAsJSON(data, filenameBase) {
  downloadBlob(
    JSON.stringify(data, null, 2),
    `${filenameBase}.json`,
    "application/json",
  );
}

function exportAsCSV(rows, filenameBase) {
  if (!Array.isArray(rows) || rows.length === 0) return;

  const columns = Object.keys(rows[0]);

  const escapeCell = (val) => {
    const str = val == null ? "" : String(val);

    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((col) => escapeCell(row[col])).join(",")),
  ];

  downloadBlob(lines.join("\n"), `${filenameBase}.csv`, "text/csv");
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Default tab after successful search
  const [activeTab, setActiveTab] = useState("order");

  const { data, status, error, search, reset } = useOrderSearch();

  // ============================================================
  // TABS
  // ============================================================

  const tabs = [
    {
      id: "order",
      label: "Order Details",
      icon: FileText,
    },
    {
      id: "lineItems",
      label: "Line Items",
      icon: ListOrdered,
    },
    {
      id: "processing",
      label: "Processing Flow",
      icon: GitBranch,
    },
    {
      id: "flowTrace",
      label: "Flow Trace Status",
      icon: Activity,
    },
    {
      id: "poSwitch",
      label: "PO Switch",
      icon: ToggleRight,
    },
    {
      id: "setup",
      label: "Setup & Configuration",
      icon: Settings,
    },
    {
      id: "logs",
      label: "Logs & Monitoring",
      icon: Terminal,
    },
  ];

  // ============================================================
  // TAB BADGE COUNTS + EXPORT
  // ============================================================

  const setupRecords = Array.isArray(data?.setupConfig)
    ? data.setupConfig
    : data?.setupConfig && typeof data.setupConfig === "object"
      ? [data.setupConfig]
      : [];

  const flowRows = Array.isArray(data?.flowTrace)
    ? data.flowTrace
    : data?.flowTrace && typeof data.flowTrace === "object"
      ? Object.values(data.flowTrace).filter(Array.isArray).flat()
      : [];

  const tabCounts = {
    order: null,
    lineItems: data?.lineItems?.length ?? 0,
    processing: null,
    flowTrace: flowRows.length,
    poSwitch: null,
    setup: setupRecords.length,
    logs: null,
  };

  const orderIdentifier =
    data?.order?.ordrNbr || data?.order?.custOrdrNbr || "order";

  const handleExport = () => {
    switch (activeTab) {
      case "order":
        exportAsJSON(data?.order, `${orderIdentifier}-header`);
        break;

      case "lineItems":
        if (data?.lineItems?.length) {
          exportAsCSV(data.lineItems, `${orderIdentifier}-line-items`);
        }
        break;

      case "flowTrace":
        if (flowRows.length) {
          exportAsCSV(flowRows, `${orderIdentifier}-flow-trace`);
        }
        break;

      case "setup":
        exportAsJSON(setupRecords, `${orderIdentifier}-partner-setup`);
        break;

      default:
        break;
    }
  };

  const exportDisabled =
    (activeTab === "order" && !data?.order) ||
    (activeTab === "lineItems" && !data?.lineItems?.length) ||
    (activeTab === "flowTrace" && !flowRows.length) ||
    (activeTab === "setup" && !setupRecords.length) ||
    ["processing", "poSwitch", "logs"].includes(activeTab);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen font-sans" style={{
      background: `
        radial-gradient(
          circle at 5% 20%,
          rgba(59, 130, 246, 0.07),
          transparent 25%
        ),
        radial-gradient(
          circle at 95% 20%,
          rgba(96, 165, 250, 0.06),
          transparent 25%
        ),
        linear-gradient(
          135deg,
          #f7fbff 0%,
          #ffffff 50%,
          #f5f9ff 100%
        )`
    }}>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <Header toggleSidebar={() => setMobileOpen(!mobileOpen)} />

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main
        className={`pt-14 transition-all duration-300 hidden-mobile-margin ${
          sidebarCollapsed ? "md:ml-[60px]" : "md:ml-[200px]"
        }`}
      >
        <div className="p-4 md:p-5 max-w-[1400px] mx-auto relative">
          {/* ======================================================
              DASHBOARD SEARCH
          ====================================================== */}

          <DashboardSearch onSearch={search} loading={status === "loading"} />

          {/* ======================================================
              RADIUS WATERMARK
          ====================================================== */}

          {status === "idle" && (
              <div
    className="pointer-events-none relative -mt-20 h-[420px] overflow-visible"
    aria-hidden="true"
  >
    <img
      src={radiusWatermark}
      alt=""
      className="absolute left-1/2 top-1/2
                 -translate-x-1/2 -translate-y-1/2
                 w-[600px] h-[600px]
                 object-contain opacity-50"
    />
  </div>
          )}

          {/* ======================================================
              STATUS
          ====================================================== */}

          <div className="mt-4">
            {/* IDLE */}
            {status === "idle" && <IdleState />}

            {/* LOADING */}
            {status === "loading" && <LoadingState />}

            {/* EMPTY */}
            {status === "empty" && <EmptyState />}

            {/* ERROR */}
            {status === "error" && (
              <ErrorState message={error} onRetry={reset} />
            )}

            {/* ====================================================
                SUCCESS
            ==================================================== */}

            {status === "success" && data && (
              <>
                {/* ==================================================
                    ORDER SUMMARY
                ================================================== */}

                <OrderSummaryBanner order={data.order} />

                {/* ==================================================
                    TAB CONTAINER
                ================================================== */}

                <div className="mt-4">
                  {/* =================================================
                      TAB HEADER
                  ================================================= */}

                  <div className="bg-white border border-[#D6E4F7] rounded-t-xl shadow-sm flex items-center justify-between">
                    {/* TAB LIST */}

                    <div className="flex items-center overflow-hidden">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;

                        const isActive = activeTab === tab.id;

                        const count = tabCounts[tab.id];

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                              relative
                              flex
                              items-center
                              gap-2
                              px-5
                              py-3
                              text-xs
                              font-medium
                              whitespace-nowrap
                              border-b-2
                              transition-all
                              ${
                                isActive
                                  ? "text-[#0F6CBD] border-[#0F6CBD] bg-[#F8FBFF]"
                                  : "text-[#6B7280] border-transparent hover:text-[#0F6CBD] hover:bg-[#F8FAFC]"
                              }
                            `}
                          >
                            <Icon size={14} />

                            {tab.label}

                            {count != null && (
                              <span className="ml-0.5 text-[10px] font-semibold bg-slate-100 text-[#6B7280] rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* EXPORT */}

                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={exportDisabled}
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        text-[#0F6CBD]
                        px-3
                        py-2
                        mr-2
                        rounded-md
                        hover:bg-[#EFF6FF]
                        disabled:opacity-30
                        disabled:cursor-not-allowed
                        flex-shrink-0
                      "
                    >
                      <Download size={13} />
                      Export
                    </button>
                  </div>

                  {/* =================================================
                      TAB CONTENT
                  ================================================= */}

                  <div className="mt-4">
                    {/* =================================================
                        1. ORDER DETAILS
                    ================================================= */}

                    {activeTab === "order" && (
                      <div className="space-y-4">
                        <OrderHeaderDetails order={data.order} />
                      </div>
                    )}

                    {/* =================================================
                        2. LINE ITEMS
                    ================================================= */}

                    {activeTab === "lineItems" && (
                      <div className="space-y-4">
                        <LineItemDetails items={data.lineItems} />
                      </div>
                    )}

                    {/* =================================================
                        3. PROCESSING FLOW
                    ================================================= */}

                    {activeTab === "processing" && (
                      <div className="space-y-4">
                        <ProcessFlowSection
                          eoStateCd={data?.order?.eoStateCd}
                        />
                      </div>
                    )}

                    {/* =================================================
                        4. FLOW TRACE STATUS
                    ================================================= */}

                    {activeTab === "flowTrace" && (
                      <div className="space-y-4">
                        <FlowTraceStatus flowTrace={data.flowTrace} />
                      </div>
                    )}

                    {/* =================================================
                        5. PO SWITCH
                    ================================================= */}

                    {activeTab === "poSwitch" && (
                      <div className="space-y-4">
                        <PoSwitchSection inPoSw={data.inPoSw} />
                      </div>
                    )}

                    {/* =================================================
                        6. SETUP & CONFIGURATION
                    ================================================= */}

                    {activeTab === "setup" && (
                      <div className="space-y-4">
                        <SetupConfigDetails config={data.setupConfig} />
                      </div>
                    )}

                    {/* =================================================
                        7. LOGS & MONITORING
                    ================================================= */}

                    {activeTab === "logs" && (
                      <div className="space-y-4">
                        <DatadogPanel
                          logs={data.logs}
                          alerts={data.datadogAlerts}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ======================================================
              FOOTER
          ====================================================== */}

          {/* <div className="mt-6 pb-4 text-center text-[10px] text-[#6B7280] flex items-center justify-between">
            <span>© 2024 Ingram Micro Inc. All Rights Reserved.</span>

            <div className="flex gap-4">
              <button className="hover:text-[#0F6CBD]">Privacy Policy</button>

              <button className="hover:text-[#0F6CBD]">Terms of Use</button>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}
