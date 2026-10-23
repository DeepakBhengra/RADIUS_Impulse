import { useMemo, useState } from "react";
import {
  Cloud,
  Database,
  GitBranch,
  Lock,
  Mail,
  Server,
  Shield,
  UserRound,
  Workflow,
} from "lucide-react";
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
import "./LoginPage.css";

const EMPTY_REGISTER = {
  email: "",
  country: "",
  role: "",
  password: "",
  confirm: "",
};

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
    <main className="radius-login">
      <section className="radius-hero">
        <div className="radius-brand">
          <div className="radius-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <Shield size={22} />
          </div>
          <div>
            <h1>RADIUS</h1>
            <p>Rapid Analysis, Diagnostics, and Intelligence for Unified Support</p>
          </div>
        </div>
        <h2>Welcome to RADIUS</h2>
        <p className="lede">Rapid diagnostics. Smarter support. Faster resolution.</p>
        <div className="radius-orbit" aria-hidden="true">
          <div className="radius-orbit-core">RADIUS</div>
          <div className="radius-node n1"><Workflow size={14} /> Order Processing</div>
          <div className="radius-node n2"><Mail size={14} /> Message Queues</div>
          <div className="radius-node n3"><Database size={14} /> DB2</div>
          <div className="radius-node n4"><Server size={14} /> Seeburger</div>
          <div className="radius-node n5"><Cloud size={14} /> APIs</div>
          <div className="radius-node n6"><GitBranch size={14} /> Diagnostic Flows</div>
        </div>
        <p className="radius-vpn"><Lock size={14} /> Available through the company VPN.</p>
      </section>

      <div className="radius-panel-wrap">
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
                  number: guest.number,
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
    </main>
  );
}

function AccessChoices({ onSelect }) {
  return (
    <section className="radius-panel">
      <h3>Access RADIUS</h3>
      <p className="sub">Choose how you want to continue.</p>
      <button className="radius-choice primary" type="button" onClick={() => onSelect("admin")}>
        <Shield size={16} /> Admin Sign In
      </button>
      <button className="radius-choice" type="button" onClick={() => onSelect("prod-register")}>
        <UserRound size={16} /> Production Register
      </button>
      <button className="radius-choice primary" type="button" onClick={() => onSelect("prod-signin")}>
        Production Sign In
      </button>
      <div className="radius-or">OR</div>
      <button className="radius-choice" type="button" onClick={() => onSelect("guest")}>
        <UserRound size={16} /> Guest Sign In
      </button>
      <p className="radius-note">
        Guest access includes Dev and QA only. Production stays visible and locked.
      </p>
    </section>
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
    <section className="radius-panel">
      <h3>Admin Sign In</h3>
      <p className="sub">Enter admin credentials. Signup for production users opens after you sign in.</p>
      <form onSubmit={submit}>
        <Field label="Admin email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <div className="radius-error">{error}</div>}
        <button className="radius-btn" type="submit">Sign In</button>
      </form>
      <div className="radius-demo">
        Sample admin: {DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}
      </div>
      <button className="radius-link radius-back" type="button" onClick={onBack}>
        Back to access options
      </button>
    </section>
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
    <section className="radius-panel">
      <h3>Production Sign In</h3>
      <p className="sub">For users who already have production access.</p>
      <form onSubmit={submit}>
        <Field label="Company email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <div className="radius-error">{error}</div>}
        <button className="radius-btn" type="submit">Sign In</button>
      </form>
      <div className="radius-demo">
        Sample production user: {DEMO_ACCOUNTS.production.email} / {DEMO_ACCOUNTS.production.password}
      </div>
      <div className="radius-row">
        <button className="radius-link" type="button" onClick={onRegister}>
          New to RADIUS? Register for production
        </button>
      </div>
      <div className="radius-or">OR</div>
      <button className="radius-choice" type="button" onClick={onGuest}>
        Continue as Guest
      </button>
      <button className="radius-link radius-back" type="button" onClick={onBack}>
        Back to access options
      </button>
    </section>
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
    <section className="radius-panel">
      <h3>{adminMode ? "Production signup" : "Production Register"}</h3>
      <p className="sub">
        {adminMode
          ? "Admin registration can add a production user."
          : "Tell us your email, country, and role. Approved company emails can create a password."}
      </p>

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

      <form onSubmit={state === "create" ? createAccount : review}>
        <Field label="Company email" type="email" value={form.email} onChange={(value) => update("email", value)} />
        <SelectField
          label="Country"
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
          value={form.role}
          onChange={(value) => update("role", value)}
          placeholder="Select role"
          options={PROD_ROLES.map((role) => ({ value: role, label: role }))}
        />

        {state === "create" && (
          <>
            <Field label="Create password" type="password" value={form.password} onChange={(value) => update("password", value)} />
            <Field label="Confirm password" type="password" value={form.confirm} onChange={(value) => update("confirm", value)} />
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
          <button className="radius-btn" type="submit" disabled={!profileReady}>
            {state === "create" ? "Create Account" : "Continue"}
          </button>
        )}
      </form>

      {state === "blocked" && (
        <button className="radius-choice" type="button" onClick={onGuest}>Continue as Guest</button>
      )}
      {state === "already" && (
        <button className="radius-btn" type="button" onClick={onSignIn}>Go to Sign In</button>
      )}
      <p className="radius-note">Registration is available only to approved production users.</p>
      <div className="radius-demo">
        Try new.prod@ingrammicro.com to create an account, or anyone@example.com to see the guest path.
      </div>
      <button className="radius-link radius-back" type="button" onClick={onBack}>
        Back to access options
      </button>
    </section>
  );
}

