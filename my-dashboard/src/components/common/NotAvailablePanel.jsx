import { Construction } from "lucide-react";
import SectionCard from "./SectionCard";

function NotAvailablePanel({ icon, title, note }) {
  return (
    <SectionCard icon={icon || Construction} title={title}>
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-2">
          <Construction size={18} className="text-[#6B7280]" />
        </div>
        <div className="text-xs font-semibold text-[#111827] mb-1">
          Not available yet
        </div>
        <div className="text-[11px] text-[#6B7280] max-w-[220px]">
          {note || "The backend doesn't expose this data yet — this panel will populate once that endpoint exists."}
        </div>
      </div>
    </SectionCard>
  );
}

export default NotAvailablePanel;