require('dotenv').config();
const app = require('./src/app');

// Vercel expects a function (req, res) => {}. Forward to the Express app.
module.exports = (req, res) => app(req, res);
