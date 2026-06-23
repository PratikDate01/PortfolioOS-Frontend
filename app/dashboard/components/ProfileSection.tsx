import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { Portfolio, User, CloudinaryAsset } from '@/types';
import { Save, Loader2, AlertCircle, Key, CheckCircle } from 'lucide-react';
import CloudinaryUploadZone from '@/components/features/CloudinaryUploadZone';

interface ProfileSectionProps {
  user: User;
  portfolioSettings: Portfolio | undefined;
  refetchPortfolio: () => void;
}

export default function ProfileSection({ user, portfolioSettings, refetchPortfolio }: ProfileSectionProps) {
  const queryClient = useQueryClient();

  // Profile fields state
  const [profileName, setProfileName] = useState(user.name || '');
  const [profileBio, setProfileBio] = useState(user.bio || '');
  const [profileGithub, setProfileGithub] = useState(user.socialLinks?.github || '');
  const [profileLinkedin, setProfileLinkedin] = useState(user.socialLinks?.linkedin || '');
  const [profileTwitter, setProfileTwitter] = useState(user.socialLinks?.twitter || '');
  const [profileWebsite, setProfileWebsite] = useState(user.socialLinks?.website || '');

  // Portfolio Theme Settings
  const [portfolioTheme, setPortfolioTheme] = useState<'corporate' | 'portfolio-os' | 'aurora-glass' | 'nordic-frost'>('portfolio-os');
  const [portfolioHeadline, setPortfolioHeadline] = useState('');
  const [portfolioVisibility, setPortfolioVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [portfolioCustomDomain, setPortfolioCustomDomain] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileImageState, setProfileImageState] = useState<CloudinaryAsset | null>(null);
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Sync profile details when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileBio(user.bio || '');
      setProfileGithub(user.socialLinks?.github || '');
      setProfileLinkedin(user.socialLinks?.linkedin || '');
      setProfileTwitter(user.socialLinks?.twitter || '');
      setProfileWebsite(user.socialLinks?.website || '');
      setProfileImageState(user.profileImage || null);
    }
  }, [user]);

  // Sync portfolio settings when fetched
  useEffect(() => {
    if (portfolioSettings) {
      setPortfolioTheme(portfolioSettings.theme || 'portfolio-os');
      setPortfolioHeadline(portfolioSettings.headline || '');
      setPortfolioVisibility(portfolioSettings.visibility || 'public');
      setPortfolioCustomDomain(portfolioSettings.customDomain || '');
      setShowProfilePhoto(portfolioSettings.showProfilePhoto !== false);
    }
  }, [portfolioSettings]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { profile: any; portfolio: any }) => {
      const profileRes = await apiFetch('/users/me/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload.profile)
      });
      if (profileRes.error) throw new Error(profileRes.error);

      const portfolioRes = await apiFetch('/portfolios/me', {
        method: 'PATCH',
        body: JSON.stringify(payload.portfolio)
      });
      if (portfolioRes.error) throw new Error(portfolioRes.error);

      return { profile: profileRes.data, portfolio: portfolioRes.data };
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      refetchPortfolio();
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword?: string }) => {
      const res = await apiFetch('/users/me/password', {
        method: 'POST',
        body: JSON.stringify(passwordData)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setTimeout(() => setPasswordSuccess(false), 5000);
    },
    onError: (error: Error) => {
      setPasswordError(error.message || 'Failed to update password');
    }
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      profile: {
        name: profileName,
        bio: profileBio,
        profileImage: profileImageState,
        avatarUrl: profileImageState?.secureUrl || '',
        socialLinks: {
          github: profileGithub,
          linkedin: profileLinkedin,
          twitter: profileTwitter,
          website: profileWebsite
        }
      },
      portfolio: {
        headline: portfolioHeadline,
        bio: profileBio,
        theme: portfolioTheme,
        visibility: portfolioVisibility,
        customDomain: portfolioCustomDomain,
        githubUsername: profileGithub,
        profileImage: profileImageState,
        showProfilePhoto: showProfilePhoto
      }
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <form onSubmit={handleProfileSave} className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-6">
        <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white font-sans">Theme & General Portfolio Settings</h2>
            <p className="text-xs text-zinc-500 font-sans">Configure your portfolio aesthetics, domain details, and sync hooks.</p>
          </div>
          {saveSuccess && (
            <span className="text-xs text-teal-400 font-semibold font-mono flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Settings updated successfully!</span>
            </span>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Portfolio Theme Choice</label>
            <select
              value={portfolioTheme}
              onChange={e => setPortfolioTheme(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
            >
              <option value="portfolio-os">Portfolio OS (Premium Terminal style)</option>
              <option value="corporate">Executive Corporate (Sleek professional)</option>
              <option value="aurora-glass">Aurora Glassmorphism (Interactive Glow)</option>
              <option value="nordic-frost">Nordic Frost (Clean Ice-Blue)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Portfolio Visibility</label>
            <select
              value={portfolioVisibility}
              onChange={e => setPortfolioVisibility(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
            >
              <option value="public">Public (Visible to indexing & visitors)</option>
              <option value="unlisted">Unlisted (Link Sharing Only)</option>
              <option value="private">Private (Owner Dashboard Access Only)</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showProfilePhoto}
                onChange={e => setShowProfilePhoto(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-teal-500 focus:ring-teal-500"
              />
              <span>Show Profile Photo on Public Portfolio</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Personal Headline</label>
            <input
              type="text"
              value={portfolioHeadline}
              onChange={e => setPortfolioHeadline(e.target.value)}
              placeholder="e.g. Lead Full Stack Architect & Tech Lead"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Custom Domain Redirect</label>
            <input
              type="text"
              value={portfolioCustomDomain}
              onChange={e => setPortfolioCustomDomain(e.target.value)}
              placeholder="e.g. customdomain.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">GitHub Sync Account</label>
            <input
              type="text"
              value={profileGithub}
              onChange={e => setProfileGithub(e.target.value)}
              placeholder="e.g. GitHub Username"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 font-mono"
            />
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-white">General Profile Details</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Display Name *</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Profile Photo</label>
              <CloudinaryUploadZone
                endpoint="profile"
                acceptType="image"
                label="Profile Picture"
                value={profileImageState}
                onUploadSuccess={asset => setProfileImageState(asset)}
                onRemove={() => setProfileImageState(null)}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Short Bio Description</label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={e => setProfileBio(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">LinkedIn URL</label>
              <input type="text" value={profileLinkedin} onChange={e => setProfileLinkedin(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Twitter URL</label>
              <input type="text" value={profileTwitter} onChange={e => setProfileTwitter(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">Website URL</label>
              <input type="text" value={profileWebsite} onChange={e => setProfileWebsite(e.target.value)} className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="inline-flex items-center space-x-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-2.5 text-xs font-mono font-bold transition-all shadow-md"
        >
          {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{updateProfileMutation.isPending ? 'Saving...' : 'Commit Settings'}</span>
        </button>
      </form>

      {/* Password update form */}
      <form onSubmit={handlePasswordChange} className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4">
        <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white">Update Access Credentials</h2>
            <p className="text-xs text-zinc-500">Edit password authorizations.</p>
          </div>
          {passwordSuccess && (
            <span className="text-xs text-green-400 font-semibold font-mono animate-fade-in">Password updated!</span>
          )}
        </div>
        {passwordError && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-950/15 p-3 text-xs text-red-400 font-mono">
            <AlertCircle className="h-4 w-4" />
            <span>{passwordError}</span>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1">Current Password</label>
            <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full rounded bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1">New Password</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 font-mono mb-1">Confirm New Password</label>
            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none focus:border-teal-500" />
          </div>
        </div>
        <button type="submit" className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs px-5 py-2.5 rounded font-mono">
          Change Security Code
        </button>
      </form>
    </div>
  );
}
