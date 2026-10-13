import { Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";
import radiusHeaderLogo from "../../assets/RADIUS_Header_Logo.png";

function Header({ toggleSidebar }) {
  return (
    <header className="h-14 bg-white border-b border-[#D6E4F7] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-[#0F6CBD] p-1 rounded-lg hover:bg-[#F0F4F8] md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <img
          src={radiusHeaderLogo}
          alt="RADIUS and IMPULSE Logo"
          className="h-13 w-auto"
        />
      </div>
      <div className="flex items-center gap-1">
        <button className="relative text-[#6B7280] hover:text-[#0F6CBD] p-2 rounded-full hover:bg-[#F0F4F8]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>
        <button className="text-[#6B7280] hover:text-[#0F6CBD] p-2 rounded-full hover:bg-[#F0F4F8]">
          <HelpCircle size={18} />
        </button>
        <button className="ml-1 flex items-center gap-2 bg-[#F0F4F8] hover:bg-[#E5EAEF] text-[#0F6CBD] rounded-full pl-1.5 pr-3 py-1">
          <div className="w-7 h-7 bg-[#0F6CBD] rounded-full flex items-center justify-center text-white text-xs font-bold">
            AS
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            Admin User
          </span>
          <ChevronDown size={14} className="hidden sm:inline" />
        </button>
      </div>
    </header>
  );
}

export default Header;
