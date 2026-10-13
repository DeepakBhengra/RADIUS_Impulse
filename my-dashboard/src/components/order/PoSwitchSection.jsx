
import { SlidersHorizontal } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { openPoSwitchDetailsTab } from "../../utils/detailsNavigation";

const PO_SWITCH_FIELDS = [
  { key: "coCd", label: "CO_CD" },
  { key: "partnerId", label: "PARTNER_ID" },
  { key: "skipFrTm", label: "SKIP_FR_TM" },
  { key: "skipToTm", label: "SKIP_TO_TM" },
  { key: "custPrty", label: "CUST_PRTY" },
  { key: "ackPoFlg", label: "ACK_PO_FLG" },
  { key: "ackPromoFlg", label: "ACK_PROMO_FLG" },
  { key: "baserateFlg", label: "BASERATE_FLG" },
  { key: "aggCdCpblFlg", label: "AGG_CD_CPBL_FLG" },
  { key: "preImHoldFlg", label: "PRE_IM_HOLD_FLG" },
  { key: "multShpToFlg", label: "MULT_SHP_TO_FLG" },
  { key: "systemPartsFlg", label: "SYSTEM_PARTS_FLG" },
  { key: "voidTaxableFlg", label: "VOID_TAXABLE_FLG" },
  { key: "casepackMsgFlg", label: "CASEPACK_MSG_FLG" },
  { key: "chkCustPrcFlg", label: "CHK_CUST_PRC_FLG" },
  { key: "distDepthFlg", label: "DIST_DEPTH_FLG" },
  { key: "airBrSeqFlg", label: "AIR_BR_SEQ_FLG" },
  { key: "brSeqOrideFlg", label: "BR_SEQ_ORIDE_FLG" },
  { key: "multBrSeqFlg", label: "MULT_BR_SEQ_FLG" },
  { key: "exportBrSeqFlg", label: "EXPORT_BR_SEQ_FLG" },
  { key: "holdOrderFlg", label: "HOLD_ORDER_FLG" },
  { key: "dfltCustNbr", label: "DFLT_CUST_NBR" },
  { key: "promoCustNbr", label: "PROMO_CUST_NBR" },
  { key: "priceCustNbr", label: "PRICE_CUST_NBR" },
  { key: "instRebatMsgFlg", label: "INST_REBAT_MSG_FLG" },
  { key: "vlaFlg", label: "VLA_FLG" },
  { key: "multiDistFlg", label: "MULTI_DIST_FLG" },
  { key: "saveFrtFlg", label: "SAVE_FRT_FLG" },
  { key: "saveDistFlg", label: "SAVE_DIST_FLG" },
  { key: "bestWhseFlg", label: "BEST_WHSE_FLG" },
  { key: "singleWhseFlg", label: "SINGLE_WHSE_FLG" },
  { key: "prntOrdrFlg", label: "PRNT_ORDR_FLG" },
  { key: "multShpSortSeq", label: "MULT_SHP_SORT_SEQ" },
  { key: "maxFutDay", label: "MAX_FUT_DAY" },
  { key: "lstChgTs", label: "LST_CHG_TS" },
  { key: "lstChgNam", label: "LST_CHG_NAM" },
  { key: "clsXFltrTypCd", label: "CLS_X_FLTR_TYP_CD" },
  { key: "clsSFltrTypCd", label: "CLS_S_FLTR_TYP_CD" },
  { key: "updCustSkuFlg", label: "UPD_CUST_SKU_FLG" },
  { key: "saveCustPrcFlg", label: "SAVE_CUST_PRC_FLG" },
  { key: "boBrXferFlg", label: "BO_BR_XFER_FLG" },
  { key: "rejOrdrHdrFlg", label: "REJ_ORDR_HDR_FLG" },
  { key: "rejCnsCmpHdrFlg", label: "REJ_CNSCMP_HDR_FLG" },
  { key: "ackRptFlg", label: "ACK_RPT_FLG" },
  { key: "specPrcFlg", label: "SPEC_PRC_FLG" },
  { key: "euCaptureFlg", label: "EU_CAPTURE_FLG" },
  { key: "customCarrFlg", label: "CUSTOM_CARR_FLG" },
  { key: "cascadeSkuFlg", label: "CASCADE_SKU_FLG" },
  { key: "autoPoChgFlg", label: "AUTO_PO_CHG_FLG" },
  { key: "clsXHldFlg", label: "CLS_X_HLD_FLG" },
  { key: "stStoreOvrRdFlg", label: "ST_STORE_OVRRD_FLG" },
  { key: "rsrvCustNbr", label: "RSRV_CUST_NBR" },
  { key: "rsrvAllowed", label: "RSRV_ALLOWED" },
  { key: "rsrvExpirDays", label: "RSRV_EXPIR_DAYS" },
  { key: "configVisibleFlg", label: "CONFIG_VISIBLE_FLG" },
  { key: "etaCalcFlg", label: "ETA_CALC_FLG" },
  { key: "etaDays", label: "ETA_DAYS" },
  { key: "addrValidFlg", label: "ADDR_VALID_FLG" },
  { key: "autoSplitFlg", label: "AUTO_SPLIT_FLG" },
  { key: "ordrCancDaysFlg", label: "ORDR_CANC_DAYS_FLG" },
  { key: "ordrCancDaysNbr", label: "ORDR_CANC_DAYS_NBR" },
  { key: "futOrdrSw", label: "FUT_ORDR_SW" },
  { key: "ackDelaySw", label: "ACK_DELAY_SW" },
  { key: "ackDelayHrs", label: "ACK_DELAY_HRS" },
];

