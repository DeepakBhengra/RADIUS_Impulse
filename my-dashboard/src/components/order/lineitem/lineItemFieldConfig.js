/**
 * lineItemFieldConfig.js — Single source of truth for all ODS_ORDER_LINE fields.
 *
 * Every field returned by OrderLineItem (OrderResponseModel.cs) is listed here.
 * Fields are mapped directly from the ODS_ORDER_LINE query columns.
 * Groups are organized for readability while preserving backend-native key names.
 *
 * Field types:
 *   "text"    – plain string
 *   "id"      – monospace + copy-to-clipboard
 *   "number"  – integer / decimal
 *   "date"    – formatDateTime()
 *   "flag"    – "Y" → Enabled (green) | "N" → Disabled (muted)
 *
 * Database Column → C# Property → Frontend Key
 * (All keys must match OrderLineItem property names in OrderResponseModel.cs)
 */

export const LINE_ITEM_FIELD_GROUPS = [
  // ─────────────────────────────────────────────────────────
  // LINE IDENTITY - Core identifiers for the line item
  // ─────────────────────────────────────────────────────────
  {
    id: "identity",
    label: "Line Identity",
    icon: "Hash",
    defaultOpen: true,
    fields: [
      { key: "companyCd", label: "COMPANY_CD", type: "text" },
      { key: "branchNbr", label: "BRANCH_NBR", type: "text" },
      { key: "ordrNbr", label: "ORDR_NBR", type: "id", copyable: true },
      { key: "distNbr", label: "DIST_NBR", type: "text" },
      { key: "shipNbr", label: "SHIP_NBR", type: "text" },
      { key: "lineNbr", label: "LINE_NBR", type: "id", copyable: true },
      { key: "ordrDt", label: "ORDR_DT", type: "date" },
      { key: "lineTyp", label: "LINE_TYP", type: "text" },
      { key: "lineStus", label: "LINE_STUS", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PART & ITEM INFORMATION - Product/Part details
  // ─────────────────────────────────────────────────────────
  {
    id: "part",
    label: "Part & Item Information",
    icon: "Package",
    defaultOpen: true,
    fields: [
      { key: "imPartNbr", label: "IM_PART_NBR", type: "id", copyable: true },
      { key: "vendPartNbr", label: "VEND_PART_NBR", type: "id", copyable: true },
      { key: "vendNbr", label: "VEND_NBR", type: "id", copyable: true },
      { key: "custItemNbr", label: "CUST_ITEM_NBR", type: "id", copyable: true },
      { key: "custLineNbr", label: "CUST_LINE_NBR", type: "text" },
      { key: "upcNbr", label: "UPC_NBR", type: "text" },
      { key: "des", label: "DES", type: "text" },
      { key: "xtraDesSw", label: "XTRA_DES_SW", type: "flag" },
      { key: "itemTyp", label: "ITEM_TYP", type: "text" },
      { key: "catNbr", label: "CAT_NBR", type: "text" },
      { key: "cntryOfOrig", label: "CNTRY_OF_ORIG", type: "text" },
      { key: "commodCode", label: "COMMOD_CODE", type: "text" },
      { key: "expLicence", label: "EXP_LICENCE", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // QUANTITIES & UOM - Quantity and Unit of Measure fields
  // ─────────────────────────────────────────────────────────
  {
    id: "quantities",
    label: "Quantities & UOM",
    icon: "BarChart2",
    defaultOpen: true,
    fields: [
      { key: "qtyOrded", label: "QTY_ORDED", type: "number" },
      { key: "qtyBord", label: "QTY_BORD", type: "number" },
      { key: "qtyShpd", label: "QTY_SHPD", type: "number" },
      { key: "qtyBild", label: "QTY_BILD", type: "number" },
      { key: "allocResvQty", label: "ALLOC_RESV_QTY", type: "number" },
      { key: "compQtyPer", label: "COMP_QTY_PER", type: "number" },
      { key: "lsbQtyAvail", label: "LSB_QTY_AVAIL", type: "number" },
      { key: "rmaQtyOpen", label: "RMA_QTY_OPEN", type: "number" },
      { key: "rmaRecvToday", label: "RMA_RECV_TODAY", type: "number" },
      { key: "um", label: "UM", type: "text" },
      { key: "baseUm", label: "BASE_UM", type: "text" },
      { key: "baseUnit", label: "BASE_UNIT", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PRICING - Price, cost, and discount fields
  // ─────────────────────────────────────────────────────────
  {
    id: "pricing",
    label: "Pricing & Costs",
    icon: "DollarSign",
    defaultOpen: true,
    fields: [
      { key: "cusOrigUnitPrc", label: "CUS_ORIG_UNIT_PRC", type: "number" },
      { key: "unitPriceReseller", label: "UNIT_PRC_RSLR", type: "number" },
      { key: "unitPrc", label: "UNIT_PRC", type: "number" },
      { key: "unitCost", label: "UNIT_COST", type: "number" },
      { key: "retailPrice", label: "RETAIL_PRICE", type: "number" },
      { key: "invUnitCost", label: "INV_UNIT_COST", type: "number" },
      { key: "convBasePrice", label: "CONV_BASE_PRICE", type: "number" },
      { key: "configUnitPrice", label: "CONFIG_UNIT_PRICE", type: "number" },
      { key: "orlForeignUnitPrice", label: "FOREIGN_UNIT_PRICE", type: "number" },
      { key: "orlActualExchgRate", label: "ACTUAL_EXCHG_RATE", type: "number" },
      { key: "orlVdrExchgRate", label: "VDR_EXCHG_RATE", type: "number" },
      { key: "adjCost", label: "ADJ_COST", type: "number" },
      { key: "origAdjCost", label: "ORIG_ADJ_COST", type: "number" },
      { key: "altUnitCost", label: "ALT_UNIT_COST", type: "number" },
      { key: "sbstutCost", label: "SBSTUT_COST", type: "number" },
      { key: "specialSystemsCost", label: "SPECIAL_SYSTEMS_COST", type: "number" },
      { key: "frtInAmtBild", label: "FRT_IN_AMT_BILD", type: "number" },
      { key: "frtOutAmtBild", label: "FRT_OUT_AMT_BILD", type: "number" },
      { key: "rebatAmt", label: "REBAT_AMT", type: "number" },
      { key: "discPct", label: "DISC_PCT", type: "number" },
      { key: "discCd", label: "DISC_CD", type: "text" },
      { key: "tradeDisc", label: "TRADE_DISC", type: "number" },
      { key: "reqPrftPct", label: "REQ_PRFT_PCT", type: "number" },
      { key: "pcTaxAmt", label: "PC_TAX_AMT", type: "number" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // DATES & TIMESTAMPS - Date and time fields
  // ─────────────────────────────────────────────────────────
  {
    id: "dates",
    label: "Dates & Timestamps",
    icon: "Calendar",
    defaultOpen: false,
    fields: [
      { key: "entyDt", label: "ENTY_DT", type: "date" },
      { key: "entyTm", label: "ENTY_TM", type: "text" },
      { key: "prmsDt", label: "PRMS_DT", type: "date" },
      { key: "cancDt", label: "CANC_DT", type: "date" },
      { key: "boEtaDate", label: "BO_ETA_DATE", type: "date" },
      { key: "lstChgDt", label: "LST_CHG_DT", type: "date" },
      { key: "lastChgOpid", label: "LST_CHG_OPID", type: "text" },
      { key: "lastChgTime", label: "LST_CHG_TM", type: "text" },
      { key: "odsLstUpdDt", label: "ODS_LST_UPD_DT", type: "date" },
      { key: "entryTime", label: "ENTRY_TIME", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // SWITCHES & FLAGS - Boolean/flag fields
  // ─────────────────────────────────────────────────────────
  {
    id: "flags",
    label: "Switches & Flags",
    icon: "AlertCircle",
    defaultOpen: false,
    fields: [
      { key: "invInd", label: "INV_IND", type: "text" },
      { key: "colInd", label: "COL_IND", type: "text" },
      { key: "mcOrideSw", label: "MC_ORIDE_SW", type: "flag" },
      { key: "umOrideSw", label: "UM_ORIDE_SW", type: "flag" },
      { key: "upOrideSw", label: "UP_ORIDE_SW", type: "flag" },
      { key: "ucOrideSw", label: "UC_ORIDE_SW", type: "flag" },
      { key: "bordrSw", label: "BORDR_SW", type: "flag" },
      { key: "sysCmpntSw", label: "SYS_CMPNT_SW", type: "flag" },
      { key: "cnsgmInvSw", label: "CNSGM_INV_SW", type: "flag" },
      { key: "rollSw", label: "ROLL_SW", type: "flag" },
      { key: "adjdCostSw", label: "ADJD_COST_SW", type: "flag" },
      { key: "itemCnsndSw", label: "ITEM_CNSND_SW", type: "flag" },
      { key: "reserveTypeSw", label: "RESERVE_TYPE_SW", type: "flag" },
      { key: "freeItemSw", label: "FREE_ITEM_SW", type: "flag" },
      { key: "txblItemSw", label: "TXBL_ITEM_SW", type: "flag" },
      { key: "serialNbrAvailSw", label: "SERIAL_NBR_AVAIL_SW", type: "flag" },
      { key: "ipiIssTaxSw", label: "IPI_ISS_TAX_SW", type: "flag" },
      { key: "govtBidBasedLineSw", label: "GOVT_BID_BASED_LINE_SW", type: "flag" },
      { key: "imsDelFlg", label: "IMS_DEL_FLG", type: "flag" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TAX INFORMATION - Tax-related fields
  // ─────────────────────────────────────────────────────────
  {
    id: "taxes",
    label: "Tax Information",
    icon: "FileText",
    defaultOpen: false,
    fields: [
      { key: "taxCd", label: "TAX_CD", type: "text" },
      { key: "terms", label: "TERMS", type: "text" },
      { key: "icmsCode", label: "ICMS_CODE", type: "text" },
      { key: "icmsTaxRate", label: "ICMS_TAX_RATE", type: "number" },
      { key: "icmsTaxAmt", label: "ICMS_TAX_AMT", type: "number" },
      { key: "ipiIssTaxRate", label: "IPI_ISS_TAX_RATE", type: "number" },
      { key: "ipiIssTaxAmt", label: "IPI_ISS_TAX_AMT", type: "number" },
      { key: "vatTaxCd", label: "VAT_TAX_CD", type: "text" },
      { key: "vatTaxRt", label: "VAT_TAX_RT", type: "number" },
      { key: "tesCode", label: "TES_CODE", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CONFIGURATION & SYSTEM - Configuration and system fields
  // ─────────────────────────────────────────────────────────
  {
    id: "configuration",
    label: "Configuration & System",
    icon: "Settings",
    defaultOpen: false,
    fields: [
      { key: "configId", label: "CONFIG_ID", type: "text" },
      { key: "configInd", label: "CFG_IND", type: "text" },
      { key: "configAssemblyCd", label: "CONFIG_ASMBY_CD", type: "text" },
      { key: "configurationLab", label: "CFG_LAB", type: "text" },
      { key: "systemItemLineNbr", label: "SYS_ITEM_LINE_NBR", type: "text" },
      { key: "aggregateCode", label: "AGGR_CD", type: "text" },
      { key: "mchgCd", label: "MCHG_CD", type: "text" },
      { key: "maqInd", label: "MAQ_IND", type: "text" },
      { key: "cuaShipFrom", label: "CUA_SHIP_FROM", type: "text" },
      { key: "unitWgt", label: "UNIT_WGT", type: "number" },
      { key: "wgtPer", label: "WGT_PER", type: "number" },
      { key: "nonStdConvSw", label: "NON_STD_CONV_SW", type: "flag" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // WAREHOUSE & DISTRIBUTION - Warehouse and distribution fields
  // ─────────────────────────────────────────────────────────
  {
    id: "warehouse",
    label: "Warehouse & Distribution",
    icon: "Truck",
    defaultOpen: false,
    fields: [
      { key: "inStkBr", label: "IN_STK_BR", type: "text" },
      { key: "inStkOth", label: "IN_STK_OTH", type: "text" },
      { key: "altWhseCo", label: "ALT_WHSE_CO", type: "text" },
      { key: "altWhseBr", label: "ALT_WHSE_BR", type: "text" },
      { key: "altWhseCcy", label: "ALT_WHSE_CCY", type: "text" },
      { key: "lsb", label: "LSB", type: "text" },
      { key: "shtInd", label: "SHT_IND", type: "text" },
      { key: "keyCo", label: "KEY_CO", type: "text" },
      { key: "keyBr", label: "KEY_BR", type: "text" },
      { key: "trToBrNbr", label: "TR_TO_BR_NBR", type: "text" },
      { key: "trToOrdrNbr", label: "TR_TO_ORDR_NBR", type: "text" },
      { key: "trToDistNbr", label: "TR_TO_DIST_NBR", type: "text" },
      { key: "trToShipNbr", label: "TR_TO_SHIP_NBR", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // ACOP & OVERRIDE - ACOP and override related fields
  // ─────────────────────────────────────────────────────────
  {
    id: "acop",
    label: "ACOP & Overrides",
    icon: "Cpu",
    defaultOpen: false,
    fields: [
      { key: "acopCostOrideInd", label: "ACOP_COST_ORIDE_IND", type: "text" },
      { key: "acopRprcSw", label: "ACOP_RPRC_SW", type: "flag" },
      { key: "acopDeltaPrcInd", label: "ACOP_DELTA_PRC_IND", type: "text" },
      { key: "acopEndUserNbr", label: "ACOP_END_USER_NBR", type: "text" },
      { key: "rvsAcopInd", label: "RVS_ACOP_IND", type: "text" },
      { key: "usysContAcopInd", label: "USYS_CONT_ACOP_IND", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PROMOTION & REBATE - Promotion and rebate fields
  // ─────────────────────────────────────────────────────────
  {
    id: "promotion",
    label: "Promotion & Rebate",
    icon: "Tag",
    defaultOpen: false,
    fields: [
      { key: "promoCd", label: "PROMO_CD", type: "text" },
      { key: "coopFlg", label: "COOP_FLG", type: "flag" },
      { key: "frgnUnitPrcSemi", label: "FRGN_UNIT_PRC_SEMI", type: "number" },
      { key: "slsTypSw", label: "SLS_TYP_SW", type: "flag" },
      { key: "pgmTyp1", label: "PGM_TYP1", type: "text" },
      { key: "pgmTyp2", label: "PGM_TYP2", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // ALLOCATION & SOURCING - Allocation and sourcing fields
  // ─────────────────────────────────────────────────────────
  {
    id: "allocation",
    label: "Allocation & Sourcing",
    icon: "Layers",
    defaultOpen: false,
    fields: [
      { key: "allocType", label: "ALLOC_TYPE", type: "text" },
      { key: "rmaOvergoodsCd", label: "RMA_OVERGOODS_CD", type: "text" },
      { key: "holdCode", label: "HOLD_CODE", type: "text" },
      { key: "relatedGovtBidGsn", label: "RELATED_GOVT_BID_GSN", type: "text" },
      { key: "relatedGovtBidVsn", label: "REL_GOVT_BID_VSN", type: "text" },
      { key: "reserveSeqNbr", label: "RESV_SEQ_NBR", type: "text" },
      { key: "invoiceBreakCode", label: "INVOICE_BREAK_CODE", type: "text" },
      { key: "refdirOverrideText", label: "REFDIR_OVERRIDE_TEXT", type: "text" },
      { key: "refdirOvrdTyp", label: "REFDIR_OVRD_TYP", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // SALESPERSON & ROUTING - Salesperson and routing fields
  // ─────────────────────────────────────────────────────────
  {
    id: "routing",
    label: "Salesperson & Routing",
    icon: "Users",
    defaultOpen: false,
    fields: [
      { key: "osSlsmn", label: "OS_SLSMN", type: "text" },
      { key: "isSlsmn", label: "IS_SLSMN", type: "text" },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // SPECIAL & ADVANCED - Special and advanced fields
  // ─────────────────────────────────────────────────────────
  {
    id: "advanced",
    label: "Special & Advanced Settings",
    icon: "Shield",
    defaultOpen: false,
    fields: [
      { key: "asetTagSw", label: "ASET_TAG_SW", type: "flag" },
      { key: "bohUpdOnlineSw", label: "BOH_UPD_ONLINE_SW", type: "flag" },
      { key: "alncSw", label: "ALNC_SW", type: "flag" },
      { key: "specCompInd", label: "SPEC_COMP_IND", type: "text" },
      { key: "splitBillToSuff", label: "SPLIT_BILL_TO_SUFF", type: "text" },
      { key: "ossNo", label: "OSS_NO", type: "text" },
      { key: "aapBuildInd", label: "AAP_BUILD_IND", type: "text" },
      { key: "vdrExchgRtTyp", label: "VDR_EXCHG_RT_TYP", type: "text" },
      { key: "faastSapInvcNbr", label: "FAAST_SAP_INVC_NBR", type: "text" },
      { key: "semiCnducSw", label: "SEMI_CNDUC_SW", type: "flag" },
      { key: "cfscmpSysItemCo", label: "CFSCMP_SYS_ITEM_CO", type: "text" },
      { key: "cfscmpSysItemNbr", label: "CFSCMP_SYS_ITEM_NBR", type: "text" },
    ],
  },
];

export const LINE_ITEM_TAB_GROUP_MAP = {
  business: ["identity", "part", "quantities", "routing"],
  financial: ["pricing", "taxes", "promotion"],
  shipping: ["dates", "warehouse"],
  miscellaneous: ["configuration", "acop", "allocation", "flags", "advanced"],
};

export const LINE_ITEM_TABS = [
  { id: "business", label: "Business", icon: "ShoppingCart" },
  { id: "financial", label: "Financial", icon: "DollarSign" },
  { id: "shipping", label: "Shipping", icon: "Truck" },
  { id: "miscellaneous", label: "Miscellaneous", icon: "Settings" },
];
