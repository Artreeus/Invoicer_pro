import { useState } from 'react';
import { User as UserIcon, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const updateProfile = useAuthStore(s => s.updateProfile);
  const changePassword = useAuthStore(s => s.changePassword);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  const profileChanged = name.trim() !== (user?.name ?? '') || email.trim() !== (user?.email ?? '');

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile and password</p>
      </div>

      <form onSubmit={handleProfile} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserIcon size={16} className="text-teal-600 dark:text-teal-300" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full name</label>
            <input className={inputClass} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={savingProfile || !profileChanged}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {savingProfile && <Loader2 size={16} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </form>

      <form onSubmit={handlePassword} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-teal-600 dark:text-teal-300" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Change password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Current password</label>
            <input className={inputClass} type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New password</label>
              <input className={inputClass} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoComplete="new-password" placeholder="At least 6 characters" />
            </div>
            <div>
              <label className={labelClass}>Confirm new password</label>
              <input className={inputClass} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {savingPassword && <Loader2 size={16} className="animate-spin" />}
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}
