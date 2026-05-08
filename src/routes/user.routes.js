const express = require('express');
const { body } = require('express-validator');
const { getProfile, createProfile, updateProfile, uploadResume } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All user profile routes require SEEKER role
router.use(authenticate, authorize('SEEKER'));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Job Seeker profile management
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       404:
 *         description: Profile not found
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   post:
 *     summary: Create seeker profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       201:
 *         description: Profile created
 *       409:
 *         description: Profile already exists
 */
router.post(
  '/profile',
  [body('fullName').notEmpty().withMessage('Full name is required.')],
  createProfile
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update seeker profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/users/profile/resume:
 *   post:
 *     summary: Upload resume (PDF or Word, max 5MB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: No file or invalid file type
 */
router.post('/profile/resume', upload.single('resume'), uploadResume);

module.exports = router;
