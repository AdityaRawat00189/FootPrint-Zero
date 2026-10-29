import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import exposureRoutes from './routes/exposureRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import brokerRoutes from './routes/brokerRoutes.js';
import { initFollowupCron } from './services/cronService.js';

process.on('unhandledRejection', (reason) => {
  console.error('[ServerError] Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[ServerError] Uncaught Exception:', err);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Daily Follow-up Cron
initFollowupCron();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Database readiness check middleware for API requests (excluding health check)
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or unreachable. In MongoDB Atlas, verify your IP is whitelisted under Network Access (0.0.0.0/0).',
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exposures', exposureRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/brokers', brokerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FootprintZero Backend',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'FootprintZero API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[FootprintZero Server] Listening on port ${PORT}`);
});

