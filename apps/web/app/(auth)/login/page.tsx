'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (mode: 'aurex' | 'pro') => {
    setLoading(true);
    try {
      await login(mode === 'aurex' ? 'alex.payg@aurex.ai' : 'sarah.pro@aurex.ai', 'password123');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-orb top-10 left-10 h-96 w-96 bg-purple-600/15" />
      <div className="glow-orb bottom-10 right-10 h-96 w-96 bg-cyan-600/10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#08090D]">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              AUREX <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in to your AI workspace or access via Aurex Pay-Per-Use</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#11131C]/90 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sign In to Workspace</span>}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center text-[11px] text-gray-400 mb-3 font-medium">Quick Demo Accounts (1-Click)</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('aurex')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 py-2 px-3 text-[11px] font-semibold text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
              >
                <Zap className="h-3 w-3 text-cyan-400" />
                <span>Aurex PAYG User</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('pro')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-[11px] font-semibold text-gray-300 hover:bg-white/10 transition cursor-pointer"
              >
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Pro Subscriber</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
