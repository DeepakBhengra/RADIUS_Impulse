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
  FileText,
  Building2,
  CreditCard,
  Globe,
  DollarSign,
  MapPin,
  Flag,
  Briefcase,
  UserCheck,
  UserCircle,
  Shield,
  KeyRound,
  ToggleLeft,
  Cpu,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Download,
  ChevronRight,
  User,
  Users,
  ShoppingCart,
  Truck,
  File,
  Info,
} from "lucide-react";

import {
  FIELD_GROUPS,
} from "../components/order/header/fieldConfig";

import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const ICON_MAP = {
  Hash,
  FileText,
  Building2,
  CreditCard,
  Globe,
  DollarSign,
  MapPin,
  Flag,
  Briefcase,
  UserCheck,
  UserCircle,
  Shield,
  KeyRound,
  ToggleLeft,
  Cpu,
  User,
  Users,
  ShoppingCart,
  Truck,
};

// ─────────────────────────────────────────────────────────────
// Tab grouping
// Reuses existing FIELD_GROUPS entries.
// No fields are added, removed, or renamed.
// ─────────────────────────────────────────────────────────────

const TAB_GROUP_MAP = {
  business: [
    "orderInfo",
    "customerInfo",
    "endUserInfo",
    "endCustomerInfo",
    "salesInfo",
    "resellerInfo",
  ],

  financial: ["billingInfo", "financialInfo"],

  shipping: ["shippingInfo"],

  governmentInfo: [
    "governmentInfo",
    "orderFlags",
    "configuration",
    "authorization",
    "processingInfo",
  ],

  miscellaneous: ["miscellaneous"],
};

const TABS = [
  {
    id: "business",
    label: "Business",
    icon: ShoppingCart,
  },
  {
    id: "financial",
    label: "Financial",
    icon: DollarSign,
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
  },
  {
    id: "governmentInfo",
    label: "Compliance",
    icon: File,
  },
  {
    id: "miscellaneous",
    label: "Miscellaneous",
    icon: Info,
  },
];

// ─────────────────────────────────────────────────────────────
// Fallback record
// ─────────────────────────────────────────────────────────────

