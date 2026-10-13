import { useState } from "react";
import { Code2, ChevronDown, ChevronUp } from "lucide-react";
import SectionCard from "../common/SectionCard";

// Temporary but genuinely useful during backend integration: shows exactly
// what the .NET GetOrder endpoint returned, so field-name mismatches in
// mapOrderResponse.js are obvious rather than silently blank. Safe to
// delete once the mapping is finalized and trusted.
function RawResponsePanel({ raw }) {
  const [open, setOpen] = useState(false);
  if (!raw) return null;

  return (
    <SectionCard
      icon={Code2}
      title="Raw API Response (debug)"
      actions={
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-[10px] text-[#2563EB] hover:underline"
        >
          {open ? "Hide" : "Show"}
          {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      }
    >
      {open ? (
        <pre className="text-[10px] font-mono bg-[#111827] text-[#DBEAFE] rounded-xl p-3 overflow-auto max-h-80">
          {JSON.stringify(raw, null, 2)}
        </pre>
      ) : (
        <div className="text-[11px] text-[#6B7280]">
          Click "Show" to inspect the exact JSON the backend returned — useful
          while confirming services/mapOrderResponse.js matches your DTO.
        </div>
      )}
    </SectionCard>
  );
}

export default RawResponsePanel;
