'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import { User, Wallet, Zap, Calendar, Mail, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();
  const { balanceINR } = useAurex();

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-2">
            <User className="h-3 w-3 text-cyan-400" />
            <span>Account Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">User Profile</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review identity, security status, and connected billing identities.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-cyan-400 text-white text-2xl font-black shadow-xl shadow-purple-600/30 shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'AV'}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl font-bold text-white">{user?.name || 'Alex Vance'}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-purple-500/30">
                <Shield className="h-3 w-3" />
                Verified Account
              </span>
            </div>
            <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-3.5 w-3.5" />
              {user?.email || 'alex@aurex.ai'}
            </p>
            <p className="text-[11px] text-gray-500 flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Member since September 2026
            </p>
          </div>

          <Link
            href="/settings"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Active Plan</h3>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {user?.plan === 'aurex_payg' ? 'Aurex Pay-Per-Use' : 'Pro Subscription'}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {user?.plan === 'aurex_payg' ? 'Zero monthly commitment' : 'Next billing 12 Nov 2026'}
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              Modify Plan &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Aurex Wallet</h3>
              <Wallet className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {formatCurrencyINR(balanceINR)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">0x8F3a...4B2c (Connected)</p>
            <Link
              href="/aurex"
              className="mt-4 inline-block text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Manage Wallet &rarr;
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
