const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');

dotenv.config();

const app = express();

// CRITICAL: Log every single request (only in development)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log('\n🌐 ========================================');
    console.log(`📨 ${req.method} ${req.url}`);
    console.log('🔍 Headers:', req.headers);
    console.log('========================================\n');
    next();
  });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  console.log('✅ Health check route hit');
  res.json({ message: 'API is running', timestamp: new Date() });
});

// Test route
app.post('/api/interviews/test', (req, res) => {
  console.log('✅ Test route hit!');
  console.log('Body:', req.body);
  res.status(200).json({ message: 'Test route working', body: req.body });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

// connect to database and start server ONLY if not in test mode
const startServer = async () => {
  try {
    // connect to database
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
    }

    // Start server only if not testing
    if (process.env.NODE_ENV !== 'test') {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log('\n🚀 =================================');
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('=================================\n');
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if not being required by tests
if (require.main === module) {
  startServer();
}

// Export app for testing
module.exports = app;
