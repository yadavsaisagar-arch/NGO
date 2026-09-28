require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const { seedInitialAdmin } = require('./controllers/authController');

// Connect to Database
connectDB().then(async () => {
  await seedInitialAdmin();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`[Server] NGO Disaster Response API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] Closed remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}).catch((err) => {
  console.error('[Fatal Error] Failed to start server:', err);
  process.exit(1);
});
