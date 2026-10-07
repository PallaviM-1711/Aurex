import {
  AurexWallet,
  AurexEstimateResponse,
  AurexPaymentResponse,
  AurexTransaction,
  AIRequestType,
  UsageMetric,
} from '@aurex/shared';

export interface AurexPaymentProvider {
  getWallet(userId: string): Promise<AurexWallet>;
  estimateCost(userId: string, serviceType: AIRequestType, usageMetric: UsageMetric): Promise<AurexEstimateResponse>;
  executePayment(userId: string, quoteId: string, serviceType: AIRequestType, amountINR: number): Promise<AurexPaymentResponse>;
  getTransactions(userId: string): Promise<AurexTransaction[]>;
  topUpWallet(userId: string, amountINR: number): Promise<{ newBalanceINR: number }>;
}
