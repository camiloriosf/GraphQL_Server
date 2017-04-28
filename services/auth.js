const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config')

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Setup options for Local Strategy
const localOptions = { usernameField: 'email' };

// Create local strategy
passport.use(new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, 'Invalid Credentials'); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, 'Invalid credentials.');
    });
  });
}));

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKey: config.secret
};
// Create JWT Strategy
passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
  
  const iat = new Date(payload.iat+2592000000).getTime() //2592000000 == 1 mes, 3600000 == 1 hora
  const currentDate = new Date().getTime();
  if( iat < currentDate){ return done(null, false, 'Token expired')}
  User.findById(payload.sub, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false, 'Invalid Token');
    }
  })
}));

// Auth Helpers

function signup({ email, password, req }) {
  const user = new User({ email, password });
  if (!email || !password) { throw new Error('You must provide an email and password.'); }

  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) { throw new Error('Email in use'); }
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        req.logIn(user, (err) => {
          if (err) { reject(err); }
          resolve(user);
        });
      });
    });
}

function login({ email, password, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user) => {
      if (!user) { reject('Invalid credentials.') }
      req.login(user, () => resolve(user));
    })({ body: { email, password } });
  });
}

function checkUser({ token, req }) {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) { reject('Invalid token.') }
      req.login(user, () => resolve(user));
    })({ body: { token } })
  })
}

module.exports = { signup, login, checkUser };