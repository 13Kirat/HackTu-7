import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { roles as initialRoles } from "@/mock/data";
import type { Role, Permission } from "@/types";
import { useToast } from "@/hooks/use-toast";

const permissionAreas = ["inventory", "orders", "users", "products"] as const;
const permissionTypes = ["read", "create", "update", "delete"] as const;

const defaultPermissions = (): Record<string, Permission> =>
  Object.fromEntries(permissionAreas.map((a) => [a, { read: false, create: false, update: false, delete: false }]));

export default function RolesPage() {
  const [roleList, setRoleList] = useState<Role[]>(initialRoles);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!newName) {
      toast({ title: "Validation Error", description: "Role name is required", variant: "destructive" });
      return;
    }
    const newRole: Role = { id: `r${Date.now()}`, name: newName, description: newDesc, permissions: defaultPermissions() };
    setRoleList((prev) => [...prev, newRole]);
    toast({ title: "Role Created", description: `${newName} has been added.` });
    setCreateOpen(false);
    setNewName("");
    setNewDesc("");
  };

  const togglePermission = (roleId: string, area: string, type: keyof Permission) => {
    setRoleList((prev) => prev.map((r) => {
      if (r.id !== roleId) return r;
      const updated = { ...r, permissions: { ...r.permissions } };
      updated.permissions[area] = { ...updated.permissions[area], [type]: !updated.permissions[area][type] };
      return updated;
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Manage access control roles">
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) { setNewName(""); setNewDesc(""); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Create Role</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Role</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Role Name</Label><Input placeholder="e.g. Supervisor" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Brief description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} /></div>
              <Button className="w-full" onClick={handleCreate}>Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {roleList.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Badge variant="outline">{role.description}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {permissionAreas.map((area) => (
                  <div key={area} className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium capitalize">{area}</span>
                    <div className="flex gap-3">
                      {permissionTypes.map((type) => (
                        <div key={type} className="flex items-center gap-1">
                          <Switch
                            checked={role.permissions[area]?.[type] ?? false}
                            onCheckedChange={() => togglePermission(role.id, area, type)}
                            className="scale-75"
                          />
                          <span className="text-xs text-muted-foreground capitalize">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
