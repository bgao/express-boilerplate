var passport = require('passport')
  , pass_local = require('../modules/pass-local')
  , User = require('../models/user').User;
  

// TODO: move all user related routes into user.js
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', { title: "YOUR PROJECT NAME", user: req.user });
  });

  app.post('/register', function(req, res) {
    User.register({email: req.body.email, password: req.body.password}, function(err, user) {
      if (err) {
        console.log(err);
        // return res.render('register', { user: user, messages: err });
      }
      res.redirect('/');
    });
  });

  // POST /login
  //   This is an alternative implementation that uses a custom callback to
  //   acheive the same functionality.
  app.post('/login', passport.authenticate('local', { successRedirect: '/', 
						    failureRedirect: '/login' }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};