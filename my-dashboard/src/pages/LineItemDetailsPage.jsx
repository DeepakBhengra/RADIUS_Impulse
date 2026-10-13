import { useState } from "react";
import {
  ArrowLeft,
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  FileText,
  Receipt,
  ArrowRightLeft,
  User,
  Check,
  Copy,
  ChevronDown,
  ShoppingCart,
  Globe,
  Settings,
  Tag,
  Layers,
  Users,
  Shield,
} from "lucide-react";
import { LINE_ITEM_FIELD_GROUPS } from "../components/order/lineitem/lineItemFieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDetailValue } from "../components/details/DetailsLayout";

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
  FileText,
  Receipt,
  ArrowRightLeft,
  User,
  Settings,
  Tag,
  Layers,
  Users,
  Shield,
  ShoppingCart,
  Globe,
};

const TAB_GROUP_MAP = {
  business: ["identity", "part", "quantities", "routing"],
  financial: ["pricing", "taxes", "promotion"],
  shipping: ["dates", "warehouse"],
  miscellaneous: ["configuration", "acop", "allocation", "flags", "advanced"],
};

const TABS = [
  { id: "business", label: "Business", icon: ShoppingCart },
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "miscellaneous", label: "Miscellaneous", icon: Settings },
];

const KEY_INFO_FIELDS = [
  { key: "lineNbr", label: "Line Number", icon: "Hash", type: "id", copyable: true },
  { key: "imPartNbr", label: "Item Number", icon: "Package", type: "id", copyable: true },
  { key: "vendPartNbr", label: "Vendor Part Number", icon: "Package", type: "id", copyable: true },
  { key: "vendNbr", label: "Vendor Number", icon: "Building2", type: "id", copyable: true },
  { key: "qtyOrded", label: "Qty Ordered", icon: "BarChart2", type: "number" },
  { key: "qtyShpd", label: "Qty Shipped", icon: "Truck", type: "number" },
  { key: "unitPrc", label: "Unit Price", icon: "DollarSign", type: "number" },
  { key: "unitCost", label: "Unit Cost", icon: "DollarSign", type: "number" },
];

function parseFallbackFromParams(searchParams) {
  return {
    lineNbr: searchParams.get("lineNbr") || "—",
    companyCd: searchParams.get("companyCd") || "—",
    branchNbr: searchParams.get("branchNbr") || "—",
    ordrNbr: searchParams.get("ordrNbr") || "—",
    imPartNbr: "—",
    vendPartNbr: "—",
    vendNbr: "—",
    qtyOrded: "—",
    qtyShpd: "—",
    unitPrc: "—",
    unitCost: "—",
  };
}

function resolveLineItem(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "line-item");
  return stored || parseFallbackFromParams(searchParams);
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (value == null || value === "" || value === "—") return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        navigator.clipboard?.writeText(String(value)).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
    </button>
  );
}

function KeyInfoTile({ field, value }) {
  const Icon = ICON_MAP[field.icon] || FileText;

  return (
    <div className="group flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD]/30 transition-colors">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-[#0F6CBD]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wide text-[#64748B] mb-0.5">{field.label}</p>
        <div className="flex items-center gap-1">
          <div className="min-w-0 text-sm font-bold text-black truncate">
            {formatDetailValue(field, value)}
          </div>
          {field.copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0F172A]">{value || "—"}</p>
    </div>
  );
}

function FlagValue({ value }) {
  const normalized = String(value ?? "").toUpperCase();

  if (["Y", "1", "TRUE", "YES"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (["N", "0", "FALSE", "NO", ""].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return <span className="text-xs text-[#0F172A]">{value}</span>;
}

function renderFieldValue(field, value) {
  if (value == null || value === "") {
    return <span className="text-slate-300 text-xs">—</span>;
  }

  if (field.type === "flag") {
    return <FlagValue value={value} />;
  }

  if (field.type === "date") {
    return <span className="text-xs text-[#0F172A]">{formatDetailValue(field, value)}</span>;
  }

  if (field.type === "number") {
    return <span className="text-xs text-[#0F172A]">{value}</span>;
  }

  return (
    <span className="flex items-center gap-1 group">
      <span className={`text-xs text-[#0F172A] ${field.type === "id" ? "font-mono" : ""}`}>
        {String(value)}
      </span>

      {field.copyable && <CopyButton value={value} />}
    </span>
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

export default function LineItemDetailsPage({ searchParams }) {
  const item = resolveLineItem(searchParams);

  const [activeTab, setActiveTab] = useState("business");
  const [openLeftGroupId, setOpenLeftGroupId] = useState("identity");
  const [openRightGroupId, setOpenRightGroupId] = useState("part");

  const groupsById = Object.fromEntries(
    LINE_ITEM_FIELD_GROUPS.map((group) => [
      group.id,
      {
        ...group,
        iconComponent: ICON_MAP[group.icon] || FileText,
      },
    ]),
  );

  const activeGroups = (TAB_GROUP_MAP[activeTab] || [])
    .map((id) => groupsById[id])
    .filter(Boolean);

  const leftGroups = activeGroups.filter((_, index) => index % 2 === 0);
  const rightGroups = activeGroups.filter((_, index) => index % 2 !== 0);

  const keyInfoTiles = KEY_INFO_FIELDS.map((field) => ({
    ...field,
    value: item[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              Selected Line Item Details
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              Line Item Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected line item record
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

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] px-5 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package size={18} className="text-[#0033A0]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                Line Item
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {item.lineNbr ?? "—"}
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-[#DBEAFE] sm:block" />

          <HeroStat label="ORDER_NBR" value={item.ordrNbr} />
          <HeroStat label="COMPANY_CD" value={item.companyCd} />
          <HeroStat label="BRANCH_NBR" value={item.branchNbr} />
          <HeroStat label="LINE_TYP" value={item.lineTyp} />
          <HeroStat label="LINE_STUS" value={item.lineStus} />

          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(String(item.lineNbr ?? ""))
                .catch(() => {});
            }}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Copy size={12} />
            Copy Line ID
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
          {keyInfoTiles.map((tile) => (
            <KeyInfoTile key={tile.key} field={tile} value={tile.value} />
          ))}
        </div>

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

                setOpenLeftGroupId(groups[0]?.id ?? null);
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            {leftGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={item}
                open={openLeftGroupId === group.id}
                onToggle={() => {
                  setOpenLeftGroupId((currentId) =>
                    currentId === group.id ? null : group.id,
                  );
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {rightGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={item}
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
