import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { alertService } from "@/services/alertService";
import { toast } from "sonner";
import type { Alert } from "@/types";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    alertService.getAlerts().then(setAlerts);
  }, []);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" as const } : a));
    toast.success("Alert resolved");
  };

  const active = alerts.filter(a => a.status === "active");
  const resolved = alerts.filter(a => a.status === "resolved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts & Notifications</h1>
        <p className="text-muted-foreground">{active.length} active alerts require attention</p>
      </div>

      <div className="space-y-3">
        {active.map(alert => (
          <Card key={alert.id} className="shadow-sm border-l-4 border-l-destructive">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {alert.type === "low_stock" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-warning mt-0.5 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{alert.productName}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {alert.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.recommendedAction}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Current Stock: <strong>{alert.currentStock}</strong></span>
                      <span>Threshold: <strong>{alert.threshold}</strong></span>
                      <span>{alert.createdAt}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resolved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Resolved</h2>
          <div className="space-y-2">
            {resolved.map(alert => (
              <Card key={alert.id} className="shadow-sm opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    <p className="text-sm">{alert.productName} — {alert.type.replace("_", " ")}</p>
                    <Badge variant="outline" className="ml-auto text-xs">Resolved</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
