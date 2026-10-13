import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Users,
  Settings,
  Truck,
  ShoppingCart,
  BarChart2,
  Shield,
  Layers,
  FileText,
  Check,
  Copy,
  Hash,
  ChevronDown,
} from "lucide-react";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDetailValue } from "../components/details/DetailsLayout";

const FIELD_GROUPS = [
  {
    id: "identity",
    label: "Identity",
    icon: Users,
    defaultOpen: true,
    fields: [
      { key: "coCd", label: "CO_CD", type: "text" },
      { key: "partnerId", label: "PARTNER_ID", type: "text" },
      { key: "custPrty", label: "CUST_PRTY", type: "text" },
      { key: "dfltCustNbr", label: "DFLT_CUST_NBR", type: "text" },
      { key: "promoCustNbr", label: "PROMO_CUST_NBR", type: "text" },
      { key: "priceCustNbr", label: "PRICE_CUST_NBR", type: "text" },
      { key: "rsrvCustNbr", label: "RSRV_CUST_NBR", type: "text" },
    ],
  },
  {
    id: "timing",
    label: "Timing & Schedule",
    icon: Clock,
    defaultOpen: true,
    fields: [
      { key: "skipFrTm", label: "SKIP_FR_TM", type: "text" },
      { key: "skipToTm", label: "SKIP_TO_TM", type: "text" },
      { key: "maxFutDay", label: "MAX_FUT_DAY", type: "text" },
      { key: "ackDelayHrs", label: "ACK_DELAY_HRS", type: "text" },
      { key: "ordrCancDaysNbr", label: "ORDR_CANC_DAYS_NBR", type: "text" },
      { key: "etaDays", label: "ETA_DAYS", type: "text" },
      { key: "rsrvExpirDays", label: "RSRV_EXPIR_DAYS", type: "text" },
      { key: "lstChgTs", label: "LST_CHG_TS", type: "text" },
      { key: "lstChgNam", label: "LST_CHG_NAM", type: "text" },
    ],
  },
  {
    id: "order-flags",
    label: "Order Flags",
    icon: ShoppingCart,
    defaultOpen: true,
    fields: [
      { key: "ackPoFlg", label: "ACK_PO_FLG", type: "text" },
      { key: "ackPromoFlg", label: "ACK_PROMO_FLG", type: "text" },
      { key: "holdOrderFlg", label: "HOLD_ORDER_FLG", type: "text" },
      { key: "ackRptFlg", label: "ACK_RPT_FLG", type: "text" },
      { key: "autoPoChgFlg", label: "AUTO_PO_CHG_FLG", type: "text" },
      { key: "futOrdrSw", label: "FUT_ORDR_SW", type: "text" },
      { key: "ackDelaySw", label: "ACK_DELAY_SW", type: "text" },
      { key: "ordrCancDaysFlg", label: "ORDR_CANC_DAYS_FLG", type: "text" },
      { key: "rejOrdrHdrFlg", label: "REJ_ORDR_HDR_FLG", type: "text" },
      { key: "rejCnsCmpHdrFlg", label: "REJ_CNSCMP_HDR_FLG", type: "text" },
      { key: "preImHoldFlg", label: "PRE_IM_HOLD_FLG", type: "text" },
    ],
  },
  {
    id: "routing",
    label: "Routing & Distribution",
    icon: Truck,
    defaultOpen: false,
    fields: [
      { key: "baserateFlg", label: "BASERATE_FLG", type: "text" },
      { key: "airBrSeqFlg", label: "AIR_BR_SEQ_FLG", type: "text" },
      { key: "brSeqOrideFlg", label: "BR_SEQ_ORIDE_FLG", type: "text" },
      { key: "multBrSeqFlg", label: "MULT_BR_SEQ_FLG", type: "text" },
      { key: "exportBrSeqFlg", label: "EXPORT_BR_SEQ_FLG", type: "text" },
      { key: "distDepthFlg", label: "DIST_DEPTH_FLG", type: "text" },
      { key: "multiDistFlg", label: "MULTI_DIST_FLG", type: "text" },
      { key: "bestWhseFlg", label: "BEST_WHSE_FLG", type: "text" },
      { key: "singleWhseFlg", label: "SINGLE_WHSE_FLG", type: "text" },
      { key: "saveFrtFlg", label: "SAVE_FRT_FLG", type: "text" },
      { key: "saveDistFlg", label: "SAVE_DIST_FLG", type: "text" },
      { key: "multShpToFlg", label: "MULT_SHP_TO_FLG", type: "text" },
      { key: "multShpSortSeq", label: "MULT_SHP_SORT_SEQ", type: "text" },
    ],
  },
  {
    id: "customer",
    label: "Customer Settings",
    icon: Users,
    defaultOpen: false,
    fields: [
      { key: "chkCustPrcFlg", label: "CHK_CUST_PRC_FLG", type: "text" },
      { key: "saveCustPrcFlg", label: "SAVE_CUST_PRC_FLG", type: "text" },
      { key: "updCustSkuFlg", label: "UPD_CUST_SKU_FLG", type: "text" },
      { key: "cascadeSkuFlg", label: "CASCADE_SKU_FLG", type: "text" },
      { key: "instRebatMsgFlg", label: "INST_REBAT_MSG_FLG", type: "text" },
      { key: "specPrcFlg", label: "SPEC_PRC_FLG", type: "text" },
      { key: "vlaFlg", label: "VLA_FLG", type: "text" },
      { key: "aggCdCpblFlg", label: "AGG_CD_CPBL_FLG", type: "text" },
      { key: "prntOrdrFlg", label: "PRNT_ORDR_FLG", type: "text" },
    ],
  },
  {
    id: "processing",
    label: "Processing",
    icon: Settings,
    defaultOpen: false,
    fields: [
      { key: "systemPartsFlg", label: "SYSTEM_PARTS_FLG", type: "text" },
      { key: "voidTaxableFlg", label: "VOID_TAXABLE_FLG", type: "text" },
      { key: "casepackMsgFlg", label: "CASEPACK_MSG_FLG", type: "text" },
      { key: "boBrXferFlg", label: "BO_BR_XFER_FLG", type: "text" },
      { key: "clsXFltrTypCd", label: "CLS_X_FLTR_TYP_CD", type: "text" },
      { key: "clsSFltrTypCd", label: "CLS_S_FLTR_TYP_CD", type: "text" },
      { key: "clsXHldFlg", label: "CLS_X_HLD_FLG", type: "text" },
      { key: "autoSplitFlg", label: "AUTO_SPLIT_FLG", type: "text" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    icon: Shield,
    defaultOpen: false,
    fields: [
      { key: "euCaptureFlg", label: "EU_CAPTURE_FLG", type: "text" },
      { key: "customCarrFlg", label: "CUSTOM_CARR_FLG", type: "text" },
      { key: "stStoreOvrRdFlg", label: "ST_STORE_OVRRD_FLG", type: "text" },
      { key: "rsrvAllowed", label: "RSRV_ALLOWED", type: "text" },
      { key: "configVisibleFlg", label: "CONFIG_VISIBLE_FLG", type: "text" },
      { key: "etaCalcFlg", label: "ETA_CALC_FLG", type: "text" },
      { key: "addrValidFlg", label: "ADDR_VALID_FLG", type: "text" },
    ],
  },
];

const TAB_GROUP_MAP = {
  identity: ["identity"],
  timing: ["timing"],
  routing: ["routing"],
  orderFlags: ["order-flags"],
  customer: ["customer"],
  processing: ["processing"],
  advanced: ["advanced"],
};

const TABS = [
  { id: "identity", label: "Identity", icon: Users },
  { id: "timing", label: "Timing & Schedule", icon: Clock },
  { id: "routing", label: "Routing & Distribution", icon: Truck },
  { id: "orderFlags", label: "Order Flags", icon: ShoppingCart },
  { id: "customer", label: "Customer Settings", icon: Users },
  { id: "processing", label: "Processing", icon: Settings },
  { id: "advanced", label: "Advanced Settings", icon: Shield },
];

const ICON_MAP = {
  Users,
  Clock,
  ShoppingCart,
  Truck,
  Settings,
  Shield,
  BarChart2,
  Hash,
  FileText,
};

function parseFallbackFromParams(searchParams) {
  return {
    coCd: searchParams.get("coCd") || "—",
    partnerId: searchParams.get("partnerId") || "—",
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "po-switch");
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
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
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
    return (
      <span className="text-xs text-[#0F172A]">{formatDetailValue(field, value)}</span>
    );
  }

  if (field.type === "number") {
    return (
      <span className="text-xs text-[#0F172A]">
        {value}
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

function SummaryInfoTile({ field, value }) {
  const Icon = ICON_MAP[field.icon] || FileText;

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[#DBEAFE] bg-white p-3.5 hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-150">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
        <Icon size={16} className="text-[#0F6CBD]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{field.label}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="min-w-0 text-sm font-bold text-black break-words">{formatDetailValue(field, value)}</div>
          {field.copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[#0F172A]">{value || "—"}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function PoSwitchDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);

  const [activeTab, setActiveTab] = useState("identity");

  const groupsById = Object.fromEntries(
    FIELD_GROUPS.map((group) => [
      group.id,
      {
        ...group,
        iconComponent: ICON_MAP[group.icon.name] || group.icon || FileText,
      },
    ]),
  );

  const activeGroups = (TAB_GROUP_MAP[activeTab] || [])
    .map((id) => groupsById[id])
    .filter(Boolean);

  const activeFields = activeGroups.flatMap((group) => group.fields);

  const fieldTiles = activeFields.map((field) => ({
    ...field,
    value: record[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              PO Switch Record
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              PO Switch Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected PO switch record
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
              <Layers size={18} className="text-[#0033A0]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                PO Switch
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {record.coCd ?? "—"}
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-[#DBEAFE] sm:block" />

          <HeroStat label="PARTNER_ID" value={record.partnerId} />
        </div>

        <div className="flex gap-1 border-b border-[#E2E8F0] mb-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {fieldTiles.map((field) => (
            <SummaryInfoTile
              key={field.key}
              field={field}
              value={field.value}
            />
          ))}
        </div>

        {activeGroups.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-[#64748B] mb-2">
              Showing fields for {TABS.find((tab) => tab.id === activeTab)?.label}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
