'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAurex } from '@/context/AurexContext';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  ShieldCheck,
  Wallet,
  ArrowRight,
} from 'lucide-react';

export const AurexPayModal: React.FC = () => {
  const {
    isOpenModal,
    currentEstimate,
    paymentState,
    lastTransaction,
    confirmPayment,
    cancelPayment,
    topUpWallet,
  } = useAurex();

  if (!isOpenModal || !currentEstimate) return null;

  const hasSufficient = currentEstimate.hasSufficientBalance;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0F121C] p-6 shadow-2xl text-white"
        >
          {/* Close button */}
          {paymentState !== 'processing' && (
            <button
              onClick={cancelPayment}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* State 1: Estimation & Confirmation */}
          {paymentState !== 'success' ? (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight">Aurex Pay-Per-Use</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                    Instant micro-billing authorization
                  </p>
                </div>
              </div>

              {/* Bill Details Box */}
              <div className="rounded-xl border border-white/[0.08] bg-[#141724] p-4 space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-medium text-white">{currentEstimate.serviceName}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Calculated Usage:</span>
                  <span className="font-mono text-slate-200">
                    {currentEstimate.usageMetric.words
                      ? `${currentEstimate.usageMetric.words.toLocaleString()} words`
                      : currentEstimate.usageMetric.pages
                      ? `${currentEstimate.usageMetric.pages} pages`
                      : currentEstimate.usageMetric.images
                      ? `${currentEstimate.usageMetric.images} image`
                      : `${currentEstimate.usageMetric.tokens || 1000} tokens`}
                  </span>
                </div>

                <div className="h-px bg-white/[0.08] my-2" />

                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-300 font-medium">Estimated Cost:</span>
                  <span className="text-2xl font-bold text-white font-mono">
                    {formatCurrencyINR(currentEstimate.estimatedCostINR)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-1 text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-slate-400" />
                    Available Aurex Balance:
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      hasSufficient ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrencyINR(currentEstimate.currentWalletBalanceINR)}
                  </span>
                </div>
              </div>

              {/* Insufficient balance alert */}
              {!hasSufficient && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 mb-4 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Insufficient balance (Shortfall: {formatCurrencyINR(currentEstimate.shortfallINR)})</span>
                  </div>
                  <button
                    onClick={() => topUpWallet(100)}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-medium border border-amber-500/40 text-xs transition"
                  >
                    + Add ₹100
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={cancelPayment}
                  disabled={paymentState === 'processing'}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 px-4 text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmPayment}
                  disabled={paymentState === 'processing' || !hasSufficient}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {paymentState === 'processing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Settling on Aurex...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Pay</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <span className="text-[11px] text-slate-500">
                  Secured by Aurex Protocol • Funds deducted only upon task initiation
                </span>
              </div>
            </div>
          ) : (
            /* State 2: Payment Successful Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-4 shadow-sm">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Payment Successful ✓</h3>
              <p className="text-xs text-slate-400 mb-6">
                Your Aurex micro-transaction was settled on ledger.
              </p>

              <div className="rounded-xl border border-white/[0.08] bg-[#141724] p-4 text-left space-y-2.5 mb-5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrencyINR(lastTransaction?.amountINR || currentEstimate.estimatedCostINR)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-slate-200">{lastTransaction?.transactionId || 'TXN-994123'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-slate-200">{currentEstimate.serviceName}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Launching AI execution pipeline...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
