const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fintrack';
    
    try {
      // Fast timeout to quickly fallback if not running
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
      if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
         console.warn(`⚠️ Local MongoDB connection failed. Starting in-memory MongoDB for testing...`);
         const mongoServer = await MongoMemoryServer.create();
         const memoryUri = mongoServer.getUri();
         await mongoose.connect(memoryUri);
         console.log(`✅ In-memory MongoDB connected: ${memoryUri}`);
         return;
      }
      throw err;
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
