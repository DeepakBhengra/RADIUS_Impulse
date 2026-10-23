const SESSION_KEY = "radius_access_session";
const REGISTRY_KEY = "radius_registered_users";

export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@ingrammicro.com",
    password: "RadiusAdmin#1",
  },
  production: {
    email: "prod.user@ingrammicro.com",
    password: "RadiusProd#1",
  },
};

export const PROD_ALLOWLIST = [
  "prod.user@ingrammicro.com",
  "new.prod@ingrammicro.com",
  "analyst@ingrammicro.com",
];

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

export const GUEST_TEAMS = [
  "Order Support",
  "EDI Operations",
  "Partner Setup",
  "Message Queue",
  "Diagnostics",
];

function readJson(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function readRegistry() {
  const stored = readJson(REGISTRY_KEY, null);
  if (Array.isArray(stored)) return stored;
  return [
    {
      email: DEMO_ACCOUNTS.production.email,
      country: "MD",
      role: "Support Analyst",
      password: DEMO_ACCOUNTS.production.password,
    },
  ];
}

export function saveRegistry(users) {
  sessionStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
}

export function findRegisteredUser(email) {
  const normalized = email.trim().toLowerCase();
  return readRegistry().find((user) => user.email === normalized) || null;
}

export function registerProductionUser(user) {
  const next = readRegistry().filter(
    (entry) => entry.email !== user.email.trim().toLowerCase(),
  );
  next.push({
    ...user,
    email: user.email.trim().toLowerCase(),
  });
  saveRegistry(next);
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function readSession() {
  return readJson(SESSION_KEY, null);
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function environmentChoices(session) {
  const productionEnabled =
    session?.mode === "production" || session?.mode === "admin";

  return [
    {
      id: "Prod",
      label: "Production",
      disabled: !productionEnabled,
    },
    { id: "Qa", label: "QA", disabled: false },
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
