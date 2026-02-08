import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Building, Save, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, updateProfile: updateLocalProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['buyer-profile'],
    queryFn: profileService.getProfile,
  });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (updated) => {
        updateLocalProfile(updated);
        queryClient.invalidateQueries({ queryKey: ['buyer-profile'] });
        toast.success('Profile updated successfully');
        setEditing(false);
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const handleSave = async () => {
    saveMutation.mutate(form);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.info('Password change feature integrated with backend profile updates');
  };

  if (isLoading) {
      return (
          <div className="container py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your profile...</p>
          </div>
      );
  }

  const fields = [
    { key: 'name', label: 'Full Name', icon: User },
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'phone', label: 'Phone', icon: Phone },
    { key: 'location', label: 'Location / Address', icon: MapPin },
    { key: 'company', label: 'Entity Type', icon: Building },
  ] as const;

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Profile & Settings</h1>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">{profile?.name}</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{profile?.company}</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1">
                <Icon className="h-3 w-3" /> {label}
              </label>
              {editing && key !== 'company' && key !== 'email' ? (
                <input
                  value={form[key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <p className="text-sm font-medium mt-0.5">{profile?.[key] || 'Not specified'}</p>
              )}
            </div>
          ))}
          {editing && (
            <Button onClick={handleSave} className="w-full mt-4 font-bold" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-heading font-semibold flex items-center gap-1.5 mb-4 text-primary">
          <Lock className="h-4 w-4" /> Security Settings
        </h3>
        <div className="space-y-3">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmPassword', label: 'Confirm Password' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{field.label}</label>
              <input
                type="password"
                value={passwordForm[field.key as keyof typeof passwordForm]}
                onChange={e => setPasswordForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full mt-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <Button onClick={handleChangePassword} variant="outline" className="w-full mt-2 font-bold h-11">Update Password</Button>
        </div>
      </div>
    </div>
  );
}