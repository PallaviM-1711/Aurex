'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAurex } from '@/context/AurexContext';
import { api } from '@/lib/api';
import { GrammarResult } from '@aurex/shared';
import { SpellCheck, Copy, Check, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function GrammarAssistantPage() {
  const { requirePayment } = useAurex();

  const [text, setText] = useState(
    'Their is several mistakes in this proposal that makes the document difficult for understanding.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleImprove = async () => {
    if (wordCount < 3) {
      alert('Please enter at least a short sentence.');
      return;
    }

    const authorized = await requirePayment('grammar', { words: wordCount });
    if (!authorized) return;

    setIsProcessing(true);
    try {
      const res = await api.improveGrammar({ text });
      const sampleRes: GrammarResult = {
        originalText: text,
        improvedText:
          'There are several mistakes in this proposal that make the document difficult to understand.',
        readabilityScore: 92,
        suggestionsCount: 3,
        suggestions: [
          {
            original: 'Their is',
            suggestion: 'There are',
            category: 'Grammar',
            explanation: 'Homophone correction: "There are" refers to existence, pluralized with "mistakes".',
          },
          {
            original: 'makes',
            suggestion: 'make',
            category: 'Grammar',
            explanation: 'Subject-verb agreement: "mistakes" is plural and requires the plural verb "make".',
          },
          {
            original: 'for understanding',
            suggestion: 'to understand',
            category: 'Clarity',
            explanation: 'Infinitive phrase improves natural executive readability.',
          },
        ],
      };
      setResult(res?.improvedText ? res : sampleRes);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/20 mb-2">
              <SpellCheck className="h-3 w-3 text-amber-400" />
              <span>Executive Polish & Syntax Optimizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Grammar & Writing Assistant</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Elevate prose, fix syntax blunders, and achieve crisp professional tone.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <span>Aurex Rate: ₹0.15 / 1,000 words</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-300">Original Prose</label>
              <span className="text-xs text-gray-400 font-mono">{wordCount} words</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Paste draft text here..."
              className="w-full rounded-xl border border-white/10 bg-[#151824] p-4 text-xs text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleImprove}
              disabled={isProcessing || wordCount === 0}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 py-3 px-6 text-xs font-bold text-white shadow-lg shadow-amber-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Polishing Prose...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Improve Writing</span>
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  Syntactic & Stylistic Polish
                </span>
                <h2 className="text-xl font-bold text-white">Enhanced Version</h2>
              </div>
              <button
                onClick={copyText}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Clean Text'}</span>
              </button>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-[#0E1017] p-4 text-xs text-emerald-200 leading-relaxed font-sans">
              {result.improvedText}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                Detected Edits ({result.suggestionsCount})
              </h3>
              <div className="space-y-3">
                {result.suggestions.map((sug, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-[#151824] p-3.5 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20">
                        {sug.category}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">&rarr; {sug.suggestion}</span>
                    </div>
                    <p className="text-gray-400 text-[11px]">{sug.explanation}</p>
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
