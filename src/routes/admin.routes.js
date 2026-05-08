const express = require('express');
const { body } = require('express-validator');
const {
  getPendingCompanies, approveCompany, rejectCompany,
  getAllUsers, deleteUser,
  getAllJobs, deleteJob,
  getPlatformStats,
} = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel — platform management
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform stats (users, companies, jobs, applications)
 */
router.get('/stats', getPlatformStats);

/**
 * @swagger
 * /api/admin/companies/pending:
 *   get:
 *     summary: List all pending company approvals
 *     tags: [Admin]
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
 *         description: Paginated pending companies
 */
router.get('/companies/pending', getPendingCompanies);

/**
 * @swagger
 * /api/admin/companies/{id}/approve:
 *   put:
 *     summary: Approve a company
 *     tags: [Admin]
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
 *         description: Company approved
 *       404:
 *         description: Company not found
 */
router.put('/companies/:id/approve', approveCompany);

/**
 * @swagger
 * /api/admin/companies/{id}/reject:
 *   put:
 *     summary: Reject a company
 *     tags: [Admin]
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
 *         description: Company rejected
 */
router.put('/companies/:id/reject', rejectCompany);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
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
 *         description: Paginated users list
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/jobs:
 *   get:
 *     summary: List all jobs (including inactive)
 *     tags: [Admin]
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
 *         description: Paginated jobs list
 */
router.get('/jobs', getAllJobs);

/**
 * @swagger
 * /api/admin/jobs/{id}:
 *   delete:
 *     summary: Hard delete a job (spam/fake removal)
 *     tags: [Admin]
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
 *         description: Job removed
 *       404:
 *         description: Job not found
 */
router.delete('/jobs/:id', deleteJob);

module.exports = router;
