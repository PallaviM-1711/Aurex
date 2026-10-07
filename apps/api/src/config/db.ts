import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurex_ai';

  try {
    // Attempt Mongoose connection with 3-second timeout so it doesn't hang if Mongo isn't running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('📦 [Database] Connected successfully to MongoDB:', uri);
  } catch (err: any) {
    console.warn('⚠️ [Database] MongoDB connection failed or not running:', err.message);
    console.log('💡 [Database] Running in In-Memory / Resilient Fallback Mode. All operations will succeed seamlessly.');
    isConnected = false;
  }
};

export const isDbConnected = () => isConnected;
