// ─── Mock Data ──────────────────────────────────────────────────────────────
// This file stands in for the "Consolidated JSON Response" the doc's
// architecture describes coming back from the API/Middleware layer after it
// fans out to DB2, ODS, TBX, MQ, and Datadog. Keeping it isolated means
// services/api.js can be pointed at a real backend later without any
// component code changing — only this file (or its usage) goes away.

export const ORDER = {
  // Keys match mapOrderResponse.js const order — ORSHED column-style names.
  custOrdrNbr: "PO456789", // CUST_ORDR_NBR
  ordrNbr: "ORD123456789", // ORDR_NBR
  entyDt: "2024-05-15", // ENTY_DT
  companyCd: "US", // COMPANY_CD
  termId: "Partner Portal", // TERM_ID
  bordrStus: "Completed", // BORDR_STUS
  billToCustNbr: "ACCT10001", // BILL_TO_CUST_NBR
  branchNbr: "001",
  // stateCd: "05EDP704",
  eoStateCd: "75EDP799",
  // eoStateCd: "05EDP700",
  // BRANCH_NBR
};

export const LINE_ITEMS = [
  {
    line: 1,
    sku: "SKU12345",
    description: "Dell PowerEdge R750",
    qty: 2,
    unitPrice: "3,250.00",
    totalPrice: "6,500.00",
    status: "Completed",
  },
  {
    line: 2,
    sku: "SKU67890",
    description: "HPE ProLiant DL380",
    qty: 1,
    unitPrice: "2,850.00",
    totalPrice: "2,850.00",
    status: "Completed",
  },
  {
    line: 3,
    sku: "SKU54321",
    description: "Cisco Catalyst 9200",
    qty: 3,
    unitPrice: "1,150.00",
    totalPrice: "3,450.00",
    status: "Completed",
  },
  {
    line: 4,
    sku: "SKU98765",
    description: "Microsoft Windows Server 2022",
    qty: 2,
    unitPrice: "1,100.00",
    totalPrice: "2,200.00",
    status: "Completed",
  },
  {
    line: 5,
    sku: "SKU11223",
    description: "Veeam Backup & Replication",
    qty: 1,
    unitPrice: "678.90",
    totalPrice: "678.90",
    status: "Completed",
  },
];

// Old six-step "Processing Flow Status" stepper — still used for the
// high-level progress bar at the top of the flow card.
export const PROCESSING_STEPS = [
  { label: "Order\nReceived", time: "May 15, 10:30 AM" },
  { label: "Validation", time: "May 15, 10:30 AM" },
  { label: "Pricing &\nAvailability", time: "May 15, 10:31 AM" },
  { label: "Order\nBooking", time: "May 16, 10:32 AM" },
  { label: "Fulfillment", time: "May 15, 10:35 AM" },
  { label: "Completed", time: "May 15, 10:40 AM" },
];
// ============================================================
// PARTNER SETUP MOCK DATA
// ============================================================

export const PARTNER = {
  coCd: "10",
  partnerId: "100245",
  partnerTypeCd: "CUSTOMER",
};

