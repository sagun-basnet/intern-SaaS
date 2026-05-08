const express = require('express');

const authRoutes        = require('./auth.routes');
const userRoutes        = require('./user.routes');
const companyRoutes     = require('./company.routes');
const jobRoutes         = require('./job.routes');
const applicationRoutes = require('./application.routes');
const bookmarkRoutes    = require('./bookmark.routes');
const adminRoutes       = require('./admin.routes');

const router = express.Router();

router.use('/auth',         authRoutes);
router.use('/users',        userRoutes);
router.use('/companies',    companyRoutes);
router.use('/jobs',         jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/bookmarks',    bookmarkRoutes);
router.use('/admin',        adminRoutes);

module.exports = router;
