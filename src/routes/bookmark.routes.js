const express = require('express');
const { addBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmark.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// All bookmark routes require SEEKER role
router.use(authenticate, authorize('SEEKER'));

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Save and manage bookmarked jobs
 */

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get all saved jobs (SEEKER only)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked jobs
 */
router.get('/', getBookmarks);

/**
 * @swagger
 * /api/bookmarks/jobs/{jobId}:
 *   post:
 *     summary: Bookmark a job (SEEKER only)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Job bookmarked
 */
router.post('/jobs/:jobId', addBookmark);

/**
 * @swagger
 * /api/bookmarks/jobs/{jobId}:
 *   delete:
 *     summary: Remove a bookmark (SEEKER only)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bookmark removed
 */
router.delete('/jobs/:jobId', removeBookmark);

module.exports = router;
