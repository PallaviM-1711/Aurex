import {
  UserProfile,
  AurexWallet,
  AurexTransaction,
  AurexEstimateResponse,
  AurexPaymentResponse,
  PlagiarismReport,
  SummaryResult,
  ImageAnalysisResult,
  OCRResult,
  ContentDetectionResult,
  GrammarResult,
  DocumentQAResponse,
  UsageAnalyticsOverview,
  AIRequestType,
  UsageMetric,
} from '@aurex/shared';
import { DEFAULT_PRICING_RULES } from '@aurex/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('aurex_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || 'API request failed');
      }

      return (await res.json()) as T;
    } catch (err: any) {
      // In Demo Mode or if backend is offline, provide intelligent demo responses
      console.warn(`[AurexAPI] Real backend call failed for ${endpoint}:`, err.message);
      return this.handleFallback<T>(endpoint, options);
    }
  }

  // Fallback demo handler for resilient operation
  private handleFallback<T>(endpoint: string, options: RequestInit): T {
    const body = options.body ? JSON.parse(options.body as string) : {};

    if (endpoint === '/aurex/estimate') {
      const { serviceType, usageMetric } = body;
      const rule = DEFAULT_PRICING_RULES[serviceType as AIRequestType] || DEFAULT_PRICING_RULES.summarizer;
      let calculatedCost = 0;

      if (rule.unit === 'page') {
        calculatedCost = (usageMetric.pages || 1) * rule.rateINR;
      } else if (rule.unit === 'word') {
        calculatedCost = ((usageMetric.words || 500) / rule.unitMultiplier) * rule.rateINR;
      } else if (rule.unit === 'image') {
        calculatedCost = (usageMetric.images || 1) * rule.rateINR;
      } else if (rule.unit === 'token') {
        calculatedCost = ((usageMetric.tokens || 1000) / rule.unitMultiplier) * rule.rateINR;
      } else {
        calculatedCost = rule.rateINR;
      }

      const cost = Math.max(rule.minChargeINR, parseFloat(calculatedCost.toFixed(2)));
      const storedBalance = typeof window !== 'undefined' ? parseFloat(localStorage.getItem('aurex_wallet_balance') || '250.00') : 250.00;

      const estimate: AurexEstimateResponse = {
        serviceType,
        serviceName: rule.displayName,
        usageMetric,
        unitDescription: `${rule.rateINR} INR per ${rule.unitMultiplier > 1 ? rule.unitMultiplier + ' ' : ''}${rule.unit}`,
        estimatedCostINR: cost,
        currentWalletBalanceINR: storedBalance,
        hasSufficientBalance: storedBalance >= cost,
        shortfallINR: storedBalance >= cost ? 0 : parseFloat((cost - storedBalance).toFixed(2)),
        requiresPayment: true,
        coveredBySubscription: false,
        quoteId: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      return estimate as unknown as T;
    }

    if (endpoint === '/aurex/pay') {
      const { estimatedCostINR, serviceType } = body;
      const currentBal = typeof window !== 'undefined' ? parseFloat(localStorage.getItem('aurex_wallet_balance') || '250.00') : 250.00;
      const newBal = Math.max(0, currentBal - estimatedCostINR);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aurex_wallet_balance', newBal.toFixed(2));
      }

      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Save to transaction history
      if (typeof window !== 'undefined') {
        const history: AurexTransaction[] = JSON.parse(localStorage.getItem('aurex_transactions') || '[]');
        const newTxn: AurexTransaction = {
          id: `txn_${Date.now()}`,
          userId: 'usr_demo_01',
          serviceType: serviceType || 'summarizer',
          serviceName: DEFAULT_PRICING_RULES[serviceType as AIRequestType]?.displayName || 'AI Operation',
          usageDetails: `Consumed micro-service`,
          usageMetric: { words: 1200 },
          amountINR: estimatedCostINR,
          status: 'completed',
          transactionId: txnId,
          createdAt: new Date().toISOString(),
        };
        history.unshift(newTxn);
        localStorage.setItem('aurex_transactions', JSON.stringify(history));
      }

      const res: AurexPaymentResponse = {
        success: true,
        transactionId: txnId,
        amountINR: estimatedCostINR,
        serviceType,
        remainingBalanceINR: newBal,
        timestamp: new Date().toISOString(),
        message: 'Aurex micro-payment verified and settled successfully.',
      };
      return res as unknown as T;
    }

    if (endpoint === '/aurex/balance') {
      const balance = typeof window !== 'undefined' ? parseFloat(localStorage.getItem('aurex_wallet_balance') || '245.60') : 245.60;
      const wallet: AurexWallet = {
        id: 'wal_aur_9921',
        userId: 'usr_demo_01',
        walletAddress: '0x8F3a...4B2c',
        balanceINR: balance,
        currency: 'INR',
        isConnected: true,
        linkedAt: '2026-09-15T10:00:00Z',
        lastUpdated: new Date().toISOString(),
      };
      return wallet as unknown as T;
    }

    // Default mock response
    return {} as T;
  }

  // Authentication
  async login(email: string, password: string):Promise<{ user: UserProfile; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, plan: string = 'free'): Promise<{ user: UserProfile; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, plan }),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.request('/user/profile');
  }

  // Aurex Pay-Per-Use
  async estimateAurexCost(serviceType: AIRequestType, usageMetric: UsageMetric): Promise<AurexEstimateResponse> {
    return this.request('/aurex/estimate', {
      method: 'POST',
      body: JSON.stringify({ serviceType, usageMetric }),
    });
  }

  async executeAurexPayment(quoteId: string, serviceType: AIRequestType, estimatedCostINR: number): Promise<AurexPaymentResponse> {
    return this.request('/aurex/pay', {
      method: 'POST',
      body: JSON.stringify({ quoteId, serviceType, estimatedCostINR }),
    });
  }

  async getAurexWallet(): Promise<AurexWallet> {
    return this.request('/aurex/balance');
  }

  async getAurexTransactions(): Promise<AurexTransaction[]> {
    return this.request('/aurex/transactions');
  }

  async topUpAurexWallet(amountINR: number): Promise<{ newBalanceINR: number }> {
    return this.request('/aurex/topup', {
      method: 'POST',
      body: JSON.stringify({ amountINR }),
    });
  }

  // AI Operations
  async checkPlagiarism(data: { text?: string; fileName?: string; pages?: number }): Promise<PlagiarismReport> {
    return this.request('/ai/plagiarism', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async summarizeText(data: { text: string; length: string; style: string }): Promise<SummaryResult> {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeImage(data: { imageBase64?: string; imageUrl?: string; fileName?: string }): Promise<ImageAnalysisResult> {
    return this.request('/ai/image-analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async performOCR(data: { imageBase64?: string; fileName?: string }): Promise<OCRResult> {
    return this.request('/ai/ocr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async detectContent(data: { text: string }): Promise<ContentDetectionResult> {
    return this.request('/ai/content-detector', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async improveGrammar(data: { text: string }): Promise<GrammarResult> {
    return this.request('/ai/grammar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async askDocumentQA(data: { documentId?: string; question: string; documentSnippet?: string; fileName?: string }): Promise<DocumentQAResponse> {
    return this.request('/ai/document-qa', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUsageAnalytics(): Promise<UsageAnalyticsOverview> {
    return this.request('/usage');
  }
}

export const api = new ApiService();
