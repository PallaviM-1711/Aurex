import { UserProfile, AurexWallet, AurexTransaction } from '@aurex/shared';
import bcrypt from 'bcryptjs';

export interface StoredUser extends UserProfile {
  passwordHash: string;
}

export class MockDataStore {
  private users: Map<string, StoredUser> = new Map();
  private wallets: Map<string, AurexWallet> = new Map();
  private transactions: AurexTransaction[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const demoId = 'usr_demo_01';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);

    const defaultUser: StoredUser = {
      id: demoId,
      name: 'Alex Vance',
      email: 'alex@aurex.ai',
      role: 'user',
      plan: 'aurex_payg',
      subscriptionStatus: 'active',
      subscriptionRenewsAt: '2026-11-12T00:00:00Z',
      aurexConnected: true,
      aurexWalletId: 'wal_aur_9921',
      createdAt: '2026-08-01T10:00:00Z',
      passwordHash,
    };

    const defaultWallet: AurexWallet = {
      id: 'wal_aur_9921',
      userId: demoId,
      walletAddress: '0x8F3a...4B2c',
      balanceINR: 245.60,
      currency: 'INR',
      isConnected: true,
      linkedAt: '2026-09-15T10:00:00Z',
      lastUpdated: new Date().toISOString(),
    };

    this.users.set(defaultUser.email.toLowerCase(), defaultUser);
    this.wallets.set(demoId, defaultWallet);
  }

  findUserByEmail(email: string): StoredUser | undefined {
    return this.users.get(email.toLowerCase());
  }

  findUserById(id: string): StoredUser | undefined {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return undefined;
  }

  createUser(user: StoredUser): StoredUser {
    this.users.set(user.email.toLowerCase(), user);
    
    // Auto-create wallet for user
    const wallet: AurexWallet = {
      id: `wal_${Date.now()}`,
      userId: user.id,
      walletAddress: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      balanceINR: user.plan === 'aurex_payg' ? 250.00 : 50.00,
      currency: 'INR',
      isConnected: true,
      linkedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    this.wallets.set(user.id, wallet);

    return user;
  }

  getWallet(userId: string): AurexWallet {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = {
        id: `wal_${Date.now()}`,
        userId,
        walletAddress: '0x8F3a...4B2c',
        balanceINR: 245.60,
        currency: 'INR',
        isConnected: true,
        linkedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      this.wallets.set(userId, wallet);
    }
    return wallet;
  }

  updateWalletBalance(userId: string, delta: number): AurexWallet {
    const wallet = this.getWallet(userId);
    wallet.balanceINR = Math.max(0, parseFloat((wallet.balanceINR + delta).toFixed(2)));
    wallet.lastUpdated = new Date().toISOString();
    return wallet;
  }

  recordTransaction(txn: AurexTransaction) {
    this.transactions.unshift(txn);
  }

  getTransactions(userId?: string): AurexTransaction[] {
    if (userId) {
      return this.transactions.filter((t) => t.userId === userId);
    }
    return this.transactions;
  }
}

export const mockStore = new MockDataStore();
