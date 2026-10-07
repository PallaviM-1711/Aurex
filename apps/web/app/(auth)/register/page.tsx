'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, Loader2, Wallet, Zap } from 'lucide-react';
import { SubscriptionTier } from '@aurex/shared';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<SubscriptionTier>('aurex_payg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please provide your name and email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password, plan);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="glow-orb top-10 right-10 h-96 w-96 bg-purple-600/15" />
      <div className="glow-orb bottom-10 left-10 h-96 w-96 bg-cyan-600/10" />

      <div className="w-full max-w-lg relative z-10">
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-xs text-gray-400 mt-1">Unlock multiple AI productivity tools with modern billing</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C]/90 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Plan Selection Mode */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-300 mb-2">Select Payment Archetype</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPlan('aurex_payg')}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    plan === 'aurex_payg'
                      ? 'border-purple-500 bg-purple-500/15 shadow-sm shadow-purple-500/20'
                      : 'border-white/10 bg-[#161824] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
                    <Wallet className="h-3.5 w-3.5" />
                    <span>Aurex Pay-Per-Use</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    ₹0 monthly fee. Pay micro-amounts only for exact pages & tokens consumed.
                  </p>
                </div>

                <div
                  onClick={() => setPlan('pro')}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    plan === 'pro'
                      ? 'border-purple-500 bg-purple-500/15 shadow-sm shadow-purple-500/20'
                      : 'border-white/10 bg-[#161824] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-1">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>Pro Subscription</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    ₹899/month. Uncapped high-volume usage and priority inference pipelines.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition disabled:opacity-50 cursor-pointer mt-4"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Complete Registration</span>}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
