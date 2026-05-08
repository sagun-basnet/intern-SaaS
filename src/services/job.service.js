const prisma = require('../config/db');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const listJobs = async (query) => {
  const { page, limit, search, type, location, salary } = query;
  const { skip, take, page: p, limit: l } = getPagination(page, limit);

  const where = {
    isActive: true,
    company: { status: 'APPROVED' },
    ...(search && {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { skills: { contains: search } },
      ],
    }),
    ...(type && { type }),
    ...(location && { location: { contains: location } }),
    ...(salary && { salary: { contains: salary } }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { id: true, name: true, logo: true, location: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, pagination: buildPaginationMeta(total, p, l) };
};

const getJobById = async (id) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: { id: true, name: true, logo: true, description: true, website: true, location: true },
      },
      _count: { select: { applications: true } },
    },
  });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  return job;
};

const getMyJobs = async (userId, query) => {
  const { skip, take, page: p, limit: l } = getPagination(query.page, query.limit);

  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    const err = new Error('Company profile not found.');
    err.statusCode = 404;
    throw err;
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: { companyId: company.id },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.job.count({ where: { companyId: company.id } }),
  ]);

  return { jobs, pagination: buildPaginationMeta(total, p, l) };
};

const createJob = async (userId, data) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    const err = new Error('Company profile not found. Create one first.');
    err.statusCode = 404;
    throw err;
  }
  if (company.status !== 'APPROVED') {
    const err = new Error('Your company must be approved by admin before posting jobs.');
    err.statusCode = 403;
    throw err;
  }
  return prisma.job.create({ data: { companyId: company.id, ...data } });
};

const updateJob = async (userId, jobId, data) => {
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
  return prisma.job.update({ where: { id: jobId }, data });
};

const deleteJob = async (userId, jobId) => {
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
  return prisma.job.update({ where: { id: jobId }, data: { isActive: false } });
};

module.exports = { listJobs, getJobById, getMyJobs, createJob, updateJob, deleteJob };
