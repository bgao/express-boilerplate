/**
 * User model
 * Mostly copied from http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
 */
var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

exports.mongoose = mongoose;

// Database connect
var db_conn_uri = 'mongodb://username:password@your_mongo_db:00000/db_';
var mongo_options = {db: { safe: true}};
mongoose.connect(db_conn_uri, mongo_options, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + db_conn_uri + '. ' + err);
  } else {
    console.log('Successfully connected to: ' + db_conn_uri);
  }
});

// Database schema
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

// User schema
var userSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});

// Bcrypt middleware
UserSchema.pre(‘save’, { 
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
userSchema.methods.validPassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}


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
