const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/auth.service');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await authService.googleLogin(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
