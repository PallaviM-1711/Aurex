'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Sparkles,
  Wallet,
  ShieldCheck,
  FileText,
  Eye,
  ScanText,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Files,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { balanceINR, topUpWallet } = useAurex();

  const isAurexMode = user?.plan === 'aurex_payg';

  const quickTools = [
    {
      title: 'Plagiarism Checker',
      desc: 'Verify academic integrity & web similarity',
      icon: ShieldCheck,
      href: '/tools/plagiarism',
      badge: 'Academic',
    },
    {
      title: 'AI Summarizer',
      desc: 'Condense long docs into executive briefs',
      icon: FileText,
      href: '/tools/summarizer',
      badge: 'Synthesis',
    },
    {
      title: 'Vision & Image Intelligence',
      desc: 'Identify objects, colors & visual context',
      icon: Eye,
      href: '/tools/image-analyzer',
      badge: 'Multi-Modal',
    },
    {
      title: 'Contextual AI Chat',
      desc: 'Multi-turn intelligent conversational agent',
      icon: MessageSquare,
      href: '/tools/ai-chat',
      badge: 'Assistant',
    },
  ];

  const recentActivities = [
    {
      title: 'Plagiarism analysis completed',
      detail: 'Machine_Learning_Thesis_v2.pdf (18 pages)',
      cost: '₹2.70',
      time: '12 mins ago',
      status: 'Completed',
    },
    {
      title: 'Document summarized',
      detail: 'Q3_Financial_Quarterly_Report.docx (2,450 words)',
      cost: '₹0.49',
      time: '1 hour ago',
      status: 'Completed',
    },
    {
      title: 'Image analyzed',
      detail: 'architecture_diagram.png (9 objects detected)',
      cost: '₹1.00',
      time: '3 hours ago',
      status: 'Completed',
    },
    {
      title: 'Aurex payment completed',
      detail: 'Instant settlement for Document OCR scan',
      cost: '₹0.50',
      time: 'Yesterday',
      status: 'Settled',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        {/* ================= HERO SECTION ================= */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E111A] p-7 sm:p-9 shadow-sm">
          {/* Subtle gradient highlight line at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Aurex Intelligence Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
              Your AI Workspace.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Analyze, understand, and create with intelligent tools — all from one place.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tools"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explore AI Tools</span>
              </Link>

              <Link
                href="/aurex"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-5 py-2.5 text-xs font-semibold text-slate-200 transition"
              >
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Use Aurex Pay-Per-Use</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= USAGE METRICS + CURRENT PLAN ROW ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: AI Credits Used */}
          <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-5 flex flex-col justify-between hover:border-white/[0.14] transition">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>AI Credits Used</span>
              <TrendingUp className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">1,245</div>
            <div className="text-[11px] text-slate-400 mt-2">≈ ₹24.90 micro-billed</div>
          </div>

          {/* Card 2: Documents Analyzed */}
          <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-5 flex flex-col justify-between hover:border-white/[0.14] transition">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Documents Analyzed</span>
              <Files className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">42</div>
            <div className="text-[11px] text-slate-400 mt-2">PDF, DOCX, TXT</div>
          </div>

          {/* Card 3: Images Processed */}
          <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-5 flex flex-col justify-between hover:border-white/[0.14] transition">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Images Processed</span>
              <ImageIcon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">18</div>
            <div className="text-[11px] text-slate-400 mt-2">Vision & OCR tasks</div>
          </div>

          {/* Card 4: Total AI Requests */}
          <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-5 flex flex-col justify-between hover:border-white/[0.14] transition">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Total AI Requests</span>
              <Sparkles className="h-4 w-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold font-mono text-white">326</div>
            <div className="text-[11px] text-emerald-400 mt-2 font-medium">100% Success Rate</div>
          </div>

          {/* Card 5: Current Plan Showcase */}
          <div className="rounded-xl border border-indigo-500/30 bg-[#131726] p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-1">
                <span>Active Tier</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              {isAurexMode ? (
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5 mt-1">
                    <Wallet className="h-4 w-4 text-emerald-400" />
                    <span>Aurex Pay-Per-Use</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">&quot;Pay only for what you use.&quot;</p>
                </div>
              ) : (
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5 mt-1">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>Pro Subscription</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Next billing: 12 Nov 2026</p>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-mono">
                Bal: <span className="text-emerald-400 font-semibold">{formatCurrencyINR(balanceINR)}</span>
              </span>
              <Link
                href={isAurexMode ? '/aurex' : '/pricing'}
                className="text-[11px] font-semibold text-indigo-300 hover:text-white transition"
              >
                {isAurexMode ? 'Wallet →' : 'Manage →'}
              </Link>
            </div>
          </div>
        </div>

        {/* ================= QUICK TOOLS SECTION ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Quick Tool Launch</h2>
            <Link href="/tools" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <span>View all 9 tools</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Unified, sleek cards without jarring rainbow colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group rounded-xl border border-white/[0.08] bg-[#121520] hover:bg-[#161A28] hover:border-indigo-500/40 p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                        {t.badge}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{t.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-300">
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= RECENT ACTIVITY & LEDGER ================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Recent Activity & Micro-Ledger</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live feed of AI invocations and Aurex settlements</p>
            </div>
            <Link href="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              Full History →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map((act, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-white/[0.04] bg-[#0E111A] p-3 hover:border-white/[0.1] transition gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{act.title}</div>
                    <div className="text-[11px] text-slate-400">{act.detail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-xs font-mono font-bold text-slate-200">{act.cost}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {act.time}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
