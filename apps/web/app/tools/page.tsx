'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import {
  ShieldCheck,
  FileText,
  Eye,
  ScanText,
  FileCode2,
  MessageSquare,
  Cpu,
  SpellCheck,
  HelpCircle,
  ArrowRight,
  Search,
  Wallet,
  Sparkles,
} from 'lucide-react';

export default function ToolsHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const tools = [
    {
      id: 'plagiarism',
      name: 'Plagiarism Detector',
      desc: 'Detect copied or highly similar content with multi-source academic & web matching.',
      category: 'Document Analysis',
      rate: '₹0.15 / page',
      freeBadge: '5 pages free',
      aurexReady: true,
      href: '/tools/plagiarism',
      btnText: 'Analyze Document',
      icon: ShieldCheck,
    },
    {
      id: 'summarizer',
      name: 'AI Text Summarizer',
      desc: 'Turn long documents into concise summaries, key bullet points, and entity extractions.',
      category: 'Writing & Synthesis',
      rate: '₹0.20 / 1k words',
      freeBadge: '2,000 words free',
      aurexReady: true,
      href: '/tools/summarizer',
      btnText: 'Summarize',
      icon: FileText,
    },
    {
      id: 'image-analyzer',
      name: 'Image Analyzer',
      desc: 'Understand objects, scenes, text, and visual content with neural multi-modal reasoning.',
      category: 'Vision AI',
      rate: '₹1.00 / image',
      freeBadge: '3 images free',
      aurexReady: true,
      href: '/tools/image-analyzer',
      btnText: 'Analyze Image',
      icon: Eye,
    },
    {
      id: 'ocr',
      name: 'High-Precision OCR',
      desc: 'Extract formatted text, tabular figures, and handwritten notes from scanned images.',
      category: 'Vision AI',
      rate: '₹0.50 / image',
      freeBadge: '5 images free',
      aurexReady: true,
      href: '/tools/ocr',
      btnText: 'Extract Text',
      icon: ScanText,
    },
    {
      id: 'pdf-analyzer',
      name: 'PDF Deep Analyzer',
      desc: 'Ask questions, review structural outlines, and extract deep insights from PDFs.',
      category: 'Document Analysis',
      rate: '₹0.12 / page',
      freeBadge: '10 pages free',
      aurexReady: true,
      href: '/tools/pdf-analyzer',
      btnText: 'Analyze PDF',
      icon: FileCode2,
    },
    {
      id: 'ai-chat',
      name: 'Contextual AI Chat',
      desc: 'Chat with an intelligent model capable of multi-turn reasoning and code generation.',
      category: 'Conversational',
      rate: '₹0.05 / 1k tokens',
      freeBadge: '10k tokens free',
      aurexReady: true,
      href: '/tools/ai-chat',
      btnText: 'Open Chat',
      icon: MessageSquare,
    },
    {
      id: 'content-detector',
      name: 'AI Content Detector',
      desc: 'Estimate whether text appears machine-generated or human-authored with probability breakdowns.',
      category: 'Auditing',
      rate: '₹0.10 / 500 words',
      freeBadge: '1,500 words free',
      aurexReady: true,
      href: '/tools/content-detector',
      btnText: 'Detect AI Text',
      icon: Cpu,
    },
    {
      id: 'grammar',
      name: 'Grammar / Writing Assistant',
      desc: 'Improve clarity, fix syntax errors, polish vocabulary, and adapt tone for professional impact.',
      category: 'Writing & Synthesis',
      rate: '₹0.15 / 1k words',
      freeBadge: '2,500 words free',
      aurexReady: true,
      href: '/tools/grammar',
      btnText: 'Improve Writing',
      icon: SpellCheck,
    },
    {
      id: 'document-qa',
      name: 'Document Question Answering',
      desc: 'Upload multi-page research documents and obtain exact answers with verified citations.',
      category: 'Document Analysis',
      rate: '₹0.25 / query',
      freeBadge: '5 queries free',
      aurexReady: true,
      href: '/tools/document-qa',
      btnText: 'Ask Document',
      icon: HelpCircle,
    },
  ];

  const categories = ['All', 'Document Analysis', 'Writing & Synthesis', 'Vision AI', 'Conversational', 'Auditing'];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20 mb-2">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>9 High-Performance Tools</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Tools Marketplace</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any capability. Pay with Aurex micro-metering or unmetered Pro subscription.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-xl border border-white/10 bg-[#121520] py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="group rounded-xl border border-white/[0.08] bg-[#121520] p-6 hover:border-indigo-500/40 hover:bg-[#151926] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400 border border-white/[0.08]">
                        {tool.freeBadge}
                      </span>
                      {tool.aurexReady && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                          <Wallet className="h-2.5 w-2.5 text-emerald-400" />
                          Aurex
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-1.5">{tool.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{tool.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-500 text-[11px]">Usage Price:</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">{tool.rate}</span>
                  </div>

                  <Link
                    href={tool.href}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm transition"
                  >
                    <span>{tool.btnText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
