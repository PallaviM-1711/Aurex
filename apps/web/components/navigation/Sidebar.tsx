'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  FileText,
  Eye,
  ScanText,
  FileCode2,
  MessageSquare,
  Cpu,
  SpellCheck,
  HelpCircle,
  Wallet,
  BarChart3,
  CreditCard,
  History,
  Settings,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const mainNav: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'All AI Tools', href: '/tools', icon: Sparkles },
  ];

  const aiToolsNav: NavItem[] = [
    { label: 'Plagiarism Checker', href: '/tools/plagiarism', icon: ShieldCheck },
    { label: 'AI Summarizer', href: '/tools/summarizer', icon: FileText },
    { label: 'Vision Analyzer', href: '/tools/image-analyzer', icon: Eye },
    { label: 'Document OCR', href: '/tools/ocr', icon: ScanText },
    { label: 'PDF Deep Analysis', href: '/tools/pdf-analyzer', icon: FileCode2 },
    { label: 'Contextual AI Chat', href: '/tools/ai-chat', icon: MessageSquare },
    { label: 'AI Content Detector', href: '/tools/content-detector', icon: Cpu },
    { label: 'Grammar Assistant', href: '/tools/grammar', icon: SpellCheck },
    { label: 'Document Q&A', href: '/tools/document-qa', icon: HelpCircle },
  ];

  const aurexFinanceNav: NavItem[] = [
    { label: 'Aurex Pay-Per-Use', href: '/aurex', icon: Wallet, badge: 'Active' },
    { label: 'Usage Analytics', href: '/usage', icon: BarChart3 },
    { label: 'Billing & Plans', href: '/billing', icon: CreditCard },
    { label: 'Activity History', href: '/history', icon: History },
  ];

  const adminNav: NavItem[] = [
    { label: 'Admin Control', href: '/admin', icon: ShieldAlert, badge: 'Ops' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-6">
      <h4 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all',
                isActive
                  ? 'bg-indigo-600/15 text-white border border-indigo-500/25 shadow-sm'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="rounded bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-mono font-medium text-indigo-300 border border-indigo-500/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.08] bg-[#090A0F] px-3 py-6 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Icon Header */}
      <div className="px-3 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white">AUREX INTELLIGENCE</div>
            <div className="text-[10px] text-slate-500 font-mono">Pay-Per-Use Cloud</div>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1">
        {renderNavGroup('Overview', mainNav)}
        {renderNavGroup('AI Workspace Tools', aiToolsNav)}
        {renderNavGroup('Aurex & Billing', aurexFinanceNav)}
        {renderNavGroup('System', adminNav)}
      </div>

      {/* Aurex Pay-Per-Use Banner Widget */}
      <div className="mt-auto pt-4 border-t border-white/[0.08] px-2">
        <div className="rounded-xl border border-white/[0.08] bg-[#121520] p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-white">Aurex Mode Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug mb-3">
            Only pay for the exact tokens and pages consumed. Zero commitment.
          </p>
          <Link
            href="/aurex"
            className="block text-center rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 py-1.5 text-[11px] font-semibold text-indigo-300 transition"
          >
            Manage Aurex Wallet →
          </Link>
        </div>
      </div>
    </aside>
  );
};
