/**
 * HeaderDrawer.jsx
 *
 * Right-side slide-over drawer that shows ALL order header fields
 * organised into 8 accordion groups with live search.
 *
 * Props
 * -----
 * open       – boolean
 * onClose    – () => void
 * order      – order data object
 * totalFields – number of populated fields (shown in header)
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  User,
  Users,
  Truck,
  DollarSign,
  Settings,
  Flag,
  UserCheck,
  Cpu,
  Shield,
  CreditCard,
  AlertCircle,
  ToggleLeft,
  MapPin,
  Globe,
  Flag,
} from "lucide-react";
import { FIELD_GROUPS, ORDER_STATUS_MAP, HOLD_CODE_MAP } from "./fieldConfig";
import { formatDateTime } from "../../../utils/format";

// ─── Icon map (string key → component) ───────────────────────────────────────
// import {
//    CreditCard, Shield, UserCheck, DollarSign,
//   ToggleLeft, MapPin, FileText, Globe, User, Flag, Building2,
// } from "lucide-react";

const ICON_MAP = {
  Hash,
  CreditCard,
  Truck,
  Shield,
  UserCheck,
  DollarSign,
  ToggleLeft,
  MapPin,
  FileText,
  Globe,
  User,
  Flag,
  Building2,
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(() => {
    navigator.clipboard?.writeText(String(value ?? "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={handle}
      aria-label="Copy to clipboard"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded
        text-[#6B7280] hover:text-[#0F6CBD] hover:bg-[#EFF6FF] focus:opacity-100 focus:outline-none
        focus:ring-2 focus:ring-blue-400"
    >
      {copied ? (
        <Check size={11} className="text-green-500" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

// ─── Value renderers ──────────────────────────────────────────────────────────
function StatusBadge({ value }) {
  if (!value) return <span className="text-gray-300">—</span>;
  const key = String(value).toLowerCase();
  const cfg = ORDER_STATUS_MAP[key] ?? ORDER_STATUS_MAP[value] ?? null;
  if (!cfg) return <span className="font-medium text-gray-700">{value}</span>;

  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50  text-blue-700  border-blue-200",
    red: "bg-red-50   text-red-700   border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-[#F8FAFC]  text-[#6B7280]  border-[#D6E4F7]",
  };
  const dots = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    gray: "bg-gray-400",
  };
  const c = cfg.color;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[c]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[c]}`} />
      {cfg.label}
    </span>
  );
}

function HoldBadge({ value }) {
  if (!value || value === "N" || value === "0" || value === "") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Clear
      </span>
    );
  }
  const desc = HOLD_CODE_MAP[value];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <AlertCircle size={9} />
      {desc ? `${desc} (${value})` : `On Hold (${value})`}
    </span>
  );
}

function FlagBadge({ value }) {
  if (value === "Y" || value === true || value === "1") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Enabled
      </span>
    );
  }
  if (value === "N" || value === false || value === "0") {
    return (
      <span className="text-[10px] font-medium text-[#6B7280]">Disabled</span>
    );
  }
  return <span className="text-xs text-[#6B7280]">{String(value ?? "—")}</span>;
}

function FieldValue({ type, value, copyable }) {
  const empty = value == null || value === "";

  if (empty) return <span className="text-gray-300 text-xs">—</span>;

  const text = (() => {
    switch (type) {
      case "date":
        return formatDateTime(value);
      case "currency":
        return typeof value === "number"
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value)
          : value;
      case "number":
        return String(value);
      default:
        return String(value);
    }
  })();

  if (type === "status") return <StatusBadge value={value} />;
  if (type === "hold") return <HoldBadge value={value} />;
  if (type === "flag") return <FlagBadge value={value} />;

  return (
    <span className="flex items-center gap-1 group">
      <span
        className={`text-xs field-value ${type === "id" ? "font-mono" : ""}`}
      >
        {text}
      </span>
      {copyable && <CopyBtn value={text} />}
    </span>
  );
}

// ─── Single drawer field row ──────────────────────────────────────────────────
function DrawerField({ field, value, highlight }) {
  const labelEl = highlight
    ? (() => {
        const parts = field.label.split(new RegExp(`(${highlight})`, "gi"));
        return parts.map((p, i) =>
          p.toLowerCase() === highlight.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5"
            >
              {p}
            </mark>
          ) : (
            p
          ),
        );
      })()
    : field.label;

  return (
    <div className="group flex items-start justify-between py-2.5 border-b border-[#D6E4F7] last:border-0 gap-3">
      <span className="field-label text-[11px] min-w-[140px] leading-tight pt-0.5">
        {labelEl}
      </span>
      <div className="flex-1 text-right">
        <FieldValue type={field.type} value={value} copyable={field.copyable} />
      </div>
    </div>
  );
}

// ─── Single accordion group ───────────────────────────────────────────────────
function AccordionGroup({ group, order, searchQuery, forceOpen }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false);
  const Icon = ICON_MAP[group.icon] ?? ShoppingCart;

  // Collect visible (non-empty) fields
  const visibleFields = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return group.fields.filter((f) => {
      const hasValue = order[f.key] != null && order[f.key] !== "";
      if (!q) return hasValue;
      return (
        f.label.toLowerCase().includes(q) ||
        String(order[f.key] ?? "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [group.fields, order, searchQuery]);

  // Auto-open when search matches
  const shouldOpen =
    forceOpen || (searchQuery && visibleFields.length > 0) || open;

  if (searchQuery && visibleFields.length === 0) return null;

  const filledCount = group.fields.filter(
    (f) => order[f.key] != null && order[f.key] !== "",
  ).length;

  return (
    <div
      className={`border border-[#D6E4F7] rounded-xl overflow-hidden mb-2 ${group.technical ? "border-l-2 border-l-orange-300" : ""}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors group"
        aria-expanded={shouldOpen}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-md ${group.technical ? "bg-orange-100" : "bg-blue-50"}`}
          >
            <Icon
              size={13}
              className={group.technical ? "text-orange-500" : "text-blue-600"}
            />
          </div>
          <span className="text-xs font-semibold text-[#0F6CBD]">
            {group.label}
          </span>
          {group.technical && (
            <span className="text-[9px] uppercase tracking-wide font-bold text-orange-500 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
              Technical
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6B7280] tabular-nums">
            {filledCount} fields
          </span>
          {shouldOpen ? (
            <ChevronDown
              size={14}
              className="text-[#6B7280] transition-transform"
            />
          ) : (
            <ChevronRight
              size={14}
              className="text-[#6B7280] transition-transform"
            />
          )}
        </div>
      </button>

      {shouldOpen && (
        <div className="px-4 bg-white animate-in slide-in-from-top-1 duration-150">
          {visibleFields.length === 0 ? (
            <p className="py-4 text-xs text-[#6B7280] text-center">
              No data available for this section.
            </p>
          ) : (
            visibleFields.map((field) => (
              <DrawerField
                key={field.key}
                field={field}
                value={order[field.key]}
                highlight={searchQuery}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export default function HeaderDrawer({ open, onClose, order, totalFields }) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const drawerRef = useRef(null);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 150);
    } else {
      setSearch("");
    }
  }, [open]);

  // Keyboard: Escape → close
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // Trap scroll behind when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const matchCount = useMemo(() => {
    if (!search) return 0;
    const q = search.toLowerCase();
    return FIELD_GROUPS.flatMap((g) => g.fields).filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        String(order?.[f.key] ?? "")
          .toLowerCase()
          .includes(q),
    ).length;
  }, [search, order]);

  if (!open && !order) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Order Header Details"
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-[500px] bg-white shadow-2xl
          flex flex-col transform transition-transform duration-250 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Sticky header */}
        <div className="flex-shrink-0 border-b border-[#D6E4F7]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F6CBD]">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Order Header Details
              </h2>
              <p className="text-[10px] text-blue-200 mt-0.5">
                {totalFields} fields populated
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 bg-[#F8FAFC]">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-2.5 text-[#6B7280]"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search header fields… (e.g. hold, partner, ship)"
                className="w-full pl-8 pr-9 py-2 text-xs border border-[#D6E4F7] rounded-xl bg-white text-[#1F2937]
                  focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] focus:border-transparent
                  placeholder-[#6B7280]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2 text-[#6B7280] hover:text-[#1F2937] p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {search && (
              <p className="mt-1.5 text-[10px] text-[#6B7280]">
                {matchCount > 0 ? (
                  <>
                    <span className="font-semibold text-[#0F6CBD]">
                      {matchCount}
                    </span>{" "}
                    field{matchCount !== 1 ? "s" : ""} matching{" "}
                    <span className="font-medium">"{search}"</span>
                  </>
                ) : (
                  <span className="text-amber-600">
                    No fields match "{search}"
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {FIELD_GROUPS.map((group) => (
            <AccordionGroup
              key={group.id}
              group={group}
              order={order ?? {}}
              searchQuery={search}
              forceOpen={false}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#D6E4F7] px-5 py-3 bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[10px] text-[#6B7280]">
            Showing all available fields for this order
          </span>
          <button
            onClick={onClose}
            className="text-xs text-[#6B7280] hover:text-[#1F2937] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
