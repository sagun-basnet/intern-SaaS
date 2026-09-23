require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;

// Create HTTP server & initialize Socket.IO
const server = http.createServer(app);
initSocket(server);

// Start server when executed directly (or locally)
if (require.main === module || !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

// Vercel serverless export
module.exports = (req, res) => app(req, res);

