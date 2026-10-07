'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  ShieldAlert,
  Users,
  Wallet,
  Zap,
  TrendingUp,
  Activity,
  Server,
  Edit2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { DEFAULT_PRICING_RULES } from '@aurex/shared';
import { formatCurrencyINR } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING_RULES);
  const [editSuccess, setEditSuccess] = useState(false);

  const handlePriceChange = (serviceType: string, newRate: number) => {
    setPricing({
      ...pricing,
      [serviceType]: {
        ...pricing[serviceType as keyof typeof pricing],
        rateINR: newRate,
      },
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/20 mb-2">
              <ShieldAlert className="h-3 w-3 text-rose-400" />
              <span>Operations & Telemetry Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Admin & Finance Console</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Global platform analytics, subscription vs Aurex micro-revenue, and provider health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <Activity className="h-3.5 w-3.5" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>

        {editSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Pricing rules updated across API pricing engine!</span>
          </div>
        )}

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Total Registered Users</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">14,280</div>
            <div className="text-[11px] text-cyan-400 mt-2">9,840 Monthly Active</div>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-[#161226] p-5">
            <span className="text-xs text-purple-300">Aurex PAYG Volume</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">₹842,500</div>
            <div className="text-[11px] text-gray-400 mt-2">11,680 Active PAYG Wallets</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Subscription MRR</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">₹2,380,000</div>
            <div className="text-[11px] text-gray-400 mt-2">2,600 Pro + Yearly Subscribers</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">AI Compute Invocations</span>
            <div className="text-2xl font-extrabold font-mono text-fuchsia-400 mt-1">1.84M</div>
            <div className="text-[11px] text-emerald-400 mt-2">99.98% Inference Uptime</div>
          </div>
        </div>

        {/* Provider Health Check */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <h2 className="text-base font-bold text-white mb-4">AI Providers & Payment Adapters Health</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-[#151824] p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Aurex Gateway Protocol</div>
                <div className="text-[10px] text-gray-400">Settlement latency: 42ms</div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                Optimal
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-[#151824] p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Google Gemini Neural API</div>
                <div className="text-[10px] text-gray-400">Inference latency: 540ms</div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-[#151824] p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Tesseract / Vision OCR OCR-v2</div>
                <div className="text-[10px] text-gray-400">Throughput: 85 pages/sec</div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Rules Admin Table */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">Aurex Dynamic Pricing Rules Engine</h2>
            <p className="text-xs text-gray-400">
              Modify rates directly without code recompilation. Updates take effect immediately.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Unit Meter</th>
                  <th className="pb-3">Current Rate (INR)</th>
                  <th className="pb-3">Quick Adjust</th>
                  <th className="pb-3 text-right">Free Tier Quota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {Object.values(pricing).map((rule) => (
                  <tr key={rule.serviceType} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-bold text-white">{rule.displayName}</td>
                    <td className="py-3.5 font-mono text-gray-400">
                      per {rule.unitMultiplier > 1 ? rule.unitMultiplier + ' ' : ''}{rule.unit}s
                    </td>
                    <td className="py-3.5 font-mono font-bold text-emerald-400">
                      {formatCurrencyINR(rule.rateINR)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={rule.rateINR}
                          onBlur={(e) =>
                            handlePriceChange(rule.serviceType, parseFloat(e.target.value) || rule.rateINR)
                          }
                          className="w-20 rounded-lg border border-white/10 bg-[#151824] px-2 py-1 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-500">INR</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-mono text-purple-300">
                      {rule.freeTierLimit} units
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
