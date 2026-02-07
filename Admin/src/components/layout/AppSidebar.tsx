import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Route, BarChart3, TrendingUp,
  RefreshCw, PieChart, Users, Shield, Box, Ticket, Settings,
  ChevronLeft, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Inventory", path: "/inventory", icon: Package },
  { title: "Product Tracking", path: "/tracking", icon: Route },
  { title: "Stock Insights", path: "/insights", icon: BarChart3 },
  { title: "Forecasting", path: "/forecasting", icon: TrendingUp },
  { title: "Replenishment", path: "/replenishment", icon: RefreshCw },
  { title: "Analytics", path: "/analytics", icon: PieChart },
  { title: "Users", path: "/users", icon: Users },
  { title: "Roles", path: "/roles", icon: Shield },
  { title: "Products", path: "/products", icon: Box },
  { title: "Coupons", path: "/coupons", icon: Ticket },
  { title: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 h-screen sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
          <Package className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sidebar-accent-foreground text-sm tracking-tight">
            SupplyChain
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
