'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import { CreditCard, Wallet, Download, CheckCircle2, Zap, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  const { user, updatePlan } = useAuth();
  const { balanceINR } = useAurex();

  const invoices = [
    { id: 'INV-2026-009', date: '01 Oct 2026', amount: '₹0.00', plan: 'Aurex Pay-Per-Use', status: 'Settled' },
    { id: 'INV-2026-008', date: '01 Sep 2026', amount: '₹899.00', plan: 'Pro Subscription', status: 'Paid' },
    { id: 'INV-2026-007', date: '01 Aug 2026', amount: '₹899.00', plan: 'Pro Subscription', status: 'Paid' },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-2">
              <CreditCard className="h-3 w-3 text-cyan-400" />
              <span>Financial & Subscription Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Billing & Payment Hub</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage subscription renewals, connected Aurex wallets, and historical invoices.
            </p>
          </div>
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 px-3.5 py-2 text-xs font-semibold text-purple-200 transition"
          >
            <span>Change Plan / Mode</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Current Plan Overview Card */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:border-r border-white/10 pr-6">
            <span className="text-xs text-gray-400">Current Plan</span>
            <div className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              {user?.plan === 'aurex_payg' ? (
                <>
                  <Wallet className="h-5 w-5 text-cyan-400" />
                  <span>Aurex Pay-Per-Use</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-amber-400" />
                  <span>Pro Subscription</span>
                </>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-medium">Status: Active</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              {user?.plan === 'aurex_payg'
                ? 'Zero monthly recurring costs. Exact micro-metered consumption.'
                : 'Next renewal: 12 Nov 2026 (₹899.00 / month)'}
            </p>
          </div>

          <div className="md:border-r border-white/10 pr-6">
            <span className="text-xs text-gray-400">Primary Payment Adapter</span>
            <div className="mt-2 rounded-xl border border-white/10 bg-[#151824] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-cyan-400">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Aurex Protocol Gateway</div>
                  <div className="text-[10px] text-gray-400 font-mono">0x8F3a...4B2c</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {formatCurrencyINR(balanceINR)}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-gray-400">Subscription Control</span>
              <p className="text-xs text-gray-300 mt-1">
                Switching to Aurex Pay-Per-Use removes all recurring renewal fees permanently.
              </p>
            </div>
            <button
              onClick={() => updatePlan(user?.plan === 'aurex_payg' ? 'pro' : 'aurex_payg')}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              {user?.plan === 'aurex_payg' ? 'Switch to Pro Subscription' : 'Switch to Aurex Pay-Per-Use'}
            </button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <h2 className="text-base font-bold text-white mb-4">Invoice Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">Invoice Number</th>
                  <th className="pb-3">Billing Date</th>
                  <th className="pb-3">Plan / Description</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-mono text-purple-300 font-bold">{inv.id}</td>
                    <td className="py-3.5 text-gray-400">{inv.date}</td>
                    <td className="py-3.5 font-medium text-white">{inv.plan}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">{inv.amount}</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="p-1 hover:text-cyan-400 transition">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
