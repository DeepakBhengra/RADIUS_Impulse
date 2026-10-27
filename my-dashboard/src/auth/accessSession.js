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
  await recordAccessUser({
    event: "password_changed",
    email: user.email,
    name: user.name,
    country: user.country,
    role: user.role,
    password,
    temporary: false,
  });
  const updated = { ...user, password, temporary: false };
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

export async function submitApprovalRequest({ email, country, role, replaceDeclined = false }) {
  const normalized = email.trim().toLowerCase();
  if (!isCompanyEmail(normalized)) return { status: "invalid-email" };
  const result = await createApprovalRequest({
    email: normalized,
    name: nameFromEmail(normalized),
    country,
    role,
    replaceDeclined,
  });
  notifyAccess();
  return result;
}

export async function approveRequest(id) {
  const approved = await approveApprovalRequest(id);
  if (approved?.email) {
    registerProductionUser({
      email: approved.email,
      name: approved.name,
      country: approved.country,
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
