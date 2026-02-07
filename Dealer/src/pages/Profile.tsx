import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { dealerService } from "@/services/dealerService";
import { toast } from "sonner";
import type { Dealer } from "@/types";

const Profile = () => {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [form, setForm] = useState({ name: "", email: "", location: "", phone: "" });

  useEffect(() => {
    dealerService.getCurrentDealer().then(d => {
      setDealer(d);
      setForm({ name: d.name, email: d.email, location: d.location, phone: d.phone });
    });
  }, []);

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  const handlePasswordChange = () => {
    toast.success("Password changed successfully");
  };

  if (!dealer) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your dealer account</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">{dealer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{dealer.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{dealer.location}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button variant="outline" onClick={handlePasswordChange}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
