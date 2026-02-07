import { Bell, X, Check, CheckCheck, Trash2, AlertTriangle, TrendingUp, Package, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; className: string }> = {
  low_stock: { icon: AlertTriangle, className: "text-destructive" },
  overstock: { icon: Package, className: "text-warning" },
  high_demand: { icon: TrendingUp, className: "text-primary" },
  info: { icon: Info, className: "text-muted-foreground" },
  success: { icon: CheckCircle, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotificationItem({ notification, onRead, onDismiss }: {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 cursor-pointer group",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className={cn("mt-0.5 shrink-0", config.className)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm truncate", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{timeAgo(notification.timestamp)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss, clearAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={markAllAsRead}>
                <CheckCheck className="h-3 w-3" /> Mark all read
              </Button>
            )}
          </div>
        </div>
        <Separator />

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Check className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">All caught up!</p>
            <p className="text-xs">No notifications</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[360px]">
              <div className="divide-y">
                {notifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDismiss={dismiss} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground gap-1" onClick={clearAll}>
                <Trash2 className="h-3 w-3" /> Clear all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
