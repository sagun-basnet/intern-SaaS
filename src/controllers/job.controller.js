const jobService = require('../services/job.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, paginated, error } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error(res, 'Validation failed.', 422, errors.array());
    return false;
  }
  return true;
};

// GET /api/jobs
const listJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.listJobs(req.query);
  return paginated(res, 'Jobs fetched.', jobs, pagination);
});

// GET /api/jobs/my
const getMyJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await jobService.getMyJobs(req.user.id, req.query);
  return paginated(res, 'Your posted jobs fetched.', jobs, pagination);
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const data = await jobService.getJobById(parseInt(req.params.id));
  return success(res, 'Job fetched.', data);
});

// POST /api/jobs
const createJob = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await jobService.createJob(req.user.id, req.body);
  return created(res, 'Job posted successfully.', data);
});

// PUT /api/jobs/:id
const updateJob = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const data = await jobService.updateJob(req.user.id, parseInt(req.params.id), req.body);
  return success(res, 'Job updated successfully.', data);
});

// DELETE /api/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.user.id, parseInt(req.params.id));
  return success(res, 'Job deactivated successfully.');
});

module.exports = { listJobs, getMyJobs, getJobById, createJob, updateJob, deleteJob };