function parseFallbackFromParams(searchParams) {
  return {
    custOrdrNbr: searchParams.get("custOrdrNbr") || null,
    branchNbr: searchParams.get("branchNbr") || null,
    ordrNbr: searchParams.get("ordrNbr") || null,
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");

  const stored = loadDetailsRecord(ref, "order-header");

  return stored || parseFallbackFromParams(searchParams);
}

// ─────────────────────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (value == null || value === "" || value === "—") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();

        navigator.clipboard?.writeText(String(value)).catch(() => {});

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? (
        <Check size={11} className="text-green-600" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Flag Value
// ─────────────────────────────────────────────────────────────

function FlagValue({ value }) {
  const v = String(value ?? "").toUpperCase();

  if (["Y", "1", "TRUE", "YES"].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (["N", "0", "FALSE", "NO", ""].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return <span className="text-xs text-[#0F172A]">{value}</span>;
}

// ─────────────────────────────────────────────────────────────
// Field Value Renderer
// ─────────────────────────────────────────────────────────────

function renderFieldValue(field, value) {
  if (value == null || value === "") {
    return <span className="text-slate-300 text-xs">—</span>;
  }

  if (field.type === "flag") {
    return <FlagValue value={value} />;
  }

  if (field.type === "date") {
    return (
      <span className="text-xs text-[#0F172A]">{formatDateTime(value)}</span>
    );
  }

  if (field.type === "currency") {
    const num = Number(value);

    return (
      <span className="text-xs text-[#0F172A]">
        {Number.isNaN(num)
          ? String(value)
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 group">
      <span
        className={`text-xs text-[#0F172A] ${
          field.type === "id" ? "font-mono" : ""
        }`}
      >
        {String(value)}
      </span>

      {field.copyable && <CopyButton value={value} />}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Key Information Tile
// ─────────────────────────────────────────────────────────────

function KeyInfoTile({ label, value, icon: Icon, copyable }) {
  return (
    <div className="group flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD]/30 transition-colors">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-[#0F6CBD]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wide text-[#64748B] mb-0.5">
          {label}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[#0F172A] truncate">
            {value ?? "—"}
          </span>

          {copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Accordion Section
// ─────────────────────────────────────────────────────────────

function AccordionSection({ group, record, open, onToggle }) {
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
            <group.iconComponent size={13} className="text-[#0F6CBD]" />
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

                <div className="text-right">
                  {renderFieldValue(field, record[field.key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function OrderHeaderDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);

  // ─────────────────────────────────────────
  // Tab state
  // ─────────────────────────────────────────

  const [activeTab, setActiveTab] = useState("business");

  // ─────────────────────────────────────────
  // TWO INDEPENDENT ACCORDION STATES
  // ─────────────────────────────────────────

  const [openLeftGroupId, setOpenLeftGroupId] = useState("orderInfo");

  const [openRightGroupId, setOpenRightGroupId] = useState("customerInfo");

  // ─────────────────────────────────────────
  // Create group lookup
  // ─────────────────────────────────────────

  const groupsById = Object.fromEntries(
    FIELD_GROUPS.map((g) => [
      g.id,
      {
        ...g,
        iconComponent: ICON_MAP[g.icon] || FileText,
      },
    ]),
  );

  // ─────────────────────────────────────────
  // Get groups for active tab
  // ─────────────────────────────────────────

  const activeGroups = (TAB_GROUP_MAP[activeTab] || [])
    .map((id) => groupsById[id])
    .filter(Boolean);

  // ─────────────────────────────────────────
  // Split groups into TWO columns
  // ─────────────────────────────────────────

  const leftGroups = activeGroups.filter((_, index) => index % 2 === 0);

  const rightGroups = activeGroups.filter((_, index) => index % 2 !== 0);

  // ─────────────────────────────────────────
  // Hero fields
  // ─────────────────────────────────────────

  const heroFields = [
    {
      label: "Order Number",
      key: "imiAsgdOrdrNbr",
    },
    {
      label: "Customer Order Number",
      key: "billToCustNbr",
    },
    {
      label: "Company Code",
      key: "custCoCd",
    },
    {
      label: "Branch Number",
      key: "custBr",
    },
    {
      label: "Terminal / Source",
      key: "termId",
    },
    {
      label: "Entry Date",
      key: "entyDt",
      date: true,
    },
  ];

  // ─────────────────────────────────────────
  // Key information tiles
  // ─────────────────────────────────────────

  const keyInfoTiles = [
    {
      label: "Customer PO Number",
      key: "custPoNbr",
      icon: FileText,
      copyable: true,
    },
    // {
    //   label: "Company Code",
    //   key: "custCoCd",
    //   icon: Building2,
    // },
    {
      label: "Branch Number",
      key: "custBr",
      icon: Building2,
    },
    {
      label: "Bill-To Customer",
      key: "billToCustNbr",
      icon: CreditCard,
      copyable: true,
    },
    {
      label: "Currency",
      key: "ordrCcyCd",
      icon: DollarSign,
    },
    {
      label: "Terms",
      key: "terms",
      icon: DollarSign,
    },
    // {
    //   label: "Country",
    //   key: "custCoCd",
    //   icon: MapPin,
    // },
    {
      label: "Priority Code",
      key: "priorityCode",
      icon: Flag,
    },
  ];

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* ═══════════════════════════════════════
          TOP HEADER
      ═══════════════════════════════════════ */}

      {/* <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-4 sticky top-0 z-20">
        <button
          type="button"
          onClick={() => window.close()}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] flex-shrink-0"
        >
          <ArrowLeft size={15} />
          Orders
        </button>

        <div className="flex-1 max-w-md mx-auto relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-[#64748B]"
          />

          <input
            disabled
            placeholder="Search orders, SKU, accounts, partners..."
            className="w-full pl-8 pr-14 py-2 text-xs border border-[#E2E8F0] rounded-md bg-slate-50 text-[#64748B] cursor-not-allowed"
          />

          <span className="absolute right-2 top-1.5 text-[9px] text-[#94A3B8] border border-[#E2E8F0] rounded px-1 py-0.5">
            Ctrl K
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <Bell size={16} className="text-[#64748B]" />

          <HelpCircle size={16} className="text-[#64748B]" />

          <div className="w-7 h-7 rounded-full bg-[#0033A0] text-white text-[10px] font-semibold flex items-center justify-center">
            {(record.userNam || "U").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header> */}

      {/* ═══════════════════════════════════════
          MAIN
      ═══════════════════════════════════════ */}

      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* Breadcrumb + title */}

        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            {/* <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
              <span>Orders</span>

              <ChevronRight size={11} />

              <span>Order Details</span>

              <ChevronRight size={11} />

              <span className="text-[#0F6CBD] font-medium">Order Header</span>
            </div> */}
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              Selected Header Details
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              Order Header Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected order header record
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
          </div>
        </div>

        {/* ═══════════════════════════════════════
            ORDER HERO
        ═══════════════════════════════════════ */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] px-5 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={18} className="text-[#0033A0]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                Order
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {record.imiAsgdOrdrNbr ?? "—"}
              </p>
            </div>
          </div>

          {heroFields.slice(1).map((f) => (
            <div key={f.key}>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                {f.label}
              </p>

              <p className="text-sm font-medium text-[#0F172A]">
                {f.date && record[f.key]
                  ? formatDateTime(record[f.key])
                  : (record[f.key] ?? "—")}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(String(record.ordrNbr ?? ""))
                .catch(() => {});
            }}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Copy size={12} />
            Copy Order ID
          </button>
        </div>

        {/* ═══════════════════════════════════════
            KEY INFORMATION
        ═══════════════════════════════════════ */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
          {keyInfoTiles.map((t) => (
            <KeyInfoTile
              key={t.key}
              label={t.label}
              value={record[t.key]}
              icon={t.icon}
              copyable={t.copyable}
            />
          ))}
        </div>

        <div className="text-center mb-4" />

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

                const groups = (TAB_GROUP_MAP[tab.id] || [])
                  .map((id) => groupsById[id])
                  .filter(Boolean);

                // First group in LEFT
                setOpenLeftGroupId(groups[0]?.id ?? null);

                // First group in RIGHT
                setOpenRightGroupId(groups[1]?.id ?? null);
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
            TWO INDEPENDENT COLUMNS
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
                open={openLeftGroupId === group.id}
                onToggle={() => {
                  setOpenLeftGroupId((currentId) =>
                    currentId === group.id ? null : group.id,
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
                open={openRightGroupId === group.id}
                onToggle={() => {
                  setOpenRightGroupId((currentId) =>
                    currentId === group.id ? null : group.id,
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
