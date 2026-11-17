import {
  Home,
  LayoutDashboard,
  User,
  LogOut,
  LinkIcon,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "@/redux/slices/user";
import { logoutUser } from "@/Api/UserApi";
import { toast } from "../ui/toast";
import { useMutation } from "@tanstack/react-query";
import BrandMark from "./BrandMark";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Links",
    url: "/links",
    icon: LinkIcon,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export default function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const { mutateAsync: logout } = useMutation({
    mutationFn: logoutUser,
    retry: false,
    onSuccess: () => {
      dispatch(clearCredentials());
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true });
    },
  });

  async function logoutHandler() {
    try {
      await toast.promise(logout(), {
        loading: "Logging out...",
        success: "Logged out successfully.",
        error: "Logout failed. Please try again.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <Sidebar className="workspace-sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-1.5 py-1">
          <BrandMark />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>WORKSPACE</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <NavLink
                        to={item.url}
                        end
                        onClick={() => setOpenMobile(false)}
                        className={({ isActive }) =>
                          isActive ? "active" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mx-3 mt-4 rounded-xl border border-violet-100 bg-violet-50/70 p-3 group-data-[collapsible=icon]:hidden">
          <div className="mb-2 flex items-center gap-2 text-violet-700">
            <Sparkles className="size-4" />
            <span className="text-xs font-semibold">Short links, simply</span>
          </div>
          <p className="text-[11px] leading-5 text-muted-foreground">
            Keep every destination organized in one place.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="mx-1 mb-2 flex items-center gap-2.5 rounded-xl bg-muted/60 p-2 group-data-[collapsible=icon]:hidden">
          <span className="workspace-user__avatar size-8 shrink-0 rounded-lg">
            {initials || user?.email?.[0]?.toUpperCase() || "S"}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-foreground">
              {fullName || "Shortly member"}
            </span>
            <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
              {user?.email || "Your workspace"}
            </span>
          </span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={logoutHandler}
              aria-label="Log out"
            >
              <LogOut />
              <span>
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
