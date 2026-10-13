import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  Users,
  FileText,
  Globe,
  Settings,
  Download,
  ChevronRight,
} from "lucide-react";

import { PARTNER_SETUP_FIELD_GROUPS } from "../components/PartnerSetup/setupFieldConfig";
import {
  normalizeSetupRecord,
  statusColor,
} from "../components/PartnerSetup/setupDetailsUtils";

import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

/* ─────────────────────────────────────────────────────────────
   ICON MAP
   Reuses icons defined in setupFieldConfig
───────────────────────────────────────────────────────────── */

const ICON_MAP = {
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  Users,
  FileText,
  Globe,
  Settings,
};

/* ─────────────────────────────────────────────────────────────
   TAB GROUPING
───────────────────────────────────────────────────────────── */

const TAB_GROUP_MAP = {
  overview: ["general", "source"],

  communication: ["communication"],

  processing: ["processing", "schedule"],

  status: ["status", "audit", "notes"],
};

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: Building2,
  },
  {
    id: "communication",
    label: "Communication",
    icon: Globe,
  },
  {
    id: "processing",
    label: "Processing",
    icon: Cpu,
  },
  {
    id: "status",
    label: "Status",
    icon: AlertCircle,
  },
];

/* ─────────────────────────────────────────────────────────────
   FALLBACK RECORD
───────────────────────────────────────────────────────────── */

function toFallbackRecord(searchParams) {
  return normalizeSetupRecord({
    coCd: searchParams.get("coCd") || "—",
    partnerId: searchParams.get("partnerId") || "—",
    partnerTypeCd:
      searchParams.get("partnerTypeCd") || "—",
    srceSysId:
      searchParams.get("srceSysId") || "—",
    formatId:
      searchParams.get("formatId") || "—",
    commuId:
      searchParams.get("commuId") || "—",
  });
}

/* ─────────────────────────────────────────────────────────────
   RESOLVE RECORD
───────────────────────────────────────────────────────────── */

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");

  const stored = loadDetailsRecord(
    ref,
    "partner-setup",
  );

  if (stored) {
    return normalizeSetupRecord(stored);
  }

  return toFallbackRecord(searchParams);
}

