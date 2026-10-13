import { useState, useCallback, useMemo } from "react";
import { Search as SearchIcon, X, Lock } from "lucide-react";
import { SEARCH_FIELDS } from "../../data/navigation";

function normalizeDisplayValue(value) {
  if (value == null || value === "" || value === "—") {
    return "N/A";
  }

  return String(value);
}

function SearchBar({
  onSearch,
  loading,
  resultOrder,
  resultLineItems,
}) {
  const [values, setValues] = useState({});

  // ------------------------------------------------------------
  // Supported search fields
  // ------------------------------------------------------------
  const supportedFields = useMemo(
    () => SEARCH_FIELDS.filter((field) => field.supported),
    []
  );

  // User only needs to enter ONE supported field.
  const canSearch = useMemo(
    () =>
      supportedFields.some(
        (field) => values[field.param]?.trim()
      ),
    [supportedFields, values]
  );

  // ------------------------------------------------------------
  // Values automatically populated from search results
  // ------------------------------------------------------------
  const derivedValues = useMemo(() => {
    const firstLine = Array.isArray(resultLineItems)
      ? resultLineItems[0]
      : null;

    return {
      orderNumber: normalizeDisplayValue(
        resultOrder?.imiAsgdOrdrNbr ??
          resultOrder?.ordrNbr ??
          resultOrder?.orderNumber
      ),

      partnerId: normalizeDisplayValue(
        resultOrder?.partnerId
      ),

      accountNumber: normalizeDisplayValue(
        resultOrder?.custNbr ??
          resultOrder?.accountNumber
      ),

      sku: normalizeDisplayValue(
        firstLine?.imPartNbr ??
          firstLine?.sku
      ),

      transactionId: normalizeDisplayValue(
        resultOrder?.xactSet ??
          resultOrder?.transactionId
      ),

      poNumber: normalizeDisplayValue(
        resultOrder?.poNumber
      ),

      countryCode: normalizeDisplayValue(
        resultOrder?.countryCode
      ),
    };
  }, [resultOrder, resultLineItems]);

  // ------------------------------------------------------------
  // Handle field changes
  // ------------------------------------------------------------
  const handleChange = useCallback(
    (param, value) => {
      setValues((prev) => ({
        ...prev,
        [param]: value,
      }));
    },
    []
  );

  // ------------------------------------------------------------
  // Clear search
  // ------------------------------------------------------------
  const handleClear = useCallback(() => {
    setValues({});
  }, []);

  // ------------------------------------------------------------
  // Submit search
  // ------------------------------------------------------------
  const handleSubmit = useCallback(() => {
    if (!canSearch || loading) {
      return;
    }

    /*
      Build request dynamically from SEARCH_FIELDS.

      Example:

      {
        poNumber: "8936049D",
        countryCode: null,
        orderNumber: null,
        partnerId: "US922531",
        accountNumber: null,
        sku: null,
        transactionId: null
      }
    */

    const searchParams = {};

    supportedFields.forEach((field) => {
      const value = values[field.param]?.trim();

      // Empty values are explicitly sent as null
      searchParams[field.param] = value || null;
    });

    onSearch(searchParams);
  }, [
    values,
    canSearch,
    loading,
    onSearch,
    supportedFields,
  ]);

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="enterprise-card">

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">

        {SEARCH_FIELDS.map(
          ({ label, param, supported, maxLength }) => {

            const displayValue = supported
              ? values[param] || ""
              : derivedValues[param] || "N/A";

            const currentLength = supported
              ? (values[param] || "").length
              : 0;

            return (
              <div key={param}>

                {/* Label */}
                <label className="field-label flex items-center gap-1 text-xs mb-1">
                  {label}

                  {!supported && (
                    <Lock
                      size={10}
                      className="text-[#6B7280]"
                    />
                  )}
                </label>

                {/* Input */}
                <div className="relative">

                  <input
                    type="text"
                    readOnly={!supported}
                    disabled={!supported}
                    maxLength={
                      supported && maxLength
                        ? maxLength
                        : undefined
                    }
                    placeholder={
                      supported
                        ? `Enter ${label}`
                        : "N/A"
                    }
                    value={displayValue}
                    onChange={(e) =>
                      handleChange(
                        param,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    className="w-full border border-[#D6E4F7] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] focus:border-transparent placeholder-[#6B7280] pr-7 disabled:bg-[#F8FAFC] disabled:text-[#6B7280] disabled:cursor-not-allowed"
                  />

                  {/* Clear button */}
                  {supported && values[param] && (
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(param, "")
                      }
                      className="absolute right-2 top-2 text-[#6B7280] hover:text-[#1F2937]"
                      aria-label={`Clear ${label}`}
                    >
                      <X size={12} />
                    </button>
                  )}

                </div>

                {/* Character counter */}
                {supported && maxLength && (
                  <div className="flex justify-end mt-0.5">
                    <span
                      className={`text-[9px] ${
                        currentLength === maxLength
                          ? "text-[#D97706] font-medium"
                          : "text-[#9CA3AF]"
                      }`}
                    >
                      {currentLength}/{maxLength}
                    </span>
                  </div>
                )}

              </div>
            );
          }
        )}

      </div>

      {/* -------------------------------------------------------
          Footer
      ------------------------------------------------------- */}
      <div className="flex items-center justify-between mt-3">

        <span className="text-[10px] text-[#6B7280]">
          Enter any available search field. Empty fields are sent as null.
        </span>

        <div className="flex gap-2">

          {/* Clear */}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1.5 text-xs font-medium text-[#6B7280] border border-[#D6E4F7] rounded-xl hover:bg-[#EFF6FF]"
          >
            Clear
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSearch || loading}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F6CBD] rounded-xl hover:bg-[#0A5CA6] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <SearchIcon size={12} />

            {loading
              ? "Searching…"
              : "Search"}
          </button>

        </div>
      </div>

    </div>
  );
}

export default SearchBar;