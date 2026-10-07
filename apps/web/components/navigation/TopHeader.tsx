'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Wallet,
  Zap,
  Plus,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { balanceINR, topUpWallet } = useAurex();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showTopUpToast, setShowTopUpToast] = useState(false);

  const handleQuickTopUp = () => {
    topUpWallet(100);
    setShowTopUpToast(true);
    setTimeout(() => setShowTopUpToast(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#090A0F]/90 px-6 backdrop-blur-xl">
      {/* Left: Brand breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white p-0.5 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            AUREX <span className="text-indigo-400">AI</span>
          </span>
        </Link>
        <span className="hidden sm:inline-block rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10">
          v2.4
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Aurex Wallet Balance Capsule */}
        <div className="relative flex items-center rounded-full border border-white/10 bg-[#121520] px-3 py-1.5 shadow-sm hover:border-white/20 transition">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.05] text-slate-400">
              <Wallet className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] leading-none text-slate-400">Aurex Balance</span>
              <span className="text-xs font-bold font-mono text-emerald-400 leading-tight">
                {formatCurrencyINR(balanceINR)}
              </span>
            </div>
          </div>

          <button
            onClick={handleQuickTopUp}
            title="Quick +₹100 top up (Demo)"
            className="ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 hover:bg-indigo-600 hover:text-white transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          {showTopUpToast && (
            <div className="absolute top-10 right-0 rounded-lg bg-emerald-600 text-white text-[11px] font-medium px-2 py-1 shadow-lg backdrop-blur-md animate-fade-in whitespace-nowrap">
              + ₹100.00 Added!
            </div>
          )}
        </div>

        {/* Plan Indicator */}
        <Link
          href="/pricing"
          className="hidden md:flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300 hover:border-white/20 hover:text-white transition"
        >
          <Zap className="h-3 w-3 text-amber-400" />
          <span>{user?.plan === 'aurex_payg' ? 'Aurex Pay-Per-Use' : user?.plan?.toUpperCase() || 'FREE'}</span>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/[0.06] transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
              {user?.name?.slice(0, 2).toUpperCase() || 'AV'}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#121520] p-2 shadow-2xl shadow-black z-50">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-semibold text-white">{user?.name || 'Alex Vance'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'alex@aurex.ai'}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <User className="h-3.5 w-3.5" />
                  Profile Account
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings & API Keys
                </Link>
              </div>

              <div className="border-t border-white/10 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
