'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS, DEFAULT_PRICING_RULES } from '@aurex/shared';
import { formatCurrencyINR } from '@/lib/utils';
import { CheckCircle2, Zap, Wallet, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const { user, updatePlan } = useAuth();

  return (
    <AppShell>
      <div className="space-y-12 max-w-6xl mx-auto py-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Dual Business Model Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Subscription When You Need It. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Pay-Per-Use When You Don&apos;t.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
            Choose predictable unmetered enterprise monthly plans or leverage Aurex micro-metering to pay only for exact computing units.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isAurex = plan.id === 'aurex_payg';
            const isCurrent = user?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  isAurex
                    ? 'border-2 border-purple-500 bg-gradient-to-b from-[#1E1138] to-[#121422] shadow-2xl shadow-purple-600/25 relative scale-[1.02]'
                    : 'border border-white/10 bg-[#11131C] hover:border-white/20'
                }`}
              >
                {isAurex && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
                    Signature Pay-Per-Use
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-white">{plan.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isAurex
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {isAurex ? '₹0' : formatCurrencyINR(plan.priceINR)}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">/ {plan.billingPeriod}</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-6 min-h-[36px]">{plan.description}</p>

                  <div className="space-y-2.5 mb-8">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => updatePlan(plan.id as any)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                      : isAurex
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : plan.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Centralized Backend Pricing Table for Aurex PAYG */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">Aurex Pay-Per-Use Unit Pricing Schedule</h2>
            <p className="text-xs text-gray-400">
              Backend configured micro-rates applied dynamically based on actual resource consumption.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">AI Capability</th>
                  <th className="pb-3">Unit Meter</th>
                  <th className="pb-3">Rate (INR)</th>
                  <th className="pb-3">Min Charge</th>
                  <th className="pb-3">Free Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {Object.values(DEFAULT_PRICING_RULES).map((rule) => (
                  <tr key={rule.serviceType} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white">{rule.displayName}</td>
                    <td className="py-3 font-mono text-gray-400">
                      per {rule.unitMultiplier > 1 ? rule.unitMultiplier + ' ' : ''}{rule.unit}s
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-400">{formatCurrencyINR(rule.rateINR)}</td>
                    <td className="py-3 font-mono text-purple-300">{formatCurrencyINR(rule.minChargeINR)}</td>
                    <td className="py-3 text-cyan-300 font-mono">{rule.freeTierLimit} {rule.unit}s</td>
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
