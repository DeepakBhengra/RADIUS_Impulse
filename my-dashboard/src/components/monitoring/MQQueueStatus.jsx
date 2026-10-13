import { Server } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { statusToColor } from "../../utils/format";

function MQQueueStatus({ queues }) {
  return (
    <SectionCard
      icon={Server}
      title="MQ Queue Status"
      actions={
        <button className="text-[10px] text-[#2563EB] hover:underline">
          View All Queues
        </button>
      }
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#DBEAFE]">
            {["Queue Name", "Status", "Messages", "Last Updated"].map((h) => (
              <th
                key={h}
                className="text-left pb-2 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {queues.map((q) => (
            <tr key={q.name} className="border-b border-[#DBEAFE] last:border-0 hover:bg-[#EFF6FF]">
              <td className="py-1.5 font-medium text-[#111827] text-[11px]">{q.name}</td>
              <td className="py-1.5">
                <Badge color={statusToColor(q.status)}>{q.status}</Badge>
              </td>
              <td className="py-1.5 text-[#6B7280] text-center">{q.messages}</td>
              <td className="py-1.5 text-[#6B7280] text-[10px]">{q.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-3 text-xs text-[#2563EB] hover:underline font-medium block text-center w-full">
        View Queue Dashboard
      </button>
    </SectionCard>
  );
}

export default MQQueueStatus;
