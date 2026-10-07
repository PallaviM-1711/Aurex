'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Wallet,
  ShieldCheck,
  Zap,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

export default function AurexDashboardPage() {
  const { wallet, balanceINR, topUpWallet } = useAurex();
  const [topUpAmount, setTopUpAmount] = useState<number>(200);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const transactions = [
    {
      date: '07 Oct 2026',
      service: 'Document Plagiarism Analysis',
      usage: '18 pages',
      amount: 2.70,
      txnId: 'TXN-984120',
      status: 'Completed',
    },
    {
      date: '07 Oct 2026',
      service: 'Executive Text Summarizer',
      usage: '2,450 words',
      amount: 0.49,
      txnId: 'TXN-874211',
      status: 'Completed',
    },
    {
      date: '06 Oct 2026',
      service: 'Vision Object Recognition',
      usage: '1 image',
      amount: 1.00,
      txnId: 'TXN-761245',
      status: 'Completed',
    },
    {
      date: '06 Oct 2026',
      service: 'High-Precision OCR Scan',
      usage: '1 document scan',
      amount: 0.50,
      txnId: 'TXN-651928',
      status: 'Completed',
    },
    {
      date: '05 Oct 2026',
      service: 'PDF Deep Analysis',
      usage: '35 pages',
      amount: 4.20,
      txnId: 'TXN-541290',
      status: 'Completed',
    },
    {
      date: '04 Oct 2026',
      service: 'Contextual AI Chat Query',
      usage: '1,200 tokens',
      amount: 0.06,
      txnId: 'TXN-432198',
      status: 'Completed',
    },
  ];

  const handleDeposit = () => {
    topUpWallet(topUpAmount);
    setToastMsg(`Successfully deposited ${formatCurrencyINR(topUpAmount)} into Aurex Wallet!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet?.walletAddress || '0x8F3a2b7C8901eF924D68A11B');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-2">
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Aurex Micro-Billing Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Aurex Pay-Per-Use Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Direct telemetry into your real-time wallet balance, micro-debits, and transaction hashes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Aurex Connected ✓</span>
            </span>
          </div>
        </div>

        {toastMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ================= WALLET SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Balance */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1B1133] to-[#11131F] p-6 shadow-xl shadow-purple-950/20">
            <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
              <span>Aurex Wallet Balance</span>
              <Wallet className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {formatCurrencyINR(balanceINR)}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span className="font-mono">{wallet?.walletAddress || '0x8F3a...4B2c'}</span>
              <button onClick={copyAddress} className="hover:text-white transition">
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Card 2: Total Spent */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Total Spent</span>
              <TrendingDown className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">₹8.95</div>
            <p className="text-[11px] text-gray-400 mt-2">Micro-metered across 6 tasks</p>
          </div>

          {/* Card 3: This Month */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>This Month</span>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">₹8.95</div>
            <p className="text-[11px] text-emerald-400 mt-2">Saved ~₹890 vs Pro subscription</p>
          </div>

          {/* Card 4: Operations */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>AI Operations</span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">6</div>
            <p className="text-[11px] text-gray-400 mt-2">100% pre-authorized on-chain</p>
          </div>
        </div>

        {/* ================= SIMULATE DEPOSIT / TOP UP ================= */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Top Up Aurex Balance</h2>
            <p className="text-xs text-gray-400">
              Load your Aurex balance to continue invoking AI pipelines without interruptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`rounded-xl py-2 px-3 text-xs font-mono font-semibold transition cursor-pointer ${
                  topUpAmount === amt
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                +₹{amt}
              </button>
            ))}

            <button
              onClick={handleDeposit}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 py-2.5 px-5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add {formatCurrencyINR(topUpAmount)}</span>
            </button>
          </div>
        </div>

        {/* ================= TRANSACTION HISTORY TABLE ================= */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Aurex Ledger Transactions</h2>
              <p className="text-xs text-gray-400">Immutable record of every AI execution authorization</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Usage</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 font-mono text-gray-400">{t.date}</td>
                    <td className="py-3.5 font-medium text-white">{t.service}</td>
                    <td className="py-3.5 font-mono text-purple-300">{t.usage}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-400">
                      {formatCurrencyINR(t.amount)}
                    </td>
                    <td className="py-3.5 font-mono text-gray-400">{t.txnId}</td>
                    <td className="py-3.5 text-right">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        {t.status}
                      </span>
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
