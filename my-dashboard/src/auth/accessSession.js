const SESSION_KEY = "radius_access_session";
const REGISTRY_KEY = "radius_registered_users";
const APPROVAL_KEY = "radius_approval_requests";
const GUEST_LOG_KEY = "radius_guest_log";

export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@ingrammicro.com",
    password: "admin1234",
  },
  production: {
    email: "prod.user@ingrammicro.com",
    password: "RadiusProd#1",
  },
};

export const COUNTRIES = [
  { code: "MD", name: "United States" },
  { code: "FT", name: "Canada" },
  { code: "UK", name: "Great Britain" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
];

export const PROD_ROLES = [
  "Support Analyst",
  "Order Management",
  "Partner Operations",
  "QA Engineer",
  "Developer",
];

const DEMO_PRODUCTION_USER = {
  email: DEMO_ACCOUNTS.production.email,
  country: "MD",
  role: "Support Analyst",
  password: DEMO_ACCOUNTS.production.password,
  temporary: false,
};

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("radius-access"));
}

function readSessionStore(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function nameFromEmail(email) {
  const local = String(email || "").split("@")[0];
  const parts = local.split(/[._+\-]+/).filter(Boolean);
  if (!parts.length) return "";
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function titleName(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function displayName(session) {
  if (session?.name?.trim()) return titleName(session.name);
  if (session?.email) return nameFromEmail(session.email);
  return "";
}

export function initialsFromName(name) {
  const parts = String(name || "").split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
  return letters.join("") || "U";
}

export function readRegistry() {
  const stored = readStore(REGISTRY_KEY, null);
  if (Array.isArray(stored)) return stored;
  return [DEMO_PRODUCTION_USER];
}

export function saveRegistry(users) {
  writeStore(REGISTRY_KEY, users);
}

export function findRegisteredUser(email) {
  const normalized = email.trim().toLowerCase();
  return readRegistry().find((user) => user.email === normalized) || null;
}

export function registerProductionUser(user) {
  const email = user.email.trim().toLowerCase();
  const next = readRegistry().filter((entry) => entry.email !== email);
  next.push({
    ...user,
    email,
    name: user.name || nameFromEmail(email),
  });
  saveRegistry(next);
}

export function readApprovals() {
  const stored = readStore(APPROVAL_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

function saveApprovals(requests) {
  writeStore(APPROVAL_KEY, requests);
}

export function pendingApprovalCount() {
  return readApprovals().filter((request) => request.status === "pending").length;
}

export function submitApprovalRequest({ email, country, role }) {
  const normalized = email.trim().toLowerCase();
  if (findRegisteredUser(normalized)) {
    return { status: "registered" };
  }

  const requests = readApprovals();
  const existing = requests.find((request) => request.email === normalized);
  if (existing?.status === "pending") return { status: "pending", request: existing };
  if (existing?.status === "approved") return { status: "approved", request: existing };

  const request = {
    id: crypto.randomUUID(),
    email: normalized,
    name: nameFromEmail(normalized),
    country,
    role,
    status: "pending",
    requestedAt: new Date().toISOString(),
    approvedAt: "",
    temporaryPassword: "",
  };
  saveApprovals([request, ...requests.filter((item) => item.email !== normalized)]);
  return { status: "created", request };
}

function temporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const bytes = new Uint32Array(8);
  crypto.getRandomValues(bytes);
  const pick = (set, index) => set[bytes[index] % set.length];
  return `Tmp${pick(digits, 0)}${pick(alphabet, 1)}${pick(alphabet, 2)}${pick(alphabet, 3)}#${pick(alphabet, 4)}${pick(alphabet, 5)}${pick(alphabet, 6)}${pick(alphabet, 7)}`;
}

export function approveRequest(id) {
  const current = readApprovals().find((request) => request.id === id);
  if (!current || current.status !== "pending") return current || null;

  const password = temporaryPassword();
  registerProductionUser({
    email: current.email,
    name: current.name,
    country: current.country,
    role: current.role,
    password,
    temporary: true,
  });

  const approved = {
    ...current,
    status: "approved",
    temporaryPassword: password,
    approvedAt: new Date().toISOString(),
  };
  saveApprovals(
    readApprovals().map((request) => (request.id === id ? approved : request)),
  );
  return approved;
}

export function approveAllPending() {
  const pending = readApprovals().filter((request) => request.status === "pending");
  pending.forEach((request) => approveRequest(request.id));
  return readApprovals();
}

export function recordGuest({ name, email, country, role }) {
  const entry = {
    name: titleName(name),
    email: email.trim().toLowerCase(),
    country,
    role,
    signedInAt: new Date().toISOString(),
  };
  const current = readGuestLog().filter((guest) => guest.email !== entry.email);
  writeStore(GUEST_LOG_KEY, [entry, ...current]);
  return entry;
}

export function readGuestLog() {
  const stored = readStore(GUEST_LOG_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

export function saveSession(session) {
  const next = {
    ...session,
    email: session.email?.trim().toLowerCase() || "",
    name: session.name?.trim() ? titleName(session.name) : nameFromEmail(session.email),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export function readSession() {
  return readSessionStore(SESSION_KEY, null);
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function environmentChoices(session) {
  const productionEnabled =
    session?.mode === "production" || session?.mode === "admin";

  return [
    { id: "Prod", label: "Prod", disabled: !productionEnabled },
    { id: "Qa", label: "Qa", disabled: false },
    { id: "Dev", label: "Dev", disabled: false },
  ];
}

export function passwordIssues(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function passwordIsValid(password) {
  const issues = passwordIssues(password);
  return Object.values(issues).every(Boolean);
}
