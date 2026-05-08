const userService = require('../services/user.service');
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

// GET /api/users/profile
const getProfile = asyncHandler(async (req, res) => {
  const data = await userService.getProfile(req.user.id);
  if (!data) return error(res, 'Profile not found. Please create one.', 404);
  return success(res, 'Profile fetched.', data);
});

// POST /api/users/profile
const createProfile = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await userService.createProfile(req.user.id, req.body);
  return created(res, 'Profile created successfully.', data);
});

// PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await userService.updateProfile(req.user.id, req.body);
  return success(res, 'Profile updated successfully.', data);
});

// POST /api/users/profile/resume
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return error(res, 'No file uploaded.', 400);
  const resumeUrl = `/uploads/${req.file.filename}`;
  const data = await userService.updateResume(req.user.id, resumeUrl);
  return success(res, 'Resume uploaded successfully.', { resumeUrl, profile: data });
});

module.exports = { getProfile, createProfile, updateProfile, uploadResume };