// Multiple setup records for the same Partner
export const PARTNER_SETUP = [
  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "IMPULSE",
    srceSysKeyId: "CUST-100245-US",

    formatId: "X12-850",
    docId: "850",

    commuId: "EDI-US-001",
    internetAddrTxt: "EDI-US-001",
    dirFlgCd: "OUT",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-US-001",

    freqId: "DAILY",
    cycleIntvl: "24",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-20 14:30:00",

    actvDt: "2024-05-15",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-20 14:45:00",
    lstChgNam: "EDI-ADMIN",

    setupNotesTxt: "Primary customer EDI configuration.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "XEDI",
    srceSysKeyId: "CUST-100245-XEDI",

    formatId: "X12-855",
    docId: "855",

    commuId: "XEDI-US-002",
    internetAddrTxt: "XEDI-US-002",
    dirFlgCd: "IN",
    sendThruId: "APIGEE",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 2,
    ovrdApplBatchId: "BATCH-XEDI-001",

    freqId: "REALTIME",
    cycleIntvl: "15",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-21 11:20:00",

    actvDt: "2024-05-16",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-21 11:20:00",
    lstChgNam: "XEDI-ADMIN",

    setupNotesTxt: "XEDI inbound acknowledgement setup.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "IMPULSE",
    srceSysKeyId: "CUST-100245-856",

    formatId: "X12-856",
    docId: "856",

    commuId: "EDI-US-003",
    internetAddrTxt: "EDI-US-003",
    dirFlgCd: "OUT",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "ODS",
    prcsOptnFlg: "Y",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-ASN-001",

    freqId: "REALTIME",
    cycleIntvl: "20",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-22 16:10:00",

    actvDt: "2024-05-18",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-22 16:10:00",
    lstChgNam: "EDI-ADMIN",

    setupNotesTxt: "ASN processing configuration.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "IMPULSE",
    srceSysKeyId: "CUST-100245-810",

    formatId: "X12-810",
    docId: "810",

    commuId: "EDI-US-004",
    internetAddrTxt: "EDI-US-004",
    dirFlgCd: "OUT",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-INV-001",

    freqId: "DAILY",
    cycleIntvl: "24",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-23 15:25:00",

    actvDt: "2024-05-20",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-23 15:25:00",
    lstChgNam: "EDI-ADMIN",

    setupNotesTxt: "Invoice transaction setup.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "ODS",
    srceSysKeyId: "CUST-100245-ODS",

    formatId: "XML",
    docId: "ORDER",

    commuId: "ODS-US-005",
    internetAddrTxt: "ODS-US-005",
    dirFlgCd: "IN",
    sendThruId: "TIBCO",

    dataStoreMechId: "ODS",
    prcsOptnFlg: "Y",
    batchSplitCnt: 3,
    ovrdApplBatchId: "BATCH-ODS-001",

    freqId: "REALTIME",
    cycleIntvl: "10",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-24 12:30:00",

    actvDt: "2024-05-21",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-24 12:30:00",
    lstChgNam: "ODS-ADMIN",

    setupNotesTxt: "ODS synchronization setup.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "SEEBURGER",
    srceSysKeyId: "CUST-100245-SBGR",

    formatId: "X12-855",
    docId: "855",

    commuId: "SBGR-US-006",
    internetAddrTxt: "SBGR-US-006",
    dirFlgCd: "IN",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 2,
    ovrdApplBatchId: "BATCH-SBGR-001",

    freqId: "REALTIME",
    cycleIntvl: "20",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-25 09:30:00",

    actvDt: "2024-05-22",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-25 09:30:00",
    lstChgNam: "EDI-ADMIN",

    setupNotesTxt: "Seeburger communication setup.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "XEDI",
    srceSysKeyId: "CUSTOMER-100245-XEDI-PRODUCTION-PRIMARY",

    formatId: "X12-850",
    docId: "850",

    commuId: "XEDI-CUSTOMER-100245-PRODUCTION",
    internetAddrTxt: "XEDI-CUSTOMER-100245-PRODUCTION",
    dirFlgCd: "OUT",
    sendThruId: "APIGEE",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 4,
    ovrdApplBatchId: "BATCH-XEDI-PROD-001",

    freqId: "REALTIME",
    cycleIntvl: "10",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-27 14:20:00",

    actvDt: "2024-05-25",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-27 14:20:00",
    lstChgNam: "XEDI-ADMIN",

    setupNotesTxt: "Primary XEDI production configuration.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "LEGACY",
    srceSysKeyId: "CUST-100245-LEGACY",

    formatId: "X12-810",
    docId: "810",

    commuId: "LEGACY-US-008",
    internetAddrTxt: "LEGACY-US-008",
    dirFlgCd: "OUT",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "N",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-LEGACY-001",

    freqId: "DAILY",
    cycleIntvl: "24",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-01-10 12:00:00",

    actvDt: "2023-11-10",
    deactvDt: "2024-01-10",
    holdCd: "N",

    lstChgTs: "2024-01-10 12:00:00",
    lstChgNam: "SYSTEM",

    setupNotesTxt: "Legacy configuration retained for historical reference.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "IMPULSE",
    srceSysKeyId: "CUST-100245-PENDING",

    formatId: "",
    docId: "",

    commuId: "",
    internetAddrTxt: "",
    dirFlgCd: "OUT",
    sendThruId: "",

    dataStoreMechId: "",
    prcsOptnFlg: "",
    batchSplitCnt: "",
    ovrdApplBatchId: "",

    freqId: "",
    cycleIntvl: "",
    cycStrtTm: "",
    cycEndTm: "",
    cycleLstRunTs: "",

    actvDt: "",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "",
    lstChgNam: "",

    setupNotesTxt: "Pending partner setup configuration.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "TEST",
    srceSysKeyId: "CUST-100245-TEST",

    formatId: "X12-850",
    docId: "850",

    commuId: "TEST-US-010",
    internetAddrTxt: "TEST-US-010",
    dirFlgCd: "OUT",
    sendThruId: "SEEBURGER",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-TEST-001",

    freqId: "DAILY",
    cycleIntvl: "24",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-28 10:00:00",

    actvDt: "2024-05-28",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-28 10:00:00",
    lstChgNam: "TEST-ADMIN",

    setupNotesTxt: "Test environment partner configuration.",
  },

  {
    coCd: "10",
    partnerId: "100245",
    partnerTypeCd: "CUSTOMER",

    srceSysId: "QA",
    srceSysKeyId: "CUST-100245-QA",

    formatId: "X12-850",
    docId: "850",

    commuId: "QA-US-011",
    internetAddrTxt: "QA-US-011",
    dirFlgCd: "OUT",
    sendThruId: "APIGEE",

    dataStoreMechId: "DB2",
    prcsOptnFlg: "Y",
    batchSplitCnt: 1,
    ovrdApplBatchId: "BATCH-QA-001",

    freqId: "DAILY",
    cycleIntvl: "24",
    cycStrtTm: "00:00",
    cycEndTm: "23:59",
    cycleLstRunTs: "2024-05-29 11:00:00",

    actvDt: "2024-05-29",
    deactvDt: "",
    holdCd: "N",

    lstChgTs: "2024-05-29 11:00:00",
    lstChgNam: "QA-ADMIN",

    setupNotesTxt: "QA environment partner configuration.",
  },
];

