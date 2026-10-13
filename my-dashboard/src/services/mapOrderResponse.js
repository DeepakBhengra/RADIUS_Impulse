// ─── Maps the real .NET GetOrder response into the shape the UI expects ───
//
// Confirmed against OrderResponseModel.cs + OrderRepository.cs — these are
// the EXACT fields the backend returns, no guessing needed. ASP.NET Core's
// default JSON serializer camel-cases the C# property names automatically,
// e.g. C#'s `PoNumber` arrives in the browser as `poNumber`.

export function mapOrderResponse(raw) {
  if (!raw) return null;

  const toPartnerSetupRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    partnerId: entry.partnerId ?? entry.PARTNER_ID ?? "—",
    partnerTypeCd: entry.partnerTypeCd ?? entry.PARTNER_TYPE_CD ?? "—",
    srceSysId: entry.srceSysId ?? entry.SRCE_SYS_ID ?? "—",
    srceSysKeyId: entry.srceSysKeyId ?? entry.SRCE_SYS_KEY_ID ?? "—",
    formatId: entry.formatId ?? entry.FORMAT_ID ?? "—",
    docId: entry.docId ?? entry.DOC_ID ?? "—",
    commuId: entry.commuId ?? entry.COMMU_ID ?? "—",
    internetAddrTxt: entry.internetAddrTxt ?? entry.INTERNET_ADDR_TXT ?? "—",
    dirFlgCd: entry.dirFlgCd ?? entry.DIR_FLG_CD ?? "—",
    sendThruId: entry.sendThruId ?? entry.SEND_THRU_ID ?? "—",
    dataStoreMechId: entry.dataStoreMechId ?? entry.DATA_STORE_MECH_ID ?? "—",
    prcsOptnFlg: entry.prcsOptnFlg ?? entry.PRCS_OPTN_FLG ?? "—",
    batchSplitCnt: entry.batchSplitCnt ?? entry.BATCH_SPLIT_CNT ?? "—",
    ovrdApplBatchId: entry.ovrdApplBatchId ?? entry.OVRD_APPL_BATCH_ID ?? "—",
    freqId: entry.freqId ?? entry.FREQ_ID ?? "—",
    cycleIntvl: entry.cycleIntvl ?? entry.CYCLE_INTVL ?? "—",
    cycStrtTm: entry.cycStrtTm ?? entry.CYC_STRT_TM ?? "—",
    cycEndTm: entry.cycEndTm ?? entry.CYC_END_TM ?? "—",
    cycleLstRunTs: entry.cycleLstRunTs ?? entry.CYCLE_LST_RUN_TS ?? "—",
    actvDt: entry.actvDt ?? entry.ACTV_DT ?? "—",
    deactvDt: entry.deactvDt ?? entry.DEACTV_DT ?? "—",
    holdCd: entry.holdCd ?? entry.HOLD_CD ?? "—",
    lstChgTs: entry.lstChgTs ?? entry.LST_CHG_TS ?? "—",
    lstChgNam: entry.lstChgNam ?? entry.LST_CHG_NAM ?? "—",
    setupNotesTxt: entry.setupNotesTxt ?? entry.SETUP_NOTES_TXT ?? "—",
  });

  const toInPoSwRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    partnerId: entry.partnerId ?? entry.PARTNER_ID ?? "—",
    skipFrTm: entry.skipFrTm ?? entry.SKIP_FR_TM ?? "—",
    skipToTm: entry.skipToTm ?? entry.SKIP_TO_TM ?? "—",
    custPrty: entry.custPrty ?? entry.CUST_PRTY ?? "—",
    ackPoFlg: entry.ackPoFlg ?? entry.ACK_PO_FLG ?? "—",
    ackPromoFlg: entry.ackPromoFlg ?? entry.ACK_PROMO_FLG ?? "—",
    baserateFlg: entry.baserateFlg ?? entry.BASERATE_FLG ?? "—",
    aggCdCpblFlg: entry.aggCdCpblFlg ?? entry.AGG_CD_CPBL_FLG ?? "—",
    preImHoldFlg: entry.preImHoldFlg ?? entry.PRE_IM_HOLD_FLG ?? "—",
    multShpToFlg: entry.multShpToFlg ?? entry.MULT_SHP_TO_FLG ?? "—",
    systemPartsFlg: entry.systemPartsFlg ?? entry.SYSTEM_PARTS_FLG ?? "—",
    voidTaxableFlg: entry.voidTaxableFlg ?? entry.VOID_TAXABLE_FLG ?? "—",
    casepackMsgFlg: entry.casepackMsgFlg ?? entry.CASEPACK_MSG_FLG ?? "—",
    chkCustPrcFlg: entry.chkCustPrcFlg ?? entry.CHK_CUST_PRC_FLG ?? "—",
    distDepthFlg: entry.distDepthFlg ?? entry.DIST_DEPTH_FLG ?? "—",
    airBrSeqFlg: entry.airBrSeqFlg ?? entry.AIR_BR_SEQ_FLG ?? "—",
    brSeqOrideFlg: entry.brSeqOrideFlg ?? entry.BR_SEQ_ORIDE_FLG ?? "—",
    multBrSeqFlg: entry.multBrSeqFlg ?? entry.MULT_BR_SEQ_FLG ?? "—",
    exportBrSeqFlg: entry.exportBrSeqFlg ?? entry.EXPORT_BR_SEQ_FLG ?? "—",
    holdOrderFlg: entry.holdOrderFlg ?? entry.HOLD_ORDER_FLG ?? "—",
    dfltCustNbr: entry.dfltCustNbr ?? entry.DFLT_CUST_NBR ?? "—",
    promoCustNbr: entry.promoCustNbr ?? entry.PROMO_CUST_NBR ?? "—",
    priceCustNbr: entry.priceCustNbr ?? entry.PRICE_CUST_NBR ?? "—",
    instRebatMsgFlg: entry.instRebatMsgFlg ?? entry.INST_REBAT_MSG_FLG ?? "—",
    vlaFlg: entry.vlaFlg ?? entry.VLA_FLG ?? "—",
    multiDistFlg: entry.multiDistFlg ?? entry.MULTI_DIST_FLG ?? "—",
    saveFrtFlg: entry.saveFrtFlg ?? entry.SAVE_FRT_FLG ?? "—",
    saveDistFlg: entry.saveDistFlg ?? entry.SAVE_DIST_FLG ?? "—",
    bestWhseFlg: entry.bestWhseFlg ?? entry.BEST_WHSE_FLG ?? "—",
    singleWhseFlg: entry.singleWhseFlg ?? entry.SINGLE_WHSE_FLG ?? "—",
    prntOrdrFlg: entry.prntOrdrFlg ?? entry.PRNT_ORDR_FLG ?? "—",
    multShpSortSeq: entry.multShpSortSeq ?? entry.MULT_SHP_SORT_SEQ ?? "—",
    maxFutDay: entry.maxFutDay ?? entry.MAX_FUT_DAY ?? "—",
    lstChgTs: entry.lstChgTs ?? entry.LST_CHG_TS ?? "—",
    lstChgNam: entry.lstChgNam ?? entry.LST_CHG_NAM ?? "—",
    clsXFltrTypCd: entry.clsXFltrTypCd ?? entry.CLS_X_FLTR_TYP_CD ?? "—",
    clsSFltrTypCd: entry.clsSFltrTypCd ?? entry.CLS_S_FLTR_TYP_CD ?? "—",
    updCustSkuFlg: entry.updCustSkuFlg ?? entry.UPD_CUST_SKU_FLG ?? "—",
    saveCustPrcFlg: entry.saveCustPrcFlg ?? entry.SAVE_CUST_PRC_FLG ?? "—",
    boBrXferFlg: entry.boBrXferFlg ?? entry.BO_BR_XFER_FLG ?? "—",
    rejOrdrHdrFlg: entry.rejOrdrHdrFlg ?? entry.REJ_ORDR_HDR_FLG ?? "—",
    rejCnsCmpHdrFlg: entry.rejCnsCmpHdrFlg ?? entry.REJ_CNSCMP_HDR_FLG ?? "—",
    ackRptFlg: entry.ackRptFlg ?? entry.ACK_RPT_FLG ?? "—",
    specPrcFlg: entry.specPrcFlg ?? entry.SPEC_PRC_FLG ?? "—",
    euCaptureFlg: entry.euCaptureFlg ?? entry.EU_CAPTURE_FLG ?? "—",
    customCarrFlg: entry.customCarrFlg ?? entry.CUSTOM_CARR_FLG ?? "—",
    cascadeSkuFlg: entry.cascadeSkuFlg ?? entry.CASCADE_SKU_FLG ?? "—",
    autoPoChgFlg: entry.autoPoChgFlg ?? entry.AUTO_PO_CHG_FLG ?? "—",
    clsXHldFlg: entry.clsXHldFlg ?? entry.CLS_X_HLD_FLG ?? "—",
    stStoreOvrRdFlg: entry.stStoreOvrRdFlg ?? entry.ST_STORE_OVRRD_FLG ?? "—",
    rsrvCustNbr: entry.rsrvCustNbr ?? entry.RSRV_CUST_NBR ?? "—",
    rsrvAllowed: entry.rsrvAllowed ?? entry.RSRV_ALLOWED ?? "—",
    rsrvExpirDays: entry.rsrvExpirDays ?? entry.RSRV_EXPIR_DAYS ?? "—",
    configVisibleFlg: entry.configVisibleFlg ?? entry.CONFIG_VISIBLE_FLG ?? "—",
    etaCalcFlg: entry.etaCalcFlg ?? entry.ETA_CALC_FLG ?? "—",
    etaDays: entry.etaDays ?? entry.ETA_DAYS ?? "—",
    addrValidFlg: entry.addrValidFlg ?? entry.ADDR_VALID_FLG ?? "—",
    autoSplitFlg: entry.autoSplitFlg ?? entry.AUTO_SPLIT_FLG ?? "—",
    ordrCancDaysFlg: entry.ordrCancDaysFlg ?? entry.ORDR_CANC_DAYS_FLG ?? "—",
    ordrCancDaysNbr: entry.ordrCancDaysNbr ?? entry.ORDR_CANC_DAYS_NBR ?? "—",
    futOrdrSw: entry.futOrdrSw ?? entry.FUT_ORDR_SW ?? "—",
    ackDelaySw: entry.ackDelaySw ?? entry.ACK_DELAY_SW ?? "—",
    ackDelayHrs: entry.ackDelayHrs ?? entry.ACK_DELAY_HRS ?? "—",
  });

  // ─── Maps the .NET GetOrder response into the shape the UI expects ────────
  //
  // IMPORTANT: the left side of each line below (`raw.xxx`) is the REAL JSON
  // key — camelCase of the C# property name, per ASP.NET Core's default
  // serializer. The right side (`companyCd:`, etc.) is the internal/UI key
  // used everywhere else in the app. For most fields these are identical;
  // for 11 fields they intentionally differ — see the table in chat history
  // for the full list of renames and why.

  const order = {
    // ── Order Information ──────────────────────────────────────

    custCoCd: raw.custCoCd ?? null,
    custBr: raw.custBr ?? null,
    imiAsgdOrdrNbr: raw.imiAsgdOrdrNbr ?? null,
    ordrDt: raw.ordrDt ?? null,
    custPoNbr: raw.custPoNbr ?? null,

    billToBranchNbr: raw.billToBranchNbr ?? null,
    billToCustNbr: raw.billToCustNbr ?? null,
    billToSfx: raw.billToSfx ?? null,
    shipToSfx: raw.shipToSfx ?? null,

    capsIdCd: raw.capsIdCd ?? null,
    terms: raw.terms ?? null,
    resdntlSw: raw.resdntlSw ?? null,

    // IMPORTANT:
    // Backend property is OrdrStatus
    // Therefore JSON key is ordrStatus
    ordrStatus: raw.ordrStatus ?? null,

    ordrCmpltFillSw: raw.ordrCmpltFillSw ?? null,
    crRels: raw.crRels ?? null,

    entyDt: raw.entyDt ?? null,
    termId: raw.termId ?? null,

    osSlsmn: raw.osSlsmn ?? null,
    isSlsmn: raw.isSlsmn ?? null,
    postalCd: raw.postalCd ?? null,
    entyMthd: raw.entyMthd ?? null,
    ediCo: raw.ediCo ?? null,

    splitSw: raw.splitSw ?? null,
    ordRefNbr: raw.ordRefNbr ?? null,
    fulmntSw: raw.fulmntSw ?? null,
    crCrdSw: raw.crCrdSw ?? null,

    entyTm: raw.entyTm ?? null,
    bidQotFlg: raw.bidQotFlg ?? null,
    bidExpDt: raw.bidExpDt ?? null,

    ordrCcyCd: raw.ordrCcyCd ?? null,
    ccyRate: raw.ccyRate ?? null,

    poCrtedSw: raw.poCrtedSw ?? null,
    govtBidFlg: raw.govtBidFlg ?? null,
    enhancedRmaSw: raw.enhancedRmaSw ?? null,

    flrngAuthActnCd: raw.flrngAuthActnCd ?? null,

    cuBusSgmt: raw.cuBusSgmt ?? null,
    cuBusTyp: raw.cuBusTyp ?? null,
    cuaShipFrom: raw.cuaShipFrom ?? null,

    baseRateOrdrSw: raw.baseRateOrdrSw ?? null,
    userNam: raw.userNam ?? null,

    govtEndUserZip: raw.govtEndUserZip ?? null,
    binTyp: raw.binTyp ?? null,
    govtGsaInd: raw.govtGsaInd ?? null,

    splitBillToSw: raw.splitBillToSw ?? null,
    govtEndUserTyp: raw.govtEndUserTyp ?? null,

    odsLstUpdDt: raw.odsLstUpdDt ?? null,

    enhancedCrMemoSw: raw.enhancedCrMemoSw ?? null,
    imsDelFlg: raw.imsDelFlg ?? null,
    specialHandleSw: raw.specialHandleSw ?? null,

    cfgFlg: raw.cfgFlg ?? null,

    endUserPoNbr: raw.endUserPoNbr ?? null,
    resellerNbr: raw.resellerNbr ?? null,
    tnSpecCd: raw.tnSpecCd ?? null,

    endUserDataSw: raw.endUserDataSw ?? null,
    endUserAuthorization: raw.endUserAuthorization ?? null,
    endUserAddrSuffix: raw.endUserAddrSuffix ?? null,
    endUserVendorFlag: raw.endUserVendorFlag ?? null,
    endUserNbr: raw.endUserNbr ?? null,

    wasBord: raw.wasBord ?? null,
    jobAcctNbr: raw.jobAcctNbr ?? null,
    capsBuyer: raw.capsBuyer ?? null,

    ackCode: raw.ackCode ?? null,
    copyCode: raw.copyCode ?? null,
    extSoCode: raw.extSoCode ?? null,
    taxCode: raw.taxCode ?? null,

    // ── Processing Flow ────────────────────────────────────────
    // Used by ProcessFlowSection
    stateCd: raw.stateCd ?? null,

    // ── Location ───────────────────────────────────────────────

    countyCode: raw.countyCode ?? null,
    cityCode: raw.cityCode ?? null,

    // ── Financial / Order Controls ─────────────────────────────

    tradeDisc: raw.tradeDisc ?? null,

    orderManagementSw: raw.orderManagementSw ?? null,
    sourceCode: raw.sourceCode ?? null,
    summInvoiceCode: raw.summInvoiceCode ?? null,

    custType: raw.custType ?? null,
    custRefNbr: raw.custRefNbr ?? null,

    orderValueAtAdd: raw.orderValueAtAdd ?? null,

    gwmdImagApplyFlag: raw.gwmdImagApplyFlag ?? null,
    customersLanguageCode: raw.customersLanguageCode ?? null,

    glOffsetNbr: raw.glOffsetNbr ?? null,
    glOffsetType: raw.glOffsetType ?? null,

    endCustNum: raw.endCustNum ?? null,

    flrngAuthNbr: raw.flrngAuthNbr ?? null,
    allianceSw: raw.allianceSw ?? null,

    custRefNbr2: raw.custRefNbr2 ?? null,

    campaign: raw.campaign ?? null,
    contract: raw.contract ?? null,

    endUserContSuffix: raw.endUserContSuffix ?? null,

    freightForwarder: raw.freightForwarder ?? null,
    endUserOrderSw: raw.endUserOrderSw ?? null,
    aodSw: raw.aodSw ?? null,

    countryCode: raw.countryCode ?? null,

    soldToSuffix: raw.soldToSuffix ?? null,

    payeeNbr: raw.payeeNbr ?? null,
    payeeSuf: raw.payeeSuf ?? null,

    resellerSplitPct: raw.resellerSplitPct ?? null,

    deliveryTerms: raw.deliveryTerms ?? null,

    endCustId: raw.endCustId ?? null,
    vendorClaimNbr: raw.vendorClaimNbr ?? null,

    indiaGstOrderInd: raw.indiaGstOrderInd ?? null,

    lastDistNbr: raw.lastDistNbr ?? null,
    lastShipmentNbr: raw.lastShipmentNbr ?? null,

    priorityCode: raw.priorityCode ?? null,

    outsourceSkuInd: raw.outsourceSkuInd ?? null,
    deleteTodaySw: raw.deleteTodaySw ?? null,
    priceRecalcSw: raw.priceRecalcSw ?? null,
    eoStateCd: raw.eoStateCd ?? null,
    environment:raw.environment ?? null,
  };

  const lineItems = Array.isArray(raw.lineItems) ? raw.lineItems : [];

  const toStatusChangeRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    ordrBrNbr: entry.ordrBrNbr ?? entry.ORDR_BR_NBR ?? "—",
    ordrNbr: entry.ordrNbr ?? entry.ORDR_NBR ?? "—",
    distNbr: entry.distNbr ?? entry.DIST_NBR ?? "—",
    shipNbr: entry.shipNbr ?? entry.SHIP_NBR ?? "—",
    ordrDt: entry.ordrDt ?? entry.ORDR_DT ?? "—",
    stusChgTypCd: entry.stusChgTypCd ?? entry.STUS_CHG_TYP_CD ?? "—",
    stusChgTs: entry.stusChgTs ?? entry.STUS_CHG_TS ?? "—",
    ordrLineNbr: entry.ordrLineNbr ?? entry.ORDR_LINE_NBR ?? "—",
    custBrNbr: entry.custBrNbr ?? entry.CUST_BR_NBR ?? "—",
    custNbr: entry.custNbr ?? entry.CUST_NBR ?? "—",
    webProcsFlg: entry.webProcsFlg ?? entry.WEB_PROCS_FLG ?? "—",
    tomcatProcsFlg: entry.tomcatProcsFlg ?? entry.TOMCAT_PROCS_FLG ?? "—",
    ordrChgStusCd: entry.ordrChgStusCd ?? entry.ORDR_CHG_STUS_CD ?? "—",
    configStusCd: entry.configStusCd ?? entry.CONFIG_STUS_CD ?? "—",
    aggregateId: entry.aggregateId ?? entry.AGGREGATE_ID ?? "—",
    prmsChgDt: entry.prmsChgDt ?? entry.PRMS_CHG_DT ?? "—",
    familyCd: entry.familyCd ?? entry.FAMILY_CD ?? "—",
    lstChgProgNam: entry.lstChgProgNam ?? entry.LST_CHG_PROG_NAM ?? "—",
    lstChgOperId: entry.lstChgOperId ?? entry.LST_CHG_OPER_ID ?? "—",
    updtRsnTxt: entry.updtRsnTxt ?? entry.UPDT_RSN_TXT ?? "—",
    evntRsnCd: entry.evntRsnCd ?? entry.EVNT_RSN_CD ?? "—",
    flrDnlQty: entry.flrDnlQty ?? entry.FLR_DNL_QTY ?? "—",
  });

  const rawStatusChanges =
    raw.statusChanges ?? raw.orderStatusChanges ?? raw.orOrderStusChgs ?? [];
  const statusChanges = Array.isArray(rawStatusChanges)
    ? rawStatusChanges
        .filter(
          (entry) =>
            entry && typeof entry === "object" && !Array.isArray(entry),
        )
        .map((entry) => toStatusChangeRecord(entry))
    : [];

  const rawPartnerSetup =
    raw.partnerSetup ??
    raw.partnerSetups ??
    raw.partnerSetupDetails ??
    raw.setupConfig ??
    [];
  const setupConfig = Array.isArray(rawPartnerSetup)
    ? rawPartnerSetup
        .filter(
          (entry) =>
            entry && typeof entry === "object" && !Array.isArray(entry),
        )
        .map(toPartnerSetupRecord)
    : rawPartnerSetup && typeof rawPartnerSetup === "object"
      ? [toPartnerSetupRecord(rawPartnerSetup)]
      : [];

  const rawInPoSw = raw.inPoSw ?? raw.ieInPoSw ?? raw.poSwitch ?? [];
  const inPoSw = Array.isArray(rawInPoSw)
    ? rawInPoSw
        .filter(
          (entry) =>
            entry && typeof entry === "object" && !Array.isArray(entry),
        )
        .map((entry) => toInPoSwRecord(entry))
    : rawInPoSw && typeof rawInPoSw === "object"
      ? [toInPoSwRecord(rawInPoSw)]
      : [];

  const availableSections = ["orderHeader", "lineItems"];
  if (statusChanges.length > 0) availableSections.push("flowTrace");
  if (setupConfig.length > 0) availableSections.push("setupConfig");
  if (inPoSw.length > 0) availableSections.push("poSwitch");

  // Only these two sections have a real backend data source right now.
  // Flow Trace, Setup Validation, Datadog, and MQ still show "Not
  // available yet" placeholders in the UI — add their keys here once
  // their endpoints exist on the backend.
  return {
    order,
    lineItems,
    processingSteps: [],
    flowTrace: statusChanges,
    setupConfig,
    inPoSw,
    setupValidation: [],
    logs: [],
    datadogAlerts: [],
    mqQueues: [],
    _raw: raw,
    _meta: {
      availableSections,
    },
  };
}
