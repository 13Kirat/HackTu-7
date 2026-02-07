import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-info/10 text-info border-info/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  active: "bg-success/10 text-success border-success/20",
  expired: "bg-muted text-muted-foreground",
  upcoming: "bg-info/10 text-info border-info/20",
  resolved: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
}
