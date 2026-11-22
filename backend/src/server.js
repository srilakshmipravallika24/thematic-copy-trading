const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB, getDbStatus } = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const copyRoutes = require('./routes/copyRoutes');
const socialRoutes = require('./routes/socialRoutes');
const riaRoutes = require('./routes/riaRoutes');

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Connect to Database (with graceful memory fallback)
connectDB();

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Thematic Social Copy-Trading Network (Regulated RIA Edition)',
    version: '1.0.0 - Production MVP',
    mongoStatus: getDbStatus() ? 'CONNECTED' : 'STANDBY_MOCK_STORE',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/copy', copyRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/ria', riaRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 RIA Thematic Copy-Trading Backend Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Portfolios API: http://localhost:${PORT}/api/portfolios`);
    console.log(`💬 Social API: http://localhost:${PORT}/api/social`);
    console.log(`📈 Copy-Trading API: http://localhost:${PORT}/api/copy/preview`);
    console.log(`====================================================`);
  });
}

module.exports = app;
