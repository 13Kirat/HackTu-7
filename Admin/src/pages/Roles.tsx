import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Role } from "@/types";

const availablePermissions = [
  "view_inventory", "create_inventory", "update_inventory", "transfer_inventory",
  "view_orders", "process_order", "create_order",
  "view_users", "manage_users",
  "view_products", "manage_products",
  "manage_roles", "view_analytics", "admin"
];

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPermissions, setNewPermissions] = useState<string[]>([]);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: userService.getRoles,
  });

  const createMutation = useMutation({
    mutationFn: userService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({ title: "Role Created", description: "New access role added." });
      setCreateOpen(false);
      setNewName("");
      setNewPermissions([]);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create role", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({ title: "Role Deleted", description: "Access role removed." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to delete role", variant: "destructive" });
    }
  });

  const handleCreate = () => {
    if (!newName) return;
    createMutation.mutate({ name: newName, permissions: newPermissions });
  };

  const togglePermission = (perm: string) => {
    setNewPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Manage access control roles">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Create Role</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create New Role</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input placeholder="e.g. Warehouse Manager" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map(perm => (
                    <div key={perm} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`perm-${perm}`}
                        checked={newPermissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <label htmlFor={`perm-${perm}`} className="text-xs capitalize">{perm.replace(/_/g, ' ')}</label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {roles?.map((role) => (
            <Card key={role.id}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                    if(confirm("Delete this role?")) deleteMutation.mutate(role.id);
                }}><Trash2 className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((p: string) => (
                    <Badge key={p} variant="secondary" className="text-[10px] uppercase">{p.replace(/_/g, ' ')}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}