import { useMemo, useState } from "react";
import {
  ChevronDown,
  Globe,
  Lock,
  Mail,
  Shield,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Header from "../components/layout/Header";
import radiusWatermark from "../assets/RADIUS_Watermark.png";
import {
  COUNTRIES,
  DEMO_ACCOUNTS,
  GUEST_TEAMS,
  PROD_ALLOWLIST,
  PROD_ROLES,
  findRegisteredUser,
  passwordIsValid,
  passwordIssues,
  registerProductionUser,
  saveSession,
} from "../auth/accessSession";
import "../components/search/DashboardSearch.css";
import "./LoginPage.css";

const EMPTY_REGISTER = {
  email: "",
  country: "",
  role: "",
  password: "",
  confirm: "",
};

const PAGE_BACKGROUND = `
  radial-gradient(circle at 5% 20%, rgba(59, 130, 246, 0.07), transparent 25%),
  radial-gradient(circle at 95% 20%, rgba(96, 165, 250, 0.06), transparent 25%),
  linear-gradient(135deg, #f7fbff 0%, #ffffff 50%, #f5f9ff 100%)
`;

function goToDashboard() {
  window.location.hash = "#/app";
}

export default function LoginPage() {
  const [view, setView] = useState("choose");
  const [session, setSession] = useState(null);
  const [environment, setEnvironment] = useState("Dev");

  function enter(nextSession, preferredEnvironment) {
    saveSession(nextSession);
    setSession(nextSession);
    setEnvironment(preferredEnvironment);
    setView("ready");
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
                  enter(
                    { mode: "admin", email, country: "", role: "Administrator" },
                    "Prod",
                  )
                }
              />
            )}
            {(view === "prod-register" || view === "admin-signup") && (
              <ProductionRegister
                adminMode={view === "admin-signup"}
                onBack={() => setView(view === "admin-signup" ? "ready" : "choose")}
                onSignIn={() => setView("prod-signin")}
                onGuest={() => setView("guest")}
                onCreated={(user) =>
                  enter(
                    {
                      mode: "production",
                      email: user.email,
                      country: user.country,
                      role: user.role,
                    },
                    "Prod",
                  )
                }
              />
            )}
            {view === "prod-signin" && (
              <ProductionSignIn
                onBack={() => setView("choose")}
                onRegister={() => setView("prod-register")}
                onGuest={() => setView("guest")}
                onSignedIn={(user) =>
                  enter(
                    {
                      mode: "production",
                      email: user.email,
                      country: user.country,
                      role: user.role,
                    },
                    "Prod",
                  )
                }
              />
            )}
            {view === "guest" && (
              <GuestSignIn
                onBack={() => setView("choose")}
                onContinue={(guest) =>
                  enter(
                    {
                      mode: "guest",
                      email: guest.email,
                      country: guest.country,
                      team: guest.team,
                    },
                    "Dev",
                  )
                }
              />
            )}
            {view === "ready" && session && (
              <AccessReady
                session={session}
                environment={environment}
                onEnvironment={setEnvironment}
                onSignup={() => setView("admin-signup")}
                onRestart={() => setView("choose")}
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
        Guest access includes Dev and QA only. Production stays visible and locked.
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

function ProductionRegister({ adminMode = false, onBack, onSignIn, onGuest, onCreated }) {
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [submitted, setSubmitted] = useState(false);
  const rules = passwordIssues(form.password);
  const email = form.email.trim().toLowerCase();
  const existing = email ? findRegisteredUser(email) : null;
  const allowlisted = PROD_ALLOWLIST.includes(email) || adminMode;
  const profileReady = email.includes("@") && form.country && form.role;

  const state = useMemo(() => {
    if (!submitted || !profileReady) return "form";
    if (existing) return "already";
    if (!allowlisted) return "blocked";
    return "create";
  }, [submitted, profileReady, existing, allowlisted]);

  function update(key, value) {
    if (key === "email" || key === "country" || key === "role") {
      setSubmitted(false);
    }
    setForm((current) => ({ ...current, [key]: value }));
  }

  function review(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  function createAccount(event) {
    event.preventDefault();
    if (!passwordIsValid(form.password) || form.password !== form.confirm) return;
    const user = {
      email,
      country: form.country,
      role: form.role,
      password: form.password,
    };
    registerProductionUser(user);
    onCreated(user);
  }

  return (
    <Panel
      icon={<UserRound size={16} />}
      title={adminMode ? "Production signup" : "Production Register"}
      subtitle={
        adminMode
          ? "Admin registration can add a production user."
          : "Tell us your email, country, and role. Approved company emails can create a password."
      }
    >
      {state === "blocked" && (
        <div className="radius-error">
          {email} is not authorised to register for production access. Continue as a guest to use Dev and QA.
        </div>
      )}
      {state === "already" && (
        <div className="radius-error">
          You have already registered. Please sign in with your existing credentials.
        </div>
      )}

      <form onSubmit={state === "create" ? createAccount : review} className="radius-form">
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
        <SelectField
          label="Role"
          icon={<Shield size={15} />}
          value={form.role}
          onChange={(value) => update("role", value)}
          placeholder="Select role"
          options={PROD_ROLES.map((role) => ({ value: role, label: role }))}
        />

        {state === "create" && (
          <>
            <Field
              label="Create password"
              type="password"
              icon={<Lock size={15} />}
              value={form.password}
              onChange={(value) => update("password", value)}
            />
            <Field
              label="Confirm password"
              type="password"
              icon={<Lock size={15} />}
              value={form.confirm}
              onChange={(value) => update("confirm", value)}
            />
            <ul className="radius-rules">
              <li className={rules.length ? "ok" : ""}>At least 8 characters</li>
              <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
              <li className={rules.lower ? "ok" : ""}>One lowercase letter</li>
              <li className={rules.number ? "ok" : ""}>One number</li>
              <li className={rules.special ? "ok" : ""}>One special character</li>
            </ul>
            {form.confirm && form.confirm !== form.password && (
              <div className="radius-error">Passwords do not match.</div>
            )}
          </>
        )}

        {state !== "already" && state !== "blocked" && (
          <button className="dashboard-search-button" type="submit" disabled={!profileReady}>
            {state === "create" ? "Create Account" : "Continue"}
          </button>
        )}
      </form>

      {state === "blocked" && (
        <button className="radius-secondary" type="button" onClick={onGuest}>Continue as Guest</button>
      )}
      {state === "already" && (
        <button className="dashboard-search-button" type="button" onClick={onSignIn}>Go to Sign In</button>
      )}
      <p className="radius-note">Registration is available only to approved production users.</p>
      <p className="radius-demo">
        Try new.prod@ingrammicro.com to create an account, or anyone@example.com to see the guest path.
      </p>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function GuestSignIn({ onBack, onContinue }) {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const ready = email.includes("@") && country && team;

  function submit(event) {
    event.preventDefault();
    if (!ready) return;
    onContinue({
      email: email.trim().toLowerCase(),
      country,
      team,
    });
  }

  return (
    <Panel
      icon={<Sparkles size={16} />}
      title="Guest Sign In"
      subtitle="No password is required. Your email, country, and team are kept for the access log."
    >
      <form onSubmit={submit} className="radius-form">
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
        <SelectField
          label="Team"
          icon={<Users size={15} />}
          value={team}
          onChange={setTeam}
          placeholder="Select team"
          options={GUEST_TEAMS.map((item) => ({ value: item, label: item }))}
        />
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

function AccessReady({ session, environment, onEnvironment, onSignup, onRestart }) {
  const productionEnabled = session.mode === "production" || session.mode === "admin";
  const choices = [
    { id: "Prod", label: "Production", disabled: !productionEnabled },
    { id: "Qa", label: "QA", disabled: false },
    { id: "Dev", label: "Dev", disabled: false },
  ];

  return (
    <Panel
      icon={<Sparkles size={16} />}
      title={
        session.mode === "admin"
          ? "Admin access"
          : session.mode === "production"
            ? "Production access"
            : "Guest access"
      }
      subtitle={[
        `Signed in as ${session.email}`,
        session.role,
        session.team,
        session.country,
      ]
        .filter(Boolean)
        .join(" · ")}
    >
      <div className="radius-success">
        {productionEnabled
          ? "Production, QA, and Dev are available in the environment dropdown."
          : "Production is visible but locked. QA and Dev are available."}
      </div>
      <div className="radius-env">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={choice.disabled}
            className={environment === choice.id ? "active" : ""}
            onClick={() => onEnvironment(choice.id)}
          >
            <span>{choice.label}</span>
            <span>{choice.disabled ? "Locked" : environment === choice.id ? "Selected" : "Open"}</span>
          </button>
        ))}
      </div>
      {session.mode === "admin" && (
        <button className="radius-secondary" type="button" onClick={onSignup}>
          Open production signup
        </button>
      )}
      <button className="dashboard-search-button" type="button" onClick={goToDashboard}>
        Continue to dashboard
      </button>
      <button className="radius-link" type="button" onClick={onRestart}>
        Use a different access option
      </button>
    </Panel>
  );
}

function Field({ label, type, icon, value, onChange }) {
  return (
    <label className="dashboard-search-field">
      {label}
      <span className="dashboard-input">
        {icon}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
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
