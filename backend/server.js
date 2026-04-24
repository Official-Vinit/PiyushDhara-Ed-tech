const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!MONGO_URI) {
  console.error('Missing required environment variable: MONGO_URI');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.warn('ADMIN_USERNAME or ADMIN_PASSWORD is missing. Admin login will fail until these are configured.');
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --- Define API Routes ---
app.use('/api', require('./routes/api'));

// Health/info endpoint
app.get('/', (req, res) => {
  res.send('PiyushDhara API is running!');
});

app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ msg: 'CORS policy rejected this origin.' });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({ msg: 'Internal server error' });
});

async function startServer() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (err) {
    console.error('Error while closing MongoDB connection:', err);
  }
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

startServer();