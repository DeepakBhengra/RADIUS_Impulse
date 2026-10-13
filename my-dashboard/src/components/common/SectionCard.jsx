function SectionCard({ icon: Icon, title, children, actions }) {
  return (
    <div className="enterprise-card h-full overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#D6E4F7] bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-[#0F6CBD]" />
          <span className="enterprise-card-header text-sm font-semibold">{title}</span>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default SectionCard;
