const express = require('express');
const { body } = require('express-validator');
const {
  listJobs, getMyJobs, getJobById, createJob, updateJob, deleteJob,
} = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listings management
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: List all active jobs with search & filters
 *     tags: [Jobs]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, description or skills
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INTERNSHIP, FULL_TIME, PART_TIME, CONTRACT]
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: salary
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated job listings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get('/', listJobs);

/**
 * @swagger
 * /api/jobs/my:
 *   get:
 *     summary: Get jobs posted by my company (COMPANY only)
 *     tags: [Jobs]
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
 *         description: My posted jobs
 */
router.get('/my', authenticate, authorize('COMPANY'), getMyJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job details with company info
 *       404:
 *         description: Job not found
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Post a new job (COMPANY only, must be approved)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       201:
 *         description: Job posted successfully
 *       403:
 *         description: Company not approved yet
 */
router.post(
  '/',
  authenticate,
  authorize('COMPANY'),
  [
    body('title').notEmpty().withMessage('Job title is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('location').notEmpty().withMessage('Location is required.'),
    body('type')
      .isIn(['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT'])
      .withMessage('Invalid job type.'),
  ],
  createJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job (COMPANY owner only)
 *     tags: [Jobs]
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
 *             $ref: '#/components/schemas/JobInput'
 *     responses:
 *       200:
 *         description: Job updated
 *       404:
 *         description: Job not found or not your job
 */
router.put('/:id', authenticate, authorize('COMPANY'), updateJob);

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Deactivate a job (COMPANY owner only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deactivated
 *       404:
 *         description: Job not found or not your job
 */
router.delete('/:id', authenticate, authorize('COMPANY'), deleteJob);

module.exports = router;
