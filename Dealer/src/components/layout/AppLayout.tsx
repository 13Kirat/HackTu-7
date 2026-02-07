import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <NotificationDropdown />
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">{user?.name || "User"}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
