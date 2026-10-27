import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { countryAllowed, displayName, environmentChoices, readSession } from "../../auth/accessSession";

import {
  Search,
  Globe2,
  FileText,
  Clock3,
  Sparkles,
  ChevronDown,
  Check,
  X,
  Server,
} from "lucide-react";

const RECENT_SEARCH_KEY = "impulse_recent_searches";

const DEFAULT_ENVIRONMENT = " ";

const COUNTRY_CODES = [
  "AE",
  "AR",
  "AT",
  "AU",
  "AX",
  "BE",
  "BI",
  "BL",
  "BP",
  "BR",
  "CH",
  "CL",
  "CN",
  "CO",
  "CP",
  "DE",
  "DK",
  "EC",
  "EH",
  "ES",
  "FI",
  "FR",
  "FT",
  "HK",
  "HU",
  "IA",
  "ID",
  "IE",
  "IN",
  "IT",
  "JP",
  "KR",
  "LK",
  "MD",
  "MX",
  "MY",
  "NL",
  "NO",
  "NZ",
  "PE",
  "PH",
  "PL",
  "PT",
  "SE",
  "SG",
  "TH",
  "TW",
  "UK",
  "UY",
  "VN",
  "X5",
  "X6",
  "YM",
  "ZA",
  "Z3",
];

/* =========================================================
 *   COUNTRY NAMES
 * ========================================================= */

const COUNTRY_NAMES = {
  AE: "United Arab Emirates",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  AX: "Singapore - obsolete",
  BE: "Belgium",
  BI: "India",
  BL: "Saint Barthélemy",
  BP: "Brazil - Sao Paulo",
  BR: "Brazil",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CP: "Pan Europe",
  DE: "Germany",
  DK: "Denmark - obsolete",
  EC: "Ecuador",
  EH: "China",
  ES: "Spain",
  FI: "Finland - obsolete",
  FR: "France",
  FT: "Canada",
  HK: "China - Hong Kong",
  HU: "Hungary",
  IA: "India",
  ID: "Indonesia",
  IE: "Ireland",
  IN: "Singapore - India Export obsolete",
  IT: "Italy",
  JP: "Japan",
  KR: "South Korea",
  LK: "Sri Lanka",
  MD: "United States",
  MX: "Mexico",
  MY: "Malaysia - obsolete",
  NL: "Netherlands",
  NO: "Norway - obsolete",
  NZ: "New Zealand",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  SE: "Sweden",
  SG: "Singapore - obsolete",
  TH: "Thailand",
  TW: "China - Hong Kong 2",
  UK: "Great Britain",
  UY: "Uruguay",
  VN: "Vietnam",
  X5: "X5",
  X6: "X6",
  YM: "China",
  ZA: "South Africa",
  Z3: "Latin America",
};

/*
 * Codes such as BP, CP, FT, IA, X5, X6, YM and Z3
 * are left as codes because they may be application-specific.
 *
 * Add their real business names here if required.
 */

function getCountryName(code) {
  return COUNTRY_NAMES[code] || code;
}


/* =========================================================
   RECENT SEARCHES
   ========================================================= */

