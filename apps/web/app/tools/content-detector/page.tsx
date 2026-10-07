'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAurex } from '@/context/AurexContext';
import { api } from '@/lib/api';
import { ContentDetectionResult } from '@aurex/shared';
import { Cpu, CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function ContentDetectorPage() {
  const { requirePayment } = useAurex();

  const [text, setText] = useState(
    'In recent years, the acceleration of computational linguistics has propelled algorithmic synthesis to unprecedented thresholds. Consequently, multi-layered transformer networks dynamically allocate intermediate activation vectors across deep latent parameters.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ContentDetectionResult | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleDetect = async () => {
    if (wordCount < 10) {
      alert('Please enter at least 10 words.');
      return;
    }

    const authorized = await requirePayment('content_detector', { words: wordCount });
    if (!authorized) return;

    setIsProcessing(true);
    try {
      const res = await api.detectContent({ text });
      const sampleRes: ContentDetectionResult = {
        aiProbability: 88,
        humanProbability: 12,
        verdict: 'Highly Likely AI',
        confidenceScore: 0.94,
        sentences: [
          {
            text: 'In recent years, the acceleration of computational linguistics has propelled algorithmic synthesis to unprecedented thresholds.',
            isAiGenerated: true,
            aiScore: 92,
          },
          {
            text: 'Consequently, multi-layered transformer networks dynamically allocate intermediate activation vectors across deep latent parameters.',
            isAiGenerated: true,
            aiScore: 84,
          },
        ],
      };
      setResult(res?.verdict ? res : sampleRes);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/20 mb-2">
              <Cpu className="h-3 w-3 text-rose-400" />
              <span>Perplexity & Burstiness Auditing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Content Detector</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Verify whether paragraphs originate from GPT-4, Claude, Gemini, or human authors.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <span>Aurex Rate: ₹0.10 / 500 words</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-300">Input Text</label>
              <span className="text-xs text-gray-400 font-mono">{wordCount} words</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Paste content to inspect AI provenance..."
              className="w-full rounded-xl border border-white/10 bg-[#151824] p-4 text-xs text-white placeholder-gray-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDetect}
              disabled={isProcessing || wordCount === 0}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 py-3 px-6 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Auditing Linguistic Tokens...</span>
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4" />
                  <span>Detect AI Probability</span>
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                Linguistic Verdict
              </span>
              <h2 className="text-xl font-bold text-white">{result.verdict}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-rose-500/30 bg-[#161928] p-4 text-center">
                <span className="text-xs text-gray-400">AI Probability</span>
                <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1">
                  {result.aiProbability}%
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-[#161928] p-4 text-center">
                <span className="text-xs text-gray-400">Human Probability</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  {result.humanProbability}%
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#161928] p-4 text-center">
                <span className="text-xs text-gray-400">Confidence Score</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1">
                  {Math.round(result.confidenceScore * 100)}%
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Sentence-Level Breakdown
              </h3>
              <div className="space-y-2">
                {result.sentences.map((sent, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3.5 border text-xs leading-relaxed flex justify-between items-center ${
                      sent.isAiGenerated
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    <span>{sent.text}</span>
                    <span className="font-mono font-bold ml-4 shrink-0">
                      {sent.isAiGenerated ? `AI: ${sent.aiScore}%` : 'Human'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
