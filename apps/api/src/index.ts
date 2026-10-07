import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import aurexRoutes from './routes/aurexRoutes';
import aiRoutes from './routes/aiRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import usageRoutes from './routes/usageRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Aurex AI Platform Engine',
    version: '1.0.0',
    aurexGateway: 'active',
    timestamp: new Date().toISOString(),
  });
});

// Mount Platform API Routes
app.use('/api/auth', authRoutes);
app.use('/api/aurex', aurexRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Bootstrap Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Aurex AI Platform API running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}/api/health`);
    console.log(`💳 Aurex Micro-Billing Protocol Gateway: ACTIVE`);
    console.log(`==================================================\n`);
  });
};

startServer();
