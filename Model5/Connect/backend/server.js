const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Import firebase admin initialized module
const admin = require('./firebaseAdmin');

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log('\n🌐 ========================================');
    console.log(`📨 ${req.method} ${req.url}`);
    console.log('🔍 Headers:', req.headers);
    console.log('========================================\n');
    next();
  });
}

const allowedOrigins = [
  'http://localhost:5173',
  'https://connect-frontend1.netlify.app'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API is running', timestamp: new Date() });
});

app.post('/api/interviews/test', (req, res) => {
  res.json({ message: 'Test route working', body: req.body });
});

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
