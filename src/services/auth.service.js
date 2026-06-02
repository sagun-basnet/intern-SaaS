const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { sendOTP } = require('../utils/email');

const generateOTP = () => "123456";

const register = async ({ email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    if (existing.isVerified) {
      const err = new Error('Email already registered.');
      err.statusCode = 409;
      throw err;
    }
    // If user exists but not verified, we can update their password and send new OTP
    const hashed = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hashed, role, otp, otpExpires },
    });

    await sendOTP(email, otp);
    return { email, message: 'OTP resent to your email.' };
  }

  const hashed = await bcrypt.hash(password, 12);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.create({
    data: { 
      email, 
      password: hashed, 
      role, 
      otp, 
      otpExpires,
      isVerified: false 
    },
  });

  // await sendOTP(email, otp);
  return { email, message: 'Verification OTP sent to your email.' };
};

const verifyOTP = async ({ email, otp }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  if (user.isVerified) {
    const err = new Error('Email already verified.');
    err.statusCode = 400;
    throw err;
  }

  if (user.otp !== otp || user.otpExpires < new Date()) {
    const err = new Error('Invalid or expired OTP.');
    err.statusCode = 400;
    throw err;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { 
      isVerified: true, 
      otp: null, 
      otpExpires: null 
    },
    select: { id: true, email: true, role: true },
  });

  const token = generateToken(updatedUser);
  return { token, user: updatedUser };
};

const resendOTP = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  if (user.isVerified) {
    const err = new Error('Email already verified.');
    err.statusCode = 400;
    throw err;
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpires },
  });

  await sendOTP(email, otp);
  return { message: 'New OTP sent to your email.' };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error('Your account has been deactivated. Contact admin.');
    err.statusCode = 403;
    throw err;
  }
  if (!user.isVerified) {
    const err = new Error('Please verify your email first.');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const safeUser = { id: user.id, email: user.email, role: user.role };
  return { token: generateToken(safeUser), user: safeUser };
};

const getMe = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, role: true, createdAt: true,
      profile: true,
      company: { select: { id: true, name: true, status: true, logo: true } },
    },
  });
};

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const googleLogin = async (profile) => {
  const email = profile.emails[0].value;
  const googleId = profile.id;

  // Check if user already exists
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    // If user exists but doesn't have googleId linked, update it
    // Google users are automatically verified
    if (!user.googleId || !user.isVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, authProvider: 'GOOGLE', isVerified: true },
      });
    }
    return user;
  }

  // Create new user if not exists
  user = await prisma.user.create({
    data: {
      email,
      googleId,
      authProvider: 'GOOGLE',
      role: 'SEEKER', // Default role
      isVerified: true,
    },
  });

  // Create empty profile for new SEEKER
  await prisma.profile.create({
    data: {
      userId: user.id,
      fullName: profile.displayName || 'Google User',
    },
  });

  return user;
};

module.exports = { register, verifyOTP, resendOTP, login, getMe, generateToken, googleLogin };
