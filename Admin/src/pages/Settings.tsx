import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { companyService } from "@/services/companyService";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", user?.companyId],
    queryFn: () => companyService.get(user?.companyId as string),
    enabled: !!user?.companyId,
  });

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || "");
      setContactEmail(company.contactEmail || "");
      setAddress(company.address || "");
      setPhone(company.phone || "");
    }
  }, [company]);

  const companyMutation = useMutation({
    mutationFn: (data: any) => companyService.update(user?.companyId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      toast({ title: "Success", description: "Company information updated." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Update Failed", 
        description: error.response?.data?.message || "Failed to update company", 
        variant: "destructive" 
      });
    }
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({ title: "Success", description: "Notification preferences updated." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Update Failed", 
        description: error.response?.data?.message || "Failed to update settings", 
        variant: "destructive" 
      });
    }
  });

  const handleCompanySave = () => {
    companyMutation.mutate({ name: companyName, contactEmail, address, phone });
  };

  const handleToggle = (key: string, checked: boolean) => {
    profileMutation.mutate({
      settings: {
        ...user?.settings,
        [key]: checked
      }
    });
  };

  if (companyLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const notificationItems = [
    { id: "lowStockAlerts", label: "Low stock alerts" },
    { id: "orderUpdates", label: "Order updates" },
    { id: "newRegistrations", label: "New user registrations" },
    { id: "systemMaintenance", label: "System maintenance" }
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage platform settings and preferences" />

      <Card>
        <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button onClick={handleCompanySave} disabled={companyMutation.isPending}>
            {companyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Company Info
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notificationItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <Switch 
                checked={!!(user?.settings as any)?.[item.id]} 
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
                disabled={profileMutation.isPending}
              />
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
          <Button variant="destructive" onClick={() => toast({ title: "Action restricted", description: "Please contact support to reset data." })}>
            Reset All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}