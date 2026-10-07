import { AurexPaymentProvider } from './AurexPaymentProvider';
import {
  AurexWallet,
  AurexEstimateResponse,
  AurexPaymentResponse,
  AurexTransaction,
  AIRequestType,
  UsageMetric,
  DEFAULT_PRICING_RULES,
} from '@aurex/shared';
import { mockStore } from '../config/mockStore';

export class MockAurexProvider implements AurexPaymentProvider {
  async getWallet(userId: string): Promise<AurexWallet> {
    return mockStore.getWallet(userId);
  }

  async estimateCost(
    userId: string,
    serviceType: AIRequestType,
    usageMetric: UsageMetric
  ): Promise<AurexEstimateResponse> {
    const rule = DEFAULT_PRICING_RULES[serviceType] || DEFAULT_PRICING_RULES.summarizer;
    let calculated = 0;

    if (rule.unit === 'page') {
      calculated = (usageMetric.pages || 1) * rule.rateINR;
    } else if (rule.unit === 'word') {
      calculated = ((usageMetric.words || 500) / rule.unitMultiplier) * rule.rateINR;
    } else if (rule.unit === 'image') {
      calculated = (usageMetric.images || 1) * rule.rateINR;
    } else if (rule.unit === 'token') {
      calculated = ((usageMetric.tokens || 1000) / rule.unitMultiplier) * rule.rateINR;
    } else {
      calculated = rule.rateINR;
    }

    const estimatedCostINR = Math.max(rule.minChargeINR, parseFloat(calculated.toFixed(2)));
    const wallet = mockStore.getWallet(userId);
    const hasSufficient = wallet.balanceINR >= estimatedCostINR;

    return {
      serviceType,
      serviceName: rule.displayName,
      usageMetric,
      unitDescription: `${rule.rateINR} INR per ${rule.unitMultiplier > 1 ? rule.unitMultiplier + ' ' : ''}${rule.unit}`,
      estimatedCostINR,
      currentWalletBalanceINR: wallet.balanceINR,
      hasSufficientBalance: hasSufficient,
      shortfallINR: hasSufficient ? 0 : parseFloat((estimatedCostINR - wallet.balanceINR).toFixed(2)),
      requiresPayment: true,
      coveredBySubscription: false,
      quoteId: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  async executePayment(
    userId: string,
    quoteId: string,
    serviceType: AIRequestType,
    amountINR: number
  ): Promise<AurexPaymentResponse> {
    const wallet = mockStore.getWallet(userId);
    if (wallet.balanceINR < amountINR) {
      throw new Error(`Insufficient Aurex balance. Required: ₹${amountINR}, Available: ₹${wallet.balanceINR}`);
    }

    // Deduct amount
    const updatedWallet = mockStore.updateWalletBalance(userId, -amountINR);
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const rule = DEFAULT_PRICING_RULES[serviceType] || DEFAULT_PRICING_RULES.summarizer;
    const txn: AurexTransaction = {
      id: `txn_${Date.now()}`,
      userId,
      serviceType,
      serviceName: rule.displayName,
      usageDetails: `Aurex micro-settlement for ${rule.displayName}`,
      usageMetric: { words: 1000 },
      amountINR,
      status: 'completed',
      transactionId: txnId,
      createdAt: new Date().toISOString(),
    };
    mockStore.recordTransaction(txn);

    return {
      success: true,
      transactionId: txnId,
      amountINR,
      serviceType,
      remainingBalanceINR: updatedWallet.balanceINR,
      timestamp: new Date().toISOString(),
      message: 'Aurex micro-transaction confirmed and debited successfully.',
    };
  }

  async getTransactions(userId: string): Promise<AurexTransaction[]> {
    return mockStore.getTransactions(userId);
  }

  async topUpWallet(userId: string, amountINR: number): Promise<{ newBalanceINR: number }> {
    const updated = mockStore.updateWalletBalance(userId, amountINR);
    return { newBalanceINR: updated.balanceINR };
  }
}

export const aurexProvider = new MockAurexProvider();
