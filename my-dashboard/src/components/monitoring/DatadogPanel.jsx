
import { Database, ExternalLink } from "lucide-react";
import SectionCard from "../common/SectionCard";

function DatadogPanel() {
  const openDetails = () => {
  window.open(
    "http://sgdciwapp4001:7009/", // Replace with API Hosted ENDPOINT
    "_blank",
    "noopener,noreferrer"
  );
};

  return (
  <SectionCard
    icon={Database}
    title="Datadog"
  >
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <button
        onClick={openDetails}
        className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-md"
      >
        <ExternalLink size={15} />
        Click here
      </button>

      <p className="mt-4 max-w-lg text-xs leading-5 text-[#6B7280]">
        Open Diagnostics Workspace
      </p>
    </div>
  </SectionCard>
);
}

export default DatadogPanel;
