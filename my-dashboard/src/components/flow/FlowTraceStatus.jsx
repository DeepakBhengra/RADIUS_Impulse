import { useMemo } from "react";
import { Activity } from "lucide-react";
import SectionCard from "../common/SectionCard";

const STATUS_CHANGE_COLUMN_ORDER = [
  "coCd",
  "ordrBrNbr",
  "ordrNbr",
  "distNbr",
  "shipNbr",
  "ordrDt",
  "stusChgTypCd",
  "stusChgTs",
  "ordrLineNbr",
  "custBrNbr",
  "custNbr",
  "webProcsFlg",
  "tomcatProcsFlg",
  "ordrChgStusCd",
  "configStusCd",
  "aggregateId",
  "prmsChgDt",
  "familyCd",
  "lstChgProgNam",
  "lstChgOperId",
  "updtRsnTxt",
  "evntRsnCd",
  "flrDnlQty",
];

const STATUS_CHANGE_LABELS = {
  coCd: "CO_CD",
  ordrBrNbr: "ORDR_BR_NBR",
  ordrNbr: "ORDR_NBR",
  distNbr: "DIST_NBR",
  shipNbr: "SHIP_NBR",
  ordrDt: "ORDR_DT",
  stusChgTypCd: "STUS_CHG_TYP_CD",
  stusChgTs: "STUS_CHG_TS",
  ordrLineNbr: "ORDR_LINE_NBR",
  custBrNbr: "CUST_BR_NBR",
  custNbr: "CUST_NBR",
  webProcsFlg: "WEB_PROCS_FLG",
  tomcatProcsFlg: "TOMCAT_PROCS_FLG",
  ordrChgStusCd: "ORDR_CHG_STUS_CD",
  configStusCd: "CONFIG_STUS_CD",
  aggregateId: "AGGREGATE_ID",
  prmsChgDt: "PRMS_CHG_DT",
  familyCd: "FAMILY_CD",
  lstChgProgNam: "LST_CHG_PROG_NAM",
  lstChgOperId: "LST_CHG_OPER_ID",
  updtRsnTxt: "UPDT_RSN_TXT",
  evntRsnCd: "EVNT_RSN_CD",
  flrDnlQty: "FLR_DNL_QTY",
};

function toHeaderLabel(key) {
  if (STATUS_CHANGE_LABELS[key]) return STATUS_CHANGE_LABELS[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/\s+/g, "_")
    .toUpperCase();
}

function FlowTraceStatus({ flowTrace }) {
  const rows = useMemo(() => {
    if (Array.isArray(flowTrace)) {
      return flowTrace.filter((row) => row && typeof row === "object" && !Array.isArray(row));
    }

    if (flowTrace && typeof flowTrace === "object") {
      return Object.values(flowTrace)
        .filter(Array.isArray)
        .flat()
        .filter((row) => row && typeof row === "object" && !Array.isArray(row));
    }

    return [];
  }, [flowTrace]);

  const columns = useMemo(() => {
    const discoveredKeys = new Set();
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => discoveredKeys.add(key));
    });

    const ordered = STATUS_CHANGE_COLUMN_ORDER.filter((key) => discoveredKeys.has(key));
    const extras = [...discoveredKeys]
      .filter((key) => !STATUS_CHANGE_COLUMN_ORDER.includes(key))
      .sort();

    return [...ordered, ...extras];
  }, [rows]);

  return (
    <SectionCard icon={Activity} title="Cycle Status">
      {rows.length === 0 ? (
        <div className="text-xs text-[#6B7280]">No OR_ORDER_STUS_CHGS data available.</div>
      ) : (
        <div className="overflow-auto max-h-[460px] rounded-xl border border-[#D6E4F7]">
          <table className="w-full min-w-max text-xs">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10">
              <tr className="border-b border-[#D6E4F7]">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-3 py-2 text-left text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap"
                  >
                    {toHeaderLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#D6E4F7] last:border-0 hover:bg-[#EFF6FF]">
                  {columns.map((column) => {
                    const rawValue = row[column];
                    const value = rawValue == null || rawValue === "" ? "—" : String(rawValue);
                    return (
                      <td
                        key={`${rowIndex}-${column}`}
                        className="px-3 py-2 text-[#111827] whitespace-nowrap"
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

export default FlowTraceStatus;
