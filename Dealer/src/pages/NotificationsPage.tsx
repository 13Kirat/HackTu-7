import { useState } from "react";
import { useNotifications } from "@/components/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bell, Package, AlertTriangle, Tag, Settings, TrendingUp,
  Check, Trash2, CheckCheck, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; label: string }> = {
  order: { icon: Package, color: "text-primary", label: "Orders" },
  stock: { icon: AlertTriangle, color: "text-destructive", label: "Stock" },
  alert: { icon: TrendingUp, color: "text-warning", label: "Alerts" },
  system: { icon: Settings, color: "text-muted-foreground", label: "System" },
  promotion: { icon: Tag, color: "text-success", label: "Promotions" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function NotificationCard({ n, onRead, onDelete, onNavigate }: {
  n: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (url: string) => void;
}) {
  const config = typeConfig[n.type];
  const Icon = config.icon;

  return (
    <Card className={cn("shadow-sm transition-all", !n.read && "border-l-4 border-l-primary")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", `${config.color} bg-muted`)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
              <Badge variant="outline" className="text-[10px] ml-auto shrink-0 capitalize">{n.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{n.message}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground/70">{formatDate(n.createdAt)}</span>
              <div className="ml-auto flex gap-1">
                {n.actionUrl && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onNavigate(n.actionUrl!)}>
                    View
                  </Button>
                )}
                {!n.read && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onRead(n.id)}>
                    <Check className="h-3 w-3 mr-1" /> Read
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => onDelete(n.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  const filtered = tab === "all"
    ? notifications
    : tab === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear all
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <Separator orientation="vertical" className="h-5 mx-1" />
          {Object.entries(typeConfig).map(([key, cfg]) => {
            const count = notifications.filter(n => n.type === key).length;
            return (
              <TabsTrigger key={key} value={key} className="capitalize gap-1">
                <cfg.icon className="h-3 w-3" /> {cfg.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={tab} className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            filtered.map(n => (
              <NotificationCard
                key={n.id}
                n={n}
                onRead={markAsRead}
                onDelete={deleteNotification}
                onNavigate={(url) => { markAsRead(n.id); navigate(url); }}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
