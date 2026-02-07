import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { users as initialUsers } from "@/mock/data";
import type { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const resetForm = () => { setName(""); setEmail(""); setRole(""); setLocation(""); };

  const handleCreate = () => {
    if (!name || !email || !role || !location) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    const newUser: User = { id: `u${Date.now()}`, name, email, role: role as User["role"], location, status: "active" };
    setUserList((prev) => [...prev, newUser]);
    toast({ title: "User Created", description: `${name} has been added.` });
    addNotification({ type: "success", title: "User Created", message: `${name} (${role}) added to the system` });
    setCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!editUser || !name || !email || !role || !location) return;
    setUserList((prev) => prev.map((u) => u.id === editUser.id ? { ...u, name, email, role: role as User["role"], location } : u));
    toast({ title: "User Updated", description: `${name} has been updated.` });
    addNotification({ type: "info", title: "User Updated", message: `${name}'s profile was modified` });
    setEditOpen(false);
    setEditUser(null);
    resetForm();
  };

  const handleDeactivate = (user: User) => {
    setUserList((prev) => prev.map((u) => u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    toast({ title: user.status === "active" ? "User Deactivated" : "User Activated", description: `${user.name} status changed.` });
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setLocation(user.location);
    setEditOpen(true);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (u: User) => <Badge variant="outline" className="capitalize">{u.role}</Badge> },
    { key: "location", header: "Location" },
    { key: "status", header: "Status", render: (u: User) => (
      <Badge variant={u.status === "active" ? "default" : "secondary"} className="capitalize">{u.status}</Badge>
    )},
    { key: "actions", header: "Actions", render: (u: User) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => openEdit(u)}>Edit</Button>
        <Button size="sm" variant="ghost" className={u.status === "active" ? "text-destructive" : "text-success"} onClick={() => handleDeactivate(u)}>
          {u.status === "active" ? "Deactivate" : "Activate"}
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage system users and access">
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create User</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
              <Button className="w-full" onClick={handleCreate}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => { setEditOpen(open); if (!open) { setEditUser(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable data={userList} columns={columns} searchKey="name" searchPlaceholder="Search users..." />
    </div>
  );
}
