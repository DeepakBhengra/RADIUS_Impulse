import { useEffect, useState } from "react";
import {
  approveApprovalRequest,
  createApprovalRequest,
  declineApprovalRequest,
  findGuestLogin,
  listApprovalRequests,
  loginAccessUser,
  recordAccessUser,
  recordGuestLogin,
} from "../services/accessApi";

export { findAccessUser } from "../services/accessApi";

const SESSION_KEY = "radius_access_session";
const REGISTRY_KEY = "radius_registered_users";

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
  { region: "NA", code: "FT", name: "Canada" },
  { region: "NA", code: "MD", name: "United States" },

  { region: "EMEA", code: "AT", name: "Austria" },
  { region: "EMEA", code: "BE", name: "Belgium" },
  { region: "EMEA", code: "DK", name: "Denmark" },
  { region: "EMEA", code: "FI", name: "Finland" },
  { region: "EMEA", code: "FR", name: "France" },
  { region: "EMEA", code: "DE", name: "Germany" },
  { region: "EMEA", code: "UK", name: "Great Britain" },
  { region: "EMEA", code: "HU", name: "Hungary" },
  { region: "EMEA", code: "IE", name: "Ireland" },
  { region: "EMEA", code: "IT", name: "Italy" },
  { region: "EMEA", code: "NL", name: "Netherlands" },
  { region: "EMEA", code: "NO", name: "Norway" },
  { region: "EMEA", code: "CP", name: "Pan Europe" },
  { region: "EMEA", code: "PL", name: "Poland" },
  { region: "EMEA", code: "PT", name: "Portugal" },
  { region: "EMEA", code: "ZA", name: "South Africa" },
  { region: "EMEA", code: "ES", name: "Spain" },
  { region: "EMEA", code: "SE", name: "Sweden" },
  { region: "EMEA", code: "CH", name: "Switzerland" },
  { region: "EMEA", code: "AE", name: "United Arab Emirates" },

  { region: "APAC", code: "AU", name: "Australia" },
  { region: "APAC", code: "CN", name: "China" },
  { region: "APAC", code: "HK", name: "Hong Kong" },
  { region: "APAC", code: "IN", name: "India" },
  { region: "APAC", code: "ID", name: "Indonesia" },
  { region: "APAC", code: "JP", name: "Japan" },
  { region: "APAC", code: "MY", name: "Malaysia" },
  { region: "APAC", code: "NZ", name: "New Zealand" },
  { region: "APAC", code: "PH", name: "Philippines" },
  { region: "APAC", code: "SG", name: "Singapore" },
  { region: "APAC", code: "KR", name: "South Korea" },
  { region: "APAC", code: "LK", name: "Sri Lanka" },
  { region: "APAC", code: "TW", name: "Taiwan" },
  { region: "APAC", code: "TH", name: "Thailand" },
  { region: "APAC", code: "VN", name: "Vietnam" },

  { region: "LATM", code: "AR", name: "Argentina" },
  { region: "LATM", code: "BR", name: "Brazil" },
  { region: "LATM", code: "CL", name: "Chile" },
  { region: "LATM", code: "CO", name: "Colombia" },
  { region: "LATM", code: "EC", name: "Ecuador" },
  { region: "LATM", code: "MX", name: "Mexico" },
  { region: "LATM", code: "PE", name: "Peru" },
  { region: "LATM", code: "UY", name: "Uruguay" },
];

export const PROD_ROLES = [
  "Support Analyst",
  "Order Management",
  "Partner Operations",
  "QA Engineer",
  "Developer",
];

export const COMPANY_EMAIL_DOMAIN = "ingrammicro.com";
export const COMPANY_EMAIL_ERROR = "Only an @ingrammicro.com email ID can be used.";
export const GUEST_PROD_HINT =
  "Prod is locked for guest access. Register for production to request a production user ID.";

export function isCompanyEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const at = normalized.indexOf("@");
  return at > 0 && normalized.slice(at + 1) === COMPANY_EMAIL_DOMAIN && !normalized.slice(0, at).includes("@");
}

const DEMO_PRODUCTION_USER = {
  email: DEMO_ACCOUNTS.production.email,
  country: "MD",
  countries: ["MD"],
  role: "Support Analyst",
  password: DEMO_ACCOUNTS.production.password,
  temporary: false,
};

export function countryLabel(code) {
  const normalized = String(code || "").trim().toUpperCase();
  const country = COUNTRIES.find((item) => item.code === normalized);
  if (country) return `${country.code} — ${country.name}`;
  return normalized || "—";
}

export function orderCountries(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(/[,;]/);
  const wanted = new Set(
    raw.map((item) => String(item || "").trim().toUpperCase()).filter(Boolean),
  );
  const ordered = COUNTRIES.map((item) => item.code).filter((code) => wanted.has(code));
  for (const code of wanted) {
    if (!ordered.includes(code)) ordered.push(code);
  }
  return ordered;
}

