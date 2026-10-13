import {
  LayoutDashboard,
  Search,
  ShoppingCart,
  ArrowLeftRight,
  Activity,
  ListOrdered,
  FileText,
  BarChart2,
  AlertTriangle,
  Settings,
  Wrench,
} from "lucide-react";

export const NAV_ITEMS = [
  // { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Search, label: "Search", id: "search", active: true },
  // { icon: ShoppingCart, label: "Orders", id: "orders" },
  // { icon: ArrowLeftRight, label: "Transactions", id: "transactions" },
  // { icon: Activity, label: "Monitoring", id: "monitoring", expandable: true },
  // { icon: ListOrdered, label: "Queues", id: "queues" },
  // { icon: FileText, label: "Logs", id: "logs" },
  // { icon: BarChart2, label: "Reports", id: "reports" },
  // { icon: AlertTriangle, label: "Alerts", id: "alerts" },
  // { icon: Settings, label: "Configuration", id: "config", expandable: true },
  // { icon: Wrench, label: "Setup", id: "setup", expandable: true },
];

// Fields exposed on the search screen, per "Front-End Web Portal > Features".
// `supported: true` fields are wired to the live .NET GetOrder endpoint
// today (which only accepts poNumber + countryCode). The rest stay visible
// — matching the doc's intended search surface — but disabled, so the UI
// doesn't silently pretend to support a lookup the backend can't do yet.
// Flip `supported` to true here the day the backend adds that endpoint;
// no other file needs to change.
export const SEARCH_FIELDS = [
  { label: "CUST PO NBR", param: "poNumber", supported: true, maxLength:24 },
  { label: "Country Code", param: "countryCode", supported: true , maxLength:2 },
  { label: "Order Number", param: "orderNumber", supported: true , maxLength:5 },
  // { label: "Partner ID", param: "partnerId", supported: true, maxLength:15 },
  // { label: "Customer Number", param: "accountNumber", supported: true, maxLength: 6},
  // { label: "SKU", param: "sku", supported: true, maxLength: 12 },
  // { label: "Transaction ID", param: "transactionId", supported: true, maxLength: 7},
];

// The three order-entry flows the tool must be able to trace, per
// "Order Flow Coverage" in the dev plan.
export const FLOW_TYPES = [
  {
    id: "edi",
    label: "Flow 1 — EDI Order Flow",
    systems: [
      "SB",
      "SB Message Tracker",
      "C:D",
      "C:E",
      "EDI DB2 DB",
      "Impulse DB",
      "ODS DB",
    ],
  },
  {
    id: "xedi-mq",
    label: "Flow 2 — XEDI + MQ Flow",
    systems: [
      "SB",
      "SB Message Tracker",
      "XEDI",
      "MQ",
      "EDI DB2 DB",
      "Impulse DB",
      "ODS DB",
    ],
  },
  {
    id: "x4c",
    label: "Flow 3 — X4C Flow",
    systems: ["X4C", "TIBCO", "Insideline", "Impulse", "ODS"],
  },
];
