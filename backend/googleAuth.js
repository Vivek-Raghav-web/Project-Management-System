import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

// Directly use clientID & secret
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const userData = {
      name: profile.displayName,
      email: profile.emails[0].value
    };
    return done(null, userData);
  } catch (err) {
    return done(err, null);
  }
}));