const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    // Only listen if not in a Vercel environment
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 FinTrack AI server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
