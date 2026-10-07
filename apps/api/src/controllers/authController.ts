import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockStore, StoredUser } from '../config/mockStore';

const JWT_SECRET = process.env.JWT_SECRET || 'aurex_super_secret_jwt_key_9999';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, plan = 'aurex_payg' } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const existing = mockStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'password123', salt);

    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'user',
      plan,
      subscriptionStatus: 'active',
      subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      aurexConnected: plan === 'aurex_payg',
      aurexWalletId: `wal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    mockStore.createUser(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const { passwordHash: _, ...userProfile } = newUser;
    return res.status(201).json({ user: userProfile, token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    let user = mockStore.findUserByEmail(email);

    // In demo mode, auto-create if not found to enable quick demonstration
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password || 'password123', salt);
      user = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: email.toLowerCase(),
        role: 'user',
        plan: 'aurex_payg',
        subscriptionStatus: 'active',
        aurexConnected: true,
        aurexWalletId: `wal_${Date.now()}`,
        createdAt: new Date().toISOString(),
        passwordHash,
      };
      mockStore.createUser(user);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const { passwordHash: _, ...userProfile } = user;
    return res.status(200).json({ user: userProfile, token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Server error during login.' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || 'usr_demo_01';
    const user = mockStore.findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { passwordHash: _, ...userProfile } = user;
    return res.status(200).json(userProfile);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Server error fetching profile.' });
  }
};
