/**
 * fieldConfig.js
 *
 * IMPORTANT:
 * These are ONLY React keys / .NET JSON camelCase property names.
 *
 * Do NOT use DB2 column names here.
 *
 * Example:
 * COMPANY_CD     -> custCoCd
 * BRANCH_NBR     -> custBr
 * ORDR_NBR       -> imiAsgdOrdrNbr
 * CUST_ORDR_NBR  -> custPoNbr
 */

export const ORDER_STATUS_MAP = {
  "10": { label: "Draft", color: "gray" },
  "20": { label: "Processing", color: "blue" },
  "30": { label: "Booked", color: "blue" },
  "40": { label: "Completed", color: "green" },
  "50": { label: "Cancelled", color: "red" },
  "60": { label: "On Hold", color: "amber" },
  "70": { label: "Backordered", color: "amber" },
  "80": { label: "Shipped", color: "green" },
  "90": { label: "Closed", color: "gray" },

  completed: { label: "Completed", color: "green" },
  processing: { label: "Processing", color: "blue" },
  cancelled: { label: "Cancelled", color: "red" },
  shipped: { label: "Shipped", color: "green" },
  "on hold": { label: "On Hold", color: "amber" },
  booked: { label: "Booked", color: "blue" },
  draft: { label: "Draft", color: "gray" },
};

export const HOLD_CODE_MAP = {
  H1: "Credit Hold",
  H2: "Compliance Hold",
  H3: "Fraud Review",
  H4: "Inventory Hold",
  H5: "Approval Pending",
  IM: "IM Internal Hold",
  SA: "Sales Authorization Hold",
  VR: "Vendor Request Hold",
};

/* -------------------------------------------------------------------------- */
/* SUMMARY FIELDS                                                             */
/* -------------------------------------------------------------------------- */

export const SUMMARY_FIELDS = [
  {
    key: "imiAsgdOrdrNbr",
    label: "Order Number",
    icon: "Hash",
    copyable: true,
    type: "id",
  },
  {
    key: "custPoNbr",
    label: "Customer PO Number",
    icon: "FileText",
    copyable: true,
    type: "id",
  },
  {
    key: "custCoCd",
    label: "Company Code",
    icon: "Building2",
    type: "text",
  },
  {
    key: "custBr",
    label: "Customer Branch",
    icon: "Building2",
    type: "text",
  },
  {
    key: "billToCustNbr",
    label: "Bill-To Customer",
    icon: "CreditCard",
    copyable: true,
    type: "id",
  },
  {
    key: "termId",
    label: "Term ID",
    icon: "Globe",
    type: "text",
  },
  {
    key: "ordrCcyCd",
    label: "Currency",
    icon: "DollarSign",
    type: "text",
  },
  {
    key: "countryCode",
    label: "Country",
    icon: "MapPin",
    type: "text",
  },
  {
    key: "resellerNbr",
    label: "Reseller Number",
    icon: "UserCheck",
    copyable: true,
    type: "id",
  },
  {
    key: "endUserPoNbr",
    label: "End-User PO Number",
    icon: "FileText",
    copyable: true,
    type: "id",
  },
  {
    key: "priorityCode",
    label: "Priority Code",
    icon: "Flag",
    type: "text",
  },
  {
    key: "ordrDt",
    label: "Order Date",
    icon: "Calendar",
    type: "date",
  },
];

/* -------------------------------------------------------------------------- */
/* FIELD GROUPS                                                               */
/* -------------------------------------------------------------------------- */

