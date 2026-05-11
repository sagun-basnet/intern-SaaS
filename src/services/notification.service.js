const prisma = require('../config/db');
const { sendToUser } = require('../config/socket');

/**
 * Create a new notification and send it to the user in real-time
 * @param {Object} data - Notification data
 * @param {number} data.userId - Recipient user ID
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.type - Notification type (e.g., 'APPLICATION_UPDATE')
 */
const createNotification = async ({ userId, title, message, type }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // Send real-time notification via Socket.io
    sendToUser(userId, 'notification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

const getNotificationsByUserId = async (userId, limit = 20) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

const markAsRead = async (notificationId, userId) => {
  return await prisma.notification.update({
    where: { 
      id: parseInt(notificationId),
      userId: userId // Security check
    },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  markAllAsRead,
};
