const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/apiResponse');

// GET /api/admin/companies/pending
const getPendingCompanies = asyncHandler(async (req, res) => {
  const { companies, pagination } = await adminService.getPendingCompanies(req.query);
  return paginated(res, 'Pending companies fetched.', companies, pagination);
});

// PUT /api/admin/companies/:id/approve
const approveCompany = asyncHandler(async (req, res) => {
  const data = await adminService.updateCompanyStatus(parseInt(req.params.id), 'APPROVED');
  return success(res, 'Company approved successfully.', data);
});

// PUT /api/admin/companies/:id/reject
const rejectCompany = asyncHandler(async (req, res) => {
  const data = await adminService.updateCompanyStatus(parseInt(req.params.id), 'REJECTED');
  return success(res, 'Company rejected.', data);
});

// GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await adminService.getAllUsers(req.query);
  return paginated(res, 'Users fetched.', users, pagination);
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(parseInt(req.params.id));
  return success(res, 'User deleted successfully.');
});

// GET /api/admin/jobs
const getAllJobs = asyncHandler(async (req, res) => {
  const { jobs, pagination } = await adminService.getAllJobs(req.query);
  return paginated(res, 'All jobs fetched.', jobs, pagination);
});

// DELETE /api/admin/jobs/:id
const deleteJob = asyncHandler(async (req, res) => {
  await adminService.deleteJob(parseInt(req.params.id));
  return success(res, 'Job removed successfully.');
});

// GET /api/admin/stats
const getPlatformStats = asyncHandler(async (req, res) => {
  const data = await adminService.getPlatformStats();
  return success(res, 'Platform statistics fetched.', data);
});

module.exports = {
  getPendingCompanies, approveCompany, rejectCompany,
  getAllUsers, deleteUser,
  getAllJobs, deleteJob,
  getPlatformStats,
};
