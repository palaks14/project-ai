import React, { useState } from 'react';
import { User, Mail, BookOpen, Palette, Bell, Shield, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
  });
  const [preferences, setPreferences] = useState({
    learningStyle: 'visual',
    dailyGoalHours: 2,
    notifyReviews: true,
    notifyStreak: true,
    notifyGroup: true,
    darkMode: false,
    soundEffects: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    updateUser({ name: profile.name, email: profile.email, role: profile.role });
    setSaved(true);
    toast.success('Profile updated successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved!');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'preferences', label: 'Preferences', icon: Palette },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10">Settings</h1>

      <div className="flex gap-8">
        {/* Tab Navigation */}
        <div className="w-56 space-y-2 shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold text-[13px] cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card-glass p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Information</h2>
              <p className="text-sm text-slate-500 mb-6">Update your personal details and display name.</p>

              <div className="flex items-center gap-6 mb-8">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=3b82f6&color=fff&bold=true&size=96`}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{profile.name || 'Your Name'}</p>
                  <p className="text-xs text-slate-400">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="input-field pl-12"
                      id="settings-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="input-field pl-12"
                      id="settings-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['student', 'teacher'].map(r => (
                      <button
                        key={r}
                        onClick={() => setProfile({ ...profile, role: r })}
                        className={`py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          profile.role === r ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2 mt-4">
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card-glass p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Learning Preferences</h2>
              <p className="text-sm text-slate-500 mb-6">Customize your learning experience.</p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Learning Style</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['visual', 'auditory', 'kinesthetic', 'reading'].map(style => (
                      <button
                        key={style}
                        onClick={() => setPreferences({ ...preferences, learningStyle: style })}
                        className={`py-3 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          preferences.learningStyle === style ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Daily Study Goal (hours)</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={preferences.dailyGoalHours}
                    onChange={(e) => setPreferences({ ...preferences, dailyGoalHours: +e.target.value })}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-sm font-bold text-slate-900 text-center">{preferences.dailyGoalHours}h / day</p>
                </div>

                <ToggleRow label="Sound Effects" checked={preferences.soundEffects} onChange={(v) => setPreferences({ ...preferences, soundEffects: v })} />
              </div>

              <button onClick={handleSavePreferences} className="btn-primary flex items-center gap-2 mt-4">
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saved ? 'Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card-glass p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Notification Settings</h2>
              <p className="text-sm text-slate-500 mb-6">Control what notifications you receive.</p>

              <div className="space-y-4">
                <ToggleRow label="Review Reminders" desc="Get notified when flashcards are due" checked={preferences.notifyReviews} onChange={(v) => setPreferences({ ...preferences, notifyReviews: v })} />
                <ToggleRow label="Streak Alerts" desc="Stay motivated with streak notifications" checked={preferences.notifyStreak} onChange={(v) => setPreferences({ ...preferences, notifyStreak: v })} />
                <ToggleRow label="Group Messages" desc="Receive notifications from study groups" checked={preferences.notifyGroup} onChange={(v) => setPreferences({ ...preferences, notifyGroup: v })} />
              </div>

              <button onClick={handleSavePreferences} className="btn-primary flex items-center gap-2 mt-4">
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card-glass p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Security</h2>
              <p className="text-sm text-slate-500 mb-6">Manage your account security settings.</p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>

              <button onClick={() => toast.success('Password updated!')} className="btn-primary flex items-center gap-2 mt-4">
                <Shield size={18} />
                Update Password
              </button>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h3>
                <button
                  onClick={() => toast.error('Account deletion is disabled in demo mode')}
                  className="px-6 py-3 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-all cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all">
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      {desc && <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-all duration-200 cursor-pointer ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default Settings;
