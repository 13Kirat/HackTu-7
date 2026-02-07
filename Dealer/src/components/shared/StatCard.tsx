import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                variant === "destructive" ? "text-destructive" : variant === "warning" ? "text-warning" : "text-success"
              )}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shrink-0",
            variant === "destructive" ? "bg-destructive/10 text-destructive" :
            variant === "warning" ? "bg-warning/10 text-warning" :
            "bg-primary/10 text-primary"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
