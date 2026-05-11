require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');

const http = require('http');
const { initSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    // Initialize Socket.io
    initSocket(server);
    console.log('✅ Socket.io initialized.');

    server.listen(PORT, () => {
      console.log('');
      console.log('🚀 ==========================================');
      console.log(`   SaaS Job & Internship Portal API`);
      console.log('   ==========================================');
      console.log(`   Server   : http://localhost:${PORT}`);
      console.log(`   API Docs : http://localhost:${PORT}/api/docs`);
      console.log(`   Health   : http://localhost:${PORT}/health`);
      console.log(`   Env      : ${process.env.NODE_ENV}`);
      console.log('🚀 ==========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
