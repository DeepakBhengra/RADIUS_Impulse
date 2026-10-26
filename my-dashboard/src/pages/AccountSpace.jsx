import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import {
  COUNTRIES,
  approveAllPending,
  approveRequest,
  clearSession,
  displayName,
  pendingApprovalCount,
  readApprovals,
  readGuestLog,
  readSession,
} from "../auth/accessSession";
import "../components/search/DashboardSearch.css";
import "./AccountSpace.css";

function countryLabel(code) {
  const country = COUNTRIES.find((item) => item.code === code);
  return country ? `${country.code} — ${country.name}` : code || "—";
}

function formatWhen(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function signOut() {
  clearSession();
  window.location.hash = "#/login";
}

export default function AccountSpace() {
  const session = readSession();
  if (session?.mode === "admin") return <AdminApprovals />;
  return <PersonalProfile session={session} />;
}

function AdminApprovals() {
  const [requests, setRequests] = useState(() => readApprovals());
  const pending = requests.filter((request) => request.status === "pending");
  const approved = requests.filter((request) => request.status === "approved");
  const name = displayName(readSession());

  function refresh() {
    setRequests(readApprovals());
  }

  return (
    <div className="account-space">
      <section className="dashboard-search-card">
        <div className="dashboard-search-title">
          <div className="dashboard-search-icon">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h2>Good day, {name}</h2>
            <p>
              Production approval requests are listed here. Approving a request creates a temporary password for that login ID.
            </p>
          </div>
        </div>

        <div className="account-toolbar">
          <span>{pendingApprovalCount()} pending</span>
          <button
            className="dashboard-search-button account-approve-all"
            type="button"
            disabled={pending.length === 0}
            onClick={() => {
              approveAllPending();
              refresh();
            }}
          >
            Approve all
          </button>
        </div>

        {pending.length === 0 && approved.length === 0 && (
          <p className="account-empty">No approval requests yet. A production registration will appear here.</p>
        )}

        {pending.length > 0 && (
          <RequestTable
            title="Pending"
            requests={pending}
            onApprove={(id) => {
              approveRequest(id);
              refresh();
            }}
          />
        )}

        {approved.length > 0 && <RequestTable title="Approved" requests={approved} />}
      </section>
      <button className="account-signout" type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}

function RequestTable({ title, requests, onApprove }) {
  return (
    <div className="account-block">
      <h3>{title}</h3>
      <div className="account-table">
        {requests.map((request) => (
          <article key={request.id} className="account-row">
            <div>
              <strong>{request.email}</strong>
              <span>{request.name}</span>
            </div>
            <div>
              <span>Country</span>
              <strong>{countryLabel(request.country)}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{request.role}</strong>
            </div>
            <div>
              <span>{request.status === "approved" ? "Temporary password" : "Requested"}</span>
              {request.status === "approved" ? (
                <code>{request.temporaryPassword}</code>
              ) : (
                <strong>{formatWhen(request.requestedAt)}</strong>
              )}
            </div>
            {onApprove && (
              <button type="button" className="account-approve" onClick={() => onApprove(request.id)}>
                <Check size={14} /> Approve
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function PersonalProfile({ session }) {
  const name = displayName(session);
  const guestRecord =
    session?.mode === "guest"
      ? readGuestLog().find((guest) => guest.email === session.email)
      : null;

  return (
    <div className="account-space">
      <section className="dashboard-search-card">
        <div className="dashboard-search-title">
          <div className="dashboard-search-icon">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h2>Good day, {name || "there"}</h2>
            <p>
              {session?.mode === "guest"
                ? "Guest details stored for this sign-in. Production stays locked."
                : "Production access is enabled for this login ID."}
            </p>
          </div>
        </div>
        <dl className="account-profile">
          <div>
            <dt>Name</dt>
            <dd>{name || "—"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{session?.email || "—"}</dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>{countryLabel(guestRecord?.country || session?.country)}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{guestRecord?.role || session?.role || "—"}</dd>
          </div>
        </dl>
      </section>
      <button className="account-signout" type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
