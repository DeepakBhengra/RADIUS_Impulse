import { useEffect, useState } from "react";
import Dashboard from "./App";
import LineItemDetailsPage from "./pages/LineItemDetailsPage";
import PartnerSetupDetailsPage from "./pages/PartnerSetupDetailsPage";
import PoSwitchDetailsPage from "./pages/PoSwitchDetailsPage";
import OrderHeaderDetailsPage from "./pages/OrderHeaderDetailsPage";

function parseHashLocation() {
  const rawHash = window.location.hash || "#/";
  const hashWithoutPrefix = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const [pathPart = "/", queryPart = ""] = hashWithoutPrefix.split("?");
  const trimmedPath = pathPart.trim();
  const path = trimmedPath ? (trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`) : "/";

  return {
    path: path.replace(/\/+$/, "") || "/",
    searchParams: new URLSearchParams(queryPart),
  };
}

export default function RootRouter() {
  const [location, setLocation] = useState(() => parseHashLocation());

  useEffect(() => {
    const handleHashChange = () => setLocation(parseHashLocation());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (location.path === "/line-item-details") {
    return <LineItemDetailsPage searchParams={location.searchParams} />;
  }

  if (location.path === "/partner-setup-details") {
    return <PartnerSetupDetailsPage searchParams={location.searchParams} />;
  }

  if (location.path === "/po-switch-details") {
    return <PoSwitchDetailsPage searchParams={location.searchParams} />;
  }

  if (location.path === "/order-header-details") {
    return <OrderHeaderDetailsPage searchParams={location.searchParams} />;
  }

  return <Dashboard />;
}
