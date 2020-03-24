const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const LocalStrategy = require("passport-local")
const User = require("../models/User");
const {
  FACEBOOK_APP_ID,
  FACEBOOK_SECRET_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = require("./keys");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_SECRET_ID,
    callbackURL: "/users/auth/facebook/callback"
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      console.log(profile);
      const facebookID = profile.id
      const username = profile.displayName

      const existedUser = await User.findOne({
        facebookID
      });

      if (existedUser) {
        return cb(null, existedUser)
      }

      const createdUser = await new User({
        facebookID,
        username
      }).save()

      return cb(null, createdUser)

    } catch (error) {
      console.log(error);
      return cb(error, false)
    }
  }
));

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/users/auth/google/callback"
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      console.log(profile);
      const googleID = profile.id
      const username = profile.name.givenName

      const existedUser = await User.findOne({
        googleID
      });

      if (existedUser) {
        return cb(null, existedUser)
      }

      const createdUser = await new User({
        googleID,
        username
      }).save()

      return cb(null, createdUser)

    } catch (error) {
      console.log(error);
      return cb(error, false)
    }
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async function (req, email, password, done) {
    try {
      console.log({email, password});

      const existedUser = await User.findOne({
        email
      });

      if (existedUser) {
        return done(null, existedUser)
      } else {
        return done(true, null)
      }

    } catch (error) {
      console.log(error);
      return done(error, null)
    }
  }
));