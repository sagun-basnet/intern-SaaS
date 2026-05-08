const prisma = require('../config/db');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const getPendingCompanies = async (query) => {
  const { skip, take, page, limit } = getPagination(query.page, query.limit);
  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where: { status: 'PENDING' },
      skip,
      take,
      include: { user: { select: { email: true, createdAt: true } } },
    }),
    prisma.company.count({ where: { status: 'PENDING' } }),
  ]);
  return { companies, pagination: buildPaginationMeta(total, page, limit) };
};

const updateCompanyStatus = async (companyId, status) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) {
    const err = new Error('Company not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.company.update({ where: { id: companyId }, data: { status } });
};

const getAllUsers = async (query) => {
  const { skip, take, page, limit } = getPagination(query.page, query.limit);
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      select: {
        id: true, email: true, role: true, isActive: true, createdAt: true,
        profile: { select: { fullName: true } },
        company: { select: { name: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);
  return { users, pagination: buildPaginationMeta(total, page, limit) };
};

const deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.user.delete({ where: { id: userId } });
};

const getAllJobs = async (query) => {
  const { skip, take, page, limit } = getPagination(query.page, query.limit);
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      skip,
      take,
      include: {
        company: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.count(),
  ]);
  return { jobs, pagination: buildPaginationMeta(total, page, limit) };
};

const deleteJob = async (jobId) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.job.delete({ where: { id: jobId } });
};

const getPlatformStats = async () => {
  const [
    totalUsers, totalSeekers, totalCompanies,
    pendingCompanies, approvedCompanies,
    totalJobs, activeJobs, totalApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SEEKER' } }),
    prisma.user.count({ where: { role: 'COMPANY' } }),
    prisma.company.count({ where: { status: 'PENDING' } }),
    prisma.company.count({ where: { status: 'APPROVED' } }),
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.application.count(),
  ]);
  return {
    users: { total: totalUsers, seekers: totalSeekers, companies: totalCompanies },
    companies: { pending: pendingCompanies, approved: approvedCompanies },
    jobs: { total: totalJobs, active: activeJobs },
    applications: { total: totalApplications },
  };
};

module.exports = {
  getPendingCompanies, updateCompanyStatus,
  getAllUsers, deleteUser,
  getAllJobs, deleteJob,
  getPlatformStats,
};
