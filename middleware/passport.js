const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
  callbackURL: '/auth/google/callback',
},async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ email: profile.emails[0].value });
  if (existingUser) {

    return done(null, existingUser);
  }
  const user = await User.create({
    googleId: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName,
    profilePicture: profile.photos[0].value,


  })
  await user.save();
  done(null, user);
}));
//
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }


      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
//











passport.serializeUser((user, done) => {

  done(null, user);
});

passport.deserializeUser(async(id, done) => {
  try {
    // Find the user by their ID in the database
    const user = await User.findOne({googleId: id });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