export function formatCountries(value) {
  const codes = orderCountries(value);
  if (!codes.length) return "—";
  return codes.map((code) => countryLabel(code)).join(", ");
}

export function countryAllowed(session, environment, code) {
  if (environment !== "Prod") return true;
  if (session?.mode === "admin") return true;
  if (session?.mode !== "production") return false;
  const allowed = new Set(
    orderCountries(session.countries?.length ? session.countries : session.country),
  );
  return allowed.has(String(code || "").trim().toUpperCase());
}

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

function demoProductionUser() {
  return {
    ...DEMO_PRODUCTION_USER,
    name: nameFromEmail(DEMO_PRODUCTION_USER.email),
  };
}

export async function loginProductionUser(email, password) {
  const normalized = email.trim().toLowerCase();
  if (!isCompanyEmail(normalized)) {
    throw new Error(COMPANY_EMAIL_ERROR);
  }
  const demoMatch =
    normalized === DEMO_ACCOUNTS.production.email &&
    password === DEMO_ACCOUNTS.production.password;

  try {
    const result = await loginAccessUser(normalized, password);
    if (result.user) return result.user;
    if (result.status === 404 && demoMatch) return demoProductionUser();
    return null;
  } catch (error) {
    if (demoMatch) return demoProductionUser();
    throw error;
  }
}

export async function changeProductionPassword(user, password) {
  const countries = orderCountries(user.countries?.length ? user.countries : user.country);
  await recordAccessUser({
    event: "password_changed",
    email: user.email,
    name: user.name,
    country: countries.join(","),
    countries,
    role: user.role,
    password,
    temporary: false,
  });
  const updated = {
    ...user,
    country: countries.join(","),
    countries,
    password,
    temporary: false,
  };
  registerProductionUser(updated);
  return updated;
}

function notifyAccess() {
  window.dispatchEvent(new Event("radius-access"));
}

export async function loadApprovals() {
  return listApprovalRequests();
}

export function usePendingApprovalCount(enabled) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return undefined;
    }

    let cancel = false;
    async function load() {
      try {
        const items = await listApprovalRequests();
        if (!cancel) {
          setCount(items.filter((item) => item.status === "pending").length);
        }
      } catch {
        if (!cancel) setCount(0);
      }
    }

    load();
    window.addEventListener("radius-access", load);
    const timer = window.setInterval(load, 15000);
    return () => {
      cancel = true;
      window.removeEventListener("radius-access", load);
      window.clearInterval(timer);
    };
  }, [enabled]);

  return count;
}

export async function submitApprovalRequest({ email, country, countries, role, replaceDeclined = false }) {
  const normalized = email.trim().toLowerCase();
  if (!isCompanyEmail(normalized)) return { status: "invalid-email" };
  const selected = orderCountries(countries?.length ? countries : country);
  if (!selected.length) return { status: "invalid-country" };
  const result = await createApprovalRequest({
    email: normalized,
    name: nameFromEmail(normalized),
    country: selected.join(","),
    countries: selected,
    role,
    replaceDeclined,
  });
  notifyAccess();
  return result;
}

export async function approveRequest(id) {
  const approved = await approveApprovalRequest(id);
  if (approved?.email && approved.temporaryPassword) {
    const countries = orderCountries(approved.countries?.length ? approved.countries : approved.country);
    registerProductionUser({
      email: approved.email,
      name: approved.name,
      country: countries.join(","),
      countries,
      role: approved.role,
      password: approved.temporaryPassword,
      temporary: true,
    });
  }
  notifyAccess();
  return approved;
}

export async function approveAllPending() {
  const pending = (await listApprovalRequests()).filter((request) => request.status === "pending");
  for (const request of pending) {
    await approveRequest(request.id);
  }
  return listApprovalRequests();
}

export async function declineRequest(id, note) {
  const trimmed = String(note || "").trim();
  if (!trimmed) {
    throw new Error("Add a note before declining this request.");
  }
  const declined = await declineApprovalRequest(id, trimmed);
  notifyAccess();
  return declined;
}

export async function recordGuest({ name, email, country, role }) {
  const normalized = email.trim().toLowerCase();
  if (!isCompanyEmail(normalized)) {
    throw new Error(COMPANY_EMAIL_ERROR);
  }
  return recordGuestLogin({
    name: titleName(name),
    email: normalized,
    country,
    role,
  });
}

export async function readGuestLog(email) {
  return findGuestLogin(email);
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
    {
      id: "Prod",
      label: "Prod",
      disabled: !productionEnabled,
      hint: session?.mode === "guest" ? GUEST_PROD_HINT : "",
    },
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