function GuestSignIn({ onBack, onContinue }) {
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState("");
  const [team, setTeam] = useState("");
  const ready = email.includes("@") && number.trim() && country && team;

  function submit(event) {
    event.preventDefault();
    if (!ready) return;
    onContinue({
      email: email.trim().toLowerCase(),
      number: number.trim(),
      country,
      team,
    });
  }

  return (
    <section className="radius-panel">
      <h3>Guest Sign In</h3>
      <p className="sub">
        No password is required. Your email, number, country, and team are kept for the access log.
      </p>
      <form onSubmit={submit}>
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Contact number" type="text" value={number} onChange={setNumber} />
        <SelectField
          label="Country"
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
          value={team}
          onChange={setTeam}
          placeholder="Select team"
          options={GUEST_TEAMS.map((item) => ({ value: item, label: item }))}
        />
        <button className="radius-btn" type="submit" disabled={!ready}>
          Continue as Guest
        </button>
      </form>
      <button className="radius-link radius-back" type="button" onClick={onBack}>
        Back to access options
      </button>
    </section>
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
    <section className="radius-panel">
      <h3>
        {session.mode === "admin" && "Admin access"}
        {session.mode === "production" && "Production access"}
        {session.mode === "guest" && "Guest access"}
      </h3>
      <p className="sub">
        Signed in as {session.email}
        {session.role ? ` · ${session.role}` : ""}
        {session.team ? ` · ${session.team}` : ""}
        {session.country ? ` · ${session.country}` : ""}
        {session.number ? ` · ${session.number}` : ""}
      </p>
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
        <button className="radius-choice" type="button" onClick={onSignup} style={{ marginTop: 14 }}>
          Open production signup
        </button>
      )}
      <button className="radius-btn" type="button" onClick={goToDashboard} style={{ marginTop: 14 }}>
        Continue to dashboard
      </button>
      <button className="radius-link radius-back" type="button" onClick={onRestart}>
        Use a different access option
      </button>
    </section>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <label className="radius-field">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, value, onChange, placeholder, options }) {
  return (
    <label className="radius-field">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
