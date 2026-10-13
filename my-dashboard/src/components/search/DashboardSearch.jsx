import { useEffect, useRef, useState } from "react";

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

const ENVIRONMENTS = ["Prod", "Qa", "Dev"];
const DEFAULT_ENVIRONMENT = " ";

const COUNTRY_CODES = [
  "AT",
  "AX",
  "BI",
  "BL",
  "BP",
  "BR",
  "CH",
  "CN",
  "CP",
  "DE",
  "DK",
  "EH",
  "ES",
  "FI",
  "FR",
  "FT",
  "HK",
  "HU",
  "IA",
  "IN",
  "IT",
  "MD",
  "MX",
  "MY",
  "NO",
  "PT",
  "SE",
  "SG",
  "TH",
  "TW",
  "UK",
  "X5",
  "X6",
  "YM",
  "Z3",
];

/* =========================================================
 *   COUNTRY NAMES
 * ========================================================= */

const COUNTRY_NAMES = {
  AT: "Austria",
  AX: "Singapore - obsolete",
  BI: "India",
  BL: "Saint Barthélemy",
  BP: "Brazil - Sao Paulo",
  BR: "Brazil",
  CH: "Switzerland",
  CN: "China",
  CP: "Pan Europe",
  DE: "Germany",
  DK: "Denmark - obsolete",
  EH: "China",
  ES: "Spain",
  FI: "Finland - obsolete",
  FR: "France",
  FT: "Canada",
  HK: "China - Hong Kong",
  HU: "Hungary",
  IA: "India",
  IN: "Singapore - India Export obsolete",
  IT: "Italy",
  MD: "United States",
  MX: "Mexico",
  MY: "Malaysia - obsolete",
  NO: "Norway - obsolete",
  PT: "Portugal",
  SE: "Sweden",
  SG: "Singapore - obsolete",
  TH: "Thailand",
  TW: "China - Hong Kong 2",
  UK: "Great Britain",
  X5: "X5",
  X6: "X6",
  YM: "China",
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

                  return (
                    <button
                      key={country}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      className={`dashboard-country-option ${
                        isSelected
                          ? "is-selected"
                          : ""
                      }`}
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

  const dropdownRef = useRef(null);

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
    (environment) => environment === value
  );

  const handleSelect = (environment) => {
    onChange(environment);

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
            {selectedEnvironment}
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
                environment === value;

              return (
                <button
                  key={environment}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`dashboard-country-option ${
                    isSelected
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelect(environment)
                  }
                >
                  <span className="dashboard-country-option-code">
                    ENV
                  </span>

                  <span className="dashboard-country-option-name">
                    {environment}
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
    useState(DEFAULT_ENVIRONMENT);

  const [recentSearches, setRecentSearches] =
    useState(() => getRecentSearches());


  /* =======================================================
     VALIDATION
     ======================================================= */

  const canSearch =
    poNumber.trim().length > 0 &&
    countryCode.trim().length > 0 &&
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

    setCountryCode(item.countryCode);

    const itemEnvironment =
      item.environment || DEFAULT_ENVIRONMENT;

    setEnvironment(itemEnvironment);

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
            Hey Good day! Let's analyze, diagnose, and resolve.
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
              onChange={setEnvironment}
              options={ENVIRONMENTS}
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