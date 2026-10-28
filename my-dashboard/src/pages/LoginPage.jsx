import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import Header from "../components/layout/Header";
import radiusWatermark from "../assets/RADIUS_Watermark.png";
import {
  COMPANY_EMAIL_ERROR,
  COUNTRIES,
  DEMO_ACCOUNTS,
  PROD_ROLES,
  changeProductionPassword,
  countryLabel,
  isCompanyEmail,
  orderCountries,
  loginProductionUser,
  passwordIsValid,
  passwordIssues,
  recordGuest,
  saveSession,
  submitApprovalRequest,
} from "../auth/accessSession";
import "../components/search/DashboardSearch.css";
import "./LoginPage.css";

const EMPTY_REGISTER = {
  email: "",
  countries: [],
  role: "",
};

const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({
  value: country.code,
  label: countryLabel(country.code),
}));

const PAGE_BACKGROUND = `
  radial-gradient(circle at 5% 20%, rgba(59, 130, 246, 0.07), transparent 25%),
  radial-gradient(circle at 95% 20%, rgba(96, 165, 250, 0.06), transparent 25%),
  linear-gradient(135deg, #f7fbff 0%, #ffffff 50%, #f5f9ff 100%)
`;

export default function LoginPage() {
  const [view, setView] = useState("choose");
  const [pendingUser, setPendingUser] = useState(null);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInNotice, setSignInNotice] = useState("");

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
              />
            )}
            {view === "prod-signin" && (
              <ProductionSignIn
                initialEmail={signInEmail}
                notice={signInNotice}
                onBack={() => {
                  setSignInNotice("");
                  setView("choose");
                }}
                onRegister={() => {
                  setSignInNotice("");
                  setView("prod-register");
                }}
                onGuest={() => setView("guest")}
                onSignedIn={(user) => {
                  if (user.temporary) {
                    setPendingUser(user);
                    setView("change-password");
                    return;
                  }
                  const countries = orderCountries(
                    user.countries?.length ? user.countries : user.country,
                  );
                  enter({
                    mode: "production",
                    email: user.email,
                    name: user.name,
                    country: countries.join(","),
                    countries,
                    role: user.role,
                  });
                }}
              />
            )}
            {view === "change-password" && pendingUser && (
              <ChangePassword
                user={pendingUser}
                onBack={() => setView("prod-signin")}
                onChanged={(user) => {
                  setPendingUser(null);
                  setSignInEmail(user.email);
                  setSignInNotice("Password is changed");
                  setView("prod-signin");
                }}
              />
            )}
            {view === "guest" && (
              <GuestSignIn
                onBack={() => setView("choose")}
                onContinue={(guest) => {
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
    if (!isCompanyEmail(email)) {
      setError(COMPANY_EMAIL_ERROR);
      return;
    }
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
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function ProductionSignIn({ onBack, onRegister, onGuest, onSignedIn, initialEmail = "", notice = "" }) {
  const [email, setEmail] = useState(initialEmail || DEMO_ACCOUNTS.production.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!isCompanyEmail(email)) {
      setError(COMPANY_EMAIL_ERROR);
      return;
    }
    try {
      const user = await loginProductionUser(email, password);
      if (!user) {
        setError("Production email or password was not recognized.");
        return;
      }
      onSignedIn(user);
    } catch (loginError) {
      setError(loginError.message || "The access log could not be reached.");
    }
  }

  return (
    <Panel
      icon={<Lock size={16} />}
      title="Production Sign In"
      subtitle="For users who already have production access."
    >
      {notice && <div className="radius-success">{notice}</div>}
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

function ProductionRegister({ onBack }) {
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [result, setResult] = useState(null);
  const email = form.email.trim().toLowerCase();
  const profileReady = email.includes("@") && form.countries.length > 0 && form.role.trim();

  function update(key, value) {
    setResult(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!profileReady) return;
    if (!isCompanyEmail(email)) {
      setResult({ status: "invalid-email" });
      return;
    }
    try {
      setResult(await submitApprovalRequest({ email, countries: form.countries, role: form.role.trim() }));
    } catch (requestError) {
      setResult({ status: "failed", message: requestError.message || "The access log could not be reached." });
    }
  }

  return (
    <Panel
      icon={<UserRound size={16} />}
      title="Production Register"
      subtitle="Submit your email and the countries this production access is for. An admin approves the request. A login that already has production access can request more countries."
    >
      {result?.status === "created" && (
        <div className="radius-success">
          Approval request for {email} is sent to Admin, Thank You
        </div>
      )}
      {result?.status === "pending" && (
        <div className="radius-error">
          An approval request for {email} is already waiting for an admin.
        </div>
      )}
      {result?.status === "already-have" && (
        <div className="radius-error">
          {email} already has production access for the selected countries. Choose another country to send a new approval request.
        </div>
      )}
      {result?.status === "invalid-email" && (
        <div className="radius-error">{COMPANY_EMAIL_ERROR}</div>
      )}
      {result?.status === "invalid-country" && (
        <div className="radius-error">Select at least one country for this production access request.</div>
      )}
      {result?.status === "declined" && (
        <div className="radius-error">
          The request for {email} was declined.
          {result.request?.note ? ` Note: ${result.request.note}` : ""}
        </div>
      )}
      {result?.status === "failed" && (
        <div className="radius-error">{result.message}</div>
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
          <CountryPicker
            selected={form.countries}
            onChange={(value) => update("countries", value)}
          />
          <RoleField value={form.role} onChange={(value) => update("role", value)} />
          <button className="dashboard-search-button" type="submit" disabled={!profileReady}>
            Request approval
          </button>
        </form>
      )}

      {result?.status === "declined" && (
        <button
          className="dashboard-search-button"
          type="button"
          onClick={async () => {
            try {
              setResult(await submitApprovalRequest({
                email,
                countries: form.countries,
                role: form.role.trim(),
                replaceDeclined: true,
              }));
            } catch (requestError) {
              setResult({
                status: "failed",
                message: requestError.message || "The access log could not be reached.",
              });
            }
          }}
        >
          Send a new request
        </button>
      )}
      {result?.status !== "created" && (
        <p className="radius-note">
          Use an @ingrammicro.com email ID, for example deepak.bhengra@ingrammicro.com.
        </p>
      )}
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function ChangePassword({ user, onBack, onChanged }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [error, setError] = useState("");
  const rules = passwordIssues(password);
  const captchaMatches = captchaInput.trim().toUpperCase() === captchaCode;

  async function submit(event) {
    event.preventDefault();
    if (!passwordIsValid(password)) {
      setError("Choose a password that meets every requirement.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password === user.password) {
      setError("Choose a password that is different from the temporary password.");
      return;
    }
    if (!captchaMatches) {
      setError("Captcha does not match. Please try again.");
      setCaptchaInput("");
      setCaptchaVersion((version) => version + 1);
      return;
    }
    try {
      const updated = await changeProductionPassword(user, password);
      onChanged(updated);
    } catch (changeError) {
      setError(changeError.message || "The access log could not be reached.");
    }
  }

  return (
    <Panel
      icon={<Lock size={16} />}
      title="Change password"
      subtitle={`The temporary password for ${user.email} can be used once. Set a new password, then sign in again.`}
    >
      <form onSubmit={submit} className="radius-form">
        <Field label="New password" type="password" icon={<Lock size={15} />} value={password} onChange={setPassword} />
        <Field label="Confirm password" type="password" icon={<Lock size={15} />} value={confirm} onChange={setConfirm} />
        <ul className="radius-rules">
          <li className={rules.length ? "ok" : ""}>At least 8 characters</li>
          <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
          <li className={rules.lower ? "ok" : ""}>One lowercase letter</li>
          <li className={rules.number ? "ok" : ""}>One number</li>
          <li className={rules.special ? "ok" : ""}>One special character</li>
        </ul>
        <Captcha key={captchaVersion} code={captchaCode} onCode={setCaptchaCode} />
        <Field
          label="Captcha"
          type="text"
          icon={<Shield size={15} />}
          value={captchaInput}
          onChange={setCaptchaInput}
          placeholder="Type the characters"
        />
        {error && <div className="radius-error">{error}</div>}
        <button
          className="dashboard-search-button"
          type="submit"
          disabled={!password || !confirm || !captchaInput.trim()}
        >
          Save password
        </button>
      </form>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to production sign in
      </button>
    </Panel>
  );
}

function makeCaptchaCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(5);
  crypto.getRandomValues(bytes);
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join("");
}

function drawCaptcha(canvas, code) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f8fbff";
  context.fillRect(0, 0, width, height);
  for (let line = 0; line < 6; line += 1) {
    context.strokeStyle = line % 2 ? "#bfdbfe" : "#dbe5f2";
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(Math.random() * width, Math.random() * height);
    context.stroke();
  }
  context.textBaseline = "middle";
  context.font = "700 24px Inter, sans-serif";
  [...code].forEach((character, index) => {
    context.save();
    context.translate(22 + index * 28, height / 2);
    context.rotate((Math.random() - 0.5) * 0.5);
    context.fillStyle = index % 2 ? "#1468d9" : "#1e3a5f";
    context.fillText(character, 0, 0);
    context.restore();
  });
}

function Captcha({ code, onCode }) {
  const canvasRef = useRef(null);

  function refresh() {
    const next = makeCaptchaCode();
    onCode(next);
    drawCaptcha(canvasRef.current, next);
  }

  useEffect(() => {
    refresh();
    // Draw a fresh captcha when this step opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (code) drawCaptcha(canvasRef.current, code);
  }, [code]);

  return (
    <div className="radius-captcha">
      <canvas ref={canvasRef} width="180" height="52" aria-label="Captcha image" />
      <button type="button" onClick={refresh} aria-label="Refresh captcha">
        <RefreshCw size={14} />
      </button>
    </div>
  );
}

function GuestSignIn({ onBack, onContinue }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const ready = name.trim() && email.includes("@") && country && role.trim();

  async function submit(event) {
    event.preventDefault();
    if (!ready) return;
    if (!isCompanyEmail(email)) {
      setError(COMPANY_EMAIL_ERROR);
      return;
    }
    setError("");
    try {
      const saved = await recordGuest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        country,
        role: role.trim(),
      });
      onContinue(saved);
    } catch (guestError) {
      setError(guestError.message || "The access log could not be reached.");
    }
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
          options={COUNTRY_OPTIONS}
        />
        <RoleField value={role} onChange={setRole} />
        {error && <div className="radius-error">{error}</div>}
        <button className="dashboard-search-button" type="submit" disabled={!ready}>
          Continue as Guest
        </button>
      </form>
      <p className="radius-note">Guest sign-in accepts only an @ingrammicro.com email ID.</p>
      <button className="radius-link" type="button" onClick={onBack}>
        Back to access options
      </button>
    </Panel>
  );
}

function CountryPicker({ selected, onChange }) {
  const summary = selected.length
    ? selected.map((code) => countryLabel(code)).join(", ")
    : "Select one or more countries";

  function toggle(code) {
    const next = selected.includes(code)
      ? selected.filter((item) => item !== code)
      : [...selected, code];
    const ordered = COUNTRIES.map((country) => country.code).filter((item) => next.includes(item));
    onChange(ordered);
  }

  return (
    <div className="dashboard-search-field">
      <span>Countries</span>
      <div className="radius-country-picker">
        <p className={`radius-country-summary${selected.length ? "" : " is-empty"}`}>{summary}</p>
        <div className="radius-country-list">
          {COUNTRY_OPTIONS.map((country) => (
            <label key={country.value}>
              <input
                type="checkbox"
                checked={selected.includes(country.value)}
                onChange={() => toggle(country.value)}
              />
              <span>{country.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
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