const FLAG_KEYS = new Set(
  PO_SWITCH_FIELDS
    .filter(({ key }) => key.endsWith("Flg") || key.endsWith("Sw"))
    .map(({ key }) => key),
);

function resolveSwitchState(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["y", "1", "true", "yes", "enabled"].includes(normalized)) {
    return { color: "green", text: "Enabled" };
  }
  if (["n", "0", "false", "no", "disabled"].includes(normalized)) {
    return { color: "gray", text: "Disabled" };
  }
  if (!normalized || normalized === "—") {
    return { color: "gray", text: "—" };
  }
  return { color: "amber", text: String(value) };
}

const PREVIEW_COUNT = 9;

function PoSwitchSection({ inPoSw }) {
  const record = Array.isArray(inPoSw) && inPoSw.length > 0 ? inPoSw[0] : null;

  if (!record) {
    return (
      <SectionCard icon={SlidersHorizontal} title="PO Switch">
        <div className="text-xs text-[#6B7280]">No IE_IN_PO_SW data available.</div>
      </SectionCard>
    );
  }


  return (
    <SectionCard
      icon={SlidersHorizontal}
      title="PO Switch"
    >
      <div
  role="button"
  tabIndex={0}
  onClick={() => openPoSwitchDetailsTab(record)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPoSwitchDetailsTab(record);
    }
  }}
  className="grid grid-cols-1 md:grid-cols-2 gap-3 cursor-pointer"
>
        {PO_SWITCH_FIELDS.slice(0, PREVIEW_COUNT).map((field) => {
          const value = record[field.key];
          const isFlag = FLAG_KEYS.has(field.key);
          const state = isFlag ? resolveSwitchState(value) : null;

          return (
            <div
              key={field.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#D6E4F7] bg-[#F8FAFC] px-3 py-2.5 hover:bg-[#EFF6FF] transition-colors"
            >
              <span className="field-label text-xs leading-snug">{field.label}</span>
              {isFlag ? (
                <Badge color={state.color}>{state.text}</Badge>
              ) : (
                <span className="field-value text-xs text-[#111827]">
                  {value == null || value === "" ? "—" : String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

export default PoSwitchSection;
