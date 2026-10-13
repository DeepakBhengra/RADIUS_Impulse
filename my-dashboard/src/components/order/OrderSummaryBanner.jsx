import {
  FileText,
  Hash,
  CalendarDays,
  Flag,
  CircleCheck,
  Building2,
} from "lucide-react";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

// Returns null for missing/placeholder values so || fallbacks work correctly.
// mapOrderResponse stores "—" for null backend fields; treat it the same as null.
function val(v) {
  return v == null || v === "—" ? null : v;
}

function firstValue(order, keys) {
  for (const key of keys) {
    const candidate = val(order?.[key]);
    if (candidate != null) return candidate;
  }
  return null;
}

function OrderSummaryBanner({ order }) {
  const tiles = [
    {
      key: "custPo",
      label: "Customer PO",
      value: firstValue(order, ["custOrdrNbr", "custPoNbr"]) ?? "—",
      icon: FileText,
    },
    {
      key: "custBr",
      label: "Branch Number",
      value: val(order?.custBr) ?? "—",
      icon: Building2,
    },
    {
      key: "orderNo",
      label: "Order Number",
      value: firstValue(order, ["ordrNbr", "imiAsgdOrdrNbr"]) ?? "—",
      icon: Hash,
    },
    
    {
      key: "custPoDate",
      label: "Customer PO Date",
      value: firstValue(order, ["custPoDt", "entyDt"])
        ? formatDateTime(firstValue(order, ["custPoDt", "entyDt"]))
        : "—",
      icon: CalendarDays,
    },
    {
      key: "country",
      label: "Country Code",
      value: firstValue(order, ["custCoCd", "companyCd", "countryCode"]) ?? "—",
      icon: Flag,
    },
    {
      key: "orderSource",
      label: "Order Source",
      value: val(order?.termId) ?? "—",
      icon: FileText,
    },
    {
      key: "status",
      label: "Status",
      value: firstValue(order, ["ordSt", "ordrStatus"]) ?? "Found",
      icon: CircleCheck,
      isStatus: true,
    },
  ];

  return (
  <div className="enterprise-card border border-[#D6E4F7] rounded-xl shadow-sm bg-white overflow-hidden">
    <div className="grid grid-cols-[1.5fr_1.4fr_1.1fr_1.6fr_1fr_1.2fr_1fr] divide-x divide-[#D6E4F7]">

      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <div
            key={tile.key}
            className="flex items-center gap-2 px-3 py-2 min-w-0"
          >
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#EEF6FF]">
              <Icon
                size={12}
                strokeWidth={2}
                className="text-[#0F6CBD]"
              />
            </div>

            <div className="flex-1 min-w-0">

              <div className="text-[9px] uppercase font-semibold tracking-wide text-slate-500 leading-none">
                {tile.label}
              </div>

              <div className="mt-0.5">
                {tile.isStatus ? (
                  <Badge
                    color="green"
                    className="text-[9px] px-2 py-0"
                  >
                    {tile.value}
                  </Badge>
                ) : (
                  <div className="truncate text-[15px] font-semibold text-slate-900">
                    {tile.value}
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}

    </div>
  </div>
);
}

export default OrderSummaryBanner;
