require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec    = require('./config/swagger');
const apiRoutes      = require('./routes/index');
const errorMiddleware = require('./middleware/error.middleware');

const passport = require('passport');
require('./config/passport');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// ─── Static File Serving (uploaded resumes) ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// // ─── Swagger Docs ─────────────────────────────────────────────────────────────
// app.use(
//   '/api/docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, {
//     customSiteTitle: 'SaaS Job Portal API Docs',
//     customCss: '.swagger-ui .topbar { background-color: #1e1e2e; }',
//     swaggerOptions: {
//       persistAuthorization: true,
//     },
//   })
// );

// // Expose raw OpenAPI JSON
// app.get('/api/docs.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 SaaS Job Portal API is running.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;


