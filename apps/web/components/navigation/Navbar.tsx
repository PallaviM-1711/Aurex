'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Wallet, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#08090D]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-cyan-400 p-0.5 shadow-md shadow-purple-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#08090D]">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white leading-none">
              AUREX <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider font-mono">INTELLIGENCE PLATFORM</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#tools" className="hover:text-white transition">
            AI Tools
          </Link>
          <Link href="#aurex-model" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-purple-400" />
            Aurex Pay-Per-Use
          </Link>
          <Link href="#how-it-works" className="hover:text-white transition">
            How It Works
          </Link>
          <Link href="#pricing" className="hover:text-white transition">
            Pricing
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 p-px shadow-lg shadow-purple-600/20 transition hover:shadow-cyan-500/30"
          >
            <div className="flex items-center gap-2 rounded-[11px] bg-[#08090D] px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-opacity-90">
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
