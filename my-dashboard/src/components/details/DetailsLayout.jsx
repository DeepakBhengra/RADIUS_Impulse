import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

export function SummaryTile({ label, value, icon: Icon }) {
  return (
    <div className="enterprise-card h-full p-4 md:p-5 flex items-start gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[#2563EB]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="field-label text-[10px] uppercase tracking-wide">{label}</div>
        <div className="field-value mt-1 text-lg font-bold text-black leading-tight break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

export function DetailFieldRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(180px,38%)_1fr] py-3 border-b border-[#DBEAFE] last:border-0">
      <span className="field-label text-xs leading-snug">{label}</span>
      <div className="field-value text-xs break-words">{value}</div>
    </div>
  );
}

export function AccordionCard({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="enterprise-card h-full p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#DBEAFE] bg-[#F8FAFC] hover:bg-[#EFF6FF]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-[#2563EB]" />
            </div>
          )}
          <span className="text-sm font-semibold text-[#1D4ED8] truncate">{title}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[#6B7280] transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function formatDetailValue(field, rawValue) {
  if (rawValue == null || rawValue === "") {
    return <span className="text-[#6B7280]">—</span>;
  }

  if (field.type === "flag") {
    const asString = String(rawValue).toUpperCase();
    if (["Y", "1", "TRUE", "YES"].includes(asString)) {
      return <Badge color="green">Enabled</Badge>;
    }
    if (["N", "0", "FALSE", "NO"].includes(asString)) {
      return <Badge color="gray">Disabled</Badge>;
    }
  }

  const formatted = field.type === "date" ? formatDateTime(rawValue) : String(rawValue);
  return <span className={`field-value text-xs ${field.type === "id" ? "font-mono" : ""}`}>{formatted}</span>;
}

export function buildSummaryTiles(summaryFields, iconMap, data) {
  return summaryFields.map((field) => ({
    ...field,
    icon: field.icon ? iconMap[field.icon] : undefined,
    value: data?.[field.key],
  }));
}

export function AccordionSection({ group, data, renderValue }) {
  return (
    <AccordionCard title={group.label} icon={group.iconComponent} defaultOpen={group.defaultOpen}>
      <div>
        {group.fields.map((field) => (
          <DetailFieldRow key={field.key} label={field.label} value={renderValue(field, data?.[field.key], data)} />
        ))}
      </div>
    </AccordionCard>
  );
}
