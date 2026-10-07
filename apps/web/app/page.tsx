'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navigation/Navbar';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Eye,
  ScanText,
  MessageSquare,
  HelpCircle,
  Wallet,
  Zap,
  CheckCircle2,
  Lock,
  Flame,
  Layers,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, DEFAULT_PRICING_RULES } from '@aurex/shared';
import { formatCurrencyINR } from '@/lib/utils';

export default function LandingPage() {
  const tools = [
    {
      name: 'Plagiarism Checker',
      desc: 'Scan documents across 10B+ academic papers & web sources with sentence-level similarity mapping.',
      icon: ShieldCheck,
      href: '/tools/plagiarism',
      rate: '₹0.15 / page',
      badge: 'Academic Grade',
    },
    {
      name: 'AI Text Summarizer',
      desc: 'Compress reports, manuals, and long essays into executive summaries, bullet points, and core insights.',
      icon: FileText,
      href: '/tools/summarizer',
      rate: '₹0.20 / 1k words',
      badge: 'High Accuracy',
    },
    {
      name: 'Vision & Image Intelligence',
      desc: 'Deep neural object identification, scene context analysis, color palette extraction, and OCR captioning.',
      icon: Eye,
      href: '/tools/image-analyzer',
      rate: '₹1.00 / image',
      badge: 'Multi-Modal',
    },
    {
      name: 'High-Precision OCR',
      desc: 'Extract formatted raw text, tables, and handwritten notes from image scans or screenshots with 99.4% precision.',
      icon: ScanText,
      href: '/tools/ocr',
      rate: '₹0.50 / image',
      badge: 'Instant TXT',
    },
    {
      name: 'Contextual AI Chat',
      desc: 'Conversational assistant with file context, code understanding, and real-time reasoning abilities.',
      icon: MessageSquare,
      href: '/tools/ai-chat',
      rate: '₹0.05 / 1k tokens',
      badge: 'Low Latency',
    },
    {
      name: 'Document Question Answering',
      desc: 'Ask direct questions to any research paper or 100+ page PDF with direct paragraph citations.',
      icon: HelpCircle,
      href: '/tools/document-qa',
      rate: '₹0.25 / query',
      badge: 'Vector Grounded',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090D] text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb -top-40 left-1/4 h-[500px] w-[500px] bg-purple-700/15" />
      <div className="glow-orb top-96 -right-20 h-[600px] w-[600px] bg-cyan-700/10" />
      <div className="glow-orb bottom-40 left-10 h-[500px] w-[500px] bg-fuchsia-700/10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300 mb-8 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Next-Generation AI Workspace with Aurex Pay-Per-Use Protocol</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
          >
            One AI Workspace. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
              Infinite Possibilities.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10"
          >
            Analyze documents, detect plagiarism, summarize content, understand images, and more — powered by AI and enabled by flexible usage-based payments through Aurex.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-600/25 hover:shadow-cyan-500/30 transition hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore AI Tools</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <Link
              href="/aurex"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-[#12141F]/80 px-7 py-3.5 text-sm font-semibold text-purple-200 hover:bg-purple-950/30 hover:border-purple-400 transition"
            >
              <Wallet className="h-4 w-4 text-cyan-400" />
              <span>Experience Aurex Pay-Per-Use</span>
            </Link>
          </motion.div>
        </div>

        {/* HERO VISUAL: Animated Workspace Preview with Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative mt-16 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0E1017]/90 p-3 sm:p-5 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl"
        >
          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">aurex-ai-studio // intelligence-hub</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
              <Zap className="h-3 w-3" />
              <span>AUREX METER: ACTIVE</span>
            </div>
          </div>

          {/* Interactive Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1: Plagiarism */}
            <div className="rounded-xl border border-purple-500/20 bg-[#151824] p-4 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-semibold text-purple-300">PLAGIARISM</span>
                  <span className="text-emerald-400 font-mono">Clean</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">27%</div>
                <p className="text-[11px] text-gray-400 mt-1">Similarity detected against 3 sources</p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                <span>Cost: ₹0.30</span>
                <span className="text-purple-400 font-medium">Report Ready</span>
              </div>
            </div>

            {/* Card 2: Summary */}
            <div className="rounded-xl border border-cyan-500/20 bg-[#151824] p-4 flex flex-col justify-between hover:border-cyan-500/50 transition">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-semibold text-cyan-300">SUMMARY</span>
                  <span className="text-cyan-400 font-mono">85% Saved</span>
                </div>
                <div className="text-xl font-extrabold text-white font-mono">1,240 → 180</div>
                <p className="text-[11px] text-gray-400 mt-1">Key takeaways distilled with executive tone</p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                <span>Cost: ₹0.24</span>
                <span className="text-cyan-400 font-medium">Export Ready</span>
              </div>
            </div>

            {/* Card 3: Image AI */}
            <div className="rounded-xl border border-fuchsia-500/20 bg-[#151824] p-4 flex flex-col justify-between hover:border-fuchsia-500/50 transition">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-semibold text-fuchsia-300">IMAGE AI</span>
                  <span className="text-fuchsia-400 font-mono">Vision Net</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">12 Objects</div>
                <p className="text-[11px] text-gray-400 mt-1">Detected laptop, desk, documents & charts</p>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                <span>Cost: ₹1.00</span>
                <span className="text-fuchsia-400 font-medium">Parsed</span>
              </div>
            </div>

            {/* Card 4: Aurex Pay-Per-Use Meter */}
            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-[#121E1C] to-[#151824] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
                  <span className="font-semibold flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> AUREX METER
                  </span>
                  <span className="text-emerald-300 font-mono">Settled</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">₹2.85</div>
                <p className="text-[11px] text-gray-300 mt-1">Micro-deducted from wallet on confirm</p>
              </div>
              <div className="mt-4 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[10px]">
                <span className="text-gray-400">Bal: ₹245.60</span>
                <span className="text-emerald-400 font-semibold font-mono">TXN-492810</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= THE AUREX ADVANTAGE / MARKETING PHILOSOPHY ================= */}
      <section id="aurex-model" className="py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#120D22] via-[#0E101A] to-[#0A131A] p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/30 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-6">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>The Financial Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              &quot;Subscription when you need it. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Pay-per-use when you don&apos;t.&quot;
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
              Why pay ₹999 every month when you only run a few document checks or summaries?
              With Aurex, you deposit any balance and pay micro-fractions for the precise computation you consume. No monthly waste. No lock-in. Full transparency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">Traditional SaaS Trap</div>
                <p className="text-xs text-gray-300">
                  Fixed ₹999/mo fee regardless of whether you analyzed 1 file or 100 files. Expired unused credits.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4">
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Aurex Pay-Per-Use Model</div>
                <p className="text-xs text-gray-300">
                  Zero monthly commitment. If you run 1 summary, you pay ₹0.20. Pre-calculated quotes before every job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW AUREX WORKS (3 STEPS) ================= */}
      <section id="how-it-works" className="py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">Workflow Mechanics</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">How Aurex Pay-Per-Use Works</p>
          <p className="text-sm text-gray-400 mt-2">Three frictionless steps to intelligent on-demand computing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 hover:border-purple-500/40 transition">
            <div className="font-mono text-3xl font-extrabold text-purple-400/40 mb-4">01</div>
            <h3 className="text-lg font-bold text-white mb-2">Connect Aurex</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Connect your Aurex wallet or virtual account with one click. Pre-load with any desired micro-balance (e.g. ₹100 or ₹250).
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Instant ledger linkage</span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 hover:border-cyan-500/40 transition">
            <div className="font-mono text-3xl font-extrabold text-cyan-400/40 mb-4">02</div>
            <h3 className="text-lg font-bold text-white mb-2">Select Any AI Tool</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Drop your PDF, paste text, or upload an image. The engine automatically counts tokens, pages, or entities in real time.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Precise usage metering</span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 hover:border-fuchsia-500/40 transition">
            <div className="font-mono text-3xl font-extrabold text-fuchsia-400/40 mb-4">03</div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm & Pay for Usage</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Review the exact estimate (e.g., ₹2.85). Click confirm to deduct only that amount. Never pay for unused bandwidth.
            </p>
            <div className="flex items-center gap-2 text-xs text-fuchsia-300 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero stealth deductions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AI TOOLS MARKETPLACE PREVIEW ================= */}
      <section id="tools" className="py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Tools Suite</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Full-Spectrum AI Capabilities</p>
            <p className="text-sm text-gray-400 mt-1">High-grade productivity tools unified in one seamless dashboard.</p>
          </div>
          <Link
            href="/tools"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold text-purple-300 hover:text-white transition"
          >
            <span>View All AI Tools</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.name}
                className="group rounded-2xl border border-white/[0.08] bg-[#11131C] p-6 hover:border-purple-500/40 hover:bg-[#141724] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-mono font-medium text-cyan-300 border border-white/10">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{tool.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500">Aurex Rate</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{tool.rate}</span>
                  </div>

                  <Link
                    href={tool.href}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-cyan-300 transition"
                  >
                    <span>Launch</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="pricing" className="py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Flexible Economics</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Ideal Payment Architecture</p>
          <p className="text-sm text-gray-400 mt-2">
            Subscribe for unmetered corporate bandwidth, or plug into Aurex Pay-Per-Use for zero commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isAurex = plan.id === 'aurex_payg';
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  isAurex
                    ? 'border-2 border-purple-500 bg-gradient-to-b from-[#1C1236] to-[#121422] shadow-xl shadow-purple-600/20 relative'
                    : 'border border-white/10 bg-[#11131C] hover:border-white/20'
                }`}
              >
                {isAurex && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
                    Pay-Per-Use Hero
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-300">{plan.name}</span>
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

                <Link
                  href={isAurex ? '/aurex' : '/login'}
                  className={`block text-center rounded-xl py-2.5 px-4 text-xs font-bold transition ${
                    isAurex
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:opacity-90'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 px-6 sm:px-10 max-w-5xl mx-auto text-center border-t border-white/[0.08]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 p-12 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Step Into the Future of On-Demand AI
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8">
            Experience complete control over your productivity software costs with the Aurex micro-metering engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white text-black font-bold px-6 py-3 text-xs hover:bg-gray-200 transition"
            >
              Open AI Workspace Now
            </Link>
            <Link
              href="/aurex"
              className="rounded-xl border border-white/20 bg-white/5 text-white font-semibold px-6 py-3 text-xs hover:bg-white/10 transition"
            >
              Test Aurex Pay-Per-Use Flow
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/[0.08] py-12 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>© 2026 Aurex AI Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition">Terms of Service</Link>
          <Link href="/docs" className="hover:text-gray-300 transition">API & SDK Docs</Link>
          <Link href="/aurex" className="hover:text-cyan-400 transition">Aurex Ledger</Link>
        </div>
      </footer>
    </div>
  );
}
