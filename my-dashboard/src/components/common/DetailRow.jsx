import { memo } from "react";

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-[#DBEAFE] last:border-0">
      <span className="field-label text-xs min-w-[130px]">{label}</span>
      <span className="field-value text-xs text-right max-w-[180px] break-words">
        {value}
      </span>
    </div>
  );
}

export default memo(DetailRow);
