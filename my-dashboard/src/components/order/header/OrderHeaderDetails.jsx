import { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Hash,
  User,
  Building2,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  Truck,
  Copy,
  Check,
  Globe,
  Flag,
  Briefcase,
  UserCheck,
  Shield,
  Settings,
  KeyRound,
  Cpu,
  CreditCard,
  MapPin,
  ToggleLeft,
  Info,
} from "lucide-react";

import { SUMMARY_FIELDS, ORDER_STATUS_MAP, HOLD_CODE_MAP } from "./fieldConfig";

import { formatDateTime } from "../../../utils/format";
import SectionCard from "../../common/SectionCard";
import { openOrderHeaderDetailsTab } from "../../../utils/detailsNavigation";

const ICON_MAP = {
  FileText,
  Hash,
  User,
  Building2,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  Truck,
  Globe,
  Flag,
  Briefcase,
  UserCheck,
  Shield,
  Settings,
  KeyRound,
  Cpu,
  CreditCard,
  MapPin,
  ToggleLeft,
};

function StatusBadge({ value }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-300 text-xs">—</span>;
  }

  const key = String(value).toLowerCase();

  const config =
    ORDER_STATUS_MAP[key] ?? ORDER_STATUS_MAP[String(value)] ?? null;

  if (!config) {
    return (
      <span className="text-xs font-medium text-[#0F172A]">
        {String(value)}
      </span>
    );
  }

  const styles = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const dots = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    gray: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${styles[config.color]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[config.color]}`} />
      {config.label}
    </span>
  );
}

function HoldBadge({ value }) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "N" ||
    value === "0"
  ) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Clear
      </span>
    );
  }

  const description = HOLD_CODE_MAP[value];

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <AlertCircle size={9} />
      {description ? `${description} (${value})` : `On Hold (${value})`}
    </span>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (event) => {
      event.stopPropagation();

      navigator.clipboard?.writeText(String(value ?? "")).catch(() => {});

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    },
    [value],
  );

  if (value === null || value === undefined || value === "" || value === "—") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy value"
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded text-gray-400 hover:text-[#0F6CBD] hover:bg-blue-50"
    >
      {copied ? (
        <Check size={11} className="text-green-500" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

function FlagValue({ value }) {
  const normalized = String(value ?? "").toUpperCase();

  if (
    normalized === "Y" ||
    normalized === "1" ||
    normalized === "TRUE" ||
    normalized === "YES"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (
    normalized === "N" ||
    normalized === "0" ||
    normalized === "FALSE" ||
    normalized === "NO"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return <span className="text-xs text-[#0F172A]">{String(value)}</span>;
}

function renderValue(field, value) {
  if (value === null || value === undefined || value === "" || value === "—") {
    return <span className="text-gray-300 text-xs">—</span>;
  }

  if (field.type === "status") {
    return <StatusBadge value={value} />;
  }

  if (field.type === "hold") {
    return <HoldBadge value={value} />;
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
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return <span className="text-xs text-[#0F172A]">{String(value)}</span>;
    }

    return (
      <span className="text-xs font-medium text-[#0F172A]">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(numberValue)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 min-w-0 group">
      <span
        className={`text-xs text-[#0F172A] ${
          field.type === "id" ? "font-mono" : ""
        } truncate`}
      >
        {String(value)}
      </span>

      {field.copyable && <CopyButton value={value} />}
    </span>
  );
}

function SummaryField({ field, value }) {
  const Icon = ICON_MAP[field.icon] ?? FileText;

  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl bg-white border border-[#DBEAFE] hover:border-[#93C5FD] hover:shadow-sm transition-all">
      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#0F6CBD]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-[#64748B] mb-1">
          {field.label}
        </p>

        <div className="min-h-[18px]">{renderValue(field, value)}</div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="enterprise-card p-5">
      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function ErrorCard({ message }) {
  return (
    <div className="enterprise-card border-red-200 p-8 flex flex-col items-center text-center">
      <AlertCircle size={28} className="text-red-400 mb-2" />

      <p className="text-sm font-semibold text-red-700">
        Failed to load order details
      </p>

      <p className="text-xs text-[#6B7280] mt-1">
        {message || "An unexpected error occurred."}
      </p>
    </div>
  );
}

export default function OrderHeaderDetails({
  order,
  loading = false,
  error = null,
}) {
  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  if (!order) {
    return null;
  }

  return (
    <SectionCard
      icon={FileText}
      title="Order Header Details"
      footer={
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#F8FAFC]">
          <Info size={11} className="text-[#64748B]" />
          <span className="text-[10px] text-[#64748B]">
            Select the header card to open the complete order details.
          </span>
        </div>
      }
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => openOrderHeaderDetailsTab(order)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openOrderHeaderDetailsTab(order);
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 cursor-pointer"
      >
        {SUMMARY_FIELDS.map((field) => (
          <SummaryField
            key={field.key}
            field={field}
            value={order[field.key]}
          />
        ))}
      </div>
    </SectionCard>
  );
}
