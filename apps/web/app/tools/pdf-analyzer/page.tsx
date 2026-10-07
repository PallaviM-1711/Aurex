'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAurex } from '@/context/AurexContext';
import { FileCode2, Upload, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function PDFAnalyzerPage() {
  const { requirePayment } = useAurex();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(24);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [insights, setInsights] = useState<{
    summary: string;
    keyFindings: string[];
    outline: string[];
  } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const estPages = Math.max(1, Math.round(f.size / 4000));
      setPageCount(estPages);
      setInsights(null);
    }
  };

  const handleAnalyze = async () => {
    // Aurex payment verification for PDF analysis (₹0.12 / page)
    const authorized = await requirePayment('pdf_analyzer', { pages: pageCount });
    if (!authorized) return;

    setIsProcessing(true);
    setTimeout(() => {
      setInsights({
        summary:
          'This PDF document contains a comprehensive technical architecture specification detailing distributed microservices, consensus protocols, and fault-tolerant storage clustering.',
        keyFindings: [
          'High availability SLA target: 99.995% uptime across multi-region nodes.',
          'Consensus engine leverages Byzantine Fault Tolerant state machine replication.',
          'Data encryption enforced at-rest (AES-256-GCM) and in-transit (mTLS 1.3).',
          'Scalability benchmarks validate linear performance scaling up to 100k concurrent connections.',
        ],
        outline: [
          '1. Executive Architectural Summary (pp. 1-3)',
          '2. Consensus Protocols & Ledger Synchronization (pp. 4-10)',
          '3. Micro-billing & Usage Metering Adapters (pp. 11-18)',
          '4. Threat Modeling & Cryptographic Auditing (pp. 19-24)',
        ],
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300 border border-blue-500/20 mb-2">
              <FileCode2 className="h-3 w-3 text-blue-400" />
              <span>Multi-Page Document Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">PDF Deep Analyzer</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Extract structural outlines, critical findings, and tabular data from multi-page PDFs.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <span>Aurex Rate: ₹0.12 / page</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-4">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-[#151824]/60 p-8 hover:border-blue-500/60 transition cursor-pointer group">
            <input type="file" accept=".pdf" onChange={handleFile} className="hidden" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">Upload PDF Document</h3>
            <span className="text-[10px] text-gray-500">Supports documents up to 25MB and 200+ pages</span>
          </label>

          {file && (
            <div className="rounded-xl border border-blue-500/30 bg-[#161928] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{file.name}</div>
                  <div className="text-[11px] text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB • {pageCount} Pages Detected
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-purple-300">
                Est. Aurex Cost: {formatCurrencyINR(pageCount * 0.12)}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing || !file}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 px-6 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Parsing {pageCount} Pages...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze PDF Structure</span>
                </>
              )}
            </button>
          </div>
        </div>

        {insights && (
          <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                Document Overview
              </span>
              <h2 className="text-xl font-bold text-white">Synthesized Insights & Structure</h2>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#151824] p-4 text-xs text-gray-200 leading-relaxed font-sans">
              {insights.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Key Findings</h3>
                <div className="space-y-2">
                  {insights.keyFindings.map((kf, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-gray-300 rounded-lg bg-[#151824] p-3 border border-white/5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{kf}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Document Outline</h3>
                <div className="space-y-2">
                  {insights.outline.map((out, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-300 rounded-lg bg-[#151824] p-3 border border-white/5 font-mono"
                    >
                      {out}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
