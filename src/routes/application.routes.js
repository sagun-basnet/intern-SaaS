const express = require('express');
const { body } = require('express-validator');
const {
  applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus,
} = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

/**
 * @swagger
 * /api/applications/my:
 *   get:
 *     summary: Get my applications with status (SEEKER only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of applications with job and company info
 */
router.get('/my', authenticate, authorize('SEEKER'), getMyApplications);

/**
 * @swagger
 * /api/applications/jobs/{jobId}:
 *   post:
 *     summary: Apply for a job (SEEKER only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Cover letter / message
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Optional resume upload (overrides profile resume)
 *     responses:
 *       201:
 *         description: Application submitted
 *       409:
 *         description: Already applied
 *       404:
 *         description: Job not found or inactive
 */
router.post(
  '/jobs/:jobId',
  authenticate,
  authorize('SEEKER'),
  upload.single('resume'),
  applyForJob
);

/**
 * @swagger
 * /api/applications/jobs/{jobId}:
 *   get:
 *     summary: Get all applicants for a job (COMPANY only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of applicants
 *       403:
 *         description: Not your job
 */
router.get('/jobs/:jobId', authenticate, authorize('COMPANY'), getApplicantsForJob);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     summary: Accept or reject an application (COMPANY only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Application status updated
 *       404:
 *         description: Application not found or access denied
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('COMPANY'),
  [
    body('status')
      .isIn(['ACCEPTED', 'REJECTED'])
      .withMessage('Status must be ACCEPTED or REJECTED.'),
  ],
  updateApplicationStatus
);

module.exports = router;
