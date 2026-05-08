const companyService = require('../services/company.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, error } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error(res, 'Validation failed.', 422, errors.array());
    return false;
  }
  return true;
};

// GET /api/companies
const listCompanies = asyncHandler(async (req, res) => {
  const data = await companyService.listCompanies();
  return success(res, 'Companies fetched.', data);
});

// GET /api/companies/:id
const getCompanyById = asyncHandler(async (req, res) => {
  const data = await companyService.getCompanyById(parseInt(req.params.id));
  return success(res, 'Company fetched.', data);
});

// GET /api/companies/my
const getMyCompany = asyncHandler(async (req, res) => {
  const data = await companyService.getMyCompany(req.user.id);
  if (!data) return error(res, 'Company profile not found. Create one first.', 404);
  return success(res, 'Your company profile fetched.', data);
});

// POST /api/companies
const createCompany = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await companyService.createCompany(req.user.id, req.body);
  return created(res, 'Company profile created. Awaiting admin approval.', data);
});

// PUT /api/companies
const updateCompany = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await companyService.updateCompany(req.user.id, req.body);
  return success(res, 'Company profile updated.', data);
});

module.exports = { listCompanies, getCompanyById, getMyCompany, createCompany, updateCompany };
