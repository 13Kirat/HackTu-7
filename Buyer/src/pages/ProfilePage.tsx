import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Building, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const profile = user?.profile ?? null;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>(profile ?? {});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSave = async () => {
    updateProfile(form);
    setEditing(false);
    toast.success('Profile updated');
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    await profileService.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password changed');
  };

  if (!profile) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  const fields = [
    { key: 'name', label: 'Full Name', icon: User },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'company', label: 'Company', icon: Building },
  ] as const;

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Profile & Settings</h1>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.company}</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" /> {label}
              </label>
              {editing ? (
                <input
                  value={form[key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-sm mt-0.5">{profile[key]}</p>
              )}
            </div>
          ))}
          {editing && (
            <Button onClick={handleSave} className="w-full mt-2">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading font-semibold flex items-center gap-1.5 mb-4">
          <Lock className="h-4 w-4 text-primary" /> Change Password
        </h3>
        <div className="space-y-3">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmPassword', label: 'Confirm Password' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
              <input
                type="password"
                value={passwordForm[field.key as keyof typeof passwordForm]}
                onChange={e => setPasswordForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <Button onClick={handleChangePassword} variant="outline" className="w-full">Update Password</Button>
        </div>
      </div>
    </div>
  );
}