// ============================================================
// PARTNER SETUP VALIDATION
// ============================================================

export const PARTNER_SETUP_VALIDATION = [
  {
    srceSysKeyId: "CUST-100245-US",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-US",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-US",
    type: "Communication Setup",
    status: "OK",
  },

  {
    srceSysKeyId: "CUST-100245-XEDI",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-XEDI",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-XEDI",
    type: "Communication Setup",
    status: "OK",
  },

  {
    srceSysKeyId: "CUST-100245-856",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-856",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-856",
    type: "Communication Setup",
    status: "OK",
  },

  {
    srceSysKeyId: "CUST-100245-810",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-810",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-810",
    type: "Communication Setup",
    status: "OK",
  },

  {
    srceSysKeyId: "CUST-100245-ODS",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-ODS",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-ODS",
    type: "Communication Setup",
    status: "OK",
  },

  {
    srceSysKeyId: "CUST-100245-SBGR",
    type: "Source System Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-SBGR",
    type: "Format Mapping",
    status: "OK",
  },
  {
    srceSysKeyId: "CUST-100245-SBGR",
    type: "Communication Setup",
    status: "OK",
  },
];

// ============================================================
// PARTNER COMMUNICATION SETUP
// ============================================================

export const COMMUNICATION_SETUP = [
  {
    srceSysKeyId: "CUST-100245-US",
    protocol: "EDI",
    communicationId: "EDI-US-001",
    direction: "OUT",
    sendThru: "SEEBURGER",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-XEDI",
    protocol: "XEDI",
    communicationId: "XEDI-US-002",
    direction: "IN",
    sendThru: "APIGEE",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-856",
    protocol: "EDI",
    communicationId: "EDI-US-003",
    direction: "OUT",
    sendThru: "SEEBURGER",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-810",
    protocol: "EDI",
    communicationId: "EDI-US-004",
    direction: "OUT",
    sendThru: "SEEBURGER",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-ODS",
    protocol: "ODS",
    communicationId: "ODS-US-005",
    direction: "IN",
    sendThru: "TIBCO",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-SBGR",
    protocol: "EDI",
    communicationId: "SBGR-US-006",
    direction: "IN",
    sendThru: "SEEBURGER",
    status: "ACTIVE",
  },
  {
    srceSysKeyId: "CUST-100245-LEGACY",
    protocol: "EDI",
    communicationId: "LEGACY-US-008",
    direction: "OUT",
    sendThru: "SEEBURGER",
    status: "INACTIVE",
  },
];

// ============================================================
// PARTNER SETUP LOGS
// ============================================================

