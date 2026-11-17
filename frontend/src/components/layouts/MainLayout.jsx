import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "../common/AppSidebar";
import Footer from "../common/Footer";
import { Toaster } from "../ui/toast";

export default function MainLayout() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user.user);
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/home": "Create a link",
    "/links": "Your links",
    "/profile": "Account settings",
  };
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarProvider>
      <div className="app-shell flex w-full">
        <AppSidebar />
        <SidebarInset className="workspace-inset">
          <header className="workspace-header">
            <div className="workspace-header__identity">
              <SidebarTrigger aria-label="Toggle navigation" />
              <div className="workspace-heading">
                <strong>{pageTitles[pathname] || "Shortly workspace"}</strong>
                <span>Your links, all in one place</span>
              </div>
            </div>
            <div className="workspace-user">
              <span className="workspace-user__name">{fullName || user?.email}</span>
              <span className="workspace-user__avatar" aria-label="Your profile">
                {initials || user?.email?.[0]?.toUpperCase() || "S"}
              </span>
            </div>
          </header>
          <main className="workspace-main">
            <Outlet />
          </main>
          <Footer />
          <Toaster position="top-right" className="z-[9999]" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
