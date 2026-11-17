import {
  Home,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  LinkIcon,
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

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "@/redux/slices/user";
import { logoutUser } from "@/Api/UserApi";
import { toast } from "../ui/toast";
import { useMutation } from "@tanstack/react-query";

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
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export default function AppSidebar() {
  const { open, setOpenMobile } = useSidebar();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            <p className="text-xl">S</p>
          </div>
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            Shortly
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

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
                          isActive ? "bg-gray-200 text-black" : ""
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer" onClick={logoutHandler}>
              <LogOut />
              <span className="text-base font-semibold" >
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
