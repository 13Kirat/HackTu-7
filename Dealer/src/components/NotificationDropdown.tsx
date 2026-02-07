import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/components/NotificationProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bell, Package, AlertTriangle, Tag, Settings, TrendingUp, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  order: { icon: Package, color: "text-primary" },
  stock: { icon: AlertTriangle, color: "text-destructive" },
  alert: { icon: TrendingUp, color: "text-warning" },
  system: { icon: Settings, color: "text-muted-foreground" },
  promotion: { icon: Tag, color: "text-success" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const recent = notifications.slice(0, 6);

  const handleClick = (id: string, actionUrl?: string) => {
    markAsRead(id);
    if (actionUrl) navigate(actionUrl);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 z-50 bg-popover border shadow-lg" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7 text-muted-foreground">
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-[380px]">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No notifications</div>
          ) : (
            <div>
              {recent.map((n) => {
                const config = typeConfig[n.type];
                const Icon = config.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n.id, n.actionUrl)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", `${config.color} bg-muted`)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm truncate", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full text-sm justify-center text-muted-foreground"
            onClick={() => navigate("/notifications")}
          >
            View all notifications <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
