'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
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
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-xs text-gray-400 mt-1">We will send you instructions to recover your account</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C]/90 p-8 shadow-2xl backdrop-blur-xl">
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Your email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/10 bg-[#161824] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition cursor-pointer"
              >
                Send Password Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Check your inbox</h3>
              <p className="text-xs text-gray-400 mb-6">
                We sent a password reset token to <span className="text-purple-300 font-mono">{email}</span>.
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-400">
            <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-white transition">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
