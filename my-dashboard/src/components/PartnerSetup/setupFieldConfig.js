export const PARTNER_SETUP_FIELD_GROUPS = [
  {
    id: "general",
    label: "General",
    icon: "Hash",
    defaultOpen: true,
    fields: [
      { key: "coCd", label: "CO_CD", type: "text" },
      { key: "partnerId", label: "PARTNER_ID", type: "id", copyable: true },
      { key: "partnerTypeCd", label: "PARTNER_TYPE_CD", type: "text" },
    ],
  },
  // {
  //   id: "source",
  //   label: "Source Information",
  //   icon: "Package",
  //   defaultOpen: true,
  //   fields: [
  //     { key: "srceSysId", label: "SRCE_SYS_ID", type: "text" },
  //     { key: "srceSysKeyId", label: "SRCE_SYS_KEY_ID", type: "text" },
  //     { key: "formatId", label: "FORMAT_ID", type: "text" },
  //     { key: "docId", label: "DOC_ID", type: "text" },
  //   ],
  // },
  // {
  //   id: "communication",
  //   label: "Communication",
  //   icon: "BarChart2",
  //   fields: [
  //     { key: "commuId", label: "COMMU_ID", type: "text" },
  //     { key: "internetAddrTxt", label: "INTERNET_ADDR_TXT", type: "text" },
  //     { key: "dirFlgCd", label: "DIR_FLG_CD", type: "text" },
  //     { key: "sendThruId", label: "SEND_THRU_ID", type: "text" },
  //   ],
  // },
  {
    id: "processing",
    label: "Processing",
    icon: "DollarSign",
    fields: [
      { key: "dataStoreMechId", label: "DATA_STORE_MECH_ID", type: "text" },
      { key: "prcsOptnFlg", label: "PRCS_OPTN_FLG", type: "text" },
      { key: "batchSplitCnt", label: "BATCH_SPLIT_CNT", type: "number" },
      { key: "ovrdApplBatchId", label: "OVRD_APPL_BATCH_ID", type: "text" },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: "Calendar",
    fields: [
      { key: "freqId", label: "FREQ_ID", type: "text" },
      { key: "cycleIntvl", label: "CYCLE_INTVL", type: "number" },
      { key: "cycStrtTm", label: "CYC_STRT_TM", type: "text" },
      { key: "cycEndTm", label: "CYC_END_TM", type: "text" },
      { key: "cycleLstRunTs", label: "CYCLE_LST_RUN_TS", type: "date" },
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: "AlertCircle",
    fields: [
      { key: "actvDt", label: "ACTV_DT", type: "date" },
      { key: "deactvDt", label: "DEACTV_DT", type: "date" },
      { key: "holdCd", label: "HOLD_CD", type: "text" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    icon: "Truck",
    fields: [
      { key: "lstChgTs", label: "LST_CHG_TS", type: "date" },
      { key: "lstChgNam", label: "LST_CHG_NAM", type: "text" },
    ],
  },
  {
    id: "notes",
    label: "Notes",
    icon: "Cpu",
    fields: [
      { key: "setupNotesTxt", label: "SETUP_NOTES_TXT", type: "text" },
    ],
  },
];
