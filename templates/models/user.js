/**
 * User model
 * Mostly copied from http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
 */
var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , crypto = require('crypto')
  , SALT_WORK_FACTOR = 10
  // default to a max of 5 attempts, result in a 2 hour lock
  , MAX_LOGIN_ATTEMPTS = 5
  , LOCK_TIME = 2 * 60 * 60 * 1000;

exports.mongoose = mongoose;

// Database connect
//var db_conn_uri = 'mongodb://username:password@your_mongo_db:00000/db_';
var db_conn_uri = "mongodb://bgao:connect@dharma.mongohq.com:10064/db_connect_test";
var mongo_options = {db: { safe: true}};
mongoose.connect(db_conn_uri, mongo_options, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + db_conn_uri + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + db_conn_uri);
  }
});

// Database schema
var Schema = mongoose.Schema;

// User schema
var userSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  token: { type: String, required: true },
  activated: { type: Boolean, require: true, default: false },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number }
});

userSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Bcrypt middleware
userSchema.pre('save', function(next) { 
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});


// Password verfication
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


userSchema.methods.incLoginAttempts = function(cb) {
  //if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    },cb);
  }
  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};


// expose enum on the model, and provide an internal convenience reference
userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};


// Register new user
userSchema.statics.register = function(user, cb) {
  var self = new this(user);
  this.findOne( { email: user.email }, function(err, existingUser) {
    if (err) { return cb(err); }
    if (existingUser) {
      return cb('User already exists: ' + user.email);
    }
    self.save(function(err) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};


// Export user model
exports.User = mongoose.model('User', userSchema);