export const PARTNER_SETUP_LOGS = [
  {
    time: "2024-05-15 10:30:15",
    level: "INFO",
    srceSysKeyId: "CUST-100245-US",
    msg: "Partner setup loaded successfully",
  },
  {
    time: "2024-05-15 10:30:16",
    level: "INFO",
    srceSysKeyId: "CUST-100245-US",
    msg: "Source system mapping validated",
  },
  {
    time: "2024-05-15 10:30:17",
    level: "INFO",
    srceSysKeyId: "CUST-100245-US",
    msg: "Format configuration validated",
  },
  {
    time: "2024-05-16 09:15:10",
    level: "INFO",
    srceSysKeyId: "CUST-100245-XEDI",
    msg: "XEDI partner setup loaded successfully",
  },
  {
    time: "2024-05-16 09:15:12",
    level: "INFO",
    srceSysKeyId: "CUST-100245-XEDI",
    msg: "XEDI communication configuration validated",
  },
  {
    time: "2024-05-18 08:30:10",
    level: "INFO",
    srceSysKeyId: "CUST-100245-856",
    msg: "ASN configuration loaded successfully",
  },
  {
    time: "2024-05-20 10:00:15",
    level: "INFO",
    srceSysKeyId: "CUST-100245-810",
    msg: "Invoice configuration loaded successfully",
  },
  {
    time: "2024-05-21 09:45:20",
    level: "INFO",
    srceSysKeyId: "CUST-100245-ODS",
    msg: "ODS synchronization configuration validated",
  },
  {
    time: "2024-05-22 11:15:10",
    level: "INFO",
    srceSysKeyId: "CUST-100245-SBGR",
    msg: "Seeburger communication configuration validated",
  },
  {
    time: "2024-05-25 08:00:05",
    level: "INFO",
    srceSysKeyId: "CUSTOMER-100245-XEDI-PRODUCTION-PRIMARY",
    msg: "XEDI production configuration loaded successfully",
  },
];

// ============================================================
// CONSOLIDATED PARTNER RESPONSE
// ============================================================

export function buildPartnerSetupResponse() {
  return {
    partner: PARTNER,
    partnerSetup: PARTNER_SETUP,
    setupValidation: PARTNER_SETUP_VALIDATION,
    communicationSetup: COMMUNICATION_SETUP,
    logs: PARTNER_SETUP_LOGS,
  };
}

export const PARTNER_SETUP_RESPONSE = buildPartnerSetupResponse();
// New: per-system flow trace (System / Status / Timestamp / Remarks), one
// array per order-entry flow — this is the "Flow Trace" table from the
// doc's "Result Screen" mockup, keyed by the flow ids in data/navigation.js.
export const FLOW_TRACE = {
  edi: [
    {
      system: "SB",
      status: "Success",
      timestamp: "10:01 AM",
      remarks: "Received",
    },
    {
      system: "SB Message Tracker",
      status: "Success",
      timestamp: "10:01 AM",
      remarks: "Logged",
    },
    {
      system: "C:D",
      status: "Success",
      timestamp: "10:02 AM",
      remarks: "Sent",
    },
    {
      system: "C:E",
      status: "Failed",
      timestamp: "10:03 AM",
      remarks: "Timeout",
    },
    {
      system: "EDI DB2 DB",
      status: "Success",
      timestamp: "10:04 AM",
      remarks: "Persisted",
    },
    {
      system: "Impulse DB",
      status: "Success",
      timestamp: "10:04 AM",
      remarks: "Persisted",
    },
    {
      system: "ODS DB",
      status: "Success",
      timestamp: "10:05 AM",
      remarks: "Synced",
    },
  ],
  "xedi-mq": [
    {
      system: "SB",
      status: "Success",
      timestamp: "10:01 AM",
      remarks: "Received",
    },
    {
      system: "SB Message Tracker",
      status: "Success",
      timestamp: "10:01 AM",
      remarks: "Logged",
    },
    {
      system: "XEDI",
      status: "Success",
      timestamp: "10:02 AM",
      remarks: "Transformed",
    },
    {
      system: "MQ",
      status: "Queue Delay",
      timestamp: "10:05 AM",
      remarks: "Depth High",
    },
    {
      system: "EDI DB2 DB",
      status: "Pending",
      timestamp: "—",
      remarks: "Awaiting MQ",
    },
    {
      system: "Impulse DB",
      status: "Pending",
      timestamp: "—",
      remarks: "Awaiting MQ",
    },
    {
      system: "ODS DB",
      status: "Pending",
      timestamp: "—",
      remarks: "Awaiting MQ",
    },
  ],
  x4c: [
    {
      system: "X4C",
      status: "Success",
      timestamp: "10:01 AM",
      remarks: "Received",
    },
    {
      system: "TIBCO",
      status: "Success",
      timestamp: "10:02 AM",
      remarks: "Routed",
    },
    {
      system: "Insideline",
      status: "Success",
      timestamp: "10:03 AM",
      remarks: "Processed",
    },
    {
      system: "Impulse",
      status: "Success",
      timestamp: "10:04 AM",
      remarks: "Booked",
    },
    {
      system: "ODS",
      status: "Success",
      timestamp: "10:05 AM",
      remarks: "Synced",
    },
  ],
};

