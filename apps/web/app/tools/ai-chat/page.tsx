'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAurex } from '@/context/AurexContext';
import { ChatMessage, ChatConversation } from '@aurex/shared';
import {
  MessageSquare,
  Plus,
  Send,
  Copy,
  Check,
  RefreshCw,
  Paperclip,
  Trash2,
  Edit2,
  Sparkles,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function AIChatPage() {
  const { requirePayment } = useAurex();

  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'c1',
      title: 'Research Project',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Can you summarize how zero-knowledge rollups impact Ethereum transaction throughput?',
          timestamp: '10:30 AM',
        },
        {
          id: 'm2',
          role: 'assistant',
          content:
            'Zero-Knowledge Rollups (ZK-Rollups) bundle hundreds of off-chain transactions into a single cryptographic cryptographic proof (SNARK or STARK) validated on Layer 1. This increases throughput from ~15 TPS to upwards of 2,000+ TPS while retaining L1 security guarantees.',
          timestamp: '10:31 AM',
          tokensUsed: 65,
        },
      ],
      createdAt: '2026-10-07T10:00:00Z',
      updatedAt: '2026-10-07T10:31:00Z',
    },
    {
      id: 'c2',
      title: 'Marketing Ideas',
      messages: [
        {
          id: 'm3',
          role: 'user',
          content: 'Draft 3 headline hooks for a Pay-Per-Use AI SaaS platform.',
          timestamp: 'Yesterday',
        },
        {
          id: 'm4',
          role: 'assistant',
          content:
            '1. "Subscription when you need it. Pay-per-use when you don\'t."\n2. "Why pay ₹999/mo for unused AI? Pay ₹0.15 per actual query."\n3. "The death of bloated SaaS subscriptions: Meet Aurex Micro-Metering."',
          timestamp: 'Yesterday',
          tokensUsed: 72,
        },
      ],
      createdAt: '2026-10-06T14:00:00Z',
      updatedAt: '2026-10-06T14:05:00Z',
    },
    {
      id: 'c3',
      title: 'Document Analysis',
      messages: [],
      createdAt: '2026-10-05T09:00:00Z',
      updatedAt: '2026-10-05T09:00:00Z',
    },
    {
      id: 'c4',
      title: 'Study Notes',
      messages: [],
      createdAt: '2026-10-04T18:00:00Z',
      updatedAt: '2026-10-04T18:00:00Z',
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('c1');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeChatId) || conversations[0];

  const handleCreateNewChat = () => {
    const newChat: ChatConversation = {
      id: `c_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations([newChat, ...conversations]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (activeChatId === id && remaining.length > 0) {
      setActiveChatId(remaining[0].id);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeConversation.messages, userMsg];
    setConversations(
      conversations.map((c) => (c.id === activeChatId ? { ...c, messages: updatedMessages } : c))
    );

    // Require micro-payment via Aurex (e.g. 500 tokens = ~₹0.02)
    const authorized = await requirePayment('ai_chat', { tokens: 500 });
    if (!authorized) return;

    setIsTyping(true);

    // Generate intelligent assistant response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your prompt regarding "${userText.slice(0, 30)}...". Utilizing context memory and verified reasoning pipelines, here is the synthesized response with sub-second latency. Aurex micro-metering automatically settled 380 tokens on the ledger.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokensUsed: 380,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, messages: [...c.messages, botMsg] } : c
        )
      );
      setIsTyping(false);
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-8.5rem)] flex gap-4">
        {/* Chat Sidebar */}
        <div className="w-64 hidden md:flex flex-col rounded-2xl border border-white/10 bg-[#11131C] p-3">
          <button
            onClick={handleCreateNewChat}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 py-2.5 px-3 text-xs font-semibold text-purple-200 transition mb-3 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>New Chat</span>
          </button>

          <span className="text-[10px] font-semibold text-gray-500 uppercase px-2 mb-2 tracking-wider">
            Recent Conversations
          </span>

          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition ${
                  activeChatId === chat.id
                    ? 'bg-purple-600/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Conversation Container */}
        <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#11131C] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-4 bg-[#141724]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white leading-none">{activeConversation.title}</h2>
                <span className="text-[10px] text-gray-400">Contextual Memory Active • ₹0.05 / 1k tokens</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Aurex Stream
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeConversation.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <Sparkles className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="text-sm font-semibold text-gray-300">How can Aurex AI assist you today?</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Ask about code architecture, document citations, or marketing copy.
                </p>
              </div>
            ) : (
              activeConversation.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300 mt-1">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                      </div>
                    )}

                    <div
                      className={`relative max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-[#161928] border border-white/10 text-gray-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      <div className="mt-2 flex items-center justify-between text-[10px] opacity-70">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <div className="flex items-center gap-2 ml-4">
                            {msg.tokensUsed && <span>{msg.tokensUsed} tokens</span>}
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="hover:opacity-100 transition"
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white mt-1">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-gray-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="flex gap-1.5 p-3 rounded-2xl bg-[#161928] border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-75" />
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#141724]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message Aurex AI Assistant... (Enter to send)"
                className="w-full rounded-xl border border-white/10 bg-[#161824] py-3 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white disabled:opacity-40 transition cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
