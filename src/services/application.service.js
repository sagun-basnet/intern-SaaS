const prisma = require('../config/db');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const applyForJob = async (userId, jobId, { message, resumeUrl }) => {
  const job = await prisma.job.findFirst({ where: { id: jobId, isActive: true } });
  if (!job) {
    const err = new Error('Job not found or is no longer active.');
    err.statusCode = 404;
    throw err;
  }
  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) {
    const err = new Error('You have already applied for this job.');
    err.statusCode = 409;
    throw err;
  }
  return prisma.application.create({ data: { userId, jobId, message, resumeUrl } });
};

const getMyApplications = async (userId, query) => {
  const { skip, take, page, limit } = getPagination(query.page, query.limit);
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true, title: true, type: true, location: true,
            company: { select: { id: true, name: true, logo: true } },
          },
        },
      },
    }),
    prisma.application.count({ where: { userId } }),
  ]);
  return { applications, pagination: buildPaginationMeta(total, page, limit) };
};

const getApplicantsForJob = async (userId, jobId, query) => {
  const { skip, take, page, limit } = getPagination(query.page, query.limit);

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    const err = new Error('Company profile not found.');
    err.statusCode = 404;
    throw err;
  }
  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) {
    const err = new Error('Job not found or you do not own this job.');
    err.statusCode = 404;
    throw err;
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { jobId },
      skip,
      take,
      orderBy: { appliedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true, email: true,
            profile: { select: { fullName: true, skills: true, resumeUrl: true, phone: true } },
          },
        },
      },
    }),
    prisma.application.count({ where: { jobId } }),
  ]);

  return { applications, job, pagination: buildPaginationMeta(total, page, limit) };
};

const updateApplicationStatus = async (userId, applicationId, status) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    const err = new Error('Company profile not found.');
    err.statusCode = 404;
    throw err;
  }
  const application = await prisma.application.findFirst({
    where: { id: applicationId, job: { companyId: company.id } },
  });
  if (!application) {
    const err = new Error('Application not found or access denied.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.application.update({ where: { id: applicationId }, data: { status } });
};

module.exports = { applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
