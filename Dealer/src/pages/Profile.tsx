import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { dealerService } from "@/services/dealerService";
import { toast } from "sonner";
import type { Dealer } from "@/types";
import { Loader2, Save, Lock, Bell } from "lucide-react";

const Profile = () => {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", location: "", phone: "" });
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    orderUpdates: true,
    newRegistrations: true,
    systemMaintenance: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const d = await dealerService.getCurrentDealer();
        setDealer(d);
        setForm({ name: d.name, email: d.email, location: d.location, phone: d.phone });
        if (d.settings) {
          setSettings(d.settings);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await dealerService.updateProfile({ ...form, settings });
      setDealer(updated);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  };

  const handlePasswordChange = () => {
    toast.info("Password change feature coming soon");
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dealer) return null;

  return (
    <div className="space-y-6 max-w-2xl pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your dealer account information and preferences</p>
      </div>

      {/* Basic Profile */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                {dealer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{dealer.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{dealer.location}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Store Location / Address</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-xs text-muted-foreground">Receive alerts when stock drops below threshold</p>
              </div>
              <Switch 
                checked={settings.lowStockAlerts} 
                onCheckedChange={(checked) => handleToggle("lowStockAlerts", checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Updates</Label>
                <p className="text-xs text-muted-foreground">Get notified about status changes in your orders</p>
              </div>
              <Switch 
                checked={settings.orderUpdates} 
                onCheckedChange={(checked) => handleToggle("orderUpdates", checked)} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Maintenance</Label>
                <p className="text-xs text-muted-foreground">Important updates about platform uptime</p>
              </div>
              <Switch 
                checked={settings.systemMaintenance} 
                onCheckedChange={(checked) => handleToggle("systemMaintenance", checked)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save All Changes
        </Button>
      </div>

      {/* Security */}
      <Card className="shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <p className="text-sm text-muted-foreground mb-2">Update your login credentials</p>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handlePasswordChange}>Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;