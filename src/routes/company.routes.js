const express = require('express');
const { body } = require('express-validator');
const {
  listCompanies, getCompanyById, getMyCompany, createCompany, updateCompany,
} = require('../controllers/company.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company profile management
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: List all approved companies
 *     tags: [Companies]
 *     security: []
 *     responses:
 *       200:
 *         description: List of approved companies
 */
router.get('/', listCompanies);

/**
 * @swagger
 * /api/companies/my:
 *   get:
 *     summary: Get my company profile (COMPANY only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile
 *       404:
 *         description: Profile not found
 */
router.get('/my', authenticate, authorize('COMPANY'), getMyCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Get company by ID (with active jobs)
 *     tags: [Companies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */
router.get('/:id', getCompanyById);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Create company profile (COMPANY only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       201:
 *         description: Company created, pending approval
 *       409:
 *         description: Company already exists
 */
router.post(
  '/',
  authenticate,
  authorize('COMPANY'),
  [body('name').notEmpty().withMessage('Company name is required.')],
  createCompany
);

/**
 * @swagger
 * /api/companies:
 *   put:
 *     summary: Update company profile (COMPANY only)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyInput'
 *     responses:
 *       200:
 *         description: Company updated
 */
router.put('/', authenticate, authorize('COMPANY'), updateCompany);

module.exports = router;
