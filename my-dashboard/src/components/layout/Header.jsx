import { useEffect, useState } from "react";
import { Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";
import radiusHeaderLogo from "../../assets/RADIUS_Header_Logo.png";
import {
  displayName,
  initialsFromName,
  readSession,
  usePendingApprovalCount,
} from "../../auth/accessSession";

function useAccessRevision() {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const bump = () => setRevision((value) => value + 1);
    window.addEventListener("radius-access", bump);
    return () => window.removeEventListener("radius-access", bump);
  }, []);
  return revision;
}

function Header({ toggleSidebar, onAccount }) {
  useAccessRevision();
  const session = readSession();
  const name = displayName(session);
  const initials = initialsFromName(name);
  const pending = usePendingApprovalCount(session?.mode === "admin");

  function openAccount() {
    if (!session) return;
    if (onAccount) onAccount();
    else window.location.hash = "#/account";
  }

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
        <button
          className="relative text-[#6B7280] hover:text-[#0F6CBD] p-2 rounded-full hover:bg-[#F0F4F8]"
          type="button"
          aria-label={pending ? `${pending} approval requests` : "Notifications"}
          onClick={openAccount}
        >
          <Bell size={18} />
          {pending > 0 ? (
            <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-red-500 rounded-full text-white text-[10px] leading-4 font-bold">
              {pending}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
          )}
        </button>
        <button className="text-[#6B7280] hover:text-[#0F6CBD] p-2 rounded-full hover:bg-[#F0F4F8]" type="button">
          <HelpCircle size={18} />
        </button>
        <button
          type="button"
          onClick={openAccount}
          className="ml-1 flex items-center gap-2 bg-[#F0F4F8] hover:bg-[#E5EAEF] text-[#0F6CBD] rounded-full pl-1.5 pr-3 py-1"
        >
          <div className="w-7 h-7 bg-[#0F6CBD] rounded-full flex items-center justify-center text-white text-xs font-bold">
            {session ? initials : "AS"}
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {session ? name : "Sign in"}
          </span>
          <ChevronDown size={14} className="hidden sm:inline" />
        </button>
      </div>
    </header>
  );
}

export default Header;
