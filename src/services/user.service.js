const prisma = require('../config/db');

const getProfile = async (userId) => {
  return prisma.profile.findUnique({
    where: { userId },
    include: { user: { select: { email: true, role: true } } },
  });
};

const createProfile = async (userId, data) => {
  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (existing) {
    const err = new Error('Profile already exists. Use PUT to update.');
    err.statusCode = 409;
    throw err;
  }
  return prisma.profile.create({ data: { userId, ...data } });
};

const updateProfile = async (userId, data) => {
  return prisma.profile.update({ where: { userId }, data });
};

const updateResume = async (userId, resumeUrl) => {
  return prisma.profile.upsert({
    where: { userId },
    update: { resumeUrl },
    create: { userId, fullName: 'Unnamed', resumeUrl },
  });
};

module.exports = { getProfile, createProfile, updateProfile, updateResume };