export const FIELD_GROUPS = [

  // ==========================================================================
  // ORDER DETAILS
  // ==========================================================================

  {
    id: "orderInfo",
    label: "Order Information",
    icon: "ShoppingCart",
    defaultOpen: true,
    fields: [
      {
        key: "imiAsgdOrdrNbr",
        label: "Order Number",
        copyable: true,
        type: "id",
      },
      {
        key: "custPoNbr",
        label: "Customer PO Number",
        copyable: true,
        type: "id",
      },
      {
        key: "ordrDt",
        label: "Order Date",
        type: "date",
      },
      {
        key: "ordRefNbr",
        label: "Order Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "ordrStatus",
        label: "Order Status",
        type: "text",
      },
      {
        key: "entyDt",
        label: "Entry Date",
        type: "date",
      },
      {
        key: "entyTm",
        label: "Entry Time",
        type: "text",
      },
      {
        key: "entyMthd",
        label: "Entry Method",
        type: "text",
      },
      {
        key: "termId",
        label: "Term ID",
        type: "text",
      },
      {
        key: "priorityCode",
        label: "Priority Code",
        type: "text",
      },
      {
        key: "contract",
        label: "Contract",
        type: "text",
      },
      {
        key: "campaign",
        label: "Campaign",
        type: "text",
      },
      {
        key: "ackCode",
        label: "Acknowledgement Code",
        type: "text",
      },
      {
        key: "sourceCode",
        label: "Source Code",
        type: "text",
      },
      {
        key: "copyCode",
        label: "Copy Code",
        type: "text",
      },
      {
        key: "wasBord",
        label: "Was Backordered",
        type: "flag",
      },
    ],
  },

  {
    id: "customerInfo",
    label: "Customer Information",
    icon: "User",
    defaultOpen: false,
    fields: [
      {
        key: "custCoCd",
        label: "Customer Company Code",
        type: "text",
      },
      {
        key: "custBr",
        label: "Customer Branch",
        type: "text",
      },
      {
        key: "billToCustNbr",
        label: "Bill-To Customer Number",
        copyable: true,
        type: "id",
      },
      {
        key: "custRefNbr",
        label: "Customer Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "custRefNbr2",
        label: "Customer Reference Number 2",
        copyable: true,
        type: "id",
      },
      {
        key: "custType",
        label: "Customer Type",
        type: "text",
      },
      {
        key: "capsIdCd",
        label: "CAPS ID Code",
        type: "text",
      },
      {
        key: "capsBuyer",
        label: "CAPS Buyer",
        type: "text",
      },
    ],
  },

  {
    id: "endUserInfo",
    label: "End User Information",
    icon: "Users",
    defaultOpen: false,
    fields: [
      {
        key: "endUserPoNbr",
        label: "End-User PO Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endUserNbr",
        label: "End-User Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endUserDataSw",
        label: "End-User Data Switch",
        type: "flag",
      },
      {
        key: "endUserAuthorization",
        label: "End-User Authorization",
        type: "text",
      },
      {
        key: "endUserAddrSuffix",
        label: "End-User Address Suffix",
        type: "text",
      },
      {
        key: "endUserVendorFlag",
        label: "End-User Vendor Flag",
        type: "flag",
      },
      {
        key: "endUserContSuffix",
        label: "End-User Contact Suffix",
        type: "text",
      },
      {
        key: "endUserOrderSw",
        label: "End-User Order Switch",
        type: "flag",
      },
    ],
  },

  {
    id: "salesInfo",
    label: "Sales Information",
    icon: "Briefcase",
    defaultOpen: false,
    fields: [
      {
        key: "osSlsmn",
        label: "Outside Salesman",
        type: "text",
      },
      {
        key: "isSlsmn",
        label: "Inside Salesman",
        type: "text",
      },
      {
        key: "userNam",
        label: "User Name",
        type: "text",
      },
      {
        key: "ediCo",
        label: "EDI Company",
        type: "text",
      },
      {
        key: "splitSw",
        label: "Split Switch",
        type: "flag",
      },
    ],
  },

  {
    id: "endCustomerInfo",
    label: "End Customer Information",
    icon: "UserCircle",
    defaultOpen: false,
    fields: [
      {
        key: "endCustId",
        label: "End Customer ID",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustNum",
        label: "End Customer Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "resellerInfo",
    label: "Reseller Information",
    icon: "UserCheck",
    defaultOpen: false,
    fields: [
      {
        key: "resellerNbr",
        label: "Reseller Number",
        copyable: true,
        type: "id",
      },
      {
        key: "vendorClaimNbr",
        label: "Vendor Claim Number",
        copyable: true,
        type: "id",
      },
      {
        key: "resellerSplitPct",
        label: "Reseller Split %",
        type: "number",
      },
    ],
  },


  // ==========================================================================
  // FINANCE
  // ==========================================================================

  {
    id: "billingInfo",
    label: "Billing & Invoice Details",
    icon: "CreditCard",
    defaultOpen: false,
    fields: [
      {
        key: "billToBranchNbr",
        label: "Bill-To Branch Number",
        type: "text",
      },
      {
        key: "billToCustNbr",
        label: "Bill-To Customer Number",
        copyable: true,
        type: "id",
      },
      {
        key: "billToSfx",
        label: "Bill-To Suffix",
        type: "text",
      },
      {
        key: "splitBillToSw",
        label: "Split Bill-To Switch",
        type: "flag",
      },
      {
        key: "summInvoiceCode",
        label: "Summary Invoice Code",
        type: "text",
      },
      {
        key: "glOffsetNbr",
        label: "GL Offset Number",
        type: "text",
      },
      {
        key: "glOffsetType",
        label: "GL Offset Type",
        type: "text",
      },
      {
        key: "payeeNbr",
        label: "Payee Number",
        copyable: true,
        type: "id",
      },
      {
        key: "payeeSuf",
        label: "Payee Suffix",
        type: "text",
      },
      {
        key: "soldToSuffix",
        label: "Sold-To Suffix",
        type: "text",
      },
    ],
  },

  {
    id: "financialInfo",
    label: "Financial Information",
    icon: "DollarSign",
    defaultOpen: false,
    fields: [
      {
        key: "terms",
        label: "Terms",
        type: "text",
      },
      {
        key: "ordrCcyCd",
        label: "Order Currency",
        type: "text",
      },
      {
        key: "ccyRate",
        label: "Currency Rate",
        type: "number",
      },
      {
        key: "orderValueAtAdd",
        label: "Order Value at Add",
        type: "currency",
      },
      {
        key: "tradeDisc",
        label: "Trade Discount",
        type: "number",
      },
      {
        key: "crRels",
        label: "Credit Release",
        type: "text",
      },
      {
        key: "crCrdSw",
        label: "Credit Card Switch",
        type: "flag",
      },
      {
        key: "priceRecalcSw",
        label: "Price Recalculation Switch",
        type: "flag",
      },
    ],
  },


  // ==========================================================================
  // SHIPPING
  // ==========================================================================

  {
    id: "shippingInfo",
    label: "Shipping Information",
    icon: "Truck",
    defaultOpen: false,
    fields: [
      {
        key: "shipToSfx",
        label: "Ship-To Suffix",
        type: "text",
      },
      {
        key: "freightForwarder",
        label: "Freight Forwarder",
        type: "text",
      },
      {
        key: "deliveryTerms",
        label: "Delivery Terms",
        type: "text",
      },
      {
        key: "resdntlSw",
        label: "Residential Switch",
        type: "flag",
      },
      {
        key: "fulmntSw",
        label: "Fulfillment Switch",
        type: "flag",
      },
      {
        key: "lastShipmentNbr",
        label: "Last Shipment Number",
        copyable: true,
        type: "id",
      },
      {
        key: "lastDistNbr",
        label: "Last Distribution Number",
        copyable: true,
        type: "id",
      },
      {
        key: "cuaShipFrom",
        label: "CUA Ship From",
        type: "text",
      },
      {
        key: "binTyp",
        label: "Bin Type",
        type: "text",
      },
      {
        key: "ordrCmpltFillSw",
        label: "Complete Fill Switch",
        type: "flag",
      },
    ],
  },


  // ==========================================================================
  // COMPLIANCE
  // ==========================================================================

  {
    id: "governmentInfo",
    label: "Government & Compliance",
    icon: "Shield",
    defaultOpen: false,
    fields: [
      {
        key: "govtBidFlg",
        label: "Government Bid Flag",
        type: "flag",
      },
      {
        key: "govtEndUserZip",
        label: "Government End-User ZIP",
        type: "text",
      },
      {
        key: "govtGsaInd",
        label: "GSA Indicator",
        type: "flag",
      },
      {
        key: "govtEndUserTyp",
        label: "Government End-User Type",
        type: "text",
      },
      {
        key: "indiaGstOrderInd",
        label: "India GST Order Indicator",
        type: "flag",
      },
      {
        key: "flrngAuthActnCd",
        label: "Floor-Ready Authorization Action Code",
        type: "text",
      },
      {
        key: "flrngAuthNbr",
        label: "Floor-Ready Authorization Number",
        copyable: true,
        type: "id",
      },
      {
        key: "tnSpecCd",
        label: "TN Specification Code",
        type: "text",
      },
    ],
  },


  // ==========================================================================
  // MISCELLANEOUS
  // ==========================================================================

  {
    id: "miscellaneous",
    label: "Miscellaneous",
    icon: "MoreHorizontal",
    defaultOpen: false,
    fields: [
      {
        key: "baseRateOrdrSw",
        label: "Base Rate Order Switch",
        type: "flag",
      },
      {
        key: "extSoCode",
        label: "External SO Code",
        type: "text",
      },
      {
        key: "jobAcctNbr",
        label: "Job Account Number",
        copyable: true,
        type: "id",
      },
      {
        key: "gwmdImagApplyFlag",
        label: "GWMD Image Apply Flag",
        type: "flag",
      },
      {
        key: "aodSw",
        label: "AOD Switch",
        type: "flag",
      },
      {
        key: "specialHandleSw",
        label: "Special Handling Switch",
        type: "flag",
      },
      {
        key: "imsDelFlg",
        label: "IMS Delete Flag",
        type: "flag",
      },
      {
        key: "cfgFlg",
        label: "Configuration Flag",
        type: "flag",
      },
      {
        key: "enhancedRmaSw",
        label: "Enhanced RMA Switch",
        type: "flag",
      },
      {
        key: "enhancedCrMemoSw",
        label: "Enhanced Credit Memo Switch",
        type: "flag",
      },
      {
        key: "poCrtedSw",
        label: "PO Created Switch",
        type: "flag",
      },
      {
        key: "outsourceSkuInd",
        label: "Outsource SKU Indicator",
        type: "flag",
      },
      {
        key: "deleteTodaySw",
        label: "Delete Today Switch",
        type: "flag",
      },
      {
        key: "orderManagementSw",
        label: "Order Management Switch",
        type: "flag",
      },
      {
        key: "allianceSw",
        label: "Alliance Switch",
        type: "flag",
      },
      {
        key: "ediCo",
        label: "EDI Company",
        type: "text",
      },
      {
        key: "ackCode",
        label: "Acknowledgement Code",
        type: "text",
      },
      {
        key: "sourceCode",
        label: "Source Code",
        type: "text",
      },
      {
        key: "summInvoiceCode",
        label: "Summary Invoice Code",
        type: "text",
      },
    ],
  },
];
/**
 * Count populated fields.
 */
export function countAvailableFields(order) {
  if (!order) return 0;

  return FIELD_GROUPS
    .flatMap((group) => group.fields)
    .filter(
      (field) =>
        order[field.key] !== null &&
        order[field.key] !== undefined &&
        order[field.key] !== "",
      )
    .length;
}

export default FIELD_GROUPS;