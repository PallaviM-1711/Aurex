'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AurexWallet,
  AurexEstimateResponse,
  AurexPaymentResponse,
  AIRequestType,
  UsageMetric,
} from '@aurex/shared';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface AurexContextType {
  wallet: AurexWallet | null;
  balanceINR: number;
  isOpenModal: boolean;
  isConfirming: boolean;
  currentEstimate: AurexEstimateResponse | null;
  paymentState: 'idle' | 'estimating' | 'confirming' | 'processing' | 'success' | 'failed';
  lastTransaction: AurexPaymentResponse | null;
  requirePayment: (serviceType: AIRequestType, usageMetric: UsageMetric) => Promise<boolean>;
  confirmPayment: () => Promise<void>;
  cancelPayment: () => void;
  topUpWallet: (amount: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const AurexContext = createContext<AurexContextType | undefined>(undefined);

export const AurexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<AurexWallet | null>(null);
  const [balanceINR, setBalanceINR] = useState<number>(245.60);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [currentEstimate, setCurrentEstimate] = useState<AurexEstimateResponse | null>(null);
  const [paymentState, setPaymentState] = useState<'idle' | 'estimating' | 'confirming' | 'processing' | 'success' | 'failed'>('idle');
  const [lastTransaction, setLastTransaction] = useState<AurexPaymentResponse | null>(null);

  // Promise resolver for the confirmation workflow
  const [pendingResolver, setPendingResolver] = useState<((val: boolean) => void) | null>(null);

  const refreshBalance = async () => {
    try {
      const data = await api.getAurexWallet();
      setWallet(data);
      setBalanceINR(data.balanceINR);
    } catch {
      const savedBal = localStorage.getItem('aurex_wallet_balance');
      const val = savedBal ? parseFloat(savedBal) : 245.60;
      setBalanceINR(val);
      setWallet({
        id: 'wal_aur_live_01',
        userId: user?.id || 'usr_demo',
        walletAddress: '0x8F3a...4B2c',
        balanceINR: val,
        currency: 'INR',
        isConnected: true,
        linkedAt: '2026-09-15T00:00:00Z',
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [user]);

  /**
   * Main gatekeeper for any AI operation.
   * If user has Pro or Yearly plan, bypasses micro-payment.
   * If user is on Free or Aurex Pay-Per-Use, triggers the estimation & confirmation modal.
   */
  const requirePayment = async (serviceType: AIRequestType, usageMetric: UsageMetric): Promise<boolean> => {
    // If user has active Pro or Yearly subscription, allow immediately
    if (user?.plan === 'pro' || user?.plan === 'yearly') {
      return true;
    }

    setPaymentState('estimating');
    try {
      const estimate = await api.estimateAurexCost(serviceType, usageMetric);
      setCurrentEstimate(estimate);
      setIsOpenModal(true);
      setPaymentState('confirming');

      return new Promise<boolean>((resolve) => {
        setPendingResolver(() => resolve);
      });
    } catch (err) {
      console.error('Failed to estimate Aurex cost:', err);
      setPaymentState('idle');
      return false;
    }
  };

  const confirmPayment = async () => {
    if (!currentEstimate) return;
    setPaymentState('processing');
    setIsConfirming(true);

    try {
      const result = await api.executeAurexPayment(
        currentEstimate.quoteId,
        currentEstimate.serviceType,
        currentEstimate.estimatedCostINR
      );

      setLastTransaction(result);
      setBalanceINR(result.remainingBalanceINR);
      setPaymentState('success');

      // Wait a moment so user sees the "Payment Successful ✓" banner
      setTimeout(() => {
        setIsOpenModal(false);
        setPaymentState('idle');
        setIsConfirming(false);
        if (pendingResolver) {
          pendingResolver(true);
          setPendingResolver(null);
        }
      }, 1200);
    } catch (err) {
      console.error('Aurex payment execution failed:', err);
      setPaymentState('failed');
      setIsConfirming(false);
    }
  };

  const cancelPayment = () => {
    setIsOpenModal(false);
    setPaymentState('idle');
    setIsConfirming(false);
    if (pendingResolver) {
      pendingResolver(false);
      setPendingResolver(null);
    }
  };

  const topUpWallet = async (amount: number) => {
    const updated = balanceINR + amount;
    setBalanceINR(updated);
    localStorage.setItem('aurex_wallet_balance', updated.toFixed(2));
    if (wallet) {
      setWallet({ ...wallet, balanceINR: updated });
    }
  };

  return (
    <AurexContext.Provider
      value={{
        wallet,
        balanceINR,
        isOpenModal,
        isConfirming,
        currentEstimate,
        paymentState,
        lastTransaction,
        requirePayment,
        confirmPayment,
        cancelPayment,
        topUpWallet,
        refreshBalance,
      }}
    >
      {children}
    </AurexContext.Provider>
  );
};

export const useAurex = () => {
  const context = useContext(AurexContext);
  if (!context) {
    throw new Error('useAurex must be used within an AurexProvider');
  }
  return context;
};
