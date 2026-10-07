'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Eye,
  Wallet,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, toggleAurexConnection } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'aurex' | 'privacy'>('profile');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-2">
            <Settings className="h-3 w-3 text-cyan-400" />
            <span>Preferences & Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Settings</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Configure profile credentials, security keys, and Aurex payment hooks.
          </p>
        </div>

        {savedToast && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Nav Tabs */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Profile & Credentials</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Security & Password</span>
            </button>

            <button
              onClick={() => setActiveTab('aurex')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left cursor-pointer ${
                activeTab === 'aurex'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Wallet className="h-3.5 w-3.5 text-cyan-400" />
              <span>Aurex Protocol Connection</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition text-left cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>Data Privacy & Safety</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="md:col-span-3 rounded-2xl border border-white/10 bg-[#11131C] p-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Personal Details</h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Alex Vance'}
                    className="w-full rounded-xl border border-white/10 bg-[#151824] p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || 'alex@aurex.ai'}
                    className="w-full rounded-xl border border-white/10 bg-[#151824] p-2.5 text-xs text-white"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Update Password</h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#151824] p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="New password (min 8 chars)"
                    className="w-full rounded-xl border border-white/10 bg-[#151824] p-2.5 text-xs text-white"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white transition cursor-pointer"
                  >
                    Update Credentials
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'aurex' && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white mb-2">Aurex Financial Adapter</h3>
                <p className="text-xs text-gray-400">
                  Control automatic micro-transaction authorization hooks and ledger sync.
                </p>

                <div className="rounded-xl border border-white/10 bg-[#151824] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Aurex Ledger Link</div>
                    <div className="text-[11px] text-gray-400 font-mono">Status: Connected (0x8F3a...4B2c)</div>
                  </div>
                  <button
                    onClick={toggleAurexConnection}
                    className="px-3 py-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                  >
                    {user?.aurexConnected ? 'Disconnect' : 'Connect Wallet'}
                  </button>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#151824] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Pre-Transaction Cost Confirmation</div>
                    <div className="text-[11px] text-gray-400">Always prompt before deducting micro-amounts</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-purple-600" />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-white mb-2">Data Privacy & Zero Retention</h3>
                <p className="text-xs text-gray-400">
                  Aurex AI does not store uploaded customer documents permanently after analysis pipelines complete.
                </p>

                <div className="rounded-xl border border-white/10 bg-[#151824] p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Ephemeral Processing Buffer</div>
                    <div className="text-[11px] text-gray-400">Flush document tensors immediately after job completion</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-purple-600" />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button className="flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account & Invalidate Ledger History</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
