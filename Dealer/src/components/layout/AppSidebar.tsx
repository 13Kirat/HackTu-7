import { NavLink } from "@/components/NavLink";
import { useNotifications } from "@/components/NotificationProvider";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Package, Warehouse, Truck, ArrowLeftRight,
  MapPin, TrendingUp, Tag, Bell, User, Boxes, Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const { unreadCount, notifications } = useNotifications();
  const activeAlertsCount = notifications.filter(n => n.type === 'alert' && !n.read).length;

  const mainNav = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Products", url: "/products", icon: Package },
    { title: "Inventory", url: "/inventory", icon: Warehouse },
    { title: "Fulfillment Orders", url: "/fulfillment-orders", icon: Truck },
    { title: "Dealer Orders", url: "/dealer-orders", icon: ArrowLeftRight },
    { title: "Order Tracking", url: "/order-tracking", icon: MapPin },
    { title: "Sales History", url: "/sales-history", icon: TrendingUp },
    { title: "Coupons", url: "/coupons", icon: Tag },
    { title: "Alerts", url: "/alerts", icon: Bell, badge: activeAlertsCount },
    { title: "Notifications", url: "/notifications", icon: Inbox, badge: unreadCount },
  ];

  const accountNav = [
    { title: "Profile", url: "/profile", icon: User },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Boxes className="h-7 w-7 text-sidebar-primary shrink-0" />
          <span className="font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            SupplyHub
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {!!item.badge && item.badge > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 p-0 flex items-center justify-center text-[10px] group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