/* ─────────────────────────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────────────────────────── */

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (
    value == null ||
    value === "" ||
    value === "—"
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();

        navigator.clipboard
          ?.writeText(String(value))
          .catch(() => {});

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? (
        <Check
          size={11}
          className="text-green-600"
        />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   FIELD VALUE RENDERER
───────────────────────────────────────────────────────────── */

function renderFieldValue(field, value) {
  if (
    value == null ||
    value === "" ||
    value === "—"
  ) {
    return (
      <span className="text-slate-300 text-xs">
        —
      </span>
    );
  }

  if (field.type === "date") {
    return (
      <span className="text-xs text-[#0F172A]">
        {formatDateTime(value)}
      </span>
    );
  }

  if (field.type === "number") {
    return (
      <span className="text-xs text-[#0F172A]">
        {value}
      </span>
    );
  }

  if (field.type === "flag") {
    const normalized = String(value)
      .toUpperCase()
      .trim();

    if (
      ["Y", "YES", "1", "TRUE"].includes(
        normalized,
      )
    ) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Enabled
        </span>
      );
    }

    if (
      ["N", "NO", "0", "FALSE"].includes(
        normalized,
      )
    ) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          Disabled
        </span>
      );
    }
  }

  if (field.type === "status") {
    const statusClass =
      statusColor?.(value) ||
      "bg-slate-100 text-slate-600";

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusClass}`}
      >
        {String(value)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 group">
      <span
        className={`text-xs text-[#0F172A] ${
          field.type === "id"
            ? "font-mono"
            : ""
        }`}
      >
        {String(value)}
      </span>

      {field.copyable && (
        <CopyButton value={value} />
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   KEY INFORMATION TILE
───────────────────────────────────────────────────────────── */

function KeyInfoTile({
  label,
  value,
  icon: Icon,
  copyable,
}) {
  return (
    <div className="group flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD]/30 transition-colors">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon
          size={13}
          className="text-[#0F6CBD]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wide text-[#64748B] mb-0.5">
          {label}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[#0F172A] truncate">
            {value ?? "—"}
          </span>

          {copyable && (
            <CopyButton value={value} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ACCORDION SECTION

   IMPORTANT:
   open + onToggle are controlled by the COLUMN that owns
   this accordion.

   Therefore:
   LEFT accordion -> only changes LEFT state
   RIGHT accordion -> only changes RIGHT state
───────────────────────────────────────────────────────────── */

function AccordionSection({
  group,
  record,
  open,
  onToggle,
}) {
  const filledCount = group.fields.filter(
    (field) =>
      record[field.key] !== null &&
      record[field.key] !== undefined &&
      record[field.key] !== "" &&
      record[field.key] !== "—",
  ).length;

  return (
    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white">
      {/* Accordion Header */}

      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <group.iconComponent
              size={13}
              className="text-[#0F6CBD]"
            />
          </div>

          <div className="text-left min-w-0">
            <div className="text-sm font-semibold text-[#0F172A]">
              {group.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[#64748B]">
            {filledCount} fields
          </span>

          <ChevronDown
            size={14}
            className={`text-[#64748B] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content */}

      {open && (
        <div className="px-4 pb-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 gap-3"
              >
                <span className="text-xs text-[#64748B] flex-shrink-0">
                  {field.label}
                </span>

                <div className="text-right min-w-0">
                  {renderFieldValue(
                    field,
                    record[field.key],
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */

export default function PartnerSetupDetailsPage({
  searchParams,
}) {
  const record = resolveRecord(searchParams);

  /* ─────────────────────────────────────────
     TAB STATE
  ───────────────────────────────────────── */

  const [activeTab, setActiveTab] =
    useState("overview");

  /* ─────────────────────────────────────────
     TWO INDEPENDENT ACCORDION STATES

     LEFT and RIGHT are completely independent.

     Opening something on LEFT does not change RIGHT.
  ───────────────────────────────────────── */

  const [openLeftGroupId, setOpenLeftGroupId] =
    useState("general");

  const [openRightGroupId, setOpenRightGroupId] =
    useState("source");

  /* ─────────────────────────────────────────
     CREATE GROUP LOOKUP
  ───────────────────────────────────────── */

  const groupsById = Object.fromEntries(
    PARTNER_SETUP_FIELD_GROUPS.map((group) => [
      group.id,
      {
        ...group,
        iconComponent:
          ICON_MAP[group.icon] || FileText,
      },
    ]),
  );

  /* ─────────────────────────────────────────
     ACTIVE TAB GROUPS
  ───────────────────────────────────────── */

  const activeGroups = (
    TAB_GROUP_MAP[activeTab] || []
  )
    .map((id) => groupsById[id])
    .filter(Boolean);

  /* ─────────────────────────────────────────
     SPLIT INTO TWO INDEPENDENT COLUMNS
  ───────────────────────────────────────── */

  const leftGroups = activeGroups.filter(
    (_, index) => index % 2 === 0,
  );

  const rightGroups = activeGroups.filter(
    (_, index) => index % 2 !== 0,
  );

  /* ─────────────────────────────────────────
     HERO FIELDS
  ───────────────────────────────────────── */

  const heroFields = [
    {
      label: "Partner ID",
      key: "partnerId",
    },
    {
      label: "Company Code",
      key: "coCd",
    },
    {
      label: "Partner Type",
      key: "partnerTypeCd",
    },
    {
      label: "Source System",
      key: "srceSysId",
    },
    {
      label: "Format ID",
      key: "formatId",
    },
    {
      label: "Communication ID",
      key: "commuId",
    },
  ];

  /* ─────────────────────────────────────────
     KEY INFORMATION TILES
  ───────────────────────────────────────── */

  const keyInfoTiles = [
    {
      label: "Partner ID",
      key: "partnerId",
      icon: Hash,
      copyable: true,
    },
    {
      label: "Company Code",
      key: "coCd",
      icon: Building2,
      copyable: true,
    },
    {
      label: "Partner Type",
      key: "partnerTypeCd",
      icon: Users,
    },
    {
      label: "Source System",
      key: "srceSysId",
      icon: Globe,
      copyable: true,
    },
    {
      label: "Format ID",
      key: "formatId",
      icon: FileText,
      copyable: true,
    },
    {
      label: "Communication ID",
      key: "commuId",
      icon: Settings,
      copyable: true,
    },
  ];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* ═══════════════════════════════════════
          MAIN
      ═══════════════════════════════════════ */}

      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* ─────────────────────────────────────
            TITLE
        ───────────────────────────────────── */}

        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              Selected Partner Setup
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              Partner Setup Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected
              partner setup record
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.close()}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#0033A0] rounded-md px-3 py-2 hover:bg-[#002580]"
            >
              <ArrowLeft size={13} />
              Close Tab
            </button>

            {/* <button
              type="button"
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] bg-white border border-[#0F6CBD]/30 rounded-md px-3 py-2 hover:bg-blue-50"
            >
              <Download size={13} />
              Export
            </button> */}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PARTNER HERO
        ═══════════════════════════════════════ */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          {/* Partner ID */}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2
                size={18}
                className="text-[#0033A0]"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                Partner
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {record.partnerId ?? "—"}
              </p>
            </div>
          </div>

          {/* Hero Fields */}

          {heroFields.slice(1).map((field) => (
            <div key={field.key}>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                {field.label}
              </p>

              <p className="text-sm font-medium text-[#0F172A]">
                {record[field.key] ?? "—"}
              </p>
            </div>
          ))}

          {/* Copy Partner ID */}

          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(
                  String(record.partnerId ?? ""),
                )
                .catch(() => {});
            }}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Copy size={12} />
            Copy Partner ID
          </button>
        </div>

        {/* ═══════════════════════════════════════
            KEY INFORMATION
        ═══════════════════════════════════════ */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {keyInfoTiles.map((tile) => (
            <KeyInfoTile
              key={tile.key}
              label={tile.label}
              value={record[tile.key]}
              icon={tile.icon}
              copyable={tile.copyable}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════
            TABS
        ═══════════════════════════════════════ */}

        <div className="flex gap-1 border-b border-[#E2E8F0] mb-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);

                const groups = (
                  TAB_GROUP_MAP[tab.id] || []
                )
                  .map(
                    (id) => groupsById[id],
                  )
                  .filter(Boolean);

                /*
                 * Reset LEFT column
                 */
                setOpenLeftGroupId(
                  groups[0]?.id ?? null,
                );

                /*
                 * Reset RIGHT column
                 */
                setOpenRightGroupId(
                  groups[1]?.id ?? null,
                );
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#0F6CBD] text-[#0F6CBD]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            CATEGORIES

            TWO COMPLETELY INDEPENDENT COLUMNS
        ═══════════════════════════════════════ */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ─────────────────────────────────────
              LEFT COLUMN
          ───────────────────────────────────── */}

          <div className="flex flex-col gap-2">
            {leftGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={record}
                open={
                  openLeftGroupId === group.id
                }
                onToggle={() => {
                  setOpenLeftGroupId(
                    (currentId) =>
                      currentId === group.id
                        ? null
                        : group.id,
                  );
                }}
              />
            ))}
          </div>

          {/* ─────────────────────────────────────
              RIGHT COLUMN
          ───────────────────────────────────── */}

          <div className="flex flex-col gap-2">
            {rightGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={record}
                open={
                  openRightGroupId ===
                  group.id
                }
                onToggle={() => {
                  setOpenRightGroupId(
                    (currentId) =>
                      currentId === group.id
                        ? null
                        : group.id,
                  );
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}