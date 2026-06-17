const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Mount Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route simple welcome status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the Fake News & Misinformation Detection Backend API',
    documentation: '/docs'
  });
});

// Centralized Error Handler Middleware (must be after routes)
app.use(errorHandler);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app;
