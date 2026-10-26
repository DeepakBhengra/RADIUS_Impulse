import { useState } from "react";
import {
  ChevronDown,
  Globe,
  Lock,
  Mail,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import Header from "../components/layout/Header";
import radiusWatermark from "../assets/RADIUS_Watermark.png";
import {
  COUNTRIES,
  DEMO_ACCOUNTS,
  PROD_ROLES,
  findRegisteredUser,
  recordGuest,
  saveSession,
  submitApprovalRequest,
} from "../auth/accessSession";
import "../components/search/DashboardSearch.css";
import "./LoginPage.css";

const EMPTY_REGISTER = {
  email: "",
  country: "",
  role: "",
};

const PAGE_BACKGROUND = `
  radial-gradient(circle at 5% 20%, rgba(59, 130, 246, 0.07), transparent 25%),
  radial-gradient(circle at 95% 20%, rgba(96, 165, 250, 0.06), transparent 25%),
  linear-gradient(135deg, #f7fbff 0%, #ffffff 50%, #f5f9ff 100%)
`;

export default function LoginPage() {
  const [view, setView] = useState("choose");

  function enter(nextSession) {
    saveSession(nextSession);
    window.location.hash = "#/app";
  }

  return (
    <div className="radius-access min-h-screen font-sans" style={{ background: PAGE_BACKGROUND }}>
      <Header toggleSidebar={() => {}} />
      <main className="pt-14">
        <div className="mx-auto max-w-[1400px] p-4 md:p-5">
          <div className="mx-auto w-full max-w-[480px]">
            {view === "choose" && <AccessChoices onSelect={setView} />}
            {view === "admin" && (
              <AdminSignIn
                onBack={() => setView("choose")}
                onSignedIn={(email) =>
                  enter({ mode: "admin", email, country: "", role: "Administrator" })
                }
              />
            )}
            {view === "prod-register" && (
              <ProductionRegister
                onBack={() => setView("choose")}
                onSignIn={() => setView("prod-signin")}
              />
            )}
            {view === "prod-signin" && (
              <ProductionSignIn
                onBack={() => setView("choose")}
                onRegister={() => setView("prod-register")}
                onGuest={() => setView("guest")}
                onSignedIn={(user) =>
                  enter({
                    mode: "production",
                    email: user.email,
                    name: user.name,
                    country: user.country,
                    role: user.role,
                  })
                }
              />
            )}
            {view === "guest" && (
              <GuestSignIn
                onBack={() => setView("choose")}
                onContinue={(guest) => {
                  recordGuest(guest);
                  enter({
                    mode: "guest",
                    name: guest.name,
                    email: guest.email,
                    country: guest.country,
                    role: guest.role,
                  });
                }}
              />
            )}
          </div>

          <div
            className="pointer-events-none relative -mt-8 h-[380px] overflow-visible"
            aria-hidden="true"
          >
            <img
              src={radiusWatermark}
              alt=""
              className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-50"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Panel({ icon, title, subtitle, children }) {
  return (
    <section className="dashboard-search-card radius-access-card">
      <div className="dashboard-search-title">
        <div className="dashboard-search-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function AccessChoices({ onSelect }) {
  return (
    <Panel
      icon={<Shield size={16} />}
      title="Access RADIUS"
      subtitle="Choose how you want to continue."
    >
      <div className="radius-actions">
        <button className="dashboard-search-button" type="button" onClick={() => onSelect("admin")}>
          <Shield size={15} /> Admin Sign In
        </button>
        <button className="radius-secondary" type="button" onClick={() => onSelect("prod-register")}>
          <UserRound size={15} /> Production Register
        </button>
        <button className="dashboard-search-button" type="button" onClick={() => onSelect("prod-signin")}>
          Production Sign In
        </button>
        <div className="radius-or">OR</div>
        <button className="radius-secondary" type="button" onClick={() => onSelect("guest")}>
          <UserRound size={15} /> Guest Sign In
        </button>
      </div>
      <p className="radius-note">
        Guest access keeps Prod visible and locked. Admin and production sign-in open Prod.
      </p>
    </Panel>
  );
}

function AdminSignIn({ onBack, onSignedIn }) {
  const [email, setEmail] = useState(DEMO_ACCOUNTS.admin.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const matches =
      email.trim().toLowerCase() === DEMO_ACCOUNTS.admin.email &&
      password === DEMO_ACCOUNTS.admin.password;
    if (!matches) {
      setError("Admin credentials were not recognized.");
      return;
    }
    onSignedIn(DEMO_ACCOUNTS.admin.email);
  }

  return (
    <Panel
      icon={<Shield size={16} />}
      title="Admin Sign In"
      subtitle="Enter admin credentials. Signup for production users opens after you sign in."
    >
      <form onSubmit={submit} className="radius-form">
        <Field label="Admin email" type="email" icon={<Mail size={15} />} value={email} onChange={setEmail} />
        <Field label="Password" type="password" icon={<Lock size={15} />} value={password} onChange={setPassword} />
        {error && <div className="radius-error">{error}</div>}
        <button className="dashboard-search-button" type="submit">Sign In</button>
      </form>
      <p className="radius-demo">
        Sample admin: {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}
      </p>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function ProductionSignIn({ onBack, onRegister, onGuest, onSignedIn }) {
  const [email, setEmail] = useState(DEMO_ACCOUNTS.production.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const user = findRegisteredUser(email);
    if (!user || user.password !== password) {
      setError("Production email or password was not recognized.");
      return;
    }
    onSignedIn(user);
  }

  return (
    <Panel
      icon={<Lock size={16} />}
      title="Production Sign In"
      subtitle="For users who already have production access."
    >
      <form onSubmit={submit} className="radius-form">
        <Field label="Company email" type="email" icon={<Mail size={15} />} value={email} onChange={setEmail} />
        <Field label="Password" type="password" icon={<Lock size={15} />} value={password} onChange={setPassword} />
        {error && <div className="radius-error">{error}</div>}
        <button className="dashboard-search-button" type="submit">Sign In</button>
      </form>
      <p className="radius-demo">
        Sample production user: {DEMO_ACCOUNTS.production.email} / {DEMO_ACCOUNTS.production.password}
      </p>
      <button className="radius-link" type="button" onClick={onRegister}>
        New to RADIUS? Register for production
      </button>
      <div className="radius-or">OR</div>
      <button className="radius-secondary" type="button" onClick={onGuest}>
        Continue as Guest
      </button>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function ProductionRegister({ onBack, onSignIn }) {
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [result, setResult] = useState(null);
  const email = form.email.trim().toLowerCase();
  const profileReady = email.includes("@") && form.country && form.role.trim();

  function update(key, value) {
    setResult(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!profileReady) return;
    setResult(submitApprovalRequest({ email, country: form.country, role: form.role.trim() }));
  }

  return (
    <Panel
      icon={<UserRound size={16} />}
      title="Production Register"
      subtitle="Submit your email, country, and role. An admin approves the request and a temporary password is issued for this login ID."
    >
      {result?.status === "created" && (
        <div className="radius-success">
          Approval request sent for {email}. An admin can approve it from Approvals. The temporary password will show against this email.
        </div>
      )}
      {result?.status === "pending" && (
        <div className="radius-error">
          An approval request for {email} is already waiting for an admin.
        </div>
      )}
      {(result?.status === "registered" || result?.status === "approved") && (
        <div className="radius-error">
          {email} already has production access. Sign in with the password issued for this login ID.
        </div>
      )}

      {result?.status !== "created" && (
        <form onSubmit={submit} className="radius-form">
          <Field
            label="Company email"
            type="email"
            icon={<Mail size={15} />}
            value={form.email}
            onChange={(value) => update("email", value)}
          />
          <SelectField
            label="Country"
            icon={<Globe size={15} />}
            value={form.country}
            onChange={(value) => update("country", value)}
            placeholder="Select country"
            options={COUNTRIES.map((country) => ({
              value: country.code,
              label: `${country.code} — ${country.name}`,
            }))}
          />
          <RoleField value={form.role} onChange={(value) => update("role", value)} />
          <button className="dashboard-search-button" type="submit" disabled={!profileReady}>
            Request approval
          </button>
        </form>
      )}

      {(result?.status === "registered" || result?.status === "approved") && (
        <button className="dashboard-search-button" type="button" onClick={onSignIn}>
          Go to Sign In
        </button>
      )}
      <p className="radius-note">
        Example login ID: deepak.bhengra@ingram.com. The greeting uses Deepak Bhengra.
      </p>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function GuestSignIn({ onBack, onContinue }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const ready = name.trim() && email.includes("@") && country && role.trim();

  function submit(event) {
    event.preventDefault();
    if (!ready) return;
    onContinue({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      country,
      role: role.trim(),
    });
  }

  return (
    <Panel
      icon={<Sparkles size={16} />}
      title="Guest Sign In"
      subtitle="No password is required. Your name, email, country, and role are stored for this guest sign-in."
    >
      <form onSubmit={submit} className="radius-form">
        <Field label="Name" type="text" icon={<UserRound size={15} />} value={name} onChange={setName} />
        <Field label="Email" type="email" icon={<Mail size={15} />} value={email} onChange={setEmail} />
        <SelectField
          label="Country"
          icon={<Globe size={15} />}
          value={country}
          onChange={setCountry}
          placeholder="Select country"
          options={COUNTRIES.map((item) => ({
            value: item.code,
            label: `${item.code} — ${item.name}`,
          }))}
        />
        <RoleField value={role} onChange={setRole} />
        <button className="dashboard-search-button" type="submit" disabled={!ready}>
          Continue as Guest
        </button>
      </form>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function RoleField({ value, onChange }) {
  const preset = PROD_ROLES.includes(value);
  const [otherMode, setOtherMode] = useState(Boolean(value) && !preset);
  const selected = otherMode ? "Others" : value;

  return (
    <>
      <SelectField
        label="Role"
        icon={<Shield size={15} />}
        value={selected}
        onChange={(next) => {
          if (next === "Others") {
            setOtherMode(true);
            onChange("");
            return;
          }
          setOtherMode(false);
          onChange(next);
        }}
        placeholder="Select role"
        options={[
          ...PROD_ROLES.map((role) => ({ value: role, label: role })),
          { value: "Others", label: "Others" },
        ]}
      />
      {otherMode && (
        <Field
          label="Other role"
          type="text"
          icon={<Shield size={15} />}
          value={preset ? "" : value}
          onChange={onChange}
          placeholder="Type the role"
        />
      )}
    </>
  );
}

function Field({ label, type, icon, value, onChange, placeholder }) {
  return (
    <label className="dashboard-search-field">
      {label}
      <span className="dashboard-input">
        {icon}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function SelectField({ label, icon, value, onChange, placeholder, options }) {
  return (
    <label className="dashboard-search-field">
      {label}
      <span className="dashboard-input dashboard-select">
        {icon}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="dashboard-select-chevron" />
      </span>
    </label>
  );
}
