const applicationService = require('../services/application.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, created, paginated } = require('../utils/apiResponse');

// POST /api/applications/jobs/:jobId
const applyForJob = asyncHandler(async (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const { message } = req.body;
  const resumeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const data = await applicationService.applyForJob(req.user.id, jobId, { message, resumeUrl });
  return created(res, 'Application submitted successfully.', data);
});

// GET /api/applications/my
const getMyApplications = asyncHandler(async (req, res) => {
  const { applications, pagination } = await applicationService.getMyApplications(req.user.id, req.query);
  return paginated(res, 'Your applications fetched.', applications, pagination);
});

// GET /api/applications/jobs/:jobId
const getApplicantsForJob = asyncHandler(async (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const { applications, job, pagination } = await applicationService.getApplicantsForJob(
    req.user.id, jobId, req.query
  );
  return paginated(res, `Applicants for "${job.title}" fetched.`, applications, pagination);
});

// PUT /api/applications/:id/status
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const data = await applicationService.updateApplicationStatus(
    req.user.id, parseInt(req.params.id), status
  );
  return success(res, `Application ${status.toLowerCase()} successfully.`, data);
});

module.exports = { applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
