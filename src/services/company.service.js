const prisma = require('../config/db');

const listCompanies = async () => {
  return prisma.company.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, name: true, description: true, website: true, location: true, logo: true },
  });
};

const getCompanyById = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      jobs: {
        where: { isActive: true },
        select: { id: true, title: true, type: true, location: true, createdAt: true },
      },
    },
  });
  if (!company) {
    const err = new Error('Company not found.');
    err.statusCode = 404;
    throw err;
  }
  return company;
};

const getMyCompany = async (userId) => {
  return prisma.company.findUnique({
    where: { userId },
    include: { user: { select: { email: true } } },
  });
};

const createCompany = async (userId, data) => {
  const existing = await prisma.company.findUnique({ where: { userId } });
  if (existing) {
    const err = new Error('Company profile already exists. Use PUT to update.');
    err.statusCode = 409;
    throw err;
  }
  return prisma.company.create({ data: { userId, ...data } });
};

const updateCompany = async (userId, data) => {
  const company = await prisma.company.findUnique({ where: { userId } });
  if (!company) {
    const err = new Error('Company profile not found. Create one first.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.company.update({ where: { userId }, data });
};

module.exports = { listCompanies, getCompanyById, getMyCompany, createCompany, updateCompany };
