const express = require('express');
const passport = require('passport');
const { body } = require('express-validator');
const { 
  register, 
  verifyOTP, 
  resendOTP, 
  login, 
  getMe, 
  googleAuthCallback 
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and send OTP
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       409:
 *         description: Email already registered
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('role').isIn(['SEEKER', 'COMPANY']).withMessage('Role must be SEEKER or COMPANY.'),
  ],
  register
);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and activate account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: Account verified successfully
 */
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
  ],
  verifyOTP
);

/**
 * @swagger
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
router.post(
  '/resend-otp',
  [body('email').isEmail().withMessage('Valid email is required.')],
  resendOTP
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not verified or deactivated
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info with profile/company
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getMe);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     description: Redirects the user to the Google login page.
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback URL
 *     description: Handles the redirect from Google, authenticates the user, and redirects to the frontend with a JWT token.
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to frontend with JWT token
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuthCallback
);

module.exports = router;
