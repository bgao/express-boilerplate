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
      if (err) return done(err);

      var reason = User.failedLogin;
      // make sure the user exists
      if (!user) { 
	return done(null, false, { message: 'Invalid email address.' }); 
      }

      // check if the account is active
      if (!user.active) {
	return done(null, false, { message: 'Account is inactive.' });
      }

      // check if the account is currently locked
      if (user.isLocked) {
	// just increment login attempts if account is already locked
	return user.incLoginAttempts(function(err) {
	  if (err) return done(err);
	  return done(null, false, { message: 'Account is locked.' }); 
	});
      }

      user.comparePassword(password, function(err, isMatch) {
	if (err) return done(err);

	// check if the password was a match
	if (isMatch) {
	  // if there's no lock for failed attempts, just return the user
	  if (!user.loginAttempts && !user.lockUntil) return done(null, user);
	  // reset attempts and lock info
	  var updates = {
	    $set: { loginAttempts: 0 },
	    $unset: { lockUntil: 1 }
	  };
	  return user.update(updates, function(err) {
	    if (err) return done(err);
	    return done(null, user);
	  });
	}

	// password is incorrect, so increment login attempts before responding
	user.incLoginAttempts(function(err) {
	  if (err) return done(err);
	  return done(null, false, { message: 'Invalid password.' });
	});
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