import { useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, AlertTriangle, TrendingUp, Package, Info, CheckCircle, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { notificationService } from "@/services/notificationService";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const typeConfig: Record<string, { icon: typeof Bell; className: string }> = {
  low_stock: { icon: AlertTriangle, className: "text-destructive" },
  overstock: { icon: Package, className: "text-warning" },
  high_demand: { icon: TrendingUp, className: "text-primary" },
  info: { icon: Info, className: "text-muted-foreground" },
  success: { icon: CheckCircle, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  system: { icon: Radio, className: "text-primary" },
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

function BroadcastDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [target, setTarget] = useState("all");
  const [loading, setLoading] = useState(false);
  const { refresh } = useNotifications();
  const { toast } = useToast();

  const handleBroadcast = async () => {
    if (!title || !message) return;
    setLoading(true);
    try {
      await notificationService.create({
        title,
        message,
        type,
        targetRoles: target === "all" ? [] : [target]
      });
      toast({ title: "Broadcast Sent", description: "Message has been sent to selected users." });
      setOpen(false);
      setTitle(""); setMessage(""); setType("info"); setTarget("all");
      refresh();
    } catch (e) {
      toast({ title: "Error", description: "Failed to send broadcast.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold tracking-tight">
          <Radio className="mr-1 h-3 w-3" /> Broadcast
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Broadcast Notification</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="System Update" /></div>
          <div className="space-y-2"><Label>Message</Label><Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter broadcast message..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Portal</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  <SelectItem value="Dealer">Dealers</SelectItem>
                  <SelectItem value="Buyer">Buyers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={handleBroadcast} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Radio className="mr-2 h-4 w-4" />}
            Send Broadcast
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
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
          <p className={cn("text-xs truncate", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(notification.timestamp)}</p>
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
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">Activity</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4">{unreadCount}</Badge>
              )}
            </div>
            <BroadcastDialog />
          </div>
          <div className="flex items-center justify-between px-4 pb-2">
             <Button variant="link" size="sm" className="h-auto p-0 text-[10px] text-muted-foreground" onClick={markAllAsRead}>
                Mark all read
             </Button>
          </div>
        </div>
        <Separator />

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Check className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No new activity</p>
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
              <Button variant="ghost" size="sm" className="w-full text-[10px] text-muted-foreground gap-1" onClick={clearAll}>
                <Trash2 className="h-3 w-3" /> Clear history
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}