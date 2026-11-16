import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "../common/AppSidebar";
import { Toaster } from "../ui/toast";

export default function MainLayout() {
  return (
     <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="font-semibold">Shortly</h1>
        </header>

        <main className="flex-1 w-11/12 mx-auto py-6">
          <Outlet />
        </main>
        <Toaster position="top-right" className="z-[9999]"/>
      </SidebarInset>
    </SidebarProvider>
  );
}
