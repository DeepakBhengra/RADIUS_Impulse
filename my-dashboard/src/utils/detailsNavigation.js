const DETAILS_STORE_KEY = "impulse.details.records.v1";
const MAX_RECORD_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_STORE_SIZE = 200;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function readStore() {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(DETAILS_STORE_KEY) || "{}");
}

function writeStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DETAILS_STORE_KEY, JSON.stringify(store));
}

function createRefId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cleanupStore(store) {
  const now = Date.now();
  const entries = Object.entries(store)
    .filter(([, value]) => {
      if (!value || typeof value !== "object") return false;
      return now - (value.savedAt ?? 0) <= MAX_RECORD_AGE_MS;
    })
    .sort((a, b) => (b[1].savedAt ?? 0) - (a[1].savedAt ?? 0));

  return Object.fromEntries(entries.slice(0, MAX_STORE_SIZE));
}

export function saveDetailsRecord(type, payload) {
  const ref = createRefId();
  const store = cleanupStore(readStore());
  store[ref] = { type, payload, savedAt: Date.now() };
  writeStore(store);
  return ref;
}

export function loadDetailsRecord(ref, type) {
  if (!ref) return null;
  const store = cleanupStore(readStore());
  writeStore(store);
  const entry = store[ref];
  if (!entry || entry.type !== type) return null;
  return entry.payload;
}

function openInNewTab(hashPath, params, type, payload) {
  const ref = saveDetailsRecord(type, payload);
  const query = new URLSearchParams({ ...params, ref }).toString();
  const url = `${window.location.origin}${window.location.pathname}#${hashPath}?${query}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openLineItemDetailsTab(item) {
  openInNewTab(
    "/line-item-details",
    {
      lineNbr: item?.lineNbr ?? "",
      companyCd: item?.companyCd ?? "",
      branchNbr: item?.branchNbr ?? "",
      ordrNbr: item?.ordrNbr ?? "",
    },
    "line-item",
    item,
  );
}

export function openOrderHeaderDetailsTab(record) {
  openInNewTab(
    "/order-header-details",
    {
      custPoNbr: record?.custPoNbr ?? "",
      imiAsgdBrNbr: record?.imiAsgdBrNbr ?? "",
      custNbr: record?.custNbr ?? "",
      partnerId: record?.partnerId ?? "",
    },
    "order-header",
    record,
  );
}

export function openPoSwitchDetailsTab(record) {
  openInNewTab(
    "/po-switch-details",
    {
      coCd: record?.coCd ?? "",
      partnerId: record?.partnerId ?? "",
    },
    "po-switch",
    record,
  );
}

export function openPartnerSetupDetailsTab(record) {
  openInNewTab(
    "/partner-setup-details",
    {
      coCd: record?.coCd ?? "",
      partnerId: record?.partnerId ?? "",
      partnerTypeCd: record?.partnerTypeCd ?? "",
      srceSysId: record?.srceSysId ?? "",
      formatId: record?.formatId ?? "",
      commuId: record?.commuId ?? "",
    },
    "partner-setup",
    record,
  );
}
