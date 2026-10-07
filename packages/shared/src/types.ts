export type SubscriptionTier = 'free' | 'pro' | 'yearly' | 'aurex_payg';

export type UserRole = 'user' | 'admin';

export type AIRequestType =
  | 'plagiarism'
  | 'summarizer'
  | 'image_analyzer'
  | 'ocr'
  | 'pdf_analyzer'
  | 'ai_chat'
  | 'content_detector'
  | 'grammar'
  | 'document_qa';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionTier;
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'none';
  subscriptionRenewsAt?: string;
  aurexConnected: boolean;
  aurexWalletId?: string;
  createdAt: string;
}

export interface AurexWallet {
  id: string;
  userId: string;
  walletAddress: string;
  balanceINR: number;
  currency: string;
  isConnected: boolean;
  linkedAt: string;
  lastUpdated: string;
}

export interface UsageMetric {
  words?: number;
  tokens?: number;
  pages?: number;
  images?: number;
  apiCalls?: number;
}

export interface PricingRule {
  serviceType: AIRequestType;
  displayName: string;
  unit: 'word' | 'token' | 'page' | 'image' | 'request';
  unitMultiplier: number; // e.g. per 1000 tokens or per 1 page
  rateINR: number;
  minChargeINR: number;
  description: string;
  freeTierLimit: number; // free daily or one-time limit
}

export interface AurexEstimateResponse {
  serviceType: AIRequestType;
  serviceName: string;
  usageMetric: UsageMetric;
  unitDescription: string;
  estimatedCostINR: number;
  currentWalletBalanceINR: number;
  hasSufficientBalance: boolean;
  shortfallINR: number;
  requiresPayment: boolean; // false if covered by active Pro/Yearly subscription or free credits
  coveredBySubscription: boolean;
  quoteId: string;
}

export interface AurexPaymentRequest {
  quoteId: string;
  serviceType: AIRequestType;
  estimatedCostINR: number;
  walletAddress?: string;
}

export interface AurexPaymentResponse {
  success: boolean;
  transactionId: string;
  amountINR: number;
  serviceType: AIRequestType;
  remainingBalanceINR: number;
  timestamp: string;
  message: string;
}

export interface AurexTransaction {
  id: string;
  userId: string;
  serviceType: AIRequestType;
  serviceName: string;
  usageDetails: string;
  usageMetric: UsageMetric;
  amountINR: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
}

export interface PlagiarismSource {
  id: string;
  name: string;
  url?: string;
  matchPercent: number;
  matchedExcerpts: Array<{
    original: string;
    matched: string;
  }>;
}

export interface PlagiarismReport {
  id: string;
  fileName?: string;
  totalWords: number;
  matchedWords: number;
  overallSimilarity: number;
  originalPercent: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  sources: PlagiarismSource[];
  highlightedText: string;
  createdAt: string;
}

export interface SummaryResult {
  summary: string;
  bulletPoints: string[];
  keyTopics: string[];
  keywords: string[];
  originalLength: number;
  summaryLength: number;
  compressionRatio: number;
  readingTimeMinutesSaved: number;
}

export interface ImageAnalysisResult {
  overview: string;
  detectedObjects: Array<{
    name: string;
    confidence: number;
    category: string;
  }>;
  sceneClassification: string;
  dominantColors: string[];
  extractedText?: string;
  visualInsights: string[];
}

export interface OCRResult {
  extractedText: string;
  confidence: number;
  wordsCount: number;
  linesCount: number;
}

export interface ContentDetectionResult {
  aiProbability: number;
  humanProbability: number;
  verdict: 'Highly Likely AI' | 'Likely AI' | 'Mixed / Edited' | 'Likely Human';
  confidenceScore: number;
  sentences: Array<{
    text: string;
    isAiGenerated: boolean;
    aiScore: number;
  }>;
}

export interface GrammarSuggestion {
  original: string;
  suggestion: string;
  category: 'Spelling' | 'Grammar' | 'Clarity' | 'Style';
  explanation: string;
}

export interface GrammarResult {
  originalText: string;
  improvedText: string;
  readabilityScore: number;
  suggestionsCount: number;
  suggestions: GrammarSuggestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tokensUsed?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentQAResponse {
  question: string;
  answer: string;
  pageReferences: number[];
  relevantSnippets: string[];
  confidence: number;
}

export interface UsageAnalyticsOverview {
  totalAiCreditsUsed: number;
  documentsAnalyzed: number;
  imagesProcessed: number;
  totalAiRequests: number;
  monthlySpendINR: number;
  usageByTool: Array<{ tool: string; count: number; spendINR: number }>;
  dailyActivity: Array<{ date: string; requests: number; spendINR: number }>;
}
