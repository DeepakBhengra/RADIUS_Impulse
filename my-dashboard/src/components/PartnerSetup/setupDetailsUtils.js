function isPresent(value) {
  return value != null && value !== "" && value !== "—";
}

export function deriveActiveStatus(setup) {
  const hold = String(setup.holdCd ?? "").trim();
  if (hold && hold !== "0" && hold.toUpperCase() !== "N") return "On Hold";
  if (isPresent(setup.deactvDt)) return "Inactive";
  if (isPresent(setup.actvDt)) return "Active";
  return "Unknown";
}

export function statusColor(status) {
  if (status === "Active") return "green";
  if (status === "Inactive") return "gray";
  if (status === "On Hold") return "amber";
  return "blue";
}

export function normalizeSetupRecord(record = {}) {
  const normalized = {
    coCd: record.coCd ?? record.CO_CD ?? "—",
    partnerId: record.partnerId ?? record.PARTNER_ID ?? "—",
    partnerTypeCd: record.partnerTypeCd ?? record.PARTNER_TYPE_CD ?? "—",

    srceSysId: record.srceSysId ?? record.SRCE_SYS_ID ?? "—",
    srceSysKeyId: record.srceSysKeyId ?? record.SRCE_SYS_KEY_ID ?? "—",
    formatId: record.formatId ?? record.FORMAT_ID ?? "—",
    docId: record.docId ?? record.DOC_ID ?? "—",

    commuId: record.commuId ?? record.COMMU_ID ?? "—",
    internetAddrTxt: record.internetAddrTxt ?? record.INTERNET_ADDR_TXT ?? "—",
    dirFlgCd: record.dirFlgCd ?? record.DIR_FLG_CD ?? "—",
    sendThruId: record.sendThruId ?? record.SEND_THRU_ID ?? "—",

    dataStoreMechId: record.dataStoreMechId ?? record.DATA_STORE_MECH_ID ?? "—",
    prcsOptnFlg: record.prcsOptnFlg ?? record.PRCS_OPTN_FLG ?? "—",
    batchSplitCnt: record.batchSplitCnt ?? record.BATCH_SPLIT_CNT ?? "—",
    ovrdApplBatchId: record.ovrdApplBatchId ?? record.OVRD_APPL_BATCH_ID ?? "—",

    freqId: record.freqId ?? record.FREQ_ID ?? "—",
    cycleIntvl: record.cycleIntvl ?? record.CYCLE_INTVL ?? "—",
    cycStrtTm: record.cycStrtTm ?? record.CYC_STRT_TM ?? "—",
    cycEndTm: record.cycEndTm ?? record.CYC_END_TM ?? "—",
    cycleLstRunTs: record.cycleLstRunTs ?? record.CYCLE_LST_RUN_TS ?? "—",

    actvDt: record.actvDt ?? record.ACTV_DT ?? "—",
    deactvDt: record.deactvDt ?? record.DEACTV_DT ?? "—",
    holdCd: record.holdCd ?? record.HOLD_CD ?? "—",

    lstChgTs: record.lstChgTs ?? record.LST_CHG_TS ?? "—",
    lstChgNam: record.lstChgNam ?? record.LST_CHG_NAM ?? "—",

    setupNotesTxt: record.setupNotesTxt ?? record.SETUP_NOTES_TXT ?? "—",
  };

  return { ...normalized, activeStatus: deriveActiveStatus(normalized) };
}
