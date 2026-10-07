'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SubscriptionTier } from '@aurex/shared';
import { api } from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string, plan?: SubscriptionTier) => Promise<void>;
  logout: () => void;
  updatePlan: (plan: SubscriptionTier) => void;
  toggleAurexConnection: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial simulated default user if none in storage
const DEFAULT_USER: UserProfile = {
  id: 'usr_aurex_lead',
  name: 'Alex Vance',
  email: 'alex@aurex.ai',
  role: 'user',
  plan: 'aurex_payg',
  subscriptionStatus: 'active',
  subscriptionRenewsAt: '2026-11-12T00:00:00Z',
  aurexConnected: true,
  aurexWalletId: '0x8F3a...4B2c',
  createdAt: '2026-08-01T10:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('aurex_token');
      const storedUser = localStorage.getItem('aurex_user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken || 'demo_jwt_token_valid');
      } else {
        // Initialize with default Aurex user for instant demo
        setUser(DEFAULT_USER);
        setToken('demo_jwt_token_valid');
        localStorage.setItem('aurex_user', JSON.stringify(DEFAULT_USER));
        localStorage.setItem('aurex_token', 'demo_jwt_token_valid');
      }
    } catch (err) {
      console.error('Error hydrating auth state:', err);
      setUser(DEFAULT_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password = 'password123') => {
    setLoading(true);
    try {
      // Attempt backend login first
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('aurex_token', res.token);
      localStorage.setItem('aurex_user', JSON.stringify(res.user));
    } catch {
      // Demo fallback login
      const demoUser: UserProfile = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0].toUpperCase(),
      };
      setUser(demoUser);
      setToken('demo_token');
      localStorage.setItem('aurex_token', 'demo_token');
      localStorage.setItem('aurex_user', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password = 'password123', plan: SubscriptionTier = 'aurex_payg') => {
    setLoading(true);
    try {
      const res = await api.register(name, email, password, plan);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('aurex_token', res.token);
      localStorage.setItem('aurex_user', JSON.stringify(res.user));
    } catch {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role: 'user',
        plan,
        subscriptionStatus: 'active',
        aurexConnected: plan === 'aurex_payg',
        aurexWalletId: '0x99A...12F4',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      setToken('demo_token');
      localStorage.setItem('aurex_token', 'demo_token');
      localStorage.setItem('aurex_user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aurex_token');
    localStorage.removeItem('aurex_user');
  };

  const updatePlan = (newPlan: SubscriptionTier) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      plan: newPlan,
      aurexConnected: newPlan === 'aurex_payg' ? true : user.aurexConnected,
    };
    setUser(updated);
    localStorage.setItem('aurex_user', JSON.stringify(updated));
  };

  const toggleAurexConnection = () => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      aurexConnected: !user.aurexConnected,
    };
    setUser(updated);
    localStorage.setItem('aurex_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updatePlan,
        toggleAurexConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