export const SETUP_CONFIG = [
  ["Source System", "Partner Portal", "ERP System", "Microsoft Dynamics 365"],
  [
    "OMS Version",
    "OMS 10.2.1",
    "Integration Profile",
    "PARTNER_PORTAL_DEFAULT",
  ],
  ["Routing Rule", "DEFAULT_ORDER_ROUTING", "Workflow Version", "WF_ORD_v2.3"],
  ["Created By", "system", "Created By", "May 15, 2024 10:30 AM"],
];

// New: "Setup Validation Section" from the doc's Result Screen mockup —
// distinct from SETUP_CONFIG, this reflects pass/fail mapping checks.
export const SETUP_VALIDATION = [
  { type: "DB2 Mapping", status: "OK" },
  { type: "TBX Mapping", status: "Missing" },
  { type: "ODS Setup", status: "OK" },
];

export const LOGS = [
  {
    time: "2024-05-15 10:30:15",
    level: "INFO",
    msg: "Order received ORD123456789 from partner P123456",
  },
  {
    time: "2024-05-15 10:30:16",
    level: "INFO",
    msg: "Order validation successful",
  },
  {
    time: "2024-05-15 10:30:18",
    level: "INFO",
    msg: "Pricing and availability check completed",
  },
  {
    time: "2024-05-15 10:30:21",
    level: "INFO",
    msg: "Order booking initiated",
  },
  {
    time: "2024-05-15 10:30:25",
    level: "INFO",
    msg: "Order booked successfully in ERP",
  },
  {
    time: "2024-05-15 10:30:30",
    level: "INFO",
    msg: "Fulfillment process started",
  },
  {
    time: "2024-05-15 10:30:35",
    level: "INFO",
    msg: "Order fulfillment completed",
  },
  {
    time: "2024-05-15 10:30:40",
    level: "INFO",
    msg: "Order processing completed successfully",
  },
];

// New: Datadog "Alert / Severity / Details" table from the Result Screen
// mockup — separate from raw log lines above.
export const DATADOG_ALERTS = [
  {
    alert: "MQ Queue High",
    severity: "High",
    details: "Queue depth exceeded threshold on ORDER.FULFILLMENT",
  },
  {
    alert: "C:E Timeout",
    severity: "Medium",
    details: "Downstream response exceeded 5s SLA",
  },
];

export const MQ_QUEUES = [
  {
    name: "ORDER.IN",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.VALIDATION",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.BOOKING",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.FULFILLMENT",
    status: "Active",
    messages: 3,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.NOTIFICATION",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
];

// Bundles everything a "search" resolves to, mirroring the doc's
// "Consolidated JSON Response". services/api.js returns this shape.
export function buildConsolidatedResponse() {
  return {
    order: ORDER,
    lineItems: LINE_ITEMS,
    processingSteps: PROCESSING_STEPS,
    flowTrace: FLOW_TRACE,
    setupConfig: SETUP_CONFIG,
    setupValidation: SETUP_VALIDATION,
    logs: LOGS,
    datadogAlerts: DATADOG_ALERTS,
    mqQueues: MQ_QUEUES,
    // Partner Setup
    partner: PARTNER,
    partnerSetup: PARTNER_SETUP,
    partnerSetupValidation: PARTNER_SETUP_VALIDATION,
    communicationSetup: COMMUNICATION_SETUP,
    partnerSetupLogs: PARTNER_SETUP_LOGS,
  };
}
