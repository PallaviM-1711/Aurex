'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { History, CheckCircle2, Download, Search, Filter } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function HistoryPage() {
  const activities = [
    {
      date: '07 Oct 2026',
      time: '14:48',
      tool: 'Document Plagiarism Analysis',
      usage: '18 pages (Thesis_ML_Draft.pdf)',
      cost: 2.70,
      status: 'Completed',
    },
    {
      date: '07 Oct 2026',
      time: '13:20',
      tool: 'AI Text Summarizer',
      usage: '2,450 words (Q3_Financial_Quarterly_Report.docx)',
      cost: 0.49,
      status: 'Completed',
    },
    {
      date: '06 Oct 2026',
      time: '17:05',
      tool: 'Vision Object Recognition',
      usage: '1 visual scan (architecture_diagram.png)',
      cost: 1.00,
      status: 'Completed',
    },
    {
      date: '06 Oct 2026',
      time: '11:12',
      tool: 'High-Precision OCR Scan',
      usage: '1 invoice scan (vendor_receipt_oct.jpg)',
      cost: 0.50,
      status: 'Completed',
    },
    {
      date: '05 Oct 2026',
      time: '09:30',
      tool: 'PDF Deep Analysis',
      usage: '35 pages (Consensus_Whitepaper_v4.pdf)',
      cost: 4.20,
      status: 'Completed',
    },
    {
      date: '04 Oct 2026',
      time: '16:45',
      tool: 'Contextual AI Chat Query',
      usage: '1,200 tokens (ZK-Rollup architecture inquiry)',
      cost: 0.06,
      status: 'Completed',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20 mb-2">
              <History className="h-3 w-3 text-cyan-400" />
              <span>Full Historical Auditing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Activity & Execution History</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Complete historical record of every document processed, prompt generated, and settled payment.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11131C] p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">AI Tool / Operation</th>
                  <th className="pb-3">Usage Metrix</th>
                  <th className="pb-3">Cost (INR)</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {activities.map((act, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 font-mono text-gray-400">
                      {act.date} <span className="text-gray-500 text-[10px]">{act.time}</span>
                    </td>
                    <td className="py-3.5 font-semibold text-white">{act.tool}</td>
                    <td className="py-3.5 font-mono text-purple-300">{act.usage}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-400">
                      {formatCurrencyINR(act.cost)}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{act.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
