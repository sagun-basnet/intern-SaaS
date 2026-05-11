const prisma = require('../config/db');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const notificationService = require('./notification.service');

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
  
  const application = await prisma.application.create({ 
    data: { userId, jobId, message, resumeUrl },
    include: { user: { select: { profile: { select: { fullName: true } } } }, job: { select: { title: true, company: { select: { userId: true, name: true } } } } }
  });

  // Notify Company
  await notificationService.createNotification({
    userId: application.job.company.userId,
    title: 'New Job Application',
    message: `${application.user.profile?.fullName || 'A candidate'} applied for ${application.job.title}`,
    type: 'NEW_APPLICATION'
  });

  return application;
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
  
  const updatedApplication = await prisma.application.update({ 
    where: { id: applicationId }, 
    data: { status },
    include: { job: { select: { title: true } } }
  });

  // Notify Seeker
  await notificationService.createNotification({
    userId: updatedApplication.userId,
    title: 'Application Status Updated',
    message: `Your application for ${updatedApplication.job.title} has been ${status.toLowerCase()}`,
    type: 'APPLICATION_STATUS_UPDATE'
  });

  return updatedApplication;
};

module.exports = { applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
