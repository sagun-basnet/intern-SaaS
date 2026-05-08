const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { success, created, error } = require("../utils/apiResponse");
const { validationResult } = require("express-validator");

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    error(res, "Validation failed.", 422, errors.array());
    return false;
  }
  return true;
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { email, password, role } = req.body;
  const data = await authService.register({ email, password, role });
  return success(res, data.message, { email: data.email });
});

// POST /api/auth/verify-otp
const verifyOTP = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { email, otp } = req.body;
  const data = await authService.verifyOTP({ email, otp });
  return success(res, "Account verified successfully.", data);
});

// POST /api/auth/resend-otp
const resendOTP = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { email } = req.body;
  const data = await authService.resendOTP(email);
  return success(res, data.message);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  if (!handleValidation(req, res)) return;
  const { email, password } = req.body;
  const data = await authService.login({ email, password });
  return success(res, "Login successful.", data);
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user.id);
  return success(res, "Current user fetched.", data);
});

// GET /api/auth/google/callback
const googleAuthCallback = asyncHandler(async (req, res) => {
  // Passport passes the authenticated user to req.user
  if (!req.user) {
    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=auth_failed`,
    );
  }

  const token = authService.generateToken(req.user);

  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
});

module.exports = { register, verifyOTP, resendOTP, login, getMe, googleAuthCallback };
