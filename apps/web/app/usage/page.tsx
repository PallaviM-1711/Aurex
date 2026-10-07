'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, Zap, Sparkles } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function UsageAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('30d');

  const dailyActivityData = [
    { date: 'Oct 01', requests: 12, spend: 1.80, tokens: 4200 },
    { date: 'Oct 02', requests: 19, spend: 3.20, tokens: 6800 },
    { date: 'Oct 03', requests: 8, spend: 0.90, tokens: 2100 },
    { date: 'Oct 04', requests: 27, spend: 4.50, tokens: 9400 },
    { date: 'Oct 05', requests: 34, spend: 5.80, tokens: 12000 },
    { date: 'Oct 06', requests: 22, spend: 3.40, tokens: 7800 },
    { date: 'Oct 07', requests: 45, spend: 8.95, tokens: 16500 },
  ];

  const toolUsageData = [
    { tool: 'Plagiarism', requests: 42, spend: 6.30 },
    { tool: 'Summarizer', requests: 85, spend: 4.80 },
    { tool: 'Vision AI', requests: 24, spend: 24.00 },
    { tool: 'OCR', requests: 38, spend: 19.00 },
    { tool: 'AI Chat', requests: 120, spend: 6.00 },
    { tool: 'PDF Analyzer', requests: 17, spend: 2.04 },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-500/20 mb-2">
              <BarChart3 className="h-3 w-3 text-cyan-400" />
              <span>Real-Time Telemetry & Resource Consumption</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Usage Analytics</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Deep analytics into tokens processed, document throughput, and Aurex micro-expenditure.
            </p>
          </div>

          {/* Time range filters */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#12141F] p-1">
            {(['7d', '30d', '3m', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  timeRange === r
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Total AI Requests</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">326</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +24% vs last period
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Micro-Spend (Aurex)</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">₹62.14</div>
            <div className="text-[11px] text-gray-400 mt-2">Avg ₹0.19 / operation</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Tokens Ingested</span>
            <div className="text-2xl font-extrabold font-mono text-purple-400 mt-1">58,800</div>
            <div className="text-[11px] text-gray-400 mt-2">Across 9 tools</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-5">
            <span className="text-xs text-gray-400">Documents & Images</span>
            <div className="text-2xl font-extrabold font-mono text-fuchsia-400 mt-1">60</div>
            <div className="text-[11px] text-gray-400 mt-2">42 docs + 18 visual scans</div>
          </div>
        </div>

        {/* Chart 1: Daily Requests & Spend Area Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Daily AI Activity & Micro-Expenditure</h2>
              <p className="text-xs text-gray-400">Requests volume plotted against micro-billed INR</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161928',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" name="AI Requests" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Usage by Tool Bar Chart */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-white">Consumption Breakdown by AI Tool</h2>
            <p className="text-xs text-gray-400">Total operation volume per specific productivity module</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toolUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="tool" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161928',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="requests" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Invocations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
