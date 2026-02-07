import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage platform settings and preferences" />

      <Card>
        <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="SupplyChain Corp" /></div>
          <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue="admin@supplyco.com" /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {["Low stock alerts", "Order updates", "New user registrations", "System maintenance"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Irreversible actions. Proceed with caution.
          </p>
          <Button variant="destructive">Reset All Data</Button>
        </CardContent>
      </Card>
    </div>
  );
}
