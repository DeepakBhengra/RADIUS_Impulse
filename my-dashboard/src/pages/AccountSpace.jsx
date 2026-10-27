import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, ShieldCheck, X } from "lucide-react";
import {
  COUNTRIES,
  approveAllPending,
  approveRequest,
  clearSession,
  declineRequest,
  displayName,
  loadApprovals,
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

function backToRadius() {
  window.location.hash = "#/app";
}

async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
  } catch {
    // Fall through to the selection copy below.
  }
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

export default function AccountSpace() {
  const session = readSession();
  if (session?.mode === "admin") return <AdminApprovals />;
  return <PersonalProfile session={session} />;
}

function AdminApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pending = requests.filter((request) => request.status === "pending");
  const approved = requests.filter((request) => request.status === "approved");
  const declined = requests.filter((request) => request.status === "declined");
  const name = displayName(readSession());

  async function refresh() {
    const items = await loadApprovals();
    setRequests(items);
    return items;
  }

  useEffect(() => {
    let cancel = false;
    refresh()
      .catch((loadError) => {
        if (!cancel) setError(loadError.message || "The access log could not be reached.");
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, []);

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
              Approving a request creates a temporary password for that login ID. Declining a request keeps a note with the decision.
            </p>
          </div>
        </div>

        {error && <p className="account-error">{error}</p>}

        <div className="account-toolbar">
          <span>{pending.length} pending</span>
          <button
            className="dashboard-search-button account-approve-all"
            type="button"
            disabled={pending.length === 0}
            onClick={async () => {
              try {
                setError("");
                await approveAllPending();
                refresh();
              } catch (approveError) {
                refresh();
                setError(approveError.message || "The access log could not be reached.");
              }
            }}
          >
            Approve all
          </button>
        </div>

        {loading && <p className="account-empty">Loading approval requests...</p>}
        {!loading && pending.length === 0 && approved.length === 0 && declined.length === 0 && (
          <p className="account-empty">No approval requests yet. A production registration will appear here.</p>
        )}

        {pending.length > 0 && (
          <RequestTable
            title="Pending"
            requests={pending}
            onApprove={async (id) => {
              try {
                setError("");
                await approveRequest(id);
                refresh();
              } catch (approveError) {
                setError(approveError.message || "The access log could not be reached.");
              }
            }}
            onDecline={async (id, note) => {
              try {
                setError("");
                await declineRequest(id, note);
                await refresh();
              } catch (declineError) {
                setError(declineError.message || "This request could not be declined.");
              }
            }}
          />
        )}

        {approved.length > 0 && <RequestTable title="Approved" requests={approved} />}
        {declined.length > 0 && (
          <RequestTable title="Declined" requests={declined} dateLabel="Decline date" dateKey="declinedAt" />
        )}
      </section>
      <div className="account-actions">
        <button className="account-back" type="button" onClick={backToRadius}>
          <ArrowLeft size={14} /> Back to RADIUS
        </button>
        <button className="account-signout" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}

function RequestTable({ title, requests, onApprove, onDecline, dateLabel = "Approval date", dateKey = "approvedAt" }) {
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
              <span>Request date</span>
              <strong>{formatWhen(request.requestedAt)}</strong>
            </div>
            <div>
              <span>{dateLabel}</span>
              <strong>{formatWhen(request[dateKey])}</strong>
            </div>
            <div>
              <span>Temporary password</span>
              {request.temporaryPassword ? (
                <PasswordValue value={request.temporaryPassword} />
              ) : (
                <strong>—</strong>
              )}
            </div>
            {request.note && <p className="account-row-note">Note: {request.note}</p>}
            {onApprove && (
              <DecisionActions
                onApprove={() => onApprove(request.id)}
                onDecline={(note) => onDecline(request.id, note)}
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function DecisionActions({ onApprove, onDecline }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="account-decide">
      <label className="account-note-field">
        Decline note
        <textarea
          value={note}
          placeholder="Why this request is declined"
          onChange={(event) => {
            setNote(event.target.value);
            setError("");
          }}
        />
      </label>
      <div className="account-decide-buttons">
        <button type="button" className="account-approve" onClick={onApprove}>
          <Check size={14} /> Approve
        </button>
        <button
          type="button"
          className="account-decline"
          onClick={() => {
            if (!note.trim()) {
              setError("Add a note before declining this request.");
              return;
            }
            onDecline(note.trim());
          }}
        >
          <X size={14} /> Decline
        </button>
      </div>
      {error && <p className="account-inline-error">{error}</p>}
    </div>
  );
}

function PasswordValue({ value }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="account-password">
      <code>{value}</code>
      <button
        type="button"
        className="account-copy"
        onClick={copy}
        aria-label={copied ? "Temporary password copied" : "Copy temporary password"}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
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
      <div className="account-actions">
        <button className="account-back" type="button" onClick={backToRadius}>
          <ArrowLeft size={14} /> Back to RADIUS
        </button>
        <button className="account-signout" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