function getRecentSearches() {
  try {
    const saved = localStorage.getItem(
      RECENT_SEARCH_KEY
    );

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}


function saveRecentSearch(searchItem) {
  try {
    const existing = getRecentSearches();

    // Remove duplicate
    const filtered = existing.filter(
      (item) =>
        !(
          item.poNumber === searchItem.poNumber &&
          item.countryCode === searchItem.countryCode &&
          (item.environment || DEFAULT_ENVIRONMENT) ===
            searchItem.environment
        )
    );

    const updated = [
      {
        ...searchItem,
        timestamp: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 8);

    localStorage.setItem(
      RECENT_SEARCH_KEY,
      JSON.stringify(updated)
    );

    return updated;
  } catch {
    return [];
  }
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(
      RECENT_SEARCH_KEY
    );
  } catch {
    // Ignore storage failures so the UI stays responsive.
  }
}


/* =========================================================
   COUNTRY DROPDOWN
   ========================================================= */

function CountryDropdown({
  value,
  onChange,
  options,
  lockedCodes = [],
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  /* -------------------------------------------------------
     CLOSE ON OUTSIDE CLICK
     ------------------------------------------------------- */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  /* -------------------------------------------------------
     ESCAPE TO CLOSE
     ------------------------------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchValue("");
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  /* -------------------------------------------------------
     FOCUS SEARCH WHEN OPEN
     ------------------------------------------------------- */

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [open]);


  /* -------------------------------------------------------
     SELECTED COUNTRY
     ------------------------------------------------------- */

  const locked = new Set(lockedCodes.map((code) => String(code).toUpperCase()));

  const selectedCountry = options.find(
    (country) => country === value
  );


  /* -------------------------------------------------------
     FILTER OPTIONS
     ------------------------------------------------------- */

  const filteredOptions = options.filter(
    (country) => {
      const code = country.toLowerCase();

      const name = getCountryName(
        country
      ).toLowerCase();

      const query =
        searchValue.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        code.includes(query) ||
        name.includes(query)
      );
    }
  );


  /* -------------------------------------------------------
     SELECT COUNTRY
     ------------------------------------------------------- */

  const handleSelect = (country) => {
    if (locked.has(country)) return;

    onChange(country);

    setOpen(false);
    setSearchValue("");
  };


  /* -------------------------------------------------------
     TRIGGER KEYBOARD
     ------------------------------------------------------- */

  const handleTriggerKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setOpen((current) => !current);
    }
  };


  return (
    <div
      ref={dropdownRef}
      className="dashboard-country-dropdown"
    >

      {/* =================================================
          TRIGGER
          ================================================= */}

      <button
        type="button"
        id="dashboard-environment"
        className={`dashboard-country-trigger ${
          open ? "is-open" : ""
        }`}
        onClick={() =>
          setOpen((current) => !current)
        }
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >

        <span className="dashboard-country-trigger-icon">
          <Globe2 size={15} />
        </span>


        {selectedCountry ? (
          <span className="dashboard-country-selected">

            <span className="dashboard-country-code">
              {selectedCountry}
            </span>

            <span className="dashboard-country-name">
              {getCountryName(
                selectedCountry
              )}
            </span>

          </span>
        ) : (
          <span className="dashboard-country-placeholder">
            Select Country Code
          </span>
        )}


        <ChevronDown
          size={15}
          className={`dashboard-country-chevron ${
            open ? "is-open" : ""
          }`}
        />

      </button>


      {/* =================================================
          DROPDOWN MENU
          ================================================= */}

      {open && (
        <div className="dashboard-country-menu">

          {/* SEARCH */}

          <div className="dashboard-country-search">

            <div className="dashboard-country-search-box">

              <Search size={13} />

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder="Search country or code..."
                autoComplete="off"
              />

            </div>

          </div>


          {/* OPTIONS */}

          <div
            className="dashboard-country-options"
            role="listbox"
          >

            {filteredOptions.length > 0 ? (

              filteredOptions.map(
                (country) => {
                  const isSelected =
                    country === value;
                  const isLocked = locked.has(country);

                  return (
                    <button
                      key={country}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      aria-disabled={isLocked}
                      disabled={isLocked}
                      className={`dashboard-country-option ${
                        isSelected
                          ? "is-selected"
                          : ""
                      } ${isLocked ? "is-disabled" : ""}`}
                      onClick={() =>
                        handleSelect(country)
                      }
                    >

                      {/* CODE */}

                      <span className="dashboard-country-option-code">
                        {country}
                      </span>


                      {/* NAME */}

                      <span className="dashboard-country-option-name">
                        {getCountryName(
                          country
                        )}
                        {isLocked ? " (locked)" : ""}
                      </span>


                      {/* CHECK */}

                      {isSelected && (
                        <span className="dashboard-country-check">
                          <Check size={11} />
                        </span>
                      )}

                    </button>
                  );
                }
              )

            ) : (

              <div className="dashboard-country-empty">

                <div className="dashboard-country-empty-icon">
                  <Search size={13} />
                </div>

                <span>
                  No country found
                </span>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   ENVIRONMENT DROPDOWN
   ========================================================= */

function EnvironmentDropdown({
  value,
  onChange,
  options,
}) {
  const [open, setOpen] = useState(false);
  const [lockPop, setLockPop] = useState(null);

  const dropdownRef = useRef(null);

  function hideLockPop() {
    setLockPop(null);
  }

  function showLockPop(environment, element) {
    if (!environment.hint) {
      setLockPop(null);
      return;
    }
    const menu = element.closest(".dashboard-country-menu") || element;
    const rect = menu.getBoundingClientRect();
    const width = Math.max(rect.width, 280);
    const margin = 12;
    let left = rect.left;
    if (left + width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - width - margin);
    }
    const estimatedHeight = 108;
    let top = rect.bottom + 8;
    if (top + estimatedHeight > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - estimatedHeight - 8);
    }
    setLockPop({
      text: environment.hint,
      top,
      left,
      width,
    });
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    if (!open) setLockPop(null);
  }, [open]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const selectedEnvironment = options.find(
    (environment) => environment.id === value
  );

  const handleSelect = (environment) => {
    if (environment.disabled) return;
    onChange(environment.id);

    setOpen(false);
  };

  const handleTriggerKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      setOpen((current) => !current);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="dashboard-country-dropdown"
    >
      <button
        type="button"
        className={`dashboard-country-trigger ${
          open ? "is-open" : ""
        }`}
        onClick={() =>
          setOpen((current) => !current)
        }
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="dashboard-country-trigger-icon">
          <Server size={15} />
        </span>

        {selectedEnvironment ? (
          <span className="dashboard-country-name">
            {selectedEnvironment.label}
          </span>
        ) : (
          <span className="dashboard-country-placeholder">
            Select Environment
          </span>
        )}

        <ChevronDown
          size={15}
          className={`dashboard-country-chevron ${
            open ? "is-open" : ""
          }`}
        />
      </button>

      {open && (
        <div className="dashboard-country-menu">
          <div
            className="dashboard-country-options"
            role="listbox"
          >
            {options.map((environment) => {
              const isSelected =
                environment.id === value;
              const showHint = Boolean(environment.disabled && environment.hint);

              return (
                <button
                  key={environment.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={environment.disabled}
                  disabled={environment.disabled && !showHint}
                  className={`dashboard-country-option ${
                    isSelected
                      ? "is-selected"
                      : ""
                  } ${environment.disabled ? "is-disabled" : ""}`}
                  onMouseEnter={(event) =>
                    showLockPop(environment, event.currentTarget)
                  }
                  onMouseLeave={hideLockPop}
                  onFocus={(event) =>
                    showLockPop(environment, event.currentTarget)
                  }
                  onBlur={hideLockPop}
                  onClick={(event) => {
                    if (showHint) {
                      showLockPop(environment, event.currentTarget);
                      return;
                    }
                    handleSelect(environment);
                  }}
                >
                  <span className="dashboard-country-option-code">
                    ENV
                  </span>

                  <span className="dashboard-country-option-name">
                    {environment.label}
                    {environment.disabled ? " (locked)" : ""}
                  </span>

                  {isSelected && (
                    <span className="dashboard-country-check">
                      <Check size={11} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {lockPop &&
        createPortal(
          <div
            className="env-lock-pop"
            role="tooltip"
            style={{
              top: lockPop.top,
              left: lockPop.left,
              width: lockPop.width,
            }}
          >
            <strong>Production registration</strong>
            <p>{lockPop.text}</p>
          </div>,
          document.body,
        )}
    </div>
  );
}


/* =========================================================
   DASHBOARD SEARCH
   ========================================================= */

export default function DashboardSearch({
  onSearch,
  loading = false,
}) {
  const [poNumber, setPoNumber] =
    useState("");

  const [countryCode, setCountryCode] =
    useState("");

  const [environment, setEnvironment] =
    useState(() => {
      const session = readSession();
      if (session?.mode === "guest") return "Dev";
      if (session?.mode === "production" || session?.mode === "admin") return "Prod";
      return DEFAULT_ENVIRONMENT;
    });

  const [recentSearches, setRecentSearches] =
    useState(() => getRecentSearches());


  /* =======================================================
     VALIDATION
     ======================================================= */

  const session = readSession();
  const lockedCodes = environment === "Prod"
    ? COUNTRY_CODES.filter((code) => !countryAllowed(session, environment, code))
    : [];

  const canSearch =
    poNumber.trim().length > 0 &&
    countryCode.trim().length > 0 &&
    countryAllowed(session, environment, countryCode) &&
    !loading;


  /* =======================================================
     SUBMIT SEARCH
     ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    const searchData = {
      poNumber: poNumber.trim(),
      countryCode:
        countryCode.trim().toUpperCase(),
      // Sent to the API as: "environment": "Prod" | "Qa" | "Dev"
      environment,
    };

    const updated =
      saveRecentSearch(searchData);

    setRecentSearches(updated);

    if (onSearch) {
      await onSearch(searchData);
    }
  };


  /* =======================================================
     RECENT SEARCH
     ======================================================= */

  const handleRecentSearch = async (
    item
  ) => {
    setPoNumber(item.poNumber);

    const requested =
      item.environment || DEFAULT_ENVIRONMENT;
    const currentSession = readSession();
    const allowed = environmentChoices(currentSession).some(
      (choice) => choice.id === requested && !choice.disabled,
    );
    const itemEnvironment = allowed ? requested : environment;

    setEnvironment(itemEnvironment);

    if (!countryAllowed(currentSession, itemEnvironment, item.countryCode)) {
      setCountryCode("");
      return;
    }

    setCountryCode(item.countryCode);

    if (onSearch) {
      await onSearch({
        poNumber: item.poNumber,
        countryCode: item.countryCode,
        environment: itemEnvironment,
      });
    }
  };

  const handleClearPoNumber = () => {
    setPoNumber("");
  };

  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const greetingName = displayName(readSession());


  return (
    <section className="dashboard-search-area">

      {/* ===================================================
          DECORATIVE BACKGROUND
          =================================================== */}

      <div className="search-decoration search-decoration-left">

        <span className="search-decoration-line line-1" />

        <span className="search-decoration-dot dot-1" />

        <span className="search-decoration-dot dot-2" />

      </div>


      <div className="search-decoration search-decoration-right">

        <span className="search-decoration-line line-2" />

        <span className="search-decoration-dot dot-3" />

        <span className="search-decoration-dot dot-4" />

      </div>


      <div className="search-glow search-glow-left" />

      <div className="search-glow search-glow-right" />


      {/* ===================================================
          SEARCH CARD
          =================================================== */}

      <div className="dashboard-search-card">

        {/* TITLE */}

        <div className="dashboard-search-title">

          <div className="dashboard-search-icon">
            <Sparkles size={17} />
          </div>

          <div>

            <h2>
            {greetingName
              ? `Hey Good day, ${greetingName}! Let's analyze, diagnose, and resolve.`
              : "Hey Good day! Let's analyze, diagnose, and resolve."}
            </h2>

            <p>
              Search by Customer PO Number, Country Code and Environment
            </p>

          </div>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="dashboard-search-form"
        >

          {/* =================================================
              CUSTOMER PO
              ================================================= */}

          <div className="dashboard-search-field">

            <label>
              Customer PO Number
            </label>

            <div className="dashboard-input">

              <FileText size={15} />

              <input
                type="text"
                value={poNumber}
                onChange={(event) =>
                  setPoNumber(
                    event.target.value
                  )
                }
                placeholder="Enter Customer PO Number"
                maxLength={24}
                autoComplete="off"
              />

              {poNumber && (
                <button
                  type="button"
                  className="dashboard-input-clear"
                  onClick={handleClearPoNumber}
                  aria-label="Clear PO number"
                >
                  <X size={12} />
                </button>
              )}

            </div>

          </div>


          {/* =================================================
              COUNTRY
              ================================================= */}

          <div className="dashboard-search-field">

            <label>
              Country Code
            </label>

            <CountryDropdown
              value={countryCode}
              onChange={setCountryCode}
              options={COUNTRY_CODES}
              lockedCodes={lockedCodes}
            />

          </div>


          {/* =================================================
              ENVIRONMENT
              ================================================= */}

          <div className="dashboard-search-field">

            <label htmlFor="dashboard-environment">
              Environment
            </label>

            <EnvironmentDropdown
              value={environment}
              onChange={(next) => {
                setEnvironment(next);
                if (!countryAllowed(readSession(), next, countryCode)) {
                  setCountryCode("");
                }
              }}
              options={environmentChoices(session)}
            />

          </div>


          {/* =================================================
              SEARCH BUTTON
              ================================================= */}

          <button
            type="submit"
            disabled={!canSearch}
            className="dashboard-search-button"
          >

            {loading ? (
              <>
                <span className="search-spinner" />

                <span>
                  Investigating...
                </span>
              </>
            ) : (
              <>
                <span>
                  Search Order
                </span>

                <Search size={15} />
              </>
            )}

          </button>

        </form>


        {/* =================================================
            RECENT SEARCHES
            ================================================= */}

        <div className="dashboard-recent">

          <div className="dashboard-recent-header">

            <div className="dashboard-recent-label">

              <Clock3 size={14} />

              <span>
                Recent Searches
              </span>

            </div>

            <button
              type="button"
              className="dashboard-recent-clear"
              onClick={handleClearRecentSearches}
              disabled={recentSearches.length === 0}
            >
              Clear Search
            </button>

          </div>


          <div className="dashboard-recent-list">

            {

              recentSearches
                .slice(0, 5)
                .map((item, index) => (

                  <button
                    key={`${item.poNumber}-${item.countryCode}-${item.environment || DEFAULT_ENVIRONMENT}-${index}`}
                    type="button"
                    className="dashboard-recent-chip"
                    onClick={() =>
                      handleRecentSearch(
                        item
                      )
                    }
                  >

                    <Search size={11} />

                    <span>
                      {item.poNumber}
                    </span>

                    <span className="dashboard-recent-country">
                      {item.countryCode}
                    </span>

                    <span className="dashboard-recent-country">
                      {item.environment || DEFAULT_ENVIRONMENT}
                    </span>

                  </button>

                ))

            }

          </div>

        </div>

      </div>

    </section>
  );
}