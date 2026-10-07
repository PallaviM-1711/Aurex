import { PricingRule, AIRequestType } from './types';

export const DEFAULT_PRICING_RULES: Record<AIRequestType, PricingRule> = {
  plagiarism: {
    serviceType: 'plagiarism',
    displayName: 'Plagiarism Checker',
    unit: 'page',
    unitMultiplier: 1,
    rateINR: 0.15, // ₹0.15 per page (or 250 words)
    minChargeINR: 0.30,
    description: 'Deep multi-source web & academic paper comparison',
    freeTierLimit: 5, // 5 pages free
  },
  summarizer: {
    serviceType: 'summarizer',
    displayName: 'AI Text Summarizer',
    unit: 'word',
    unitMultiplier: 1000,
    rateINR: 0.20, // ₹0.20 per 1,000 words
    minChargeINR: 0.10,
    description: 'Executive summaries, bullet key points & entity tags',
    freeTierLimit: 2000, // 2000 words free
  },
  image_analyzer: {
    serviceType: 'image_analyzer',
    displayName: 'Vision & Image Intelligence',
    unit: 'image',
    unitMultiplier: 1,
    rateINR: 1.00, // ₹1.00 per image
    minChargeINR: 1.00,
    description: 'Neural object detection, scene parsing & color breakdown',
    freeTierLimit: 3, // 3 images free
  },
  ocr: {
    serviceType: 'ocr',
    displayName: 'High-Precision OCR',
    unit: 'image',
    unitMultiplier: 1,
    rateINR: 0.50, // ₹0.50 per image/scan
    minChargeINR: 0.50,
    description: 'Extract raw text, tables, and formatted layout from scans',
    freeTierLimit: 5,
  },
  pdf_analyzer: {
    serviceType: 'pdf_analyzer',
    displayName: 'PDF Deep Analysis',
    unit: 'page',
    unitMultiplier: 1,
    rateINR: 0.12, // ₹0.12 per page
    minChargeINR: 0.25,
    description: 'Full document outline, cross-table extraction & analytics',
    freeTierLimit: 10,
  },
  ai_chat: {
    serviceType: 'ai_chat',
    displayName: 'Contextual AI Chat',
    unit: 'token',
    unitMultiplier: 1000,
    rateINR: 0.05, // ₹0.05 per 1,000 tokens
    minChargeINR: 0.02,
    description: 'Low-latency conversational agent with multi-turn memory',
    freeTierLimit: 10000,
  },
  content_detector: {
    serviceType: 'content_detector',
    displayName: 'AI Content Detector',
    unit: 'word',
    unitMultiplier: 500,
    rateINR: 0.10, // ₹0.10 per 500 words
    minChargeINR: 0.10,
    description: 'Perplexity & burstiness synthetic text detector',
    freeTierLimit: 1500,
  },
  grammar: {
    serviceType: 'grammar',
    displayName: 'Writing & Grammar Assistant',
    unit: 'word',
    unitMultiplier: 1000,
    rateINR: 0.15, // ₹0.15 per 1,000 words
    minChargeINR: 0.10,
    description: 'Tone adjustment, syntax fixes and clarity polish',
    freeTierLimit: 2500,
  },
  document_qa: {
    serviceType: 'document_qa',
    displayName: 'Document Question Answering',
    unit: 'request',
    unitMultiplier: 1,
    rateINR: 0.25, // ₹0.25 per query
    minChargeINR: 0.25,
    description: 'Vector-grounded document search and verified citations',
    freeTierLimit: 5,
  },
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free Tier',
    badge: 'Starter',
    priceINR: 0,
    billingPeriod: 'Forever',
    description: 'Essential AI capabilities for casual exploration and light checks.',
    features: [
      '5 Plagiarism pages free',
      '2,000 words Text Summarization',
      '3 Image analyses per month',
      'Standard model latency',
      'Community support',
    ],
    buttonText: 'Current Plan',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro Subscription',
    badge: 'Popular',
    priceINR: 899,
    billingPeriod: 'per month',
    description: 'Uncapped productivity for creators, researchers & professionals.',
    features: [
      'Unlimited Document Summaries',
      'High-tier Plagiarism (up to 500 pages/mo)',
      'Unlimited Vision & OCR analysis',
      'Document Q&A with deep citations',
      'Priority inference queue (<800ms)',
      'Export PDF & Word reports',
    ],
    buttonText: 'Upgrade to Pro',
    highlighted: false,
  },
  {
    id: 'yearly',
    name: 'Yearly Power',
    badge: 'Save 25%',
    priceINR: 7999,
    billingPeriod: 'per year',
    description: 'Maximum cost efficiency with enterprise-grade SLA & priority.',
    features: [
      'Everything in Pro included',
      'Equivalent to ₹666/month',
      'Unlimited batch PDF processing',
      'Team workspace sharing (up to 3)',
      'Direct API access token',
      'Dedicated 24/7 priority support',
    ],
    buttonText: 'Start Yearly Plan',
    highlighted: false,
  },
  {
    id: 'aurex_payg',
    name: 'Aurex Pay-Per-Use',
    badge: 'Zero Monthly Fee',
    priceINR: 0,
    billingPeriod: 'Micro-billed',
    description: 'Pay ONLY for the exact tokens, pages, or images you consume. Zero waste.',
    features: [
      '₹0 recurring subscription fee',
      'Direct Aurex Wallet instant settlement',
      'Micro-transactions starting from ₹0.05',
      'Pre-execution transparent cost quotes',
      'Real-time transaction receipt ledger',
      'No lock-in or cancellation friction',
    ],
    buttonText: 'Connect Aurex Wallet',
    highlighted: true,
  },
];
