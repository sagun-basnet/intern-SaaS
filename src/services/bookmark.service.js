const prisma = require('../config/db');

const addBookmark = async (userId, jobId) => {
  const job = await prisma.job.findFirst({ where: { id: jobId, isActive: true } });
  if (!job) {
    const err = new Error('Job not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.bookmark.upsert({
    where: { userId_jobId: { userId, jobId } },
    update: {},
    create: { userId, jobId },
  });
};

const removeBookmark = async (userId, jobId) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (!bookmark) {
    const err = new Error('Bookmark not found.');
    err.statusCode = 404;
    throw err;
  }
  return prisma.bookmark.delete({ where: { userId_jobId: { userId, jobId } } });
};

const getBookmarks = async (userId) => {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
    include: {
      job: {
        include: { company: { select: { id: true, name: true, logo: true } } },
      },
    },
  });
};

module.exports = { addBookmark, removeBookmark, getBookmarks };
