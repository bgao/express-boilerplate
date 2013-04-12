/**
 * Passport local strategy configuration
 * Please visit http://passportjs.org for more information about Passport
 */

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('../models/user').User;

passport.use(new LocalStrategy( {
    usernameField: 'email',  // I would like to use email as login id
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({email: email}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { 
	return done(null, false, { message: 'Invalid email address.' }); 
      }
      user.validPassword(password, function(err, isMatch) {
	if (err) { return done(err); }
	if (!isMatch) {
	  return done(null, false, { message: 'Invalid password.' });
	} else {
	  return done(null, user);
	}
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});