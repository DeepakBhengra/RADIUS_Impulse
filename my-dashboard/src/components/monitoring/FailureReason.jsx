import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import SectionCard from "../common/SectionCard";

function FailureReason({ failures }) {
  const hasFailures = failures.length > 0;

  return (
    <SectionCard icon={AlertTriangle} title="Failure Reason">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            hasFailures ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {hasFailures ? (
            <XCircle size={24} className="text-red-500" strokeWidth={2} />
          ) : (
            <CheckCircle2 size={24} className="text-green-500" strokeWidth={2} />
          )}
        </div>
        <div className="text-sm font-semibold text-[#111827] mb-1">
          {hasFailures ? `${failures.length} Failure${failures.length > 1 ? "s" : ""} Detected` : "No Failures"}
        </div>
        {hasFailures ? (
          <ul className="text-xs text-[#6B7280] space-y-1">
            {failures.map((f, i) => (
              <li key={i}>
                <span className="font-medium text-[#111827]">{f.system}:</span> {f.remarks}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-[#6B7280]">
            This transaction completed successfully with no failures.
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default FailureReason;
