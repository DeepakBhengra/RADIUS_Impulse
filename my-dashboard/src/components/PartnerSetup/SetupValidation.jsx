import { CheckCircle2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { statusToColor } from "../../utils/format";

function SetupValidation({ validations }) {
  return (
    <SectionCard icon={CheckCircle2} title="Setup Validation">
      <div className="space-y-1">
        {validations.map((v) => (
          <div
            key={v.type}
            className="flex justify-between items-center py-1.5 border-b border-[#DBEAFE] last:border-0"
          >
            <span className="field-label text-xs">{v.type}</span>
            <Badge color={statusToColor(v.status)}>{v.status}</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default SetupValidation;
